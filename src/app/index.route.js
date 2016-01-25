(function () {
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
      .state('home.dynamic-analytics', {
        url: '/analytics/:id',
        templateUrl: 'app/states/sessions-users/sessions-users.html',
        controller: 'SessionsUsersController',
        controllerAs: 'vm',
        params: {
          id: null
        }
      })

    $urlRouterProvider.otherwise('/analytics/sessions-users');
  }

})();
