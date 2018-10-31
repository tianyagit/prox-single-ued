angular.module('messageApp', ['we7app']);
angular.module('messageApp').controller('messageNoticeCtrl', ['$scope', '$http', 'config', function($scope, $http, config){
	$scope.type = config.type;
	$scope.lists = config.lists;
	$scope.is_read = config.is_read;
	$scope.all_read_url = config.all_read_url;

	$scope.allRead = function() {
		$http.post($scope.all_read_url, {'type' : $scope.type}).success(function(data) {
			util.message(data.message.message,data.redirect,'ajax');
		});
	}
	$scope.changeStatus = function(property, type) {
		console.log(property);
		console.log(type);
		var classes = $('#key-' + type).attr('class');
		$http.post('./index.php?c=message&a=notice&do=setting', {'property' : property, 'type' : type}).success(function(data) {
			if (data.message.errno == 0) {
				if (classes.match('switchOn')) {
					$('#key-'+type).removeClass('switchOn');
				} else {
					$('#key-'+type).addClass('switchOn');
				}
				util.message('修改成功！');
			} else {
				util.message('网络错误，请稍候重试');
			}
		}).error(function(data) {
			util.message('网络错误，请稍候重试');
		});				
	}
	$scope.getOfficialMsg = function (id, url) {
		$http.get(config.mark_read_url + "&id=" +id);
		window.open(url); 
    }
}]);