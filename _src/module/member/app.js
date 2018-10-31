angular.module('memberAPP', ['we7app']);
angular.module('memberAPP')
.controller('group', ['$scope', '$http', 'config', function($scope, $http, config) {
		$scope.config = config;
		$scope.group_level = $scope.config.group_level;
		$scope.group_person_count = $scope.config.group_person_count;
		$scope.group_list = $scope.config.group_list;
		$scope.default_group = $scope.config.default_group;
		$scope.set_group_detail_info = function(group_id) {
			$scope.group_detail = {};
			$http.post($scope.config.get_group_url, {'group_id' : group_id}).success(function(data) {
				if (data.message.errno == 1) {
					util.message(data.message.message, '', 'error');
				} else {
					$scope.group_detail = data.message.message;
				}
			});
			$('#group_detail').modal('show');
		}
		
		$scope.change_group_level = function() {
			$http.post($scope.config.change_group_level_url, {'group_level' : $scope.group_level}).success(function(data) {
				if (data.message.errno == 0) {
					util.modal_message('','设置成功', '', 'success');
				} else {
					util.message('设置失败', '', 'error');
				}
			});
		}

		$scope.save_group = function() {
			if ($scope.group_detail.title == '') {
				util.message('请填写会员组名称', '', 'error');
				return false;
			}
			$http.post($scope.config.save_group_url, {'group' : $scope.group_detail}).success(function(data) {
				if (data.message.errno == 1) {
					util.message(data.message.message, '', 'error');
				}
				if (data.message.errno == 2) {
					$('#group_detail').modal('hide');
					$scope.group_list[$scope.group_detail.groupid] = $scope.group_detail;
					util.message(data.message.message, '', 'success');
				}
				if (data.message.errno == 3) {
					groupid = data.message.message.groupid;
					$scope.group_list[groupid] = data.message.message;
					$('#group_detail').modal('hide');
					util.message('添加成功', '', 'success');
				}
			});
		}

		$scope.set_default = function(group_id) {
			$http.post($scope.config.set_default_url, {'group_id' : group_id}).success(function(data) {
				if (data.message.errno == 0) {
					$scope.group_list[group_id].isdefault = 1;
					$scope.group_list[$scope.default_group.groupid].isdefault = 0;
					$scope.default_group = $scope.group_list[group_id];
					$scope.apply($scope);
					util.message('设置成功', '', 'success');
				} else {
					util.message('设置失败', '', 'error');
				}
			});
		}

		$scope.del_group = function(group_id) {
			if (!confirm("确定要删除吗？")) {
				return false;
			}
			$http.post($scope.config.del_group_url, {'group_id' : group_id}).success(function(data) {
				if (data.message.errno == 0) {
					delete $scope.group_list[group_id];
					util.message('删除成功', '', 'success');
				} else {
					util.message('删除失败', '', 'error');
				}
			});
		}
}]);
angular.module('memberAPP').controller('baseInformation', ['$scope', '$http', 'config', function($scope, $http, config) {
	$scope.config = config;
	$scope.profile = $scope.config.profile;
	$scope.groups = $scope.config.groups;
	$scope.addresses = $scope.config.addresses;
	$scope.custom_fields = $scope.config.custom_fields;
	$scope.all_fields = $scope.config.all_fields;
	$scope.uniacid_fields = $scope.config.uniacid_fields;
	$scope.sexes = [{id:0,name:'保密'}, {id:1,name:'男'}, {id:2,name:'女'}];
	$scope.educations = ['博士','硕士','本科','专科','中学','小学','其它'];
	$scope.constellations = ['水瓶座', '双鱼座', '白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座'];
	$scope.zodiacs = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
	$scope.bloodtypes = ['A', 'B', 'AB', 'O', '其它'];
	$scope.profile.births = $scope.profile.birthyear + '-' + $scope.profile.birthmonth + '-' + $scope.profile.birthday;
	$scope.profile.resides = $scope.profile.nationality + $scope.profile.resideprovince + $scope.profile.residecity + $scope.profile.residedist;
	$scope.other_field_name = '';
	$scope.other_field_title = '';
	$scope.addAddress = {name:'', phone:'', code:'', province:'', city:'', district:'', detail:''};
	$scope.editAddress = {};
	$scope.uid = $scope.config.uid;
	angular.forEach($scope.addresses, function(data, index){
		data['pcda'] = data.province + '-' + data.city + '-' + data.district + '-' + data.address;
	});
	$scope.addAdd = function() {
		$scope.addAddress.province = $('.tpl-province').eq(1).val();
		$scope.addAddress.city = $('.tpl-city').eq(1).val();
		$scope.addAddress.district = $('.tpl-district').eq(1).val();
		$('#address-add').modal('hide');
		$http.post(config.links.addAddressUrl, $scope.addAddress)
		.success(function(data){
			if(data.message.errno == 0) {
				var address = data.message.message;
				address['pcda'] = address.province + '-' + address.city + '-' + address.district + '-' + address.address;
				$scope.addresses.push(address);
				util.message('收货地址添加成功', '', 'success');
			}else{
				if(data.message.errno == 1) util.message(data.message.message, '', 'error');
			}
		});
	};
	$scope.choseEditAdd = function(id) {
		angular.forEach($scope.addresses, function(data, index){
			if (data.id == id) {
				$scope.editAddress = {
					id:id,
					name:data.username,
					phone:data.mobile,
					code:data.zipcode,
					province:data.province,
					city:data.city,
					district:data.district,
					detail:data.address,
					uniacid:data.uniacid
				};
				$('.tpl-province').eq(2).attr('data-value', $scope.editAddress.province);
				$('.tpl-city').eq(2).attr('data-value', $scope.editAddress.city);
				$('.tpl-district').eq(2).attr('data-value', $scope.editAddress.district);
				require(["district"], function(dis){
					$(".tpl-district-container").each(function(){
						var elms = {};
						elms.province = $(this).find(".tpl-province")[0];
						elms.city = $(this).find(".tpl-city")[0];
						elms.district = $(this).find(".tpl-district")[0];
						var vals = {};
						vals.province = $(elms.province).attr("data-value");
						vals.city = $(elms.city).attr("data-value");
						vals.district = $(elms.district).attr("data-value");
						dis.render(elms, vals, {withTitle: true});
					});
				});
			}
		});
	};
	$scope.editAdd = function(id) {
		$scope.editAddress.province = $('.tpl-province').eq(2).val();
		$scope.editAddress.city = $('.tpl-city').eq(2).val();
		$scope.editAddress.district = $('.tpl-district').eq(2).val();
		$('#address-edit').modal('hide');
		$http.post(config.links.editAddressUrl, $scope.editAddress)
		.success(function(res){
			if(res.message.errno == 0) {
				var address = res.message.message;
				address.pcda= address.province + '-' + address.city + '-' + address.district + '-' + address.address;
				angular.forEach($scope.addresses, function(data, index){
					if (address.id == data.id) {
						data.pcda = address.pcda;
					}
				});
				util.message('收货地址修改成功', '', 'success');
			}else{
				if(data.message.errno == 1) util.message(res.message.message, '', 'error');
			}
		});
	};
	$scope.delAdd = function(id) {
		$http.post(config.links.delAddressUrl, {id:id})
		.success(function(res){
			if(res.message.errno == 0) {
				angular.forEach($scope.addresses, function(data, index){
					if (id == data.id) {
						$scope.addresses.splice(index, 1);
					}
				});
				util.message('收货地址删除成功', '', 'success');
			}else{
				if(data.message.errno == 1) util.message(res.message.message, '', 'error');
			}
		});
	};
	$scope.setDefaultAdd = function(id) {
		$http.post(config.links.setDefaultAddressUrl, {id:id, uid:$scope.uid})
		.success(function(res){
			if(res.message.errno == 0) {
				angular.forEach($scope.addresses, function(data, index){
					if (id == data.id) {
						data.isdefault = 1;
					} else {
						data.isdefault = 0;
					}
				});
				util.message('设置成功', '', 'success');
			}else{
				util.message('设置失败', '', 'success');
			}
		});
	}
	$scope.changeImage = function(type) {
		if(type == 'avatar') {
			require(['fileUploader'], function(uploader){
				uploader.init(function(imgs){
						$scope.profile.avatar = imgs.attachment;
						$scope.profile.avatarUrl = imgs.url;
						$scope.$apply($scope.profile);
						$scope.httpChange(type);
				}, {'direct' : true, 'multiple' : false});
			});
		}
	};
	$scope.editInfo = function(type, val) {
		$scope.userOriginal = {};
		if (type == 'other_field') {
			$scope.userOriginal[val] = $scope.profile[val];
			$scope.other_field_name = $scope.all_fields[val];
			$scope.other_field_title = val;
		} else {
			$scope.userOriginal[type] = val;
		}
	};
	$scope.httpChange = function(type, newval) {
		switch(type) {
			case 'avatar':
				$http.post(config.links.basePost, {type: type, imgsrc: $scope.profile.avatar})
					.success(function(data){
						if(data.message.errno == 0) {
							util.message('修改成功！', '', 'success');
						}else{
							if(data.message.errno == -1) util.message(data.message.message, data.redirect, 'error');
							if(data.message.errno == 1) util.message(data.message.message, '', 'error');
						}
					});
				break;
			case 'groupid':
			case 'gender':
			case 'education':
			case 'nickname':
			case 'realname':
			case 'address':
			case 'mobile':
			case 'qq':
			case 'email':
			case 'telephone':
			case 'msn':
			case 'taobao':
			case 'alipay':
			case 'graduateschool':
			case 'grade':
			case 'studentid':
			case 'revenue':
			case 'position':
			case 'occupation':
			case 'company':
			case 'nationality':
			case 'height':
			case 'weight':
			case 'idcard':
			case 'zipcode':
			case 'site':
			case 'affectivestatus':
			case 'lookingfor':
			case 'bio':
			case 'interest':
			case 'constellation':
			case 'zodiac':
			case 'bloodtype':
				$('#'+ type).modal('hide');
				if ($scope.userOriginal[type] == '') {
					util.message('不可为空！', '', 'error');
					return false;
				}
				if (type == 'mobile') {
					var phonereg = /^\d{11}$/; 
					if (!phonereg.test($scope.userOriginal[type])) {
						util.message('手机号格式错误', '', 'error');
						return false;
					}
				}
				$http.post(config.links.basePost, {type: type, request_data: $scope.userOriginal[type]})
					.success(function(data){
						if(data.message.errno == 0) {
							$scope.profile[type] = $scope.userOriginal[type];
							util.message('修改成功！', '', 'success');
						}else {
							if(data.message.errno == -1) util.message(data.message.message, data.redirect, 'error');
							if(data.message.errno == 1) util.message(data.message.message, '', 'error');
						}
					})
				break;
			case 'other_field':
				$('#'+ type).modal('hide');
				if ($scope.userOriginal[$scope.other_field_title] == '') {
					util.message('不可为空！', '', 'error');
					return false;
				}
				$http.post(config.links.basePost, {type: $scope.other_field_title, request_data: $scope.userOriginal[$scope.other_field_title]})
					.success(function(data){
						if(data.message.errno == 0) {
							$scope.profile[$scope.other_field_title] = $scope.userOriginal[$scope.other_field_title];
							util.message('修改成功！', '', 'success');
						}else {
							if(data.message.errno == -1) util.message(data.message.message, data.redirect, 'error');
							if(data.message.errno == 1) util.message(data.message.message, '', 'error');
						}
					})
				break;
			case 'births':
				$('.modal').modal('hide');
				var year = $('.tpl-year').val();
				var month = $('.tpl-month').val();
				var day = $('.tpl-day').val();
				$http.post(config.links.basePost, {type: type, birthyear: year, birthmonth: month, birthday: day}).success(
					function(data){
						if(data.message.errno == 0) {
							$scope.profile.births = year+'-'+month+'-'+day;
							util.message('修改成功！', '', 'success');
						}else {
							if(data.message.errno == -1) util.message(data.message.message, data.redirect, 'error');
							if(data.message.errno == 1) util.message(data.message.message, '', 'error');
						}
					}
				)
				break;
			case 'resides':
				$('.modal').modal('hide');
				var resideprovince = $('.tpl-province').eq(0).val();
				var residecity = $('.tpl-city').eq(0).val();
				var residedist = $('.tpl-district').eq(0).val();
				$http.post(config.links.basePost, {type: type, resideprovince: resideprovince, residecity: residecity, residedist: residedist}).success(
					function(data){
						if(data.message.errno == 0) {
							$scope.profile.resides = $scope.profile.nationality + resideprovince + residecity + residedist;
							util.message('修改成功！', '', 'success');
						}else {
							if(data.message.errno == -1) util.message(data.message.message, data.redirect, 'error');
							if(data.message.errno == 1) util.message(data.message.message, '', 'error');
						}
					}
				)
				break;
			case 'password':
				$('.modal').modal('hide');
				var newpwd = $('.new-password').val();
				var renewpwd = $('.renew-password').val();
				if(newpwd == '') {
					util.message('新密码不可为空！');
					return false;
				}
				if(renewpwd == '') {
					util.message('确认新密码不可为空！');
					return false;
				}
				if(newpwd != renewpwd){
					util.message('两次密码不一致！');
					return false;
				}
				$http.post(config.links.basePost, {type: type, password: newpwd}).success(function(data){
					if(data.message.errno == 0) {
						util.message('密码修改成功！');
					}else {
						if(data.message.errno == -1) util.message(data.message.message, data.redirect, 'error');
						if(data.message.errno == 1) util.message(data.message.message, '', 'error');
					}
				})
				break;
		}
	};
}]);