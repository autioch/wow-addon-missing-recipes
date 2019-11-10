const request = require('request');
const fs = require('fs');
const path = require('path');
const { PROFESSIONS } = require('./consts');

const HANG_DELAY = 10000;

function fetchPage(url, dest) {
  console.log('Fetch ', url);

  return new Promise((resolve, reject) => {
    request({
      url,
      dest,
      encoding: null,
      timeout: HANG_DELAY
    }, (err, res, body) => {
      console.log('Done', url);
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

const profUrl = (profName) => `https://classic.wowhead.com/${profName}`;
const profFile = (profName) => path.join(__dirname, '..', 'pages', `${profName}.html`);

async function fetchRecipesPages() {
  const promises = Object.values(PROFESSIONS).map((profName) => fetchPage(profUrl(profName), profFile(profName)));

  await Promise.all(promises);

  console.log('Done');
}

fetchRecipesPages();
