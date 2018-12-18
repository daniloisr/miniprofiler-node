'use strict';

const asyncContext = require('../async-context');

module.exports = {
  buildMiddleware: function(provider) {
    return function *(next) {
      yield new Promise((resolve, reject) => {
        provider.handler(asyncContext, resolve);
      });
      yield next;
    };
  },
  mainMiddleware: function(enable, authorize, handleRequest) {
    return function *(next) {
      var extension = yield handleRequest(enable, authorize, this.req, this.res);

      if (extension) {
        asyncContext.set(extension);

        if (this.render) {
          var render = this.render;
          this.render = function() {
            return new Promise((resolve, reject) => {
              var renderArguments = arguments;
              asyncContext.get().step(`Render: ${arguments[0]}`, function() {
                render.apply(this, renderArguments);
                resolve();
              });
            });
          };
        }

        return yield next;
      }

    };
  }
};
