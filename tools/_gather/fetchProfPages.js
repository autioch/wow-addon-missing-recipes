const request = require('request');
const fs = require('fs');

const { PROFESSIONS, HANG_DELAY } = require('./consts');
const { pageUrl, pageFile } = require('./utils');

function fetchPage(url, dest) {
  return new Promise((resolve, reject) => {
    request({
      url,
      dest,
      encoding: null,
      timeout: HANG_DELAY
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
    const url = pageUrl(prof);
    const file = pageFile(prof);

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
