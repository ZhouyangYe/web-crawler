const IndexPage = require('./IndexPage');
const Xlsx = require('./Xlsx');
const PhonePage = require('./PhonePage');

const pool = {};
const pages = 6;

let index = 0;

const handleDetail = () => {
  const brandsPool = Object.keys(pool);
  const key = brandsPool[index];
  const brandPool = pool[key];
  const xlsx = new Xlsx(key);
  let count = 0;

  brandPool.forEach((detail) => {
    const run = () => {
      detail.getTemplate().getData().then((data) => {
        if (Object.keys(data).length === 2) {
          console.log('in');
          setTimeout(() => {
            run();
          }, 100);
          return;
        }
  
        xlsx.add(data);
        count++;
        if (count === brandPool.length) {
          console.log(index);
          index++;
          xlsx.create();
  
          if (index < brandsPool.length) {
            //setTimeout(handleDetail, 0);
          }
        }
      });
    }
  });
};

const handleIndex = () => {
  // const detail = new PhonePage('/index.php?m=device&id=19175&c=apple_iphone_13_5g_a2635_dual_sim_td-lte_ru_kz_512gb__apple_iphone_14,5');
  // detail.getTemplate().getData().then((data) => {
  //   console.log(data);
  // });
  // return;

  const indexPage = new IndexPage('/index.php?m=device');
  indexPage.getTemplate().getBrands().then((brands) => {
    return new Promise((res, rej) => {
      let countBrands = 0;
      brands.forEach((brand, i) => {
        pool[brand.brand] = [];

        let countPhones = 0;
        for (let i = 0; i < pages; i++) {
          brand.getTemplate(i).getPhoneLink().then((details) => {
            details.forEach((detail, i) => {
              pool[brand.brand].push(detail);
            });

            countPhones++;
            if (countPhones === pages) {
              countBrands++;
            }
            if (countBrands === brands.length) {
              res();
            }
          });
        }
      });
    });
  }).then(() => {
    index = 0;
    handleDetail();
  });
};

module.exports = {
  handleIndex,
};
