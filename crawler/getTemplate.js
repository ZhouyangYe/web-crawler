const https = require('https');

module.exports = (path = '') => {
  return new Promise((res, rej) => {
    const options = {
      hostname: 'phonedb.net',
      port: 443,
      path,
      method: 'GET',
    };
    
    const request = https.request(options, (response) => {
      let result = '';

      response.on('data', (data) => {
        result += data;
      });
      
      response.on('end', () => {
        res(result.toString());
      });
    });
    
    request.on('error', (e) => {
      console.error(e);
      rej(e);
    });
    
    request.end();
  });
};
