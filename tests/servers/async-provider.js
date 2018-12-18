'use strict';

module.exports = function(obj) {
  return {
    name: 'dummy-async',
    handler: function(asyncContext, next) {
      obj.asyncFn = function() {
        const timing = asyncContext.get().startTimeQuery('async', 'dummy call');

        return new Promise(resolve => {
          setTimeout(() => {
            asyncContext.get().stopTimeQuery(timing);
            resolve();
          }, 25);
        });
      };

      next();
    }
  };
};
