const request = require('request');
const fs = require('fs');
const path = require('path');

const { PROFESSIONS } = require('./consts');

function fetchPage(url, dest) {
  return new Promise((resolve, reject) => {
    request({
      url,
      dest,
      encoding: null,
      timeout: 10000
    }, (err, res, body) => {
      if (err) {
        reject(err);
      } else if (res.statusCode !== 200 && res.statusCode !== 201) { // eslint-disable-line no-magic-numbers
        reject(new Error(res.statusCode));
      } else if (body) {
        fs.writeFile(dest, body, 'binary', resolve);
      } else {
        reject(new Error(`Empty body`));
      }
    });
  });
}

async function fetchRecipesPages() {
  for (const prof of Object.values(PROFESSIONS)) {
    const url = `https://classic.wowhead.com/${prof}`;
    const file = path.join(__dirname, '..', 'pages', `${prof}.html`);

    if (fs.existsSync(file)) { // eslint-disable-line no-sync
      console.log(`Cached page found for ${prof}.`);
    } else {
      console.log(`Fetch page for ${prof}.`);
      await fetchPage(url, file);
    }
  }

  console.log('Done');
}

fetchRecipesPages();
