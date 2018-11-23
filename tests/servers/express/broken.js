'use strict';

var express = require('express');
var miniprofiler = require('../../../lib/miniprofiler.js');
var brokenProvider = require('../broken-provider');

var app = express();

app.use(miniprofiler.express());
app.use(miniprofiler.express.for(brokenProvider.provider(brokenProvider.module)));

app.get('/', (req, res) => {
  try {
    brokenProvider.module.fn();
  } catch (_erro) {
    res.status(500).send(res.locals.miniprofiler.include());
  }
});

module.exports = app;
