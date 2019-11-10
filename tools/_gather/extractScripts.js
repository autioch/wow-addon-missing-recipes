const fs = require('fs').promises;
const path = require('path');
const { PROFESSIONS } = require('./consts');
const cheerio = require('cheerio');

const SEARCH_IN = 'div#main-contents.main-contents';
const SEARCHED_TEXT = 'WH.Gatherer.addData';

const htmlFile = (profName) => path.join(__dirname, '..', 'pages', `${profName}.html`);
const scriptFile = (profName) => path.join(__dirname, '..', 'scripts', `${profName}.html`);

function getTagDefinition(el, $el) {
  let def = el.tagName;

  if ($el.attr('id')) {
    def = `${def}#${$el.attr('id')}`;
  }

  if ($el.attr('class')) {
    def = `${def}.${$el.attr('class')}`;
  }

  return def;
}

function getParentsDefinition($el, $) {
  return $el.parentsUntil(SEARCH_IN).map((_2, el2) => getTagDefinition(el2, $(el2))).get().reverse().join(' ');
}

(async () => {
  for (const prof of Object.values(PROFESSIONS)) {
    const html = await fs.readFile(htmlFile(prof), 'utf8');

    const $ = cheerio.load(html);

    const scripts = $(`${SEARCH_IN} script`).each((_, el) => {
      $(el).attr('parents', getParentsDefinition($(el), $));
      $(el).removeAttr('type');
    });

    const scriptsOnlyHtml = scripts
      .filter((i, el) => !$(el).attr('parents').includes(' head'))
      .filter((i, el) => $(el).html().includes(SEARCHED_TEXT))
      .filter((i, el) => !($(el).attr('src') || '').length)
      .map((i, el) => {
        const $tmp = $('<div>');

        $tmp.append($(el).clone());

        return $tmp.html();
      }).get().join('\n');

    await fs.writeFile(scriptFile(prof), `<html>\n<body>\n${scriptsOnlyHtml}\n</body>\n</html>`, 'utf8');
  }
})();
