'use strict';

var miniprofiler = require('../../../lib/miniprofiler.js');
var express = require('express');

var app = express();

var options = {
  authorize: (req) => {
    return false;
  }
};

app.use(miniprofiler.express(options));

app.get('/', (req, res) => {
	res.send(miniprofiler.currentExtension().include());
});

module.exports = app;
