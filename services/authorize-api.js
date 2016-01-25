(function () {
  var fs = require('fs');
  var crypto = require('crypto');
  var request = require('request');
  var config = require('../config');
  var logger = require('./logger');
  var $q = require('q')

  var JWSHeader = {
    'alg': 'RS256',
    'typ': 'JWT'
  }
  var JWSPayload = {
    'iss': config.GA_SERVICE_ACCOUNT, // Service account email
    'scope': 'https://www.googleapis.com/auth/analytics.readonly', // We MUST tell them we just want to read data
    'aud': 'https://accounts.google.com/o/oauth2/token'
  }
  var SIGNATURE_ALGORITHM = 'RSA-SHA256';
  var SIGNATURE_ENCODE_METHOD = 'base64';
  var GA_KEY_PATH = config.GA_KEY_PATH;
  var gaKey;

  function urlEscape(source) {
    return source.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
  }

  function base64Encode(obj) {
    var encoded = new Buffer(JSON.stringify(obj), 'utf8').toString('base64');
    return urlEscape(encoded);
  }

  function readPrivateKey() {
    if (!gaKey) {
      gaKey = fs.readFileSync(GA_KEY_PATH, 'utf8');
    }
    return gaKey;
  }

  var authorize = function (callback) {
    var deferred = $q.defer();

    var self = this,
      now = parseInt(Date.now() / 1000, 10), // Google wants us to use seconds
      cipher,
      signatureInput,
      signatureKey = readPrivateKey(),
      signature,
      jwt;

    // Setup time values
    JWSPayload.iat = now;
    JWSPayload.exp = now + 3600; // Token valid for one hour

    // Setup JWS Signature
    signatureInput = base64Encode(JWSHeader) + '.' + base64Encode(JWSPayload); //Plain text

    // Generate JWT
    cipher = crypto.createSign('RSA-SHA256');
    cipher.update(signatureInput);
    signature = cipher.sign(signatureKey,'base64');
    jwt = signatureInput + '.' + urlEscape(signature);

    // Send request to authorize this application
    request({
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      uri: 'https://accounts.google.com/o/oauth2/token',
      body: 'grant_type=' + escape('urn:ietf:params:oauth:grant-type:jwt-bearer') +
      '&assertion=' + jwt
    }, function (error, response, body) {
      if (error) {
        logger().log("error", error);
        deferred.reject(error);
      } else {
        var gaResult = JSON.parse(body);
        if (gaResult.error) {
          logger().log("error", error);
          deferred.reject(error);
        } else {
          deferred.resolve(gaResult);
        }
      }
    });

    return deferred.promise;
  };
  module.exports = {
    getGAToken: authorize
  }
})();
