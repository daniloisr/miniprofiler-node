'use strict';

var miniprofiler = require('../../../lib/miniprofiler.js');
var express = require('express');

var app = express();

var options = {
  enable: (req) => {
    return false;
  }
};

app.use(miniprofiler.express(options));

app.get('/', (req, res) => {
  miniprofiler.currentExtension().timeQuery('custom', 'Sleeping...', setTimeout, function() {
    miniprofiler.currentExtension().step('Step 1', () => {
      res.send(miniprofiler.currentExtension().include());
    });
  }, 50);
});

module.exports = app;
