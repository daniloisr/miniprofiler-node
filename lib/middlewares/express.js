'use strict';

const asyncContext = require('../async-context');

module.exports = {
  buildMiddleware: function(provider) {
    return function(_req, _res, next) {
      provider.handler(asyncContext, next);
    };
  },
  mainMiddleware: function(enable, authorize, handleRequest, cls) {
    return function(req, res, next) {
      handleRequest(enable, authorize, req, res).then(extension => {
        if (extension) {
          asyncContext.set(extension);

          var render = res.render;
          res.render = function() {
            var renderArguments = arguments;
            asyncContext.get().step(`Render: ${arguments[0]}`, function() {
              render.apply(res, renderArguments);
            });
          };

          next();
        }
      }).catch(next);
    };
  }
};
