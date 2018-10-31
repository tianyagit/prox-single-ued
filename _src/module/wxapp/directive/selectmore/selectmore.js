angular.module('wxApp').directive('we7ChooseMore', ['$http', function($http){
	return {
		restrict: 'EA',
		templateUrl: 'directive-selectmore-module-item.html',
		scope: {
			'selectModules': '=we7Modules',
			'selectSingle' : '=we7ChooseSingle'
		},
		link: function($scope) {
			$scope.selectMore = function() {
				if(!$scope.wxappModuleList || $scope.wxappModuleList.length == 0) {
					$http({method: 'POST', url: './index.php?c=wxapp&a=post&do=get_wxapp_modules', cache: true})
					.success(function(data, status) {
						$scope.wxappModuleList = data.message.message;
						$('#modules-Modal').modal('show');
					});
				} else {
					$('#modules-Modal').modal('show');
				}
			};
			
			$scope.selectModule = function(module){
				if ($scope.selectSingle) {
					$scope.selectModules = [];
					$scope.selectModules.push({
						title: module.title,
						module: module.name,
						icon: module.logo,
						version: module.version,
						bindings : module.bindings
					});
					$('#modules-Modal').modal('hide');
					$('.app-list .select-more').css('display', 'none');
					return false;
				} else {
					$scope.selectModules.push({
						title: module.title,
						module: module.name,
						icon: module.logo,
						version: module.version,
						bindings : module.bindings
					});
					$('#modules-Modal').modal('hide');
				}
			};
			$scope.delModule = function(module) {
				var index = _.indexOf($scope.selectModules, module);
				if (index > -1) {
					$scope.selectModules = _.without($scope.selectModules, module);
				}
				if (_.isEmpty($scope.selectModules)) {
					$('.app-list .select-more').css('display', '');
				}
			};
		}
	}
}]);