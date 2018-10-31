angular.module('profileApp', ['we7app']);
angular.module('profileApp')
.controller('oauthCtrl', ['$scope', '$http', 'config', function($scope, $http, config) {
	$scope.config = config;
	$scope.oauthHost = config.oauthHost;
	$scope.oauthAccount = config.oauthAccount;
	$scope.oauthtitle = config.oauthAccounts[config.oauthAccount];
	$scope.jsOauthAccount = config.jsOauth;
	$scope.jsOauthtitle = config.jsOauthAccounts[config.jsOauth];
	$scope.originalHost = $scope.oauthHost;

	$scope.recover = function() {
		$scope.oauthHost = $scope.originalHost;
	};
	$scope.saveOauth = function(type) {
		param = {};
		if (type == 'oauth') {
			param = {
				'type' : 'oauth',
				'account' : $scope.oauthAccount,
				'host' : $scope.oauthHost
			}
		}
		if (type == 'jsoauth') {
			param = {
				'type' : 'jsoauth',
				'account' : $scope.jsOauthAccount
			}
		}
		$http.post($scope.config.oauth_url, param).success(function(data) {
			if (data.message.errno == 0) {
				location.reload();
			} else {
				util.message('域名不合法', '', 'error');
			}
		});
	};
}])
.controller('tplCtrl', ['$scope', '$http', 'config', function($scope, $http, config) {
	$scope.tplList = config.tplList;
	$scope.active = '';
	$scope.activetpl = '';
	$scope.changeActive = function(key) {
		$scope.active = key;
		$scope.activetpl = $scope.tplList[key]['tpl'];
	};
	$scope.saveTpl = function() {
		original_tpl = $scope.tplList[$scope.active]['tpl'];
		$scope.tplList[$scope.active]['tpl'] = $scope.activetpl;
		$http.post(config.url, {'tpl' : $scope.tplList}).success(function(data) {
			if (data.message.errno == 1) {
				$scope.tplList[$scope.active]['tpl'] = original_tpl;
				util.message('请填写正确的'+data.message.message+'模板id', '', 'info');
			} else {
				$('.modal').modal('hide');
			}
		});
	};
}])
.controller('emailCtrl', ['$scope', '$http', 'config', function($scope, $http, config) {
	$scope.config = config;
	$scope.setting = $scope.config.setting;
	$scope.type = $scope.setting['smtp'] == undefined ? '163' : $scope.setting.smtp.type;
	$scope.changeType = function(ev) {
		var targetHtml = $(ev)[0].target;
		$(targetHtml).attr('type', 'password');
	};
}])
.controller('paymentCtrl', ['$scope', '$http', 'config', function($scope, $http, config) {
		$scope.config = config;
		$scope.paysetting = config.paysetting;
		$scope.aliaccounthelp = false;
		$scope.alipartnerhelp = false;
		$scope.alisecrethelp = false;
		$scope.saveEdit = function (type) {
			if (type == 'wechat_facilitator') {
				if ($scope.paysetting.wechat_facilitator.pay_switch === true || $scope.paysetting.wechat_facilitator.recharge_switch === true) {
					if ($scope.paysetting.wechat_facilitator.mchid == '') {
						util.message('请填写服务商商户号', '', 'info');
						return false;
					}
					if ($scope.paysetting.wechat_facilitator.signkey == '') {
						util.message('请填写服务商商户支付密钥', '', 'info');
						return false;
					}
				}
			}
			if (type == 'alipay') {
				if ($scope.paysetting.alipay.pay_switch === true || $scope.paysetting.alipay.recharge_switch === true) {
					if ($scope.paysetting.alipay.partner == '') {
						util.message('请填写合作者身份', '', 'info');
						return false;
					}
					if ($scope.paysetting.alipay.account == '') {
						util.message('请填写收款支付宝账号', '', 'info');
						return false;
					}
					if ($scope.paysetting.alipay.secret == '') {
						util.message('请填写校验密钥', '', 'info');
						return false;
					}
				}
			}
			if (type == 'wechat') {
				if ($scope.paysetting.wechat.switch == 1) {
					if ($scope.paysetting.wechat.version == 1) {
						if ($scope.paysetting.wechat.partner == '') {
							util.message('请填写商户身份', '', 'info');
							return false;
						}
						if ($scope.paysetting.wechat.key == '') {
							util.message('请填写商户秘钥', '', 'info');
							return false;
						}
						if ($scope.paysetting.wechat.signkey == '') {
							util.message('请填写通信秘钥', '', 'info');
							return false;
						}
					} else {
						if ($scope.paysetting.wechat.mchid == '') {
							util.message('请填写商户号', '', 'info');
							return false;
						}
						if ($scope.paysetting.wechat.apikey == '') {
							util.message('请填写支付秘钥', '', 'info');
							return false;
						}
					}
				}
				if ($scope.paysetting.wechat.switch == 3) {
					if ($scope.paysetting.wechat.service == '') {
						util.message('请选择服务商公众号', '', 'info');
						return false;
					}
					if ($scope.paysetting.wechat.sub_mch_id == '') {
						util.message('请填写子商户号', '', 'info');
						return false;
					}
				}
			}
			if (type == 'unionpay') {
				if ($scope.paysetting.unionpay.pay_switch == true || $scope.paysetting.unionpay.recharge_switch == true) {
					if ($scope.paysetting.unionpay.merid == '') {
						util.message('请填写商户号', '', 'info');
						return false;
					}
					if ($scope.paysetting.unionpay.signcertpwd == '') {
						util.message('请填写商户私钥证书密码', '', 'info');
						return false;
					}
				}
			}
			if (type == 'baifubao') {
				if ($scope.paysetting.baifubao.pay_switch === true || $scope.paysetting.baifubao.recharge_switch === true) {
					if ($scope.paysetting.baifubao.mchid == '') {
						util.message('请填写商户号', '', 'info');
						return false;
					}
					if ($scope.paysetting.baifubao.signkey == '') {
						util.message('请填写商户支付密钥', '', 'info');
						return false;
					}
				}
			}
			if (type == 'line') {
				if (($scope.paysetting.line.pay_switch === true || $scope.paysetting.line.recharge_switch === true) && $scope.paysetting.line.message == '') {
					util.message('请填写账户信息', '', 'info');
					return false;
				}
			}
			if (type == 'jueqiymf') {
				if ($scope.paysetting.jueqiymf.pay_switch === true || $scope.paysetting.jueqiymf.recharge_switch === true) {
					if ($scope.paysetting.jueqiymf.url == '' || $scope.paysetting.jueqiymf.url == undefined) {
						util.message('请填写一码付后台地址', '', 'info');
						return false;
					}
					if ($scope.paysetting.jueqiymf.mchid == '' || $scope.paysetting.jueqiymf.mchid == undefined) {
						util.message('请填写商户号', '', 'info');
						return false;
					}
				}
			}
			$http.post($scope.config.saveurl, {'type' : type, 'param' : $scope.paysetting[type]})
				.success(function(data) {
					if (data.message.errno == 0) {
						util.message(data.message.message, data.redirect, 'success');
					}
				});
		};

		$scope.switchStatus = function(paytype, switchtype) {
			if (!paytype || !switchtype) {
				util.message('参数错误', '', 'error');
			}
			$scope.paysetting[paytype][switchtype] = !$scope.paysetting[paytype][switchtype];
			if (paytype == 'delivery' || paytype == 'credit' || paytype == 'mix' || paytype == 'line') {
				$scope.paysetting[paytype]['recharge_switch'] = false;
			}
			$http.post(config.change_status, {'type': paytype, 'param': $scope.paysetting[paytype]})
				.success(function(data) {
					if (data.message.errno == 0) {
						util.message(data.message.message, data.redirect, 'success');
					} else {
						util.message(data.message.message);
					}
				});
		};
		$scope.check_wechat = function () {
			if (config.account_level < 3 || (config.services != undefined && config.borrows.length < 1 && config.services.length < 1 && config.account_level != 4)  || (config.services == undefined && config.borrows.length < 1 && config.account_level != 4)) {
				util.message('您没有有效的微信支付方式', '', 'error');
				return false;
			}
			$('#weixin').modal('show');
		};

		$('.modal').on('hide.bs.modal', function() {
			$http.post($scope.config.get_setting_url, {}).success(function(data) {
				$scope.paysetting = data.message.message;
			});
		});

		$scope.test_alipay = function() {
			$http.post($scope.config.text_alipay_url, {'param' : $scope.paysetting.alipay}).success(function(data) {
				if (data.message.message !== null) {
					location.href = data.message.message;
					return false;
				} else {
					util.message('配置失败！');
				}
			});
		};

		$scope.changeSwitch = function(type, status) {
			$scope.paysetting[type].switch = status;
		};

		$scope.changeVersion = function(status) {
			$scope.paysetting.wechat.version = status;
		};

		$scope.tokenGen = function(name) {
			if (confirm('确定要修改密钥吗？')) {
				var letters = 'abcdefghijklmnopqrstuvwxyz0123456789';
				var token = '';
				for(var i = 0; i < 32; i++) {
					var j = parseInt(Math.random() * (31 + 1));
					token += letters[j];
				}
				if (name == 'wechat_facilitator.signkey') {
					$scope.paysetting.wechat_facilitator.signkey = token;
				}
				if (name == 'wechat.apikey') {
					$scope.paysetting.wechat.apikey = token;
				}
			}
		};
	}])
