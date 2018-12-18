'use strict';

var miniprofiler = require('../../../lib/miniprofiler.js');
var koa = require('koa');
var route = require('koa-route');
var app = koa();

app.use(miniprofiler.koa());
app.use(miniprofiler.koa.for(require('../dummy-provider.js')()));

app.use(route.get('/', function *(){
  this.body = miniprofiler.currentExtension().include();
}));

app.use(route.get('/step', function *(){
  miniprofiler.currentExtension().step('Step', () => {
    this.body = miniprofiler.currentExtension().include();
  });
}));

app.use(route.get('/step-two', function *(){
  miniprofiler.currentExtension().step('Step 1', () => {
    miniprofiler.currentExtension().step('Step 2', () => {
      this.body = miniprofiler.currentExtension().include();
    });
  });
}));

app.use(route.get('/step-parallel', function *(){
	var count = 0;
	var finish = () => {
		if (++count == 2)
      this.body = miniprofiler.currentExtension().include();
	};

  miniprofiler.currentExtension().step('Step 1', finish);
  miniprofiler.currentExtension().step('Step 2', finish);
}));

app.use(route.get('/js-sleep', function *(){
  yield new Promise((resolve, reject) => {
    miniprofiler.currentExtension().timeQuery('custom', 'Sleeping...', setTimeout, () => {
      this.body = miniprofiler.currentExtension().include();
      resolve();
    }, 50);
  });
}));

app.use(route.get('/js-sleep-start-stop', function *(){
  yield new Promise((resolve, reject) => {
    var timing = miniprofiler.currentExtension().startTimeQuery('custom', 'Sleeping...');
    setTimeout(() => {
      miniprofiler.currentExtension().stopTimeQuery(timing);
      this.body = miniprofiler.currentExtension().include();
      resolve();
    }, 50);
  });
}));

module.exports = app;
