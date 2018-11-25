'use strict';

  // asyncContext.set(currentRequestExtension);
  // Object.defineProperty(request, 'miniprofiler', {
  //   get: () => {
  //     return asyncContext.get();
  //   }
  // });
const asyncHooks = require('async_hooks');
class AsyncContext {
  constructor() {
    this.map = new Map();
    asyncHooks.createHook({
      init: (id, _type, triggerId) => {
        if (this.map.has(triggerId))
          this.map.set(id, this.map.get(triggerId));
      },
      destroy: (id) => this.map.delete(id)
    }).enable();
  }

  get() {
    const id = asyncHooks.executionAsyncId();
    if (this.map.has(id))
      return this.map.get(id);
  }

  set(val) {
    this.map.set(asyncHooks.executionAsyncId(), val);
  }
}
const asyncContext = new AsyncContext();

module.exports = {
  buildMiddleware: function(provider) {
    return function(req, res, next) {
      provider.handler(req, res, next);
    };
  },
  mainMiddleware: function(enable, authorize, handleRequest) {
    return function(req, res, next) {
      handleRequest(enable, authorize, req, res).then((handled) => {
        res.locals.miniprofiler = req.miniprofiler;

        asyncContext.set(req.miniprofiler);
        Object.defineProperty(req, 'miniprofiler', { get: () => asyncContext.get() });

        var render = res.render;
        res.render = function() {
          var renderArguments = arguments;
          req.miniprofiler.step(`Render: ${arguments[0]}`, function() {
            render.apply(res, renderArguments);
          });
        };

        if (!handled)
          next();
      }).catch(next);
    };
  }
};
