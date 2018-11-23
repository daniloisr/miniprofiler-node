'use strict';

module.exports = {
  module: {
    fn() { throw 'Broken module'; }
  },

  provider: function(obj) {
    let originalFn = obj.fn;

    return {
      name: 'dummy',
      handler: function(req, res, next) {
        obj.fn = function() {
          const timing = req.miniprofiler.startTimeQuery('broken-provider', 'fails');
          originalFn();
          req.miniprofiler.stopTimeQuery(timing);
        };

        next();
      }
    };
  }
};
