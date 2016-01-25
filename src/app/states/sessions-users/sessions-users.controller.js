(function () {
  'use strict';

  angular
    .module('gAnalytics')
    .controller('SessionsUsersController', SessionsUsersController);

  /** @ngInject */
  function SessionsUsersController($http, $mdDialog, $rootScope, $mdToast, CONFIG, DATATYPE_MAPPER, SESSIONS_USERS_QUERY, moment, mapper, gCharts) {
    var vm = this;
    vm.disableRequest = true;
    vm.label = "Sessions / Users";
    vm.maxDate = new Date();
    vm.minDate = new Date(2016, 0, 10);
    vm.loading = true;
    vm.selectedRow = [];
    vm.requestAnalytics = requestAnalytics;
    vm.checkDateValidity = checkDateValidity;
    vm.onPaginate = onPaginate;
    google.charts.load('current', {'packages': ['line', 'bar', 'corechart']});

    vm.queryGrid = {
      order: 'name',
      limit: 5,
      page: 1
    };

    $rootScope.$on('CHANGE_TAB_INDEX', function (event, args) {
      vm.views = CONFIG.analyticsItems[args.selectedAnalyticItem].views;
      vm.selectedView = vm.views[0];
    });

    //Initialize
    requestAnalytics();

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
      if (vm.startDate)
        SESSIONS_USERS_QUERY.dates["start-date"] = moment(vm.startDate).format("YYYY-MM-DD");
      if (vm.endDate)
        SESSIONS_USERS_QUERY.dates["end-date"] = moment(vm.endDate).format("YYYY-MM-DD");

      SESSIONS_USERS_QUERY.queries.map(function (query) {
        query = angular.extend(query, SESSIONS_USERS_QUERY.dates);
        query = angular.extend(query, {"ids": CONFIG.propertyId})
      });
      vm.promise = $http({
        url: CONFIG.serverUrl + "get-meterics-dimensions",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        data: SESSIONS_USERS_QUERY.queries
      }).then(function (result) {
        if (result.data.errorCode == 0) {
          vm.loading = false;
          vm.progressFlag = false;
          vm.disableRequest = false;
          vm.analyticsData = []; //Array of received data
          _.each(result.data.data, function (analyticobj, index) {
            if (analyticobj.errorCode == 0) {
              var queryItem = _.find(SESSIONS_USERS_QUERY.queries, function (item) {
                return item.request_id == analyticobj.data.request_id;
              });
              //mapping
              analyticobj.data.rows = _.map(analyticobj.data.rows, function (row) {
                return mapper.mapValueTypes(row, queryItem.mapping);
              });
              vm.analyticsData.push(analyticobj.data);
            }
          });
          if (vm.selectedView == 'Chart')
            google.charts.setOnLoadCallback(drawChart);
        }
      }, function (result) {
        $mdDialog.show(
          $mdDialog.alert({
            title: 'Warning',
            textContent: "Can't retrieve analytics data, please try again later",
            ok: 'Close'
          })
        );
      });
    }

    function drawChart() {
      var chartObj = {};
      var chartArr = [];
      _.each(vm.analyticsData, function (analyticsObj) {
        var data = new google.visualization.DataTable();
        var queryItem = _.find(SESSIONS_USERS_QUERY.queries, function (item) {
          return item.request_id == analyticsObj.request_id;
        });
        //Setting DataTable Headers
        _.each(analyticsObj.columnHeaders, function (columnHeader, index) {
          data.addColumn(queryItem.mapping[index], (columnHeader.name.split(':')[1]).toUpperCase())
        });
        data.addRows(analyticsObj.rows);
        _.each(queryItem.chartTypes, function (chartType, index) {
          var chart = gCharts.getChartType(chartType, angular.element(queryItem.chartContainers[index])[0]);
          chartArr.push({
            chart: chart,
            data: data,
            options: queryItem.chartOptions
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

  }
})();
