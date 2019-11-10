const path = require('path');
const cheerio = require('cheerio');
const { IGNORED_LISTS } = require('./consts');

function extractRelevantScripts(pageHtml) {
  const $ = cheerio.load(pageHtml);

  return $(`div#main-contents.main-contents script`)
    .filter((i, el) => $(el).html().includes('WH.Gatherer.addData'))
    .map((i, el) => $(el).html()).get();
}

/* Used as a mock for scripts data extraction. */
function Tabs() { // eslint-disable-line no-inner-declarations
  this.flush = () => {};
}

function getBase() {
  return { // eslint-disable-line no-underscore-dangle
    '1:4': {
      table: 'vendors',
      items: []
    },
    '2:4': {
      table: 'worldObjects',
      items: []
    },
    '3:4': {
      table: 'items',
      items: []
    },
    '4:4': {
      table: 'sets',
      items: []
    },
    '5:4': {
      table: 'quests',
      items: []
    },
    '6:4': {
      table: 'spells',
      items: []
    },
    '7:4': {
      table: 'zones',
      items: []
    },
    '15:4': {
      table: 'professions',
      items: []
    }
  };
}

function uniqifyBase(base) {
  Object.values(base).forEach((table) => {
    table.items = table.items.reduce((obj, item) => {
      Object.entries(item).forEach(([id, def]) => {
        const existingItem = obj[id];

        if (!existingItem) {
          obj[id] = def;

          return;
        }

        const existingItemHash = JSON.stringify(existingItem);
        const newItemHash = JSON.stringify(def);

        if (existingItemHash !== newItemHash) {
          throw Error(`Different definition for table ${item.table}: \n${existingItemHash}\n${newItemHash}`);
        }
      });

      return obj;
    }, {});
  });
}

function getWH(base) {
  return {
    ge() {},
    sprintf() {},
    Gatherer: {
      addData(arg1, arg2, rowsDict) { // eslint-disable-line max-statements
        const tableId = `${arg1.toString()}:${arg2.toString()}`;

        if (base[tableId]) {
          base[tableId].items.push(rowsDict);

          return;
        }
        throw Error(`Unknown DB type ${arg1} ${arg2}.`);
      }
    }
  };
}

function getListview(lists) {
  return function Listview(config) {
    const { data, id: listId, name: listName, listTemplate } = config;

    if (IGNORED_LISTS[listId]) {
      return;
    }

    lists.push({
      listId,
      listName,
      listTemplate,
      data
    });
  };
}

// A big dose of trust towards WH
// TODO new Function sandbox node.js
function extractDataFromScript(scriptHtml, WH, Listview) {
  try {
    new Function( // eslint-disable-line no-new-func
      'WH', 'Listview', // extracts data
      'Tabs', 'g_users', 'LANG', 'lv_comments0', 'lv_screenshots', 'lv_videos', 'window', // unused
      scriptHtml
    )(
      WH, Listview, // extracts data
      Tabs, {}, {}, [], {}, {}, {} // unused
    );
  } catch (err) {
    console.log(err);
  }
}

const pageUrl = (profName) => `https://classic.wowhead.com/${profName}`;
const pageFile = (profName) => path.join(__dirname, '..', 'pages', `${profName}.html`);
const dataFile = (profName) => path.join(__dirname, '..', 'data', `${profName}.json`);

module.exports = {
  extractRelevantScripts,
  Tabs,
  getBase,
  uniqifyBase,
  getWH,
  getListview,
  extractDataFromScript,
  pageUrl,
  pageFile,
  dataFile
};
