angular.module('xzApp', ['we7app', 'infinite-scroll']);

//熊掌号管理
//添加熊掌号-step1
angular.module('xzApp').controller('XzappPostStepOne', ['$scope', 'config', function($scope, config){

}]);

//添加熊掌号-step2
angular.module('xzApp').controller('XzappPostStepTwo', ['$scope', function($scope){
	$scope.account = {};
	$scope.uploadMultiImage = function(type) {
		require(['fileUploader'], function(uploader){
			uploader.init(function(imgs){
				$scope.account[type] = imgs.url;
				$scope.$apply($scope.account);
			}, {'direct' : true, 'multiple' : false});
		});
	};
	$scope.delMultiImage = function(type) {
		$scope.account[type] = '';
	}
}]);

//添加熊掌号-step3
angular.module('xzApp').controller('XzappPostStepThree', ['$scope', 'config', 'XzAppCommon', function($scope, config, XzAppCommon){
	$scope.notify = config.notify;
	$scope.owner = config.owner;
	$scope.links = config.links;
	$scope.selectOwner = function(ev) {
		ev.preventDefault();
		XzAppCommon.selectOwner();
	};
	$scope.changeGroup = function(){
		var user = $('input[name="uid"]').val();
		if (!user) {
			$('#groupid').val(0);
			util.message('请先选择管理员');
			return false;
		}
		XzAppCommon.update_package_list($('#groupid').find('option:selected').data('package'));
	};
	$scope.addPermission = XzAppCommon.addPermission;

}]);

//添加熊掌号-step4
angular.module('xzApp').controller('XzappPostStepFour', ['$scope', 'config', function($scope, config){
	$scope.account = config.account;
	$scope.links = config.links;
	$scope.url = config.links.siteroot + "api.php?id=" + $scope.account.acid;
	$scope.success = function(id) {
		var id = parseInt(id);
		var obj = $('<span class="label label-success" style="position:absolute;z-index:10"><i class="fa fa-check-circle"></i> 复制成功</span>');
		AccountAppCommon.copySuccess(id, obj);
	};
}]);

