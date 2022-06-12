const xlsx = require('node-xlsx');
const fs = require('fs');

class Xlsx {
  constructor(brandName) {
    this.brand = brandName;
    this.index = 0;
    this.sheetData = {};
  }

  add(data) {
    Object.keys(data).forEach((key) => {
      if (!this.sheetData[key]) {
        this.sheetData[key] = [];
      }

      this.sheetData[key][this.index] = data[key];
    });
    this.index++;
  }

  create() {
    const titles = Object.keys(this.sheetData);
    const data = [titles];
    fs.writeFileSync('data.json', JSON.stringify(this.sheetData));

    for (let i = 0; i < this.index; i++) {
      const row = [];
      titles.forEach((title) => {
        row.push(this.sheetData[title][i]);
      });
      data.push(row);
    }

    const buffer = xlsx.build([{ name: this.brand, data }]);

    fs.writeFileSync(`sheet/${this.brand}.xlsx`, buffer);
  }
}

module.exports = Xlsx;
