(function () {
  'use strict';

  angular
    .module('gAnalytics')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, $rootScope, $timeout, CONFIG) {
    $log.debug('runBlock end');
    //Safe Apply to avoid run the ordinary apply in current digest cycle
    $rootScope.safeApply = function (fn) {
      var phase = this.$root.$$phase;
      if (phase == '$apply' || phase == '$digest') {
        if (fn && (typeof (fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    }
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      var selectedAnalyticItem = _.findIndex(CONFIG.analyticsItems,function(item){
        return toState.url.indexOf(item.url)>-1
      });
      $timeout(function(){
        $rootScope.$broadcast('CHANGE_TAB_INDEX',{selectedAnalyticItem:selectedAnalyticItem});
      },500);
    });
  }

})();
