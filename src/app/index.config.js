(function () {
  'use strict';

  angular
    .module('gAnalytics')
    .config(config);

  /** @ngInject */
  function config($logProvider) {
    // Enable log
    $logProvider.debugEnabled(true);
  }

})();