//熊掌号管理-基础信息
angular.module('xzApp').controller('XzappManageBase', [
	'$scope',
	'$http',
	'config',
	'XzAppCommon',
	function($scope, $http, config, XzAppCommon) {
		$scope.account = config.account;
		$scope.uniaccount = config.uniaccount;
		$scope.authstate = config.authstate;
		$scope.authurl = config.authurl;
		$scope.founder = config.founder;
		$scope.owner = config.owner;
		$scope.xzapp_normal = config.xzapp_normal;
		$scope.xzapp_auth = config.xzapp_auth;
		$scope.other = {
			headimgsrc: config.headimgsrc,
			qrcodeimgsrc: config.qrcodeimgsrc,
			serviceUrl: config.links.siteroot + "api.php?id=" + $scope.account.acid,
			siteurl: config.links.siteroot,
		};
		$scope.changeImage = function(type, uniacid) {
			if(type == 'headimgsrc' || type == 'qrcodeimgsrc') {
				require(['fileUploader'], function(uploader){
					uploader.init(function(imgs){
						$scope.other[type] = imgs.url;
						$scope.$apply($scope.other);
						$scope.httpChange(type);
					}, {'direct' : true, 'multiple' : false, 'uniacid': uniacid});
				});
			}
		};
		$scope.success = function(id) {
			var id = parseInt(id);
			var obj = $('<a href="javascript:;" class="btn btn-success btn-sm we7-margin-left-sm"><i class="fa fa-check-circle"></i> 复制成功</a>');
			XzAppCommon.copySuccess(id, obj);
		};
		$scope.editInfo = function(type, val) {
			$scope.middleAccount = {};
			$scope.middleAccount[type] = val;
		};
		$scope.httpChange = function(type, newval) {
			switch(type) {
				case 'headimgsrc':
				case 'qrcodeimgsrc':
					$http.post(config.links.basePost, {type: type, imgsrc: $scope.other[type]})
						.success(function(data){
							if(data.message.errno == 0) {
								$('.wechat-img').attr('src', $scope.other[type])
								util.message('修改成功！', '', 'success');
							}else{
								if(data.message.errno == -1) util.message(data.message.message, data.redirect, 'error');
								if(data.message.errno == 1) util.message(data.message.message, '', 'error');
								if(data.message.errno == 40035) util.message(data.message.message, '', 'error');
							}
						});
					break;
				case 'name':
				case 'account':
				case 'original':
				case 'level':
				case 'key':
				case 'secret':
				case 'attachment_limit':
					$('#'+ type).modal('hide');
					if($scope.middleAccount[type].length == 0 && type != 'attachment_limit') {
						util.message('不可为空！', '', 'error');
						return false;
					}
					$http.post(config.links.basePost, {type: type, request_data: $scope.middleAccount[type]})
						.success(function(data){
							if(data.message.errno == 0) {
								$scope.account[type] = $scope.middleAccount[type];
								util.message('修改成功！', '', 'success');
							}else {
								if(data.message.errno == 1) util.message(data.message.message, '', 'error');
								if(data.message.errno == 40035) util.message(data.message.message, '', 'error');
							}
						})
					break;
				case 'jointype':
					$('#jointype').modal('hide');
					if ($scope.middleAccount.type == $scope.xzapp_normal) {
						$http.post(config.links.basePost, {type: 'jointype', request_data: $scope.xzapp_normal})
							.success(function(data){
								if(data.message.errno == 0) {
									$scope.account[type] = $scope.middleAccount[type];
									$scope.account.type = 1;
									util.message('修改成功！', '', 'success');
								}else {
									if(data.message.errno == 1) util.message(data.message.message, '', 'error');
									if(data.message.errno == 40035) util.message(data.message.message, '', 'error');
								}
							})
					}
					if ($scope.middleAccount.type == $scope.xzapp_auth) {
						util.message('暂不支持授权接入！');
						return false;
						if (config.authurl.errno == 1) {
							util.message(config.authurl.url);
						} else {
							if (confirm('必须通过熊掌号授权登录页面进行授权接入，是否跳转至授权页面...')) {
								location.href = config.authurl.url;
							} else {
								return false;
							}
						}
					}
					break;
				case 'token':
					$('#token').modal('hide');
					if ( typeof newval == 'undefined') {
						if (!confirm('确定要生成新的吗？')) {
							return false;
						}
						var token = XzAppCommon.tokenGen();
					} else {
						var token = $('#newtoken').val();
						if (token.length == 0) {
							util.message('不可为空！');
							return false;
						}
						var reg = new RegExp(/^[A-Za-z0-9]{3,32}$/);
						if (!reg.test(token)) {
							util.message('必须为英文或者数字，长度为3到32个字符！');
							return false;
						}
					}
					$http.post(config.links.basePost, {type: type, request_data: token})
						.success(function(data){
							if(data.message.errno == 0) {
								$scope.account[type] = token;
								util.message('修改成功！');
							}else {
								if(data.message.errno == -1) util.message(data.message.message, data.redirect, 'error');
								if(data.message.errno == 1) util.message(data.message.message, '', 'error');
								if(data.message.errno == 40035) util.message(data.message.message, '', 'error');
							}
						});
					break;
				case 'encodingaeskey':
					$('#encodingaeskey').modal('hide');
					if ( typeof newval == 'undefined') {
						if (!confirm('确定要生成新的吗？')) {
							return false;
						}
						var encoding = XzAppCommon.encodingAESKeyGen();
					} else {
						var encoding = $('#newencodingaeskey').val();
						if (encoding.length == 0) {
							util.message('不可为空！');
							return false;
						}
						var reg = new RegExp(/^[A-Za-z0-9]{43}$/);
						if (!reg.test(encoding)) {
							util.message('必须为英文或者数字，长度为43个字符！');
							return false;
						}
					}
					$http.post(config.links.basePost, {type: type, request_data: encoding})
						.success(function(data){
							if(data.message.errno == 0) {
								$scope.account[type] = encoding;
								util.message('修改成功！');
							} else {
								if(data.message.errno == -1) util.message(data.message.message, data.redirect, 'error');
								if(data.message.errno == 1) util.message(data.message.message, '', 'error');
								if(data.message.errno == 40035) util.message(data.message.message, '', 'error');
							}
						});
					break;
				case 'highest_visit':
					if (typeof $scope.middleAccount.highest_visit == 'number') {
						$http.post(config.links.basePost, {type: type, request_data: $scope.middleAccount.highest_visit})
							.success(function(data) {
								if (data.message.errno == 0) {
									$scope.account[type] = $scope.middleAccount.highest_visit;
									util.message('修改成功！');
								} else {
									util.message(data.message.message, '', 'error');
								}
							});
					}
					break;
				case 'endtime':
					var endtime = $('[name="endtime"]').val();
					$http.post(config.links.basePost, {type : 'endtime', endtype : $scope.middleAccount.endtype, endtime : endtime}).success(function(data) {
						if (data.message.errno == 1) {
							util.message(data.message.message, '', 'info');
						} else {
							$scope.account.endtype = $scope.middleAccount.endtype;
							$scope.account.end = $scope.account.endtype == 2 ? endtime : '永久';
							util.message('修改成功！');
						}
					});
					break;
			}
		};
	}]);