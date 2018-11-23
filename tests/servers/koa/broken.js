'use strict';

var miniprofiler = require('../../../lib/miniprofiler.js');
const brokenProvider = require('../broken-provider');
var koa = require('koa');
var route = require('koa-route');
var app = koa();

app.use(miniprofiler.koa());
app.use(miniprofiler.koa.for(brokenProvider.provider(brokenProvider.module)));

app.use(route.get('/', function *(){
  try {
    brokenProvider.module.fn();
  } catch (_err) {
    this.status = 500;
    this.body = this.state.miniprofiler.include();
  }
}));


module.exports = app;
