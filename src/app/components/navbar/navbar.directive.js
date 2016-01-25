(function () {
  'use strict';

  angular
    .module('gAnalytics')
    .directive('navBar', navBar);

  /** @ngInject */
  function navBar() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'app/components/navbar/navbar.html',
      scope: {
        items: '='
      },
      controller: NavbarController,
      controllerAs: 'vm',
      bindToController: {
        items: '='
      }
    };

    return directive;

    /** @ngInject */
    function NavbarController($rootScope) {
      var vm = this;
      $rootScope.$on('CHANGE_TAB_INDEX', function (event,args) {
        vm.selectedIndex = args.selectedAnalyticItem;
      });
    }
  }

})();
