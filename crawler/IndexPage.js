const cheerio = require('cheerio');
const xlsx = require('node-xlsx');
const getTemplate = require('./getTemplate');
const BrandPage = require('./BrandPage');

class IndexPage {
  constructor(path) {
    this.path = path;
  }

  getTemplate() {
    this.templatePromise = getTemplate(this.path);
    return this;
  }

  getBrands() {
    return this.templatePromise.then((html) => {
      const $ = cheerio.load(html);
      const brandLinkList = $('.compact_list>a').toArray();
      return brandLinkList.map((link) => {
        return new BrandPage(`/${link.attribs.href}`);
      });
    });
  }
}

module.exports = IndexPage;
