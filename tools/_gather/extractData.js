/* eslint-disable no-magic-numbers */
const fs = require('fs').promises;
const path = require('path');
const { PROFESSIONS } = require('./consts');
const cheerio = require('cheerio');

const scriptFile = (profName) => path.join(__dirname, '..', 'scripts', `${profName}.html`);
const dataFile = (profName) => path.join(__dirname, '..', 'data', `${profName}.json`);

const IGNORED_LISTS = {
  guides: true,
  comments: true,
  screenshots: true,
  quests: true,
  'required-by': true
};

const _base = { // eslint-disable-line no-underscore-dangle
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

function uniqify_base() {
  Object.values(_base).forEach((table) => {
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

function Tabs() { // eslint-disable-line no-inner-declarations
  this.flush = () => {};
}

(async () => { // eslint-disable-line max-statements
  for (const prof of Object.values(PROFESSIONS)) {
    const html = await fs.readFile(scriptFile(prof), 'utf8');

    const $ = cheerio.load(html);

    let trainers = [];
    let recipes = [];
    const lists = [];
    const WH = {
      ge() {},
      sprintf() {},
      Gatherer: {
        addData(arg1, arg2, rowsDict) { // eslint-disable-line max-statements
          const tableId = `${arg1.toString()}:${arg2.toString()}`;

          if (_base[tableId]) {
            _base[tableId].items.push(rowsDict);

            return;
          }
          throw Error(`Unknown DB type ${arg1} ${arg2}.`);
        }
      }
    };

    function Listview(config) { // eslint-disable-line no-inner-declarations
      const { data, id: listId, name: listName, listTemplate } = config; // eslint-disable-line no-unused-vars

      if (IGNORED_LISTS[listId]) {
        return;
      }

      if (listId === 'trainers') {
        trainers = data.map(({ classification, minlevel, maxlevel, type, ...info }) => info);// eslint-disable-line no-unused-vars

        return;
      }

      if (listId === 'recipes') {
        recipes = data;

        return;
      }

      if (listId === 'spells') {
        console.log(prof, data.length);
      }

      lists.push({
        listId,
        listName,
        listTemplate,
        data
      });
    }

    $('script').each((i, el) => {
      const contents = $(el).html();

      try {
        new Function( // eslint-disable-line no-new-func
          'WH', // extracts data
          'Tabs', 'Listview', // extracts data
          'g_users', 'LANG', 'lv_comments0', 'lv_screenshots', 'lv_videos', 'window', // unused
          contents
        )(
          WH, // extracts data
          Tabs, Listview, // extracts data
          {}, {}, [], {}, {}, {} // unused
        );
      } catch (err) {
        console.log(err);
      }
    });

    // await fs.writeFile(dataFile(`lists-${prof}`), JSON.stringify(lists, null, '  '), 'utf8');
    // await fs.writeFile(dataFile(`trainers-${prof}`), JSON.stringify(trainers, null, '  '), 'utf8');
    // await fs.writeFile(dataFile(`recipes-${prof}`), JSON.stringify(recipes, null, '  '), 'utf8');
  }

  uniqify_base(_base);

  // await fs.writeFile(dataFile(`_base`), JSON.stringify(_base, null, '  '), 'utf8');
})();
