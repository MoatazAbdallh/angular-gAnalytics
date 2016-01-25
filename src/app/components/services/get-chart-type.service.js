(function () {
  'use strict';
  angular.module('gAnalytics').service('gCharts', gCharts);

  /** @ngInject */
  function gCharts() {
    google.charts.load('current', {'packages': ['line', 'bar', 'corechart']});

    this.getChartType = function (chartType, chartContainer) {
      switch (chartType) {
        case "google.charts.Line":
          return new google.charts.Line(chartContainer);
          break;
        case "google.charts.Bar":
          return new google.charts.Bar(chartContainer);
          break;
        case "google.visualization.PieChart":
          return new google.visualization.PieChart(chartContainer);
          break;
        case "google.visualization.GeoChart":
          return new google.visualization.GeoChart(chartContainer);
          break;
      }
    }
  }
})();
