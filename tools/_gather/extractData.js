const fs = require('fs').promises;
const path = require('path');
const cheerio = require('cheerio');
const { PROFESSIONS, TABLES, WH_VAR_NAMES, IGNORED_LISTS } = require('./consts');

const pageFile = (profName) => path.join(__dirname, '..', 'pages', `${profName}.html`);
const dataFile = (profName) => path.join(__dirname, '..', 'data', `${profName}.json`);

function Tabs() { // eslint-disable-line no-inner-declarations
  this.flush = () => {};// eslint-disable-line no-empty-function
}

function getListview(lists) {
  return function Listview(config) {
    if (!IGNORED_LISTS[config.id]) {
      lists.push({
        listId: config.id,
        listName: config.name,
        data: config.data
      });
    }
  };
}

function getWH(base) {
  return {
    ge() {}, // eslint-disable-line no-empty-function
    sprintf() {}, // eslint-disable-line no-empty-function
    Gatherer: {
      addData(arg1, arg2, rowsDict) { // eslint-disable-line max-statements
        const tableId = `${arg1.toString()}:${arg2.toString()}`;
        const table = base[tableId];

        if (!table) {
          throw Error(`Unknown DB type ${arg1} ${arg2}.`);
        }

        Object.entries(rowsDict).forEach(([id, def]) => {
          const existingItem = table.items[id];

          if (!existingItem) {
            table.items[id] = def;

            return;
          }

          const existingItemHash = JSON.stringify(existingItem);
          const newItemHash = JSON.stringify(def);

          if (existingItemHash !== newItemHash) {
            throw Error(`Different definition for table ${table.table}:\n${existingItemHash}\n${newItemHash}`);
          }
        });
      }
    }
  };
}

(async () => {
  const base = Object.entries(TABLES).reduce((obj, [id, label]) => Object.assign(obj, {
    [id]: {
      table: label,
      items: {}
    }
  }), {});

  for (const prof of Object.values(PROFESSIONS)) {
    const pageHtml = await fs.readFile(pageFile(prof), 'utf8');
    const lists = [];
    const WH = getWH(base);
    const Listview = getListview(lists);

    const $ = cheerio.load(pageHtml);

    $(`div#main-contents.main-contents script`)
      .filter((i, el) => $(el).html().includes('WH.Gatherer.addData'))
      .each((i, el) => {
        const script = $(el).html();

        // A big dose of trust towards WH
        // TODO new Function sandbox node.js
        new Function(...WH_VAR_NAMES, script)(WH, Listview, Tabs, {}, {}, [], {}, {}, {});// eslint-disable-line no-new-func
      });

    await fs.writeFile(dataFile(`lists-${prof}`), JSON.stringify(lists, null, '  '), 'utf8');
  }

  await fs.writeFile(dataFile(`_base`), JSON.stringify(base, null, '  '), 'utf8');
})();
