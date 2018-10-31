angular.module('userProfile', ['we7app']);
angular.module('userProfile').controller('UserProfileDisplay', ['$scope', '$window', '$http', 'config', function($scope, $window, $http, config){

	$scope.user = config.user;
	$scope.profile = config.profile;
	$scope.extra_fields = config.extra_fields;
	$scope.account_num = config.account_num;
	if($scope.profile == null) {
		$scope.profile = {avatar: '',realname: '',births: '',address: '',resides: ''};
	}
	$scope.links = config.links;
	$scope.group_info = config.group_info;
	$scope.groups = config.groups;
	$scope.changeGroup = $scope.user.groupid;
	$scope.wechats = config.wechats;
	$scope.wxapps = config.wxapps;
	$scope.changeAvatar = function() {
		require(['fileUploader'], function(uploader){
			uploader.init(function(imgs){
				$scope.profile.avatar = imgs.url;
				$scope.$apply($scope.profile);
				$scope.httpChange('avatar');
			}, {'direct' : true, 'multiple' : false, 'uniacid' : 0});
		});
	};
	$('.js-clip').each(function(){
		util.clip(this, $(this).attr('data-url'));
	});
	$scope.editInfo = function(type, val) {
		$scope.userOriginal = {};
		$scope.userOriginal[type] = val;
	};
	$scope.httpChange = function(type) {
		switch(type) {
			case 'avatar':
				$http.post($scope.links.userPost, {type: type, avatar: $scope.profile.avatar, uid: $scope.user.uid})
					.success(function(data){
						if(data.message.errno == 0) {
							util.message('修改成功！');
						}else{
							if(data.message.errno == -1) util.message(data.message.message);
							if(data.message.errno == 1) util.message(data.message.message);
							if(data.message.errno == 40035) util.message(data.message.message);
						}
					});
				break;
			case 'username':
				$('.modal').modal('hide');
				$http.post($scope.links.userPost, {type: type, username: $scope.userOriginal[type], uid: $scope.user.uid})
					.success(function(data){
						if(data.message.errno == 0) {
							$scope.user[type] = $scope.userOriginal[type];
							util.message('修改成功！');
						}else {
							if(data.message.errno == -1) util.message(data.message.message);
							if(data.message.errno == 1) util.message(data.message.message);
							if (data.message.errno == 2) util.message(data.message.message);
							if(data.message.errno == 40035) util.message(data.message.message);
						}
					})
				break;
			case 'vice_founder_name':
				$('.modal').modal('hide');
				$http.post($scope.links.userPost, {type: type, vice_founder_name: $scope.userOriginal[type], uid: $scope.user.uid})
					.success(function(data){
						if(data.message.errno == 0) {
							$scope.user[type] = $scope.userOriginal[type];
							util.message('修改成功！');
						}else {
							util.message(data.message.message);
							return false;
						}
					})
				break;
			case 'qq':
				$('.modal').modal('hide');
				$http.post($scope.links.userPost, {type: type, qq: $scope.userOriginal[type], uid: $scope.user.uid})
					.success(function(data){
						if(data.message.errno == 0) {
							$scope.profile[type] = $scope.userOriginal[type];
							util.message('修改成功！');
						}else {
							util.message(data.message.message);
							return false;
						}
					})
				break;
			case 'remark':
				$('.modal').modal('hide');
				$http.post($scope.links.userPost, {type: type, remark: $scope.userOriginal[type], uid: $scope.user.uid})
					.success(function(data){
						if(data.message.errno == 0) {
							$scope.user[type] = $scope.userOriginal[type];
							util.message('修改成功！');
						}else {
							util.message(data.message.message);
							return false;
						}
					})
				break;
			case 'welcome_link':
				$('.modal').modal('hide');
				$http.post($scope.links.userPost, {type: type, welcome_link: $scope.user.welcome_link, uid: $scope.user.uid})
					.success(function(data){
						if(data.message.errno == 0) {
							util.message('修改成功！');
						}else {
							util.message(data.message.message);
							return false;
						}
					})
				break;
			case 'mobile':
				$('.modal').modal('hide');
				$http.post($scope.links.userPost, {type: type, mobile: $scope.userOriginal[type], uid: $scope.user.uid})
					.success(function(data){
						if(data.message.errno == 0) {
							$scope.profile[type] = $scope.userOriginal[type];
							util.message('修改成功！');
						}else {
							util.message(data.message.message);
							return false;
						}
					})
				break;
			case 'password':
				$('.modal').modal('hide');
				if ($window.sysinfo.isfounder == 0 && $scope.user.register_type==0) {
					var oldpwd = $('.old-password').val();
					if(_.isEmpty(oldpwd)) {
						util.message('原密码不可为空！');
						return false;
					}
				}
				var newpwd = $('.new-password').val();
				var renewpwd = $('.renew-password').val();
				if(_.isEmpty(newpwd)) {
					util.message('新密码不可为空！');
					return false;
				}
				if(_.isEmpty(renewpwd)) {
					util.message('确认新密码不可为空！');
					return false;
				}
				if(newpwd != renewpwd){
					util.message('两次密码不一致！');
					return false;
				}
				$http.post($scope.links.userPost, {type: type, oldpwd: oldpwd, newpwd: newpwd, renewpwd: renewpwd, uid: $scope.user.uid})
					.success(function(data){
						if(data.message.errno == 0) {
							util.message('密码修改成功！');
						}else {
							if(data.message.errno == -1) util.message('抱歉，用户不存在或是已经被删除！');
							if(data.message.errno == 1) util.message('密码修改失败，请稍后重试！');
							if(data.message.errno == 2) util.message('两次密码不一致！');
							if(data.message.errno == 3) util.message('原密码不正确！');
							if(data.message.errno == 4) util.message(data.message.message);
							if(data.message.errno == 40035) util.message('不合法的参数！');
						}
					});
				break;
			case 'endtime':
				$('.modal').modal('hide');
				var endtype = $scope.user.endtype;
				var endtime = $(':text[name="endtime"]').val();
				$http.post($scope.links.userPost, {type: type, endtype: endtype, endtime: endtime, uid: $scope.user.uid})
					.success(function(data){
						if(data.message.errno == 0) {
							$scope.user.endtype = endtype;
							$scope.user.end = endtype == 1 ? '永久' : endtime;
							util.message('到期时间修改成功！');
						}else {
							if(data.message.errno == -1) util.message(data.message.message);
							if(data.message.errno == 1) util.message(data.message.message);
							if(data.message.errno == 40035) util.message(data.message.message);
						}
					});
				break;
			case 'realname':
				$('.modal').modal('hide');
				if(_.isEmpty($scope.userOriginal.realname)) {
					util.message('真实姓名不可为空！');
					return false;
				}
				$http.post($scope.links.userPost, {type: type, realname: $scope.userOriginal.realname, uid: $scope.user.uid})
					.success(function(data){
						if(data.message.errno == 0) {
							$scope.profile.realname = $scope.userOriginal.realname;
							util.message('真实姓名修改成功！');
						}else {
							if(data.message.errno == -1) util.message(data.message.message);
							if(data.message.errno == 1) util.message(data.message.message);
							if(data.message.errno == 40035) util.message(data.message.message);
						}
					})
				break;
			case 'birth':
				$('.modal').modal('hide');
				var year = $('.tpl-year').val();
				var month = $('.tpl-month').val();
				var day = $('.tpl-day').val();
				$http.post($scope.links.userPost, {type: type, year: year, month: month, day: day, uid: $scope.user.uid})
					.success(function(data){
						if(data.message.errno == 0) {
							$scope.profile.births = year+'年'+month+'月'+day+'日';
							util.message('修改成功！');
						}else {
							if(data.message.errno == -1) util.message(data.message.message);
							if(data.message.errno == 1) util.message(data.message.message);
							if(data.message.errno == 40035) util.message(data.message.message);
						}
					})
				break;
			case 'address':
				$('.modal').modal('hide');
				if(_.isEmpty($scope.userOriginal.address)) {
					util.message('邮寄地址不可为空！');
					return false;
				}
				$http.post($scope.links.userPost, {type: type, address: $scope.userOriginal.address, uid: $scope.user.uid})
					.success(function(data){
						if(data.message.errno == 0) {
							$scope.profile.address = $scope.userOriginal.address;
							util.message('邮寄地址修改成功！');
						}else {
							if(data.message.errno == -1) util.message(data.message.message);
							if(data.message.errno == 1) util.message(data.message.message);
							if(data.message.errno == 40035) util.message(data.message.message);
						}
					})
				break;
			case 'reside':
				$('.modal').modal('hide');
				var province = $('.tpl-province').val();
				var city = $('.tpl-city').val();
				var district = $('.tpl-district').val();
				$http.post($scope.links.userPost, {type: type, province: province, city: city, district: district, uid: $scope.user.uid})
					.success(function(data){
						if(data.message.errno == 0) {
							$scope.profile.resides = province+' '+city+' '+district;
							util.message('修改成功！');
						}else {
							if(data.message.errno == -1) util.message(data.message.message);
							if(data.message.errno == 1) util.message(data.message.message);
							if(data.message.errno == 40035) util.message(data.message.message);
						}
					})
				break;
		}
	};
	$scope.changeText = function(ev) {
		var text = $(ev)[0].target.text;
		$(ev)[0].target.text = text == '展开' ? '收起' : '展开';
	};
}]);

