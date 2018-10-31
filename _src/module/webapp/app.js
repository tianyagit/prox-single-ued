angular.module('webApp', ['we7app']);
angular.module('webApp').controller('webappModuleLinkUniacidCtrl', ['$scope', '$http', 'config', function ($scope, $http, config) {
	$scope.modules = config.modules;
	$scope.module = '';
	$scope.linkWxappAccounts = '';
	$scope.linkAppAccounts = '';
	$scope.selectedAccount = '';

	$scope.tabChange = function(index) {
		$scope.jurindex = index;
		if (index == 1 && !$scope.linkAppAccounts) {
			$scope.searchLinkAccount($scope.module, 'app');
		}
		if ($scope.jurindex == 1) {
			$('#account-wxapp .row').find('.item').removeClass('active');
		}
		if ($scope.jurindex == 0) {
			$('#account-app .row').find('.item').removeClass('active');
		}
		$scope.selectedAccount = '';
	}
	$scope.searchLinkAccount = function (modulename, type) {
		$scope.module = modulename;
		$('#show-account').modal('show');
		if (type == 'wxapp') {
			$scope.tabChange(0);
			$scope.loadingWxappData = true;
		} else {
			$scope.loadingAppData = true;
		}
		$http.post(config.links.search_link_account, { 'module_name': modulename, 'type': type == 'wxapp' ? config.wxapp : config.app})
			.success(function (data) {
				console.log(data);
				if (type == 'wxapp') {
					$scope.loadingWxappData = false;
					$scope.linkWxappAccounts = data.message.message;
					$scope.linkAppAccounts = '';
				} else {
					$scope.loadingAppData = false;
					$scope.linkAppAccounts = data.message.message;
				}
				console.log($scope.linkWxappAccounts);
			})
	};

	$scope.selectLinkAccount = function (account, ev) {
		$(ev.target).parentsUntil('.col-sm-2').addClass('active');
		$(ev.target).parentsUntil('.col-sm-2').parent().siblings().find('.item').removeClass('active');
		$scope.selectedAccount = account;
	};

	$scope.module_unlink_uniacid = function (module_name) {
		$http.post(config.links.module_unlink_uniacid, {'module_name': module_name})
			.success(function (data) {
				if (data.message.errno == 0) {
					util.message(data.message.message, data.redirect);
				} else {
					util.message(data.message.message, data.redirect);
				}
			})
	};

	$scope.moduleLinkUniacid = function () {
		$('#show-account').modal('hide');
		$http.post(config.links.module_link_uniacid, {'module_name': $scope.module,'submit': 'yes','token': config.token,'uniacid': $scope.selectedAccount.uniacid})
			.success(function (data) {
				if (data.message.errno == 0) {
					util.message('关联成功', 'refresh', 'success');
				} else {
					util.message(data.message.message);
				}
			});
		$scope.module = '';
	}
}]);
angular.module('webApp').controller('bindDomainCtrl', ['$scope', '$http', 'config', function($scope, $http, config) {
	$scope.account = config.account;
	$scope.moduleList = config.modulelist;
	$scope.middleAccount = {'bind_domain': ''};
	
	$scope.httpChange = function() {
		$http.post(config.links.postDomain, {'bind_domain': $scope.middleAccount.bind_domain, 'submit': true, 'token': config.token})
			.success(function(data) {
				if(data.message.errno == 0){
					util.message('修改成功！', data.redirect, 'success');
				}else {
					util.message(data.message.message);
				}
			});
	};
	$scope.changeModule = function() {
		$http.post(config.links.postModule, {'module_name': $scope.selectedModule, 'token': config.token})
			.success(function(data) {
				if (data.message.errno == 0) {
					util.message('修改成功！', data.redirect, 'success');
				} else {
					util.message(data.message.message);
				}
			})
		$('#add_module').modal('hide');
	};
	$scope.cancelModule = function() {
		$('#add_module').modal('hide');
	};
	$scope.selectModule = function(name) {
		angular.forEach($scope.moduleList, function(value, key) {
			if (name == key) {
				$scope.moduleList[key].selected = true;
			} else {
				$scope.moduleList[key].selected = false;
			}
		});
		$scope.selectedModule = name;
	}
}]);