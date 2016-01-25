(function () {
  'use strict';
  var configModule = angular.module("gAnalytics.config", []);
  var initInjector = angular.injector(["ng"]);
  var $http = initInjector.get("$http");
  getBaseConfig().then(getSessionsUsersQuery).then(bootstrapApplication);

  function getBaseConfig(){
   return $http.get("config/config.json").then(function (result) {
      configModule.constant("CONFIG", result.data);
    });
  }
  function getSessionsUsersQuery(){
    return  $http.get("config/sessions-users-query.json").then(function (result) {
      configModule.constant("SESSIONS_USERS_QUERY", result.data);
    });
  }
  function bootstrapApplication() {
    angular.element(document).ready(function () {
      angular.bootstrap(document, ["gAnalytics"]);
    });
  }
})();
