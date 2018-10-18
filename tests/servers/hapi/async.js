'use strict';

var miniprofiler = require('../../../lib/miniprofiler.js');
var dummyModule = require('../dummy-module');
const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: 8083 });

server.register(miniprofiler.hapi(), (err) => {
  if (err) throw err;
});

server.register(miniprofiler.hapi.for(require('../dummy-provider-async.js')(dummyModule)), (err) => {
  if (err) throw err;
});

server.route({
  method: 'GET',
  path:'/',
  handler: function(request, reply) {
    return dummyModule.dummyFn().then(() => {
      const q = request.query.once ? Promise.resolve() : dummyModule.dummyFn();
      return q.then(() => reply(request.app.miniprofiler.include()));
    });
  }
});

module.exports = server;
