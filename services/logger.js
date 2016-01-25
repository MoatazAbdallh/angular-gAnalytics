(function () {
  var winston = require('winston');
  var fs = require('fs');
  var path = require('path');
  var config = require('../config');
  var loggerInstance = null;

  var logDirectory =  config.log_directory;
  fs.existsSync("logs") || fs.mkdirSync("logs");
  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

  function logger() {
    if (loggerInstance)
      return loggerInstance
    else {
      loggerInstance = new (winston.Logger)({
        transports: [
          new (winston.transports.Console)(),
          new (require('winston-daily-rotate-file'))({filename: path.join(logDirectory, 'process.log')})
        ]
      });
      return loggerInstance;
    }
  }

  module.exports = logger;
})();
