var fs = require('fs');
var request = require('superagent');
var cheerio = require('cheerio');
var xlsx = require('node-xlsx');
var binaryParser = require('superagent-binary-parser');
var events = require('events');
var EventEmitter = new events.EventEmitter();
var async = require('async');
var iconv = require('iconv-lite');
var urls = require('./data.json');

var cookie = '';

function getCookie(){
    request.post('')
        .parse(binaryParser)
        .type("form")
        .send({"username":"colourwolf1","password":"jianshen20075"})
        .end(function(err, res){
            if (err) throw err;
            cookie = res.header['set-cookie'];
            //console.log(res);
            EventEmitter.emit("getCookie");
        });
}

function getUrls(){

}

function getInfo(url, callback) {
    var data = '';
    //console.log(cookie);
    request.get(url)
        .parse(binaryParser)
        .set('User-Agent','Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.87 Safari/537.36')//
        .set('Cookie', cookie)
        .end(function(err, res) {
            data = iconv.decode(res.body,'utf-8');
            callback(err, data);
        });
}

function start(){
    async.eachSeries(urls, function(url, callback) {
        getInfo(url, function(err, data) {
            //console.log(data);
            fs.writeFileSync('tmp.txt', data);
            callback(null);
        });
    }, function(err, res) {
        // fs.writeFileSync('book.xlsx', xlsx.build([{
        //     name: "sheet",
        //     data: result
        // }]), 'binary');
        console.log('done');
    });
}

// getCookie();
// EventEmitter.on('getCookie',start);

start();