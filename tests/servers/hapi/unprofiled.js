'use strict';

var miniprofiler = require('../../../lib/miniprofiler.js');
const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: 8083 });

var options = {
  enable: (req) => {
    return false;
  }
};

server.register(miniprofiler.hapi(options), (err) => {
  if (err) throw (err);
});

server.route({
  method: 'GET',
  path:'/',
  handler: function(request, reply) {
    miniprofiler.currentExtension().timeQuery('custom', 'Sleeping...', setTimeout, () => {
      miniprofiler.currentExtension().step('Step 1', () => {
        return reply(miniprofiler.currentExtension().include());
      });
    }, 50);
  }
});

module.exports = server;
