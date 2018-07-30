'use strict';

const asyncHooks = require('async_hooks');

class AsyncContext {
  constructor() {
    this.map = new Map();
    asyncHooks.createHook({
      init: (id, type, triggerId) => {
        if ((type === 'PROMISE' || type === 'Immediate') && this.map.has(triggerId))
          this.map.set(id, this.map.get(triggerId));
      },
      destroy: (id) => this.map.delete(id)
    }).enable();
  }

  get miniprofiler() {
    const id = asyncHooks.executionAsyncId();
    if (this.map.has(id))
      return this.map.get(id);
  }

  set miniprofiler(val) {
    this.map.set(asyncHooks.executionAsyncId(), val);
  }
}

module.exports = new AsyncContext();
