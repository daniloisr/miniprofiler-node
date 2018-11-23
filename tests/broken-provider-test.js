'use strict';

var expect = require('chai').expect;

module.exports = function(server) {
  describe('Broken providers', function() {
    before(server.setUp.bind(null, 'broken'));
    after(server.tearDown);

    it('skip timings for calls with errors', function(done) {
      server.get('/', (err, response) => {
        var ids = JSON.parse(response.headers['x-miniprofiler-ids']);
        expect(ids).to.have.lengthOf(1);
        expect(response.statusCode).to.equal(500);

        server.post('/mini-profiler-resources/results/', { id: ids[0], popup: 1 }, (err, response, body) => {
          var result = JSON.parse(body);

          expect(result.Id).to.equal(ids[0]);
          expect(result.Name).to.equal('/');
          expect(result.Root.Children).to.be.empty;
          expect(result.Root.CustomTimings).to.have.property('broken-provider');
          expect(result.Root.CustomTimings.custom).to.be.undefined;
          done();
        });
      });

    });

  });
};
