(function () {
  'use strict';
  angular.module("gAnalytics").service("configService", configService);

  /** @ngInject */
  function configService() {
    var CONFIG = null;
    var PROPERTY_ID = null;
    this.setConfig = function (config) {
      CONFIG = config;
    };
    this.getConfig = function () {
      return CONFIG;
    };
    this.setPropertyId = function (propertyId) {
      PROPERTY_ID = propertyId;
    };
    this.getPropertyId = function () {
      return PROPERTY_ID;
    }
  }
})();
