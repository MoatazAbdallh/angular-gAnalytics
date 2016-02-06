(function () {
  'use strict';
  var configModule = angular.module("gAnalytics.config", []);
  var initInjector = angular.injector(["ng"]);
  var $http = initInjector.get("$http");

  getBaseConfig().then(fetchConfig).then(bootstrapApplication);
  configModule.value("ANALYTICS_QUERY", "");
  var CONFIG = null;
  function getBaseConfig() {
    return $http.get("config/config.json").then(function (result) {
      CONFIG = result.data;
      configModule.constant("CONFIG", result.data);
    });
  }

  function fetchConfig() {
    return $http.get("config/queries/" + CONFIG.selectedProperty + "/config.json").then(function (result) {
      configModule.constant("CONFIG_QUERIES", result.data);
    });
  }

  function bootstrapApplication() {
    angular.element(document).ready(function () {
      angular.bootstrap(document, ["gAnalytics"]);
    });
  }
})();