.controller('creditCtrl', ['$scope', '$http', 'config', function($scope, $http, config) {
	$scope.config = config;
	$scope.creditSetting = config.creditSetting;
	$scope.tactics = {'activity' : config.activity, 'currency' : config.currency};
	$scope.creditTitle = '';
	$scope.activeCredit = '';
	$scope.activeTacticsType = '';
	$scope.enabledCredit = config.enabledCredit;
	$scope.activeTactics = '';
	$scope.syncSetting = config.syncSetting;

	$scope.changeEnabled = function (credit) {
		$scope.creditSetting = $scope.creditSetting == null ? {} : $scope.creditSetting;
		if ($scope.creditSetting[credit] == undefined) {
			$scope.creditSetting[credit] = {title : '', 'enabled' : 0};
		}
		$scope.creditSetting[credit].enabled = $scope.creditSetting[credit].enabled == 1? 0 : 1;
		$http.post($scope.config.saveCreditSetting, {'credit_setting' : $scope.creditSetting})
			.success(function(data) {
				if (data.message.errno == 0) {
					util.message(data.message.message, data.redirect, 'success');
				} else {
					util.message(data.message.message);
				}
			});
	};

	$scope.editCreditTactics = function (type) {
		$('#tactics').modal('show');
		$scope.activeTacticsType = type;
		$scope.activeTactics = $scope.tactics[type];
	};

	$scope.editCreditName = function (credit) {
		$scope.activeCredit = credit;
		$('#credit-name').modal('show');
		if ($scope.creditSetting[credit] == undefined) {
			$scope.creditSetting[credit] = {title : '', 'enabled' : 0};
		}
		$scope.creditTitle = $scope.creditSetting[credit].title;
	};

	$scope.setCreditName = function() {
		$scope.creditSetting[$scope.activeCredit].title = $scope.creditTitle;
		$http.post($scope.config.saveCreditSetting, {'credit_setting' : $scope.creditSetting})
			.success(function(data) {
				if (data.message.errno == 0) {
					util.message(data.message.message, data.redirect, 'success');
				} else {
					util.message(data.message.message);
				}
			});
	}

	$scope.setCreditTactics = function() {
		$http.post($scope.config.saveTacticsSetting, {'setting' : $scope.tactics})
			.success(function(data) {
				if (data.message.errno == 0) {
					util.message(data.message.message, data.redirect, 'success');
				} else {
					util.message(data.message.message);
				}
			});
	}
}])
.controller('syncCtrl', ['$scope', '$http', 'config', function($scope, $http, config) {
		$scope.config = config;
		$scope.syncSetting = config.syncSetting;
		$scope.setSync = function() {
			$scope.syncSetting = $scope.syncSetting == 1 ? 0 : 1;
			$http.post($scope.config.saveSyncSetting, {'setting' : $scope.syncSetting}).success(function(data) {
			});
		}
	}])
