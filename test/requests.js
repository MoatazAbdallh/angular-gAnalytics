(function () {
  'use strict';
  var request = require('request');
  var expect = require('expect.js');

  describe('express rest api server', function () {
    var id;

    it('post object', function (done) {
      this.timeout(5000);
      request({
        method: 'POST',
        uri: 'http://localhost:8080/get-meterics-dimensions',
        form: {
          "ids": "ga:113910487",
          "start-date": "30daysAgo",
          "end-date": "yesterday",
          "dimensions": "ga:date",
          "metrics": "ga:sessions,ga:users",
          "request_id": "SESSIONS_USERS_DATE"
        }
      }, function (error, resp, body) {
        expect(resp.statusCode).to.equal(200);
        expect(JSON.parse(body).data).to.not.equal(null);
        expect(JSON.parse(body).data[0].errorCode).to.equal(0);
        expect(JSON.parse(body).data[0].data.kind).to.equal("analytics#gaData");
        done();
      });
    })
  })
})();
