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
    function NavbarController($rootScope, $state, $mdDialog, $mdSidenav, CONFIG, configService) {
      var vm = this;
      vm.selectTab = selectTab;
      vm.toggleMenu = toggleMenu;
      vm.propertiesId = CONFIG.propertiesId;
      vm.propertyChanged = propertyChanged;

      $rootScope.$on('CHANGE_TAB_INDEX', function (event, args) {
        vm.selectedIndex = args.selectedAnalyticItemIndex;
      });
      function propertyChanged() {
        configService.setPropertyId(vm.selectedProperty);
        $rootScope.$broadcast('propertyChanged', {
          property: vm.selectedProperty
        });
      }

      function toggleMenu() {
        $mdSidenav('left').toggle();
      }

      function selectTab(index) {
        var selectedAnalyticsItem = configService.getConfig().analyticsItems[index];
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
