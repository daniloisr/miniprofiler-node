'use strict';

const asyncContext = require('../async-context');

module.exports = {
  buildMiddleware: function(provider) {
    var plugin = {
      register: (server, options, next) => {
        server.ext('onRequest', function(request, reply) {
          provider.handler(asyncContext, () => {
            return reply.continue();
          });
        });
        next();
      }
    };

    plugin.register.attributes = {
      name: `miniprofiler-hapi-${provider.name}`,
      version: require('../../package.json').version
    };

    return plugin;
  },
  mainMiddleware: function(enable, authorize, handleRequest) {
    var plugin = {
      register: (server, options, next) => {
        server.ext('onRequest', function(request, reply) {
          handleRequest(enable, authorize, request.raw.req, request.raw.res).then(extension => {
            if (extension) {
              asyncContext.set(extension);
              reply.continue();
            }
          });
        });
        next();
      }
    };

    plugin.register.attributes = {
      name: 'miniprofiler-hapi',
      version: require('../../package.json').version
    };

    //That's a bad monkey patch, didn't like it, needs refactor...
    plugin.vision = (server) => {
      var view = server._replier._decorations['view'];

      server._replier._decorations['view'] = function(template, context, options) {
        var viewArguments = arguments;
        asyncContext.get().step(`Render: ${template}`, () => {
          return view.apply(this, viewArguments);
        });
      };
    };

    return plugin;
  }
};
