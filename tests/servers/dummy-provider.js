'use strict';

module.exports = function() {
  return {
    name: 'dummy',
    handler: function(_asyncContext, next) {
      next();
    }
  };
};
