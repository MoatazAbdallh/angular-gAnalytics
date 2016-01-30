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
    function NavbarController($rootScope, $state, $mdDialog, CONFIG) {
      var vm = this;
      vm.selectTab = selectTab;
      $rootScope.$on('CHANGE_TAB_INDEX', function (event, args) {
        vm.selectedIndex = args.selectedAnalyticItemIndex;
      });

      function selectTab(index) {
        var selectedAnalyticsItem = CONFIG.analyticsItems[index];
        if (selectedAnalyticsItem.disabled)
          $mdDialog.show(
            $mdDialog.alert({
              title: 'Warning',
              textContent: "This feature not activated now, please try again later",
              ok: 'Close'
            })
          );
        else
          $state.go(selectedAnalyticsItem.state, {
            id: selectedAnalyticsItem.id
          });
      }
    }
  }

})();
