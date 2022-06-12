const cheerio = require('cheerio');
const url = require('url');
const getTemplate = require('./getTemplate');
const PhonePage = require('./PhonePage');

const itemNumPerPage = 29;

class BrandPage {
  constructor(path) {
    this.path = path;
    this.brand = url.parse(this.path, true).query.first;
  }

  getTemplate(range = 0) {
    this.templatePromise = getTemplate(`${this.path}&filter=${range * itemNumPerPage}`);
    return this;
  }

  getPhoneLink() {
    return this.templatePromise.then((html) => {
      const $ = cheerio.load(html);
      const detailLinks = $('.content_block_title>a').toArray();
      return detailLinks.map((detailLink, i) => {
        const link = detailLink.attribs.href;
        return new PhonePage(`/${link}`);
      });
    });
  }
}

module.exports = BrandPage;
