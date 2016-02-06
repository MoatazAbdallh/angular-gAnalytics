(function () {
  'use strict';
  angular.module('gAnalytics').controller('HomeController', HomeController);

  /** @ngInject */
  function HomeController(CONFIG, CONFIG_QUERIES, $http, configService) {
    var vm = this;
    vm.selectedProperty = CONFIG.selectedProperty;
    vm.navbar = {};
    var configQueries = configService.getConfig() || CONFIG_QUERIES;

    vm.navbar.items = configQueries.analyticsItems;
  }
})();
