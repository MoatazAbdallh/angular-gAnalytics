(function () {
  'use strict';
  angular.module("gAnalytics").filter("dateFilter", dateFilter);

  /** @ngInject */
  function dateFilter(moment) {
    return function (input, format) {
      if (input)
        return moment(input).format(format);
    }
  }
})();
