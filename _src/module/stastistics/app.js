angular.module('statisticsApp', ['we7app']);
angular.module('statisticsApp').controller('HorizontalBarCtrl', ['$scope', '$http', 'serviceCommon', 'config', function($scope, $http, serviceCommon, config) {
	$scope.needAccountApi = config.frame == 'account' || config.frame == 'wxapp';
	require(['echarts'], function(echarts) {
		//公众号
		if ($scope.needAccountApi) {
            var accountChart = echarts.init(document.getElementById('chart-line'));
        }
		accountOption = {
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'line'
				}
			},
			grid: {
				left: '3%',
				right: '3%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: {
				data: [],
			},
			yAxis: {
				splitArea: {
					show: true
				}
			},
			series: [{
				name: '数量',
				type: 'line',
				smooth: true,
				data: []
			}]
		};
		if ($scope.needAccountApi) {
            accountChart.showLoading();
        }
		//模块
		var moduleChart = echarts.init(document.getElementById('chart-horizontal-bar'));
		moduleOption = {
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				}
			},
			grid: {
				left: '3%',
				right: '3%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: {},
			yAxis: {
				type: 'category',
				data: [],
			},
			series: [{
				name: '数量',
				type: 'bar',
				data: []
			}]
		};
		moduleChart.showLoading();

		$scope.active = true;
		$scope.code = "<script type=\"text\/javascript\" src=\"\{$_W['siteroot']\}app/index.php?i=\{$_W['uniacid']\}&c=utility&a=visit&do=showjs&m=\{$_W['current_module']['name']\}\"><\/script>";
		//解决访问统计没数据的方法显示与隐藏
		$scope.show = true;
		$scope.accountDateRange = { startDate: moment().format('YYYY-MM-DD'), endDate: moment().format('YYYY-MM-DD')};
		$scope.moduleDateRange = { startDate: moment().format('YYYY-MM-DD'), endDate: moment().format('YYYY-MM-DD')};
		$scope.changeDivideType = function (accountOrModule, type) {
			if (accountOrModule == 'account') {
				$scope.accountDivideType = type;
			}
			if (accountOrModule == 'module') {
				$scope.moduleDivideType = type;
			}
			$scope.getModuleApi(accountOrModule, 'week');
		};
		$scope.getModuleApi = function(accountOrModule, timeType) {
			var link = '';
			var divideType = '';
			var dateRange = '';
			if (accountOrModule == 'account') {
				$scope.accountTimeType = timeType;
				$scope.accountLabels = [];
				$scope.accountData = [];
				link = config.links.accountApi;
				divideType = $scope.accountDivideType;
				dateRange = $scope.accountDateRange;
			}
			if (accountOrModule == 'module') {
				$scope.moduleTimeType = timeType;
				$scope.moduleLabels = [];
				$scope.moduleData = [];
				link = config.links.moduleApi;
				divideType = $scope.moduleDivideType;
				dateRange = $scope.moduleDateRange;
			}
			$http.post(link, {'divide_type': divideType, 'time_type' : timeType, 'daterange': dateRange})
				.success(function(data) {
					if ($scope.needAccountApi) {
                        accountChart.hideLoading();
                    }	
					moduleChart.hideLoading();
					if ($scope.needAccountApi && accountOrModule == 'account') {
						accountOption.xAxis.data = data.message.message.data_x;
						accountOption.series[0].data = data.message.message.data_y;
						accountChart.setOption(accountOption);
					}
					if (accountOrModule == 'module') {
						var count = data.message.message.data_y.length;
						$scope.actualHight = parseInt(count) * 15 + 'px';
						moduleOption.series[0].data = data.message.message.data_x;
						moduleOption.yAxis.data = data.message.message.data_y;
						moduleChart.setOption(moduleOption);
					}
					
				})
		};
		$scope.accountDivideType = 'bysum';
		$scope.moduleDivideType = 'bysum';
		$scope.accountTimeType = 'week';
		$scope.moduleTimeType = 'week';
		if ($scope.needAccountApi) {
            $scope.getModuleApi('account', $scope.accountTimeType);
        }
		$scope.getModuleApi('module', $scope.moduleTimeType);
		$scope.success = function(id) {
			var id = parseInt(id);
			var obj = $('<span class="label label-success" style="position:absolute;z-index:10;width:90px;height:34px;line-height:28px;"><i class="fa fa-check-circle"></i> 复制成功</span>');
			serviceCommon.copySuccess(id, obj);
		};
		$scope.changeStatus = function() {
			$scope.show = $scope.show ? false : true;
		};
		$scope.$watch('moduleDateRange', function(newVal, oldVal) {
			if(newVal && newVal != oldVal){
				$scope.moduleDateRange.startDate = moment(newVal.startDate).format("YYYY-MM-DD");
				$scope.moduleDateRange.endDate = moment(newVal.endDate).format("YYYY-MM-DD");
				$scope.getModuleApi('module', 'daterange');
			}
		}, true);
		$scope.$watch('accountDateRange', function(newVal, oldVal) {
			if(newVal && newVal != oldVal){
				$scope.accountDateRange.startDate = moment(newVal.startDate).format("YYYY-MM-DD");
				$scope.accountDateRange.endDate = moment(newVal.endDate).format("YYYY-MM-DD");
				$scope.getModuleApi('account', 'daterange');
			}
		}, true);
	});
}]);
angular.module('statisticsApp').controller('statisticsSettingCtrl', ['$scope', '$http', 'config', function($scope, $http, config) {
	$scope.setting = config.highest_visit;
	$scope.interval = config.interval;
	$scope.newVisitVal = 0;
	$scope.newInterval = 0;
	$scope.editInfo = function(type, val) {
		switch(type) {
			case 'visit':
				$scope.newVisitVal = val ? val : 0;
			break;
			case 'interval':
				$scope.newInterval = val ? val : 0;
			break;
		}
	};

	$scope.saveSetting = function(type) {
		switch(type) {
			case 'visit':
				$http.post(config.links.editSetting, {'highest_visit': $scope.newVisitVal, 'type': 'highest_visit'})
					.success(function(data) {
						if (data.message.errno == 0) {
							$scope.setting = $scope.newVisitVal;
						}
						util.message(data.message.message);
					});
			break;
			case 'interval':
				$http.post(config.links.editSetting, {'interval': $scope.newInterval, 'type': 'interval'})
					.success(function(data) {
						if (data.message.errno == 0) {
							$scope.interval = $scope.newInterval;
						}
						util.message(data.message.message);
					});				
			break;
		}
	};
}]);
angular.module('statisticsApp').controller('systemAccountAppAnalysisCtrl', ['$scope', '$http', 'config', function($scope, $http, config){
	require(['echarts'], function(echarts) {
		var myChart = echarts.init(document.getElementById('chart-line'));
		option = {
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'line'
				}
			},
			xAxis: {
				data: []
			},
			yAxis: {
				splitArea: {
					show: true
				}
			},
			series: [{
				name: '数量',
				type: 'line',
				smooth: true,
				data: []
			}]
		};
		myChart.showLoading();

		$scope.dateRange = { startDate: moment().format('YYYY-MM-DD'), endDate: moment().format('YYYY-MM-DD')};
		$scope.changeDivideType = function (type) {
			$scope.divideType = type;
			$scope.getAccountApi('week');
		};

		$scope.getAccountApi = function(timeType) {
			$scope.timeType = timeType;
			$http.post(config.links.accountApi, {'divide_type': $scope.divideType, 'time_type' : timeType, 'daterange': $scope.dateRange})
				.success(function(data) {
					myChart.hideLoading();
					option.xAxis.data = data.message.message.data_x;
					option.series[0].data = data.message.message.data_y;
					myChart.setOption(option);
				})
		};
		$scope.divideType = 'bysum';
		$scope.timeType = 'week';
		$scope.getAccountApi($scope.timeType);
		$scope.$watch('dateRange', function(newVal, oldVal) {
			if(newVal && newVal != oldVal){
				$scope.dateRange.startDate = moment(newVal.startDate).format("YYYY-MM-DD");
				$scope.dateRange.endDate = moment(newVal.endDate).format("YYYY-MM-DD");
				$scope.getAccountApi('daterange');
			}
		}, true);
	});
}]);
angular.module('statisticsApp').controller('systemAccountAnalysisCtrl', ['$scope', '$http', 'config', function($scope, $http, config) {
	require(['echarts'], function(echarts) {
		var accountChart = echarts.init(document.getElementById('chart-line'));
		accountOption = {
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'line'
				}
			},
			grid: {
				left: '3%',
				right: '3%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: {
				data: [],
			},
			yAxis: {
				splitArea: {
					show: true
				}
			},
			series: [{
				name: '数量',
				type: 'line',
				smooth: true,
				data: []
			}]
		};
		accountChart.showLoading();

		$scope.dateRange = { startDate: moment().format('YYYY-MM-DD'), endDate: moment().format('YYYY-MM-DD')};
		$scope.getAccountApi = function(timeType) {
			$scope.timeType = timeType;
			$http.post(config.links.accountApi, {'time_type' : timeType, 'daterange': $scope.dateRange})
				.success(function(data) {
					accountChart.hideLoading();
					accountOption.xAxis.data = data.message.message.data_x;
					accountOption.series[0].data = data.message.message.data_y;
					accountChart.setOption(accountOption);
				})
		};
		$scope.timeType = 'week';
		$scope.getAccountApi($scope.timeType);
		$scope.$watch('dateRange', function(newVal, oldVal) {
			if(newVal && newVal != oldVal){
				$scope.dateRange.startDate = moment(newVal.startDate).format("YYYY-MM-DD");
				$scope.dateRange.endDate = moment(newVal.endDate).format("YYYY-MM-DD");
				$scope.getAccountApi('daterange');
			}
		}, true);
	});
}]);
angular.module('statisticsApp').controller('CurrentAccountCtrl', ['$scope', '$http', 'config', function($scope, $http, config) {
	require(['echarts'], function(echarts) {
		var accountChart = echarts.init(document.getElementById('chart-line'));
		accountOption = {
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'line'
				}
			},
			grid: {
				left: '3%',
				right: '3%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: {
				data: [],
			},
			yAxis: {
				splitArea: {
					show: true
				}
			},
			series: [{
				name: '数量',
				type: 'line',
				smooth: true,
				data: []
			}]
		};
		accountChart.showLoading();

		$scope.accountDateRange = { startDate: moment().format('YYYY-MM-DD'), endDate: moment().format('YYYY-MM-DD')};
		$scope.getModuleApi = function(timeType) {
			$scope.accountTimeType = timeType;
			$http.post(config.links.accountApi, {'time_type' : timeType, 'daterange': $scope.accountDateRange})
				.success(function(data) {
					accountChart.hideLoading();
					accountOption.xAxis.data = data.message.message.data_x;
					accountOption.series[0].data = data.message.message.data_y;
					accountChart.setOption(accountOption);
				})
		};
		$scope.accountTimeType = 'week';
		$scope.getModuleApi($scope.accountTimeType);
		$scope.$watch('accountDateRange', function(newVal, oldVal) {
			if(newVal && newVal != oldVal){
				$scope.accountDateRange.startDate = moment(newVal.startDate).format("YYYY-MM-DD");
				$scope.accountDateRange.endDate = moment(newVal.endDate).format("YYYY-MM-DD");
				$scope.getModuleApi('daterange');
			}
		}, true);
	});
}]);
angular.module('statisticsApp').controller('FansStatisticeCtrl', ['$scope', '$http', 'serviceCommon', 'config', function($scope, $http, serviceCommon, config) {
	require(['echarts'], function(echarts) {
		var fansChart = echarts.init(document.getElementById('chart-line'));
		option = {
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'line'
				}
			},
			grid: {
				left: '3%',
				right: '3%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: {
				data: [],
			},
			yAxis: {
				splitArea: {
					show: true
				}
			},
			series: [{
				name: '数量',
				type: 'line',
				smooth: true,
				data: []
			}]
		};
		fansChart.showLoading();

		$scope.dateRange = { startDate: moment().format('YYYY-MM-DD'), endDate: moment().format('YYYY-MM-DD')};
		$scope.changeDivideType = function (type) {
			$scope.fansDivideType = type;
			$scope.getFansApi('week');
		};
		$scope.getFansApi = function(timeType) {
			$scope.timeType = timeType;
			$http.post(config.links.fansApi, {'divide_type': $scope.fansDivideType, 'time_type' : timeType, 'daterange': $scope.dateRange})
				.success(function(data) {
					console.log(data);
					fansChart.hideLoading();
					option.xAxis.data = data.message.message.data_x;
					option.series[0].data = data.message.message.data_y;
					fansChart.setOption(option);
				})
		};
		$scope.fansDivideType = 'bynew';
		$scope.fansTimeType = 'week';
		$scope.getFansApi($scope.fansTimeType);
		$scope.$watch('dateRange', function(newVal, oldVal) {
			if(newVal && newVal != oldVal){

				$scope.dateRange.startDate = moment(newVal.startDate).format("YYYY-MM-DD");
				$scope.dateRange.endDate = moment(newVal.endDate).format("YYYY-MM-DD");
				$scope.getFansApi('daterange');
			}
		}, true);
	});
}]);