'use strict';

const miniprofiler = require('../../../lib/miniprofiler.js');
const brokenProvider = require('../broken-provider');
const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: 8083 });

server.register(miniprofiler.hapi(), err => {
  if (err) throw err;
});

server.register(miniprofiler.hapi.for(brokenProvider.provider(brokenProvider.module)), err => {
  if (err) throw err;
});

server.route({
  method: 'GET',
  path:'/',
  handler: function(request, reply) {
    try {
      brokenProvider.module.fn();
    } catch (_err) {
      return reply(request.app.miniprofiler.include()).code(500);
    }
  }
});

module.exports = server;
