(function () {
  'use strict';
  var express = require('express');
  var bodyParser = require('body-parser');
  var morgan = require('morgan');
  var FileStreamRotator = require('file-stream-rotator');
  var fs = require('fs');
  var mongoose = require('mongoose');
  var base64 = require('base-64');
  var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
  var config = require('./config'); // get our config file
  var logger = require('./services/logger');
  var authorizeAPI = require('./services/authorize-api');
  var gaApi = require('./services/send-ga-request');

  var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    // intercept OPTIONS method
    if ('OPTIONS' == req.method)
      res.sendStatus(200);
    else
      next();
  }
  var app = express();
  app.use(allowCrossDomain);
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());
  var port = process.env.PORT || 8080;
  app.listen(port);

//HTTP Logging
  var httpLogDirectory = config.http_log_directory;
  fs.existsSync(httpLogDirectory) || fs.mkdirSync(httpLogDirectory);
// create a rotating write stream
  var accessLogStream = FileStreamRotator.getStream({
    filename: httpLogDirectory + '/access-%DATE%.log',
    frequency: 'daily',
    verbose: false
  });
  app.use(morgan('combined', {stream: accessLogStream}));

//Mongo DB
//  mongoose.connect(config.database);
//  var db = mongoose.connection;
//  db.on('error', function (err) {
//    logger().log("error", err);
//  });
//  db.once('open', function (callback) {
//    logger().log("info", "Success Connection to DB");
//  });


// =======================
// routes ================
// =======================

  app.post('/get-meterics-dimensions', function (req, res) {
    authorizeAPI.getGAToken().then(function (gaToken) {
        var dataArr = [];
        var responseArr = [];
        var counter = 0;
        if (Array.isArray(req.body))
          dataArr = req.body;
        else
          dataArr.push(req.body);

        dataArr.forEach(function (data) {
          gaApi.sendGARequest(data, gaToken.access_token).then(function (response) {
            counter++;
            responseArr.push(response);
            if (counter == dataArr.length)
              res.json({
                errorCode: 0,
                error: null,
                data: responseArr
              });
          });
        });
      }
      , function (error) {
        res.json({
          errorCode: 1,
          error: error
        })
      })
  });

// API ROUTES -------------------
// we'll get to these in a second

// =======================
// start the server ======
// =======================
  console.log('Magic happens at http://localhost:' + port);
})();