.controller('ucCtrl', ['$scope', '$http', 'config', function($scope, $http, config) {
		$scope.config = config;
		$scope.uc = config.uc;

		$("#submit").click(function(){
			var textarea = $("#textarea").val();
			var arr = textarea.split(';');
			var data = new Array();
			for(var i in arr) {
				var index0 = arr[i].indexOf("UC");
				var index1 = arr[i].indexOf("', '");
				var index2 = arr[i].indexOf("')");
				var key = arr[i].substring(index0,index1);
				var value = arr[i].substring(index1+4,index2);
				data[key] = value;
			}
			$scope.uc.connect = data['UC_CONNECT'];
			$scope.uc.appid = data['UC_APPID'];
			$scope.uc.key = data['UC_KEY'];
			$scope.uc.charset = data['UC_CHARSET'];
			$scope.uc.dbhost = data['UC_DBHOST'];
			$scope.uc.dbuser = data['UC_DBUSER'];
			$scope.uc.dbname = data['UC_DBNAME'];
			$scope.uc.dbpw = data['UC_DBPW'];
			$scope.uc.dbcharset = data['UC_DBCHARSET'];
			$scope.uc.dbtablepre = data['UC_DBTABLEPRE'];
			$scope.uc.dbconnect = data['UC_DBCONNECT'];
			$scope.uc.api = data['UC_API'];
			$scope.uc.ip = data['UC_IP'];

			$scope.$digest();
		});
		$("#form1").submit(function(){
			if($(':radio[name="status"]:checked').val()=='1'){
				if($.trim($(':text[name="title"]').val()) == '') {
					util.message('必须输入通行证名称.', '', 'error');
					return false;
				}
				var appid = parseInt($(':text[name="appid"]').val());
				if(isNaN(appid)) {
					util.message('必须输入UCenter应用的ID.', '', 'error');
					return false;
				}
				if($.trim($(':text[name="key"]').val()) == '') {
					util.message('必须输入与UCenter的通信密钥.', '', 'error');
					return false;
				}
				if($.trim($(':text[name="charset"]').val()) == '') {
					util.message('必须输入UCenter的字符集.', '', 'error');
					return false;
				}
				if($(':radio[name="connect"]:checked').val() == 'mysql') {
					if($.trim($(':text[name="dbhost"]').val()) == '') {
						util.message('必须输入UCenter数据库主机地址.', '', 'error');
						return false;
					}
					if($.trim($(':text[name="dbuser"]').val()) == '') {
						util.message('必须输入UCenter数据库用户名.', '', 'error');
						return false;
					}
					if($.trim($(':text[name="dbpw"]').val()) == '') {
						util.message('必须输入UCenter数据库密码.', '', 'error');
						return false;
					}
					if($.trim($(':text[name="dbname"]').val()) == '') {
						util.message('必须输入UCenter数据库名称.', '', 'error');
						return false;
					}
					if($.trim($(':text[name="dbcharset"]').val()) == '') {
						util.message('必须输入UCenter数据库字符集.', '', 'error');
						return false;
					}
					if($.trim($(':text[name="dbtablepre"]').val()) == '') {
						util.message('必须输入UCenter数据表前缀.', '', 'error');
						return false;
					}
				} else if($(':radio[name="connect"]:checked').val() == 'http'){
					if($.trim($(':text[name="api"]').val()) == '') {
						util.message('必须输入UCenter 服务端的URL地址.', '', 'error');
						return false;
					}
					if($.trim($(':text[name="ip"]').val()) == '') {
						util.message('必须输入UCenter的IP.', '', 'error');
						return false;
					}
				}
			}
		});
	}])
