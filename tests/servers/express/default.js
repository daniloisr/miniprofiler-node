'use strict';

var miniprofiler = require('../../../lib/miniprofiler.js');
var express = require('express');

var app = express();

app.use(miniprofiler.express());
app.use(miniprofiler.express.for(require('../dummy-provider.js')()));

app.get('/', (req, res) => {
	res.send(miniprofiler.currentExtension().include());
});

app.get('/step', (req, res) => {
  miniprofiler.currentExtension().step('Step', () => {
    res.send(miniprofiler.currentExtension().include());
  });
});

app.get('/step-two', (req, res) => {
  miniprofiler.currentExtension().step('Step 1', () => {
    miniprofiler.currentExtension().step('Step 2', () => {
      res.send(miniprofiler.currentExtension().include());
    });
  });
});

app.get('/step-parallel', (req, res) => {
	var count = 0;
	var finish = () => {
		if (++count == 2)
			res.send(miniprofiler.currentExtension().include());
	};

  miniprofiler.currentExtension().step('Step 1', finish);
  miniprofiler.currentExtension().step('Step 2', finish);
});

app.get('/js-sleep', function(req, res) {
	miniprofiler.currentExtension().timeQuery('custom', 'Sleeping...', setTimeout, function() {
		res.send(miniprofiler.currentExtension().include());
	}, 50);
});

app.get('/js-sleep-start-stop', function(req, res) {
	var timing = miniprofiler.currentExtension().startTimeQuery('custom', 'Sleeping...');
	setTimeout(function() {
		miniprofiler.currentExtension().stopTimeQuery(timing);
		res.send(miniprofiler.currentExtension().include());
	}, 50);
});

module.exports = app;
