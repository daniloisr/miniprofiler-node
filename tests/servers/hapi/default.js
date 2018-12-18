'use strict';

var miniprofiler = require('../../../lib/miniprofiler.js');
const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: 8083 });

server.register(miniprofiler.hapi(), (err) => {
  if (err) throw err;
});

server.register(miniprofiler.hapi.for(require('../dummy-provider.js')()), (err) => {
  if (err) throw err;
});

server.route({
  method: 'GET',
  path:'/',
  handler: function(request, reply) {
    return reply(miniprofiler.currentExtension().include());
  }
});

server.route({
  method: 'GET',
  path:'/step',
  handler: function(request, reply) {
    miniprofiler.currentExtension().step('Step', () => {
      return reply(miniprofiler.currentExtension().include());
    });
  }
});

server.route({
  method: 'GET',
  path:'/step-two',
  handler: function(request, reply) {
    miniprofiler.currentExtension().step('Step 1', () => {
      miniprofiler.currentExtension().step('Step 2', () => {
        return reply(miniprofiler.currentExtension().include());
      });
    });
  }
});

server.route({
  method: 'GET',
  path:'/step-parallel',
  handler: function(request, reply) {
    var count = 0;
    var finish = () => {
    if (++count == 2)
      return reply(miniprofiler.currentExtension().include());
    };

    miniprofiler.currentExtension().step('Step 1', finish);
    miniprofiler.currentExtension().step('Step 2', finish);
  }
});

server.route({
  method: 'GET',
  path:'/js-sleep',
  handler: function(request, reply) {
    miniprofiler.currentExtension().timeQuery('custom', 'Sleeping...', setTimeout, () => {
      return reply(miniprofiler.currentExtension().include());
    }, 50);
  }
});

server.route({
  method: 'GET',
  path:'/js-sleep-start-stop',
  handler: function(request, reply) {
    var timing = miniprofiler.currentExtension().startTimeQuery('custom', 'Sleeping...');
    setTimeout(function() {
      miniprofiler.currentExtension().stopTimeQuery(timing);
      return reply(miniprofiler.currentExtension().include());
    }, 50);
  }
});

module.exports = server;
