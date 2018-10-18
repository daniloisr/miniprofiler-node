'use strict';

var expect = require('chai').expect;

module.exports = function(server) {
  describe('Concurrent Async Tests', function() {
    before(server.setUp.bind(null, 'async'));
    after(server.tearDown);

    it('Timing runs on its own context', function(done) {
      let count = 0;
      const countDone = () => { if (++count === 2) done(); };

      server.get('/', (err, response) => {
        var ids = JSON.parse(response.headers['x-miniprofiler-ids']);
        expect(ids).to.have.lengthOf(1);

        server.post('/mini-profiler-resources/results/', { id: ids[0], popup: 1 }, (err, response, body) => {
          var result = JSON.parse(body);
          expect(result.Root.CustomTimings.async).to.have.lengthOf(2);
          countDone();
        });
      });

      server.get('/', (err, response) => {
        var ids = JSON.parse(response.headers['x-miniprofiler-ids']);
        expect(ids).to.have.lengthOf(1);

        server.post('/mini-profiler-resources/results/', { id: ids[0], popup: 1 }, (err, response, body) => {
          var result = JSON.parse(body);
          expect(result.Root.CustomTimings.async).to.have.lengthOf(2);
          countDone();
        });
      });
    });

    it('Timings do not interfer on each other', function(done) {
      let count = 0;
      const countDone = () => { if (++count === 2) done(); };

      server.get('/', (err, response) => {
        var ids = JSON.parse(response.headers['x-miniprofiler-ids']);
        expect(ids).to.have.lengthOf(1);
        countDone();
      });

      server.get('/?once=true', (err, response) => {
        var ids = JSON.parse(response.headers['x-miniprofiler-ids']);
        expect(ids).to.have.lengthOf(1);
        countDone();
      });
    });
  });
};
