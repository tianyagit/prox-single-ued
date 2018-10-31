angular.module('accountApp', ['we7app', 'infinite-scroll']);
//公众号列表
angular.module('accountApp').controller('SystemAccountDisplay', ['$scope', 'config', function($scope, config){
	$scope.lists = config.lists;
	$scope.links = config.links;
}]);
//公众号回收站
angular.module('accountApp').controller('SystemAccountRecycle', ['$scope', '$http','config', function($scope, $http, config) {
	$scope.del_accounts = config.del_accounts;
	$scope.links = config.links;
	$scope.delete = function(acid, uniacid) {
		if (!confirm('此为永久删除，删除后不可找回, 进入后台任务删除！确认吗？')) {
			return false;
		}
		$http.post(config.links.postDel, {acid: acid, uniacid: uniacid})
				.success(function(data){
					if (data.message.errno == 0) {
						util.message(data.message.message, data.redirect, 'success');
					} else {
						util.message(data.message.message, data.redirect, 'error');
					}
				});
	}
}]);
//公众号管理
//添加公众号-step1
angular.module('accountApp').controller('AccountPostStepOne', ['$scope', 'config', function($scope, config){
}]);
//添加公众号-step2
angular.module('accountApp').controller('AccountPostStepTwo', ['$scope', 'config', function($scope, config){
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
	};
}]);
//添加公众号-step3
angular.module('accountApp').controller('AccountPostStepThree', [
	'$scope',
	'$http',
	'config',
	'AccountAppCommon',
	function($scope, $http, config, AccountAppCommon){
		$scope.notify = config.notify;
		$scope.owner = config.owner;
		$scope.links = config.links;
		$scope.selectOwner = function(ev) {
			ev.preventDefault();
			AccountAppCommon.selectOwner();
		};
		$scope.changeGroup = function(){
			var user = $('input[name="uid"]').val();
			if (!user) {
				$('#groupid').val(0);
				util.message('请先选择管理员');
				return false;
			}
			AccountAppCommon.update_package_list($('#groupid').find('option:selected').data('package'));
		};
		$scope.changeText = function(ev) {
			var text = $(ev)[0].target.text;
			$(ev)[0].target.text = text == '展开' ? '收起' : '展开';
		};
		$scope.addPermission = AccountAppCommon.addPermission;
}]);
//添加公众号-step4
angular.module('accountApp').controller('AccountPostStepFour', [
	'$scope',
	'config',
	'AccountAppCommon',
	function($scope, config, AccountAppCommon){
		$scope.account = config.account;
		$scope.links = config.links;
		$scope.url = config.links.siteroot + "api.php?id=" + $scope.account.acid;
		$scope.success = function(id) {
			var id = parseInt(id);
			var obj = $('<span class="label label-success" style="position:absolute;z-index:10"><i class="fa fa-check-circle"></i> 复制成功</span>');
			AccountAppCommon.copySuccess(id, obj);
		};
}]);
//公众号管理-基础信息
angular.module('accountApp').controller('AccountManageBase', [
	'$scope',
	'$http',
	'config',
	'AccountAppCommon',
	function($scope, $http, config, AccountAppCommon) {
		$scope.account = config.account;
		$scope.uniaccount = config.uniaccount;
		$scope.authstate = config.authstate;
		$scope.authurl = config.authurl;
		$scope.founder = config.founder;
		$scope.owner = config.owner;
		$scope.other = {
			headimgsrc: config.headimgsrc + '?nocache=' + Math.random(),
			qrcodeimgsrc: config.qrcodeimgsrc + '?nocache=' + Math.random(),
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
			AccountAppCommon.copySuccess(id, obj);
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
					if ($scope.middleAccount.type == 1) {
						$http.post(config.links.basePost, {type: 'jointype', request_data: 1})
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
					if ($scope.middleAccount.type == 3) {
						if (config.authurl.errno == 1) {
							util.message(config.authurl.url);
						} else {
							if (confirm('必须通过公众号授权登录页面进行授权接入，是否跳转至授权页面...')) {
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
						var token = AccountAppCommon.tokenGen();
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
						var encoding = AccountAppCommon.encodingAESKeyGen();
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
//公众号管理-应用模块/模板
angular.module('accountApp').controller('AccountMangeModulesTpl', ['$scope', '$http', 'config', function($scope, $http, config) {
	$scope.owner = config.owner;
	$scope.modules_tpl = config.modules_tpl;
	$scope.packagelist = config.packagelist;
	$scope.extend = config.extend;
	$scope.allmodule = false;
	$scope.jurindex = 0;
	$scope.changeText = function(ev) {
		var text = $(ev)[0].target.text;
		$(ev)[0].target.text = text == '展开' ? '收起' : '展开';
	};
	$scope.changeGroup = function() {
		var a = $('input[name="package[]"]');
		var groupData = [];
		for(var i = 0;i < a.length; i++){
			if($(a[i]).is(':checked')) {
				groupData.push($(a[i]).val());
			}
		}
		$http.post(config.links.postModulesTpl, {type: 'group', groupdata: groupData})
			.success(function(data){
				if(data.message.errno == 0) {
					location.reload();
				}else {
					if(data.message.errno == 40035) util.message('参数错误！');
				}
			});
	};

	function onTabChange() {
		var divid = '#content-templates';
		if ($scope.jurindex == 0) { 
			divid = '#content-modules';
		}
		if ($('#jurisdiction-add '+divid+' .item').size() == $('#jurisdiction-add '+divid+' .item.active').size()) {
			$scope.allmodule = true;
			return;
		}  
		$scope.allmodule = false;
	}
	$scope.tabChange = function(index) {
		$scope.jurindex = index;
		onTabChange();
	}
	$scope.itemclick = function() {
		onTabChange();
	};

	$scope.allmodulechange = function(selected) {
		var divid = '#content-templates';
		if ($scope.jurindex == 0) { 
			divid = '#content-modules';
		}
		if (selected) {
			$('#jurisdiction-add '+divid+' .item').addClass('active');
		} else {
			$('#jurisdiction-add '+divid+' .item').removeClass('active');
		}
	};

	$scope.addExtend = function() {
		var moduleshtml = '',templatehtml = '';
		var modulesname = [],templateid = [];
		$('#jurisdiction-add #content-modules').find('.active').each(function(){
			moduleshtml += '<div class="col-sm-3 text-left we7-margin-bottom"><a href="javascript:;" class="label label-info">'+$(this).attr('data-title')+'</a></div>';
			modulesname.push($(this).attr('data-name'));
		});
		$('#jurisdiction-add #content-templates').find('.active').each(function(){
			templatehtml += '<div class="col-sm-3 text-left we7-margin-bottom"><a href="javascript:;" class="label label-info">'+$(this).attr('data-title')+'</a></div>';
			templateid.push($(this).attr('data-id'));
		});
		if (moduleshtml || templatehtml) {
			$('.account-package-extra').show();
		} else {
			$('.account-package-extra').hide();
		}
		$('.account-package-extra .js-extra-modules').append(moduleshtml);
		$('.account-package-extra .js-extra-templates').append(templatehtml);
		$('#jurisdiction-add').modal('hide');
		$http.post(config.links.postModulesTpl, {type: 'extend', module: modulesname, tpl: templateid})
			.success(function(data){
				if(data.message.errno == 0) {
					location.reload();
				}else {
					if(data.message.errno == 40035) util.message('参数错误！');	
				}
			});
	};

	$scope.editEndTime = function(expire_time, goods_id) {
		$scope.middleTime = expire_time;
		$scope.middleGoodsId = parseInt(goods_id);
		$('#endtime').modal('show');
		$('input[name="endtime"]').val(expire_time);
	};
	$scope.httpChange = function() {
		var newTime = $('input[name="endtime"]').val();
		$http.post(config.links.postModulesTpl, {'type': 'store_endtime', 'new_time': newTime, 'order_id': $scope.middleGoodsId})
			.success(function(data) {
				if (data.message.errno == 0) {
					util.message(data.message.message, data.redirect);
				}
			})
	}
}]);
//公众号管理-使用者管理
angular.module('accountApp').controller('AccountManageUsers', ['$scope', '$http', 'config', function($scope, $http, config) {
	$scope.vice_founder = config.vice_founder;
	$scope.owner = config.owner;
	$scope.manager = config.manager;
	$scope.operator = config.operator;
	$scope.state = config.state;
	$scope.setPermission = function(uid) {
		var uid = parseInt(uid);
		location.href = config.links.setPermission + '&uid=' + uid;
	};
	$scope.delPermission = function(uid) {
		var uid = parseInt(uid);
		if(!confirm('确认删除当前选择的用户?')){
			return false;
		}
		$http.post(config.links.delete, {uid: uid}).success(function(data){
			util.message(data.message, data.redirect);
		});
	};
	$scope.addOwner = function() {
		$('#owner-modal').modal('hide');
		var username = $.trim($('#add-owner-username').val());
		$scope.requestPost(3, username);
	};

	$scope.changeOwner = function(username) {
		$('#owner-modal').modal('show');
		$('#add-owner-username').val(username);
	};

	$scope.changeVice = function(username) {
		$('#user-modal').modal('show');
		$('#addtype-4').prop('checked', true);
		$('#add-username').val(username);
	};

	$scope.addUsername = function() {
		$('#user-modal').modal('hide');
		var username = $.trim($('#add-username').val());
		var addtype = $('.addtype');
		$.each(addtype, function(i, n) {
			if ($(addtype[i]).is(':checked')) {
				$scope.requestPost($(addtype[i]).val(), username);
			}
		})
	};

	$scope.requestPost = function(type, username) {
		if(!username) {
			util.message('请输入用户名.');
			return false;
		}
		var type = parseInt(type);
		$http.post(config.links.addUser, {'username': username, 'addtype': type, 'account_type': config.accountType, 'token': config.token})
			.success(function(data){
				if(data.message.errno == 0){
					location.reload();
				}else {
					if(data.message.errno == -1) util.message(data.message.message);
					if(data.message.errno == 1) util.message('添加失败，请稍候重试！');
					if(data.message.errno == 2) util.message(username + '已经是该公众号的操作员或管理员，请勿重复添加！');
					if(data.message.errno == 3) util.message('用户未通过审核，请联系网站管理员审核通过后再行添加！');
					if(data.message.errno == 4) util.message('管理员不可操作其他管理员！');
					if(data.message.errno == 5 || data.message.errno == 6) util.message(data.message.message);
				}
			});
	}
}]);
//公众号管理-短信信息
angular.module('accountApp').controller('AccountManageSms', ['$scope', '$http', 'config', function($scope, $http, config) {
	$scope.notify = config.notify;
	$scope.signatures = config.signatures;
	$scope.editSms = function(type, val) {
		$scope.middleSms = {};
		$scope.middleSms[type] = val;
	};
	$scope.httpChange = function(type) {
		switch(type) {
			case 'balance':
				$('#balance').modal('hide');
				$http.post(config.links.postSms, {type: type, balance: $scope.middleSms[type]})
					.success(function(data){
						if(data.message.errno == 0){
							$scope.notify.sms[type] = data.message.message.num;
							util.message('修改成功！');
						}else {
							if(data.message.errno == -1) util.message('您现有短信数量为0，请联系服务商购买短信!');
							if(data.message.errno == 1) util.message('修改失败！请稍候重试！');
						}
					});
				break;
			case 'signature':
				$('#signature').modal('hide');
				$http.post(config.links.postSms, {type: type, signature: $scope.middleSms[type]})
					.success(function(data){
						if(data.message.errno == 0){
							$scope.notify.sms[type] = $scope.middleSms[type];
							util.message('设置成功！');
						}else {
							if(data.message.errno == 40035) util.message('参数错误！');
							if(data.message.errno == 1) util.message('修改失败！请稍候重试！');
						}
					});
				break;
		}
	};
}]);
//微信开放平台设置
angular.module('accountApp').controller('SystemPlatform', [
 '$scope',
 '$http',
 'config',
 'AccountAppCommon',
 function($scope, $http, config, AccountAppCommon) {
	$scope.platform = config.platform;
	$scope.url = config.url;
	$scope.success = function(id) {
		var id = parseInt(id);
		var obj = $('<span class="label label-success" style="btn btn-success we7-margin-left-sm"><i class="fa fa-check-circle"></i> 复制成功</span>');
		AccountAppCommon.copySuccess(id, obj);
	};
	$scope.httpChange = function(type, newval) {
		switch(type) {
			case 'authstate':
				var authstate = $scope.platform.authstate == 1 ? 0 : 1;
				$http.post(config.links.platformPost, {authstate: authstate})
					.success(function(data){
						if(data.message.errno == 0) {
							$scope.platform.authstate = authstate;
							util.message('修改成功！', '', 'success');
						}else {
							if(data.message.errno == 1) util.message('修改失败，请稍后重试！');
						}
					});
				break;
			case 'appid':
				$('#AppID').modal('hide');
				var newappid = $('#newappid').val();
				$http.post(config.links.platformPost, {appid: newappid})
					.success(function(data){
						if(data.message.errno == 0) {
							$scope.platform.appid = newappid;
							util.message('修改成功！');
						}else {
							if(data.message.errno == 1) util.message('修改失败，请稍后重试！');
						}
					});
				break;
			case 'appsecret':
				$('#AppSecret').modal('hide');
				var newappsecret = $('#newappsecret').val();
				$http.post(config.links.platformPost, {appsecret: newappsecret})
					.success(function(data){
						if(data.message.errno == 0) {
							$scope.platform.appsecret = newappsecret;
							util.message('修改成功！');
						}else {
							if(data.message.errno == 1) util.message('修改失败，请稍后重试！');
						}
					});
				break;
			case 'token':
				if ( typeof newval == 'undefined') {
					if (!confirm('确定要生成新的吗？')) {
						return false;
					}
					var token = AccountAppCommon.tokenGen();
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
				$http.post(config.links.platformPost, {token: token})
					.success(function(data){
						if(data.message.errno == 0) {
							$scope.platform.token = token;
							util.message('修改成功！');
						}else {
							if(data.message.errno == 1) util.message('修改失败，请稍后重试！');
						}
					});
				break;
			case 'encodingaeskey':
				if ( typeof newval == 'undefined') {
					if (!confirm('确定要生成新的吗？')) {
						return false;
					}
					var encoding = AccountAppCommon.encodingAESKeyGen();
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
				$http.post(config.links.platformPost, {encodingaeskey: encoding})
					.success(function(data){
						if(data.message.errno == 0) {
							$scope.platform.encodingaeskey = encoding;
							util.message('修改成功！');
						}else {
							if(data.message.errno == 1) util.message('修改失败，请稍后重试！');
						}
					});
				break;
		}
	};
}]);
//小程序管理-可用小程序模块
angular.module('accountApp').controller('AccountManageWxappCtrl', ['$scope', '$http', 'config', function($scope, $http, config) {
	$scope.wxapp_modules = config.wxapp_modules;
	$scope.current_module_info = config.current_module_info;
	$scope.showWxModules = function() {
		$('#module_wxapp').modal('show');
	};

	$scope.selectedWxModule = function(module, e) {
		var current = $(e.target).parents('.select-module-wxapp');
		current.find('span').removeClass('hide');
		current.siblings().find('span').addClass('hide');
		$scope.newWxModule = module;
	};
	
	$scope.addWxModules = function() {
		$http.post(config.links.editmodule, {'module': $scope.newWxModule, 'account_type': 4}).
			success(function(data) {
				$('#module_wxapp').modal('hide');
				if(data.message.errno == 0) {
					location.reload();
				} else {
					util.message(data.message.message);
				}
			});
	};
	$scope.delWxModule = function() {
		$http.post(config.links.delmodule, {'module': $scope.current_module_info, 'account_type': 4}).
			success(function(data) {
				if (data.message.errno == 0) {
					location.reload();
				} else {
					util.message(data.message.message);
				}
			});
	}
}]);
//所有权限
angular.module('accountApp').controller('AccountDisplay', ['$scope', '$http', '$timeout', 'config', function($scope, $http, $timeout, config){
	$scope.list = config.list;
	$scope.type = config.type;
	$scope.title = config.title;
	$scope.links = config.links;
	$scope.types = config.types;
	$scope.alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','#','全部'];
	$scope.activeLetter = '';
	$scope.keyword = config.keyword;
	$scope.letter = config.letter;
	$scope.searchShow = config.total > 0 ? true : false;

	$scope.currentPage = 1;
	$scope.busy = false;
	$scope.loadMore = function() {
		if ($scope.busy) {
			return false;
		}
		$scope.currentPage++;
		$scope.busy = true;
		$http.post(config.scrollUrl, {page : $scope.currentPage, keyword : config.keyword, letter : config.letter}).success(function(data) {
			$scope.busy = false;
			if (data.message.errno == 0) {
				$scope.searchShow = true;
				if (data.message.message.length == 0 && $scope.currentPage == 2) {
					$scope.searchShow = false;
				}
				for (var i in data.message.message) {
					$scope.list.push(data.message.message[i]);
				}
			}
			$scope.busy = false;
		})
	};

	$scope.searchModule = function(letter) {
		$scope.activeLetter = letter;
		$timeout(function() {
			$('.button').click();
		}, 500);
	};

	$scope.stick = function(uniacid, type) {
		var uniacid = parseInt(uniacid);
		$http.post($scope.links.rank, {uniacid : uniacid, type : type}).success(function(data) {
			if (data.message.errno == 0) {
				location.reload();
			} else {
				util.message(data.message.message);
			}
		})
	};

	$scope.showVersions = function(ev) {
		var cutSelect = $(ev.target).parents('.mask').next('.cut-select');
		if (cutSelect.css('display') == 'none') {
			cutSelect.css('display', 'block');
			cutSelect.parent('.wxapp-list-item').siblings().find('.cut-select').css('display', 'none');
		} else {
			cutSelect.css('display', 'none');
		}
	};

	$scope.hideSelect = function(ev) {
		$(ev.target).css('display', 'none');
	};

}]);