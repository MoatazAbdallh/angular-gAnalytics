(function() {
  'use strict';

  angular
    .module('gAnalytics')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('home', {
        templateUrl: 'app/states/home/home.html',
        controller: 'HomeController',
        controllerAs: 'vm'
      })
      .state('home.dashboard', {
        url: '/dashboard',
        templateUrl: 'app/states/dashboard/dashboard.html',
        controller: 'DashboardController',
        controllerAs: 'vm'
      })
      .state('home.sessions-users', {
        url: '/sessions-users',
        templateUrl: 'app/states/sessions-users/sessions-users.html',
        controller: 'SessionsUsersController',
        controllerAs: 'vm'
      })

    $urlRouterProvider.otherwise('/sessions-users');
  }

})();
