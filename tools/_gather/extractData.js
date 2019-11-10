const fs = require('fs').promises;

const { PROFESSIONS } = require('./consts');
const { dataFile, extractRelevantScripts, extractDataFromScript, getBase, uniqifyBase, getWH, getListview, pageFile } = require('./utils');

(async () => {
  const base = getBase();

  for (const prof of Object.values(PROFESSIONS)) {
    const html = await fs.readFile(pageFile(prof), 'utf8');

    const lists = [];
    const WH = getWH(base);
    const Listview = getListview(lists);

    extractRelevantScripts(html).forEach((script) => extractDataFromScript(script, WH, Listview));

    await fs.writeFile(dataFile(`lists-${prof}`), JSON.stringify(lists, null, '  '), 'utf8');
  }

  uniqifyBase(base);

  await fs.writeFile(dataFile(`_base`), JSON.stringify(base, null, '  '), 'utf8');
})();
