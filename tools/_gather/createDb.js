const fs = require('fs').promises;
const path = require('path');
const { PROFESSIONS } = require('./consts');

const dbFile = (profName) => path.join(__dirname, '..', '..', 'src', 'db', `${profName}.lua`);
const dataFile = (profName) => path.join(__dirname, '..', 'data', `${profName}.json`);

function escLua(key) {
  if (typeof key === 'string') {
    return key.replace(/"/g, `\\"`);
  }

  return key;
}

function objToLua(obj, indent) {
  const props = Object.entries(obj).map(([key, value]) => `["${escLua(key)}"] = "${escLua(value)}"`);

  return `{\n  ${indent}${props.join(`,\n  ${indent}`)}\n${indent}}`;
}

function dbItemToLua(spell) {
  return `  ["${escLua(spell.label)}"] = ${objToLua(spell, '  ')}`;
}

function dbToLua(db, prof) {
  const prefix = `local A, NS = ...\n\nNS.DB["${prof}"] = {\n`;
  const body = db.sort((a, b) => a.id - b.id).map(dbItemToLua).join(',\n');
  const suffix = '\n}';

  return prefix + body + suffix;
}

(async () => {
  const base = require(dataFile('_base'));
  const spells = base['6:4'].items;
  const { items } = base['3:4'];

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

        if (recipe.creates) {
          const itemCreated = items[recipe.creates[0]];

          if (!itemCreated) {
            throw Error(`Unknown item created:\n${JSON.stringify(recipe, null, '  ')}`);
          }
        }

        return {
          id: recipe.id,
          label: spell.name_enus,
          icon: spell.icon
        };
      })
      .filter((spell) => spell.cat !== 0);

    await fs.writeFile(dbFile(prof), dbToLua(db, prof), 'utf8');
  }
})();
