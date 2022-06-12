const cheerio = require('cheerio');
const getTemplate = require('./getTemplate');

class PhonePage {
  constructor(path) {
    this.path = path;
  }

  getTemplate() {
    this.templatePromise = getTemplate(`${this.path}&d=detailed_specs`);
    return this;
  }

  getData() {
    return this.templatePromise.then((html) => {
      const $ = cheerio.load(html);

      const result = {};

      $('.container .canvas tr').toArray().forEach((row) => {
        const cols = cheerio.load(row)('td').toArray();
        if (cols.length === 2) {
          const key = cheerio.load(cols[0])('strong').text().trim();
          const value = cheerio.load(cols[1]).text().trim();
          if (!!key) {
            result[key] = value;
          }
        }
      });
      result.picLink = `https://phonedb.net/${$('.sidebar h1+div img').attr('src')}`;
      result.url = `https://phonedb.net${this.path}`;

      return { ...result };
    });
  }
}

module.exports = PhonePage;
