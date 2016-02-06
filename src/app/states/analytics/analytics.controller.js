(function () {
  'use strict';

  angular
    .module('gAnalytics')
    .controller('AnalyticsController', AnalyticsController);

  /** @ngInject */
  function AnalyticsController($http, $mdDialog, $rootScope, $mdToast, CONFIG, configService, analyticsQuery, moment, mapper, gCharts) {
    var vm = this;
    vm.disableRequest = true;
    vm.maxDate = new Date();
    vm.minDate = new Date(2016, 0, 10);
    vm.loading = true;
    vm.selectedRow = [];
    vm.requestAnalytics = requestAnalytics;
    vm.checkDateValidity = checkDateValidity;
    vm.onPaginate = onPaginate;
    vm.orderGrid = orderGrid;
    vm.ordering = {};
    vm.ordering.index = 0;
    vm.ordering.status = 'ascending';

    vm.queryGrid = {
      order: 'name',
      limit: 5,
      page: 1,
      options: [20, 40, 60, 80, 100]
    };

    $rootScope.$on('CHANGE_TAB_INDEX', function (event, args) {
      vm.selectedAnalyticsItem = configService.getConfig().analyticsItems[args.selectedAnalyticItemIndex];
      vm.views = configService.getConfig().analyticsItems[args.selectedAnalyticItemIndex].views;
      vm.selectedView = vm.views[0];
      //Getting Query Json for this analytic Item
      $http.get(configService.getConfig().analyticsItems[args.selectedAnalyticItemIndex].query_file).then(function (result) {
        analyticsQuery.setQuery(result.data);
        //Initialize
        requestAnalytics();
      });
    });
    $rootScope.$on('propertyChanged', function () {
      requestAnalytics();
    });

    function checkDateValidity() {
      if (!(vm.startDate && vm.endDate))
        $mdToast.show(
          $mdToast.simple()
            .textContent('Please choose valid Date')
            .parent(angular.element('md-card-content'))
            .position('top right')
            .hideDelay(1000)
        );
      else
        requestAnalytics();
    }

    function requestAnalytics() {
      vm.disableRequest = true;
      var ANALYTICS_QUERY = analyticsQuery.getQuery();

      if (vm.startDate)
        ANALYTICS_QUERY.dates["start-date"] = moment(vm.startDate).format("YYYY-MM-DD");
      if (vm.endDate)
        ANALYTICS_QUERY.dates["end-date"] = moment(vm.endDate).format("YYYY-MM-DD");

      ANALYTICS_QUERY.queries.map(function (query) {
        query = angular.extend(query, ANALYTICS_QUERY.dates);
        query = angular.extend(query, {"ids": configService.getPropertyId().id})
      });
      vm.promise = $http({
        url: CONFIG.serverUrl + "get-meterics-dimensions",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        data: ANALYTICS_QUERY.queries
      }).then(function (result) {
        if (result.data.errorCode == 0) {
          vm.loading = false;
          vm.progressFlag = false;
          vm.disableRequest = false;
          vm.analyticsData = []; //Array of received data
          _.each(result.data.data, function (analyticobj, index) {
            if (analyticobj.errorCode == 0) {
              var queryItem = _.find(ANALYTICS_QUERY.queries, function (item) {
                return item.request_id == analyticobj.data.request_id;
              });
              //mapping
              analyticobj.data.rows = _.map(analyticobj.data.rows, function (row) {
                return mapper.mapValueTypes(row, queryItem.mapping);
              });
              angular.extend(analyticobj.data, {
                "queryItem": queryItem
              });
              vm.analyticsData.push(analyticobj.data);
            }
          });
          if (vm.selectedView == 'Chart')
            google.charts.setOnLoadCallback(drawChart);
        }
      }, function (result) {
        vm.loading = false;
        $mdDialog.show(
          $mdDialog.alert({
            title: 'Warning',
            textContent: "Can't retrieve analytics data, please try again later",
            ok: 'Close'
          })
        );
      });
      return vm.promise;
    }

    function drawChart() {
      var ANALYTICS_QUERY = analyticsQuery.getQuery();
      var chartObj = {};
      var chartArr = [];
      _.each(vm.analyticsData, function (analyticsObj) {
        var data = new google.visualization.DataTable();
        //Setting DataTable Headers
        _.each(analyticsObj.columnHeaders, function (columnHeader, index) {
          data.addColumn(analyticsObj.queryItem.mapping[index], (columnHeader.name.split(':')[1]).toUpperCase())
        });
        data.addRows(analyticsObj.rows);
        _.each(analyticsObj.queryItem.chartTypes, function (chartType, index) {
          var chart = gCharts.getChartType(chartType, angular.element(analyticsObj.queryItem.chartContainers[index])[0]);
          chartArr.push({
            chart: chart,
            data: data,
            options: analyticsObj.queryItem.chartOptions
          });
        });
      });
      //Drawing Charts
      _.each(chartArr, function (chartObj) {
        chartObj.chart.draw(chartObj.data, chartObj.options);
      });
    }

    function onPaginate(page, limit) {
      angular.extend({}, vm.queryGrid, {page: page, limit: limit});
    }

    function orderGrid(parent_index, index) {
      vm.ordering.index = index;
      vm.ordering.status = vm.ordering.status == 'descending' ? 'ascending' : 'descending';
      _.each(vm.analyticsData, function (data) {
        data.rows = _.sortBy(data.rows, function (row) {
          return row[index];
        });
        if (vm.ordering.status == 'descending')
          data.rows = data.rows.reverse();
      });
      $rootScope.safeApply();
    }
  }
})();
