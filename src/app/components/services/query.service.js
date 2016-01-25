(function () {
  'use strict';
  angular.module("gAnalytics").service("analyticsQuery", analyticsQuery);

  /** @ngInject */
  function analyticsQuery() {

    this.setQuery = function (queryConfig) {
      this.queryConfig = queryConfig;
    }
    this.getQuery = function () {
      return this.queryConfig;
    }
  }
})();
