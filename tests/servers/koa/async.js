'use strict';

var miniprofiler = require('../../../lib/miniprofiler.js');
var dummyModule = require('../dummy-module');
var koa = require('koa');
var route = require('koa-route');
var app = koa();

app.use(miniprofiler.koa());
app.use(miniprofiler.koa.for(require('../dummy-provider-async.js')(dummyModule)));

app.use(route.get('/', function *(){
  yield dummyModule.asyncFn().then(() => {
    const q = Promise.resolve(this.query.once ? undefined : dummyModule.asyncFn());
    q.then(() => {
      this.body = this.state.miniprofiler.include();
    });
  });
}));

module.exports = app;
