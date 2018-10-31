angular.module('homeApp', ['we7app']);
//公众号欢迎页
angular.module('homeApp').controller('WelcomeCtrl', ['$scope', '$http', 'config', function($scope, $http, config){
	$scope.notices = config.notices;
	$scope.loaderror = 0;
	$scope.last_modules = null;
	$scope.fans_kpi = [];
	$http({
		method: 'POST',
		url: './index.php?c=home&a=welcome&do=get_fans_kpi',
	}).success(function(data){
		if(data.message.errno == 0) {
			$scope.fans_kpi = data.message.message;
		}
	});
	$scope.get_last_modules = function(){
		$http.post('./index.php?c=home&a=welcome&do=get_last_modules')
			.success(function(data){
				if (data.message.errno == 0) {
					var wxapp_last_modules = [];
					angular.forEach(data.message.message, function(val, key) {
						if (!val.wxapp) {
							wxapp_last_modules.push(val);
						}
					});
					$scope.last_modules = wxapp_last_modules;
				} else {
					$scope.last_modules = null;
					$scope.loaderror = 1;
				}
		});
	};
	$scope.get_last_modules();
}]);


angular.module('homeApp').controller('systemWelcomeCtrl', ['$scope', '$http', 'config', function($scope, $http, config){
	$scope.account_num = config.account_num;
	$scope.last_accounts_modules = config.last_accounts_modules;
	$scope.message_list = config.message_list;
	$scope.links = config.links;
	$scope.user_info = config.user_info;

	$scope.setTop = function(id) {
		$http.post($scope.links.setTop, {'id' : id}).success(function(data){
			if (data.message.errno == 0) {
				location.reload();
			}
		});
	}
}]);