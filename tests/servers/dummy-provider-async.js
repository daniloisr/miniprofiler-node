'use strict';

module.exports = function(asyncModule) {
  return {
    name: 'dummy-async',
    handler: function(req, res, next) {
      asyncModule.dummyFn = function() {
        const timing = req.miniprofiler.startTimeQuery('async', 'dummy call');

        return new Promise(resolve => {
          setTimeout(() => {
            req.miniprofiler.stopTimeQuery(timing);
            resolve();
          }, 25);
        });
      };

      next();
    }
  };
};
