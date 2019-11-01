const { join } = require('path');
const fsOld = require('fs');
const fs = fsOld.promises;
const glob = require('glob-promise');
const copy = require('recursive-copy');

const WOW_ADDON_DIR = join('c:','Games','WoW Classic','World of Warcraft','_classic_','Interface','AddOns');

const SOURCE = join(__dirname, '..', 'src');
const TARGET = join(WOW_ADDON_DIR, 'MissingRecipes');

(async () => {

  if (!fsOld.existsSync(TARGET)){
    await fs.mkdir(TARGET).catch(console.error);
  }

  await copy(SOURCE, TARGET, { overwrite: true }).catch(console.error);

  console.log('Done copying addon.');
})();
