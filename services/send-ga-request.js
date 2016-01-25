(function () {
  'use strict';
  var $q = require('q');
  var request = require('request');
  var qs = require('querystring');
  var logger = require('./logger');
  var extend = require('extend');

  function sendGARequest(data, accessToken) {
    var deferred = $q.defer();
    var id = {
      "request_id":data.request_id
    };
    request({
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + accessToken // Here is where we use the auth token
      },
      uri: 'https://www.googleapis.com/analytics/v3/data/ga?' + qs.stringify(data)
    }, function (error, resp, body) {
      if (resp.statusCode != 200) {
        logger().log("error", error);
        deferred.resolve({
          errorCode: 1,
          error: extend(JSON.parse(body).error.message, id),
          data: null
        });
      }
      else
        deferred.resolve({
          errorCode: 0,
          error: null,
          data: extend(JSON.parse(body), id)
        });
    });
    return deferred.promise;
  }


  module.exports = {
    sendGARequest: sendGARequest
  }
})();
