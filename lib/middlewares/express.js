'use strict';

const asyncContext = require('../async-context');

module.exports = {
  mainMiddleware: function(options, handleRequest) {
    return function(req, res, next) {
      handleRequest(options.enable, options.authorize, req, res).then((handled) => {
        res.locals.miniprofiler = req.miniprofiler;

        var render = res.render;
        res.render = function() {
          var renderArguments = arguments;
          req.miniprofiler.step(`Render: ${arguments[0]}`, function() {
            render.apply(res, renderArguments);
          });
        };

        if (!handled) {
          asyncContext.miniprofiler = req.miniprofiler;
          for (var provider of options.providers) provider.install(asyncContext);
          next();
        }
      }).catch(next);
    };
  }
};