angular.module('userProfile').controller('userBindCtrl', ['$scope','$http', 'config','$interval', function($scope, $http, config, $interval){
	$scope.bindqq = config.bindqq;
	$scope.bindwechat = config.bindwechat;
	$scope.bindmobile = config.bindmobile;
	$scope.login_urls = config.login_urls;
	$scope.thirdlogin = config.thirdlogin;
	$scope.bind_sign = config.bind_sign;
	$scope.image = config.image;
	$scope.mobile = '';
	$scope.password = '';
	$scope.repassword = '';
	$scope.links = config.links;
	$scope.imagecode = '';
	$scope.smscode = '';

	$scope.expire = 120;
	$scope.text = "发送验证码";
	$scope.isDisable = false;

	$scope.sendMessage = function(type) {
		if ($scope.mobile == '') {
			util.message('手机号不能为空');
			return false;
		}
		$http.post($scope.links.valid_mobile_link, {mobile : $scope.mobile, type : type}).success(function(data){
			if (data.message.errno != 0) {
				util.message(data.message.message);
			} else {
				$http.post($scope.links.send_code_link, {receiver : $scope.mobile, custom_sign: $scope.bind_sign}).success(function(data){
					if (data== 'success') {
						util.message('发送验证码成功', '', 'success');
						var time = $interval(function(){
							$scope.isDisable = true;
							$scope.expire--;
							$scope.text = $scope.expire + "秒后重新获取";
							if ($scope.expire <= 0) {
								$interval.cancel(time);
								$scope.isDisable = false;
								$scope.text = "重新点击获取验证码";
								$scope.expire = 120;
							}
						},1000);
					}else{
						util.message(data, '', 'error');
					}
				});
			}
		});
	}

	$scope.changeVerify = function() {
		$scope.image = $scope.links.img_verify_link + 'r=' + Math.round(new Date().getTime());
		return false;
	}

	$scope.mobileBind = function(type, bind_type) {
		if ($scope.mobile == '') {
			util.message('手机号不能为空');
			return false;
		}
		if ($scope.imagecode == '') {
			util.message('图形验证码不能为空');
			return false;
		}
		if ($scope.smscode == '') {
			util.message('手机号验证码不能为空');
			return false;
		}
		if ($scope.bindmobile == null) {
			if ($scope.password == '') {
				util.message('密码不能为空');
				return false;
			}
			if ($scope.repassword == '') {
				util.message('确认密码不能为空');
				return false;
			}
			if ($scope.password != $scope.repassword) {
				util.message('两次输入的密码不一致');
				return false;
			}
		}

		if ($scope.bindmobile == null) {
			$http.post($scope.links.bind_mobile_link, {
				mobile: $scope.mobile,
				password: $scope.password,
				repassword: $scope.repassword,
				imagecode: $scope.imagecode,
				smscode: $scope.smscode,
				type: type
			}).success(function (data) {
				if (data.message.errno == 0) {
					util.message(data.message.message, data.redirect, 'success');
				} else {
					util.message(data.message.message);
				}
			});
		} else {
			$http.post($scope.links.unbind_third_link, {
				mobile: $scope.mobile,
				password: $scope.password,
				repassword: $scope.repassword,
				imagecode: $scope.imagecode,
				smscode: $scope.smscode,
				type: type,
				bind_type : bind_type
			}).success(function (data) {
				if (data.message.errno == 0) {
					util.message(data.message.message, data.redirect, 'success');
				} else {
					util.message(data.message.message);
				}
			});
		}
	}

	$scope.unbind = function(third_type) {
		$http.post($scope.links.unbind_third_link, {bind_type: third_type}).success(function(data){
			if (data.message.errno == 0) {
				util.message(data.message.message, data.redirect, 'success');
			} else {
				util.message(data.message.message);
			}
		});
	}
}]);