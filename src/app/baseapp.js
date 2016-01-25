(function () {
  'use strict';
  var configModule = angular.module("gAnalytics.config", []);
  var initInjector = angular.injector(["ng"]);
  var $http = initInjector.get("$http");
  getBaseConfig().then(bootstrapApplication);
  configModule.value("ANALYTICS_QUERY","");

  function getBaseConfig() {
    return $http.get("config/config.json").then(function (result) {
      configModule.constant("CONFIG", result.data);
    });
  }

  function bootstrapApplication() {
    angular.element(document).ready(function () {
      angular.bootstrap(document, ["gAnalytics"]);
    });
  }
})();
