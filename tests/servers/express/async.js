'use strict';

var miniprofiler = require('../../../lib/miniprofiler.js');
var dummyModule = require('../dummy-module');
var express = require('express');

var app = express();

app.use(miniprofiler.express());
app.use(miniprofiler.express.for(require('../dummy-provider-async.js')(dummyModule)));

app.get('/', (req, res) => {
	dummyModule.dummyFn().then(() => {
		const q = req.query.once ? Promise.resolve() : dummyModule.dummyFn();
		q.then(() => res.send(res.locals.miniprofiler.include()));
	});
});

module.exports = app;
