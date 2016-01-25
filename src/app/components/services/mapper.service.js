(function () {
  'use strict';
  angular.module('gAnalytics').service("mapper", mapper);

  /** @ngInject */
  function mapper(moment) {
    this.mapValueTypes = function (row, mapArr) {
      return _.map(row, function (value, index) {
        return mapValue(value, mapArr[index]);
      });
    };

    function mapValue(value, mapType) {
      var newValue;
      switch (mapType) {
        case "number":
          newValue = parseInt(value);
          break;
        case "string":
          newValue = value.toString();
          break;
        case "date":
          newValue = new Date(moment(value, "YYYYMMDD"));
          break;
        default:
          newValue = value;
          break;
      }
      return newValue;
    }
  }
})();
