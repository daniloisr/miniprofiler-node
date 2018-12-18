'use strict';

var miniprofiler = require('../../../lib/miniprofiler.js');
var koa = require('koa');
var route = require('koa-route');

var app = koa();

var options = {
  authorize: (req) => {
    return false;
  }
};

app.use(miniprofiler.koa(options));

app.use(route.get('/', function *(){
  this.body = miniprofiler.currentExtension().include();
}));

module.exports = app;
