const fs = require('fs').promises;
const path = require('path');
const { PROFESSIONS } = require('./consts');

const dbFile = (profName) => path.join(__dirname, '..', '..', 'src', 'db', `${profName}.lua`);
const dataFile = (profName) => path.join(__dirname, '..', 'data', `${profName}.json`);

function dbItemToLua({ name_enus }) {
  return `  ["${name_enus}"] = {\n    ["name"] = "${name_enus}"\n  }`;
}

function dbToLua(db, prof) {
  const prefix = `local A, NS = ...\n\nNS.DB.${prof} = {\n`;
  const body = db.sort((a, b) => a.name_enus.localeCompare(b.name_enus)).map(dbItemToLua).join(',\n');
  const suffix = '\n}';

  return prefix + body + suffix;
}

(async () => {
  const base = await fs.readFile(dataFile('_base'), 'utf8');
  const spells = JSON.parse(base)['6:4'].items;

  for (const prof of Object.values(PROFESSIONS)) {
    const profListJson = await fs.readFile(dataFile(`lists-${prof}`), 'utf8');
    const profList = JSON.parse(profListJson);

    const recipes = profList.find((list) => list.listId === 'recipes') || {
      data: []
    };

    const db = recipes.data
      .map((recipe) => {
        const spell = spells[recipe.id];

        if (!spell) {
          throw Error(`Unknown spell:\n${JSON.stringify(recipe, null, '  ')}`);
        }

        return spell;
      })
      .filter((spell) => spell.attainable !== 0);

    await fs.writeFile(dbFile(prof), dbToLua(db, prof), 'utf8');
  }
})();
