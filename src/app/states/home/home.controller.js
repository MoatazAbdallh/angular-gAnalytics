(function(){
  'use strict';
  angular.module('gAnalytics').controller('HomeController',HomeController);

  /** @ngInject */
  function HomeController(CONFIG){
    var vm = this;
    vm.navbar = {};
    vm.navbar.items = CONFIG.analyticsItems;
  }
})();
