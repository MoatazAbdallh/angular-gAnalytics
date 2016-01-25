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
    function NavbarController($rootScope, $state, CONFIG) {
      var vm = this;
      vm.selectTab = selectTab;
      $rootScope.$on('CHANGE_TAB_INDEX', function (event, args) {
        vm.selectedIndex = args.selectedAnalyticItemIndex;
      });

      function selectTab(index) {
        var selectedAnalyticsItem = CONFIG.analyticsItems[index];
        $state.go(selectedAnalyticsItem.state, {
          id: selectedAnalyticsItem.id
        });
      }
    }
  }

})();