.controller('refundCtrl', ['$scope', '$http', 'config', function($scope, $http, config) {
		$scope.setting = config.setting;
		$scope.wechat_refund = $scope.setting.wechat_refund;
		$scope.ali_refund = $scope.setting.ali_refund;

		$scope.change_switch = function (type, val) {
			if (type == 'wechat_refund') {
				$scope.wechat_refund.switch = val;
			}
			if (type == 'ali_refund') {
				$scope.ali_refund.switch = val;
			}
		};
		$('#key').change(function() {
			$scope.wechat_refund.key = $('#key').val();
			$scope.$apply();
		});
		$('#cert').change(function() {
			$scope.wechat_refund.cert = $('#cert').val();
			$scope.$apply();
		});
		$('#form_wechat').submit(function() {
			if ($scope.wechat_refund.switch == 1) {
				if ($scope.wechat_refund.cert == '') {
					util.message('请上传apiclient_cert.pem证书');
					return false;
				}
				if ($scope.wechat_refund.key == '') {
					util.message('请上传apiclient_key.pem证书');
					return false;
				}
			}
		});
		$('#private_key').change(function() {
			$scope.ali_refund.private_key = $('#private_key').val();
			$scope.$apply();
		});
		$('#form_ali').submit(function() {
			if ($scope.ali_refund.switch == 1) {
				if ($scope.ali_refund.app_id == '') {
					util.message('请填写app_id');
					return false;
				}
				if ($scope.ali_refund.private_key == '') {
					util.message('请上传rsa_private_key.pem证书');
					return false;
				}
			}
		});
}])
.controller('bindDomainCtrl', ['$scope', '$http', 'config', function($scope, $http, config) {
	$scope.account = config.account;
	$scope.middleAccount = {'bind_domain': ''};
	
	$scope.httpChange = function() {
		$http.post(config.links.post, {'bind_domain': $scope.middleAccount.bind_domain, 'submit': true, 'token': config.token})
			.success(function(data){
				if(data.message.errno == 0){
					util.message('修改成功！', data.redirect, 'success');
				}else {
					util.message(data.message.message);
				}
			});		
	}
}])
.controller('appModuleLinkUniacidCtrl', ['$scope', '$http', 'config', function ($scope, $http, config) {
	$scope.modules = config.modules;
	$scope.module = '';
	$scope.linkWxappAccounts = '';
	$scope.linkPcAccounts = '';
	$scope.selectedAccount = '';

	$scope.tabChange = function(index) {
		$scope.jurindex = index;
		if (index == 1 && !$scope.linkPcAccounts) {
			$scope.searchLinkAccount($scope.module, 'pc');
		}
		if ($scope.jurindex == 1) {
			$('#account-wxapp .row').find('.item').removeClass('active');
		}
		if ($scope.jurindex == 0) {
			$('#account-pc .row').find('.item').removeClass('active');
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
			$scope.loadingPcData = true;
		}
		$http.post(config.links.search_link_account, { 'module_name': modulename, 'type': type == 'wxapp' ? config.wxapp : config.webapp})
			.success(function (data) {
				if (type == 'wxapp') {
					$scope.loadingWxappData = false;
					$scope.linkWxappAccounts = data.message.message;
					$scope.linkPcAccounts = '';
				} else {
					$scope.loadingPcData = false;
					$scope.linkPcAccounts = data.message.message;
				}
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