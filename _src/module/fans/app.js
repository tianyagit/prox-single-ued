angular.module('fansApp', ['we7app'])
.value('config', {
	running : false,
	syncState : '',
	downloadState : '',
})
.controller('DisplayCtrl', ['$scope', '$http', 'config', '$q', function($scope, $http, config, $q) {
	$scope.config = config;
	$scope.addTagUrl = config.addTagUrl;
	$scope.tag = '';
	$scope.searchMod = config.searchMod;
	$scope.closeValue = 0;
	$scope.registerUrl = config.registerUrl;
	$scope.register = [];
	$scope.sync_member= 0;
	$scope.switchSearchMod = function(type) {
		$scope.searchMod = type;
		$scope.$apply($scope.searchMod);
	};

	$scope.addTag = function() {
		$http.post($scope.addTagUrl, {'tag' : $scope.tag}).success(function(data) {
		});
	};

	$scope.registerMember = function(openid) {
		$scope.register.openid = openid;
		$scope.register.password = '';
		$scope.register.repassword = '';
	}

	$scope.register = function() {
		$('.modal').modal('hide');
		if($scope.register.password == '') {
			util.message('新密码不可为空！');
			return false;
		}
		if($scope.register.repassword == '') {
			util.message('确认新密码不可为空！');
			return false;
		}
		if($scope.register.password != $scope.register.repassword){
			util.message('两次密码不一致！');
			return false;
		}
		$http.post($scope.registerUrl, {'password' : $scope.register.password, 'repassword' : $scope.register.repassword, 'openid':$scope.register.openid}).success(function(data) {
			if (data.message.errno == 0) {
				util.message(data.message.message, data.redirect, 'ajax');
			} else {
				util.message(data.message.message);
			}
		});
	}

	$scope.syncMember = function() {
		$scope.sync_member = $scope.sync_member==0 ? 1: 0;
	}
	$scope.downloadFans = function(nextOpenid, count) {
		var arr,reg=new RegExp("(^| )we7:sync_fans_pindex:" + window.sysinfo.uniacid + "=([^;]*)(;|$)");
		if(arr=document.cookie.match(reg)) {
			$scope.sync('all', {'pageindex' : unescape(arr[2])});
			return false;
		}
		if (!count) {
			count = 0;
		}
		if (nextOpenid == undefined) {
			nextOpenid = '';
			util.message('正在下载粉丝数据...');
		}
		$http.post(config.syncAllUrl, {'next_openid' : nextOpenid}).success(function(data) {
			if (data.message.errno != 0) {
				var notice = '';
				if (typeof data.message == 'string') {
					notice = data.message;
				} else if (typeof data.message.message == 'string') {
					notice = data.message.message;
				}
				util.message('粉丝下载失败。具体原因：' + notice);
				return false;
			}
			count += parseInt(data.message.message.count);
			if ((data.message.message.total <= count) || (!data.message.message.count && !data.message.message.next)) {
				$scope.sync('all');
				return false;
			} else {
				$scope.downloadFans(data.message.message.next, count);
			}
		});
	};
	$scope.sync = function(type,param) {
		if (type == 'all') {
			if (!param) {
				param = {};
				param.pageindex = 0;
				param.total = 0;
				util.message('粉丝数据下载完成。开始更新粉丝数据...', '', 'success');
			}
			param.type = 'all';
			param.sync_member = $scope.sync_member;
		} else{
			param = {'type' : 'check', 'openids' : [], 'sync_member':$scope.sync_member}
			$('.openid:checked').each(function() {
				param.openids.push(this.value);
			});
			if (param.openids.length == 0) {
				util.message('请选择粉丝', '', 'info');
				return false;
			}
			util.message('正在同步粉丝数据请不要关闭浏览器...');
		}
		if (param.pageindex > 0 && $scope.closeValue==0) {
			$('#modal-message').modal('hide');
			var modalobj = util.dialog('更新进度', '<div class="progress"> '+
			'<div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="'+((param.pageindex/param.total)*100)+'" aria-valuemin="0" aria-valuemax="100" style="width: '+((param.pageindex/param.total)*100)+'%">'+
			'<span class="sr-only"></span>'+
			'</div>'+
			'</div>', '', {containerName:'link-container'});
			modalobj.modal('show');
		}
		//同步所有粉丝
		/*$http.post($scope.config.syncUrl, param).success(function(data) {
			if (data.message == undefined) {
				util.message('更新失败！可能是由于你当前网络不稳定，请稍后再试。', '', 'info');
				return false;
			} else {
				if (data.message.errno == 0) {
					if ((data.message.message == 'success') || (data.message.message.total == data.message.message.pageindex)) {
						util.message('同步粉丝数据成功', config.msgUrl, 'success');
						return false;
					} else {
						$scope.sync('all', {'pageindex' : data.message.message.pageindex, 'total' : data.message.message.total});
					}
				}  else {
					if (++param.pageindex > param) {
						util.message('同步粉丝数据成功', config.msgUrl, 'success');
						return false;
					} else {
						$scope.sync('all', {'pageindex' : ++param.pageindex, 'total' : param.total});
					}
				}
			}
		});*/
		$(".close").click(function(){
			$scope.closeValue=1;
		});
		var deferred = $q.defer();
        var promise = deferred.promise;
        promise.then(function () {
        	//同步所有粉丝
           $http.post($scope.config.syncUrl, param).success(function(data) {
				if (data.message == undefined) {
					util.message('更新失败！可能是由于你当前网络不稳定，请稍后再试。', '', 'info');
					return false;
				} else {
					if (data.message.errno == 0) {
						if ((data.message.message == 'success') || (data.message.message.total == data.message.message.pageindex)) {
							util.message('同步粉丝数据成功', config.msgUrl, 'success');
							return false;
						} else {
							$scope.sync('all', {'pageindex' : data.message.message.pageindex, 'total' : data.message.message.total});
						}
					}  else {
						if (++param.pageindex > param) {
							util.message('同步粉丝数据成功', config.msgUrl, 'success');
							return false;
						} else {
							$scope.sync('all', {'pageindex' : ++param.pageindex, 'total' : param.total});
						}
					}
				}
			});
        }, function (error) {
        	//点击模态框关闭按钮停止同步请求
            //alert("Fail: " + error);
        });
        if ($scope.closeValue==1) {
        	$scope.closeValue=0;
        	//deferred.reject("已关闭!");
        } else {
           deferred.resolve(); 
        }
	};
}])
.controller('chatsCtrl', ['$scope', '$http', 'config', function($scope, $http, config) {
	send = function() {
		types  = [];
		types['text'] = $('[name="reply[reply_basic]"]').val();
		types['news'] = $('[name="reply[reply_news]"]').val();
		types['image'] = $('[name="reply[reply_image]"]').val();
		types['music'] = $('[name="reply[reply_music]"]').val();
		types['voice'] = $('[name="reply[reply_voice]"]').val();
		types['video'] = $('[name="reply[reply_video]"]').val();
		types['wxcard'] = $('[name="reply[reply_wxcard]"]').val();
		for (type in types) {
			if (types[type] != '') {
				msg_type = type;
				msg_content = types[type];
				break;
			}
		}
		$.post(config.sendurl, {'type' : msg_type, 'content' : msg_content}, function(data) {
			data  = $.parseJSON(data);
			if (data.message.errno == -1) {
				util.message(data.message.message, '', 'info');
			} else {
				$('.del-basic-media').remove();
				$scope.chatLogs.unshift({
					'flag': 1,
					'createtime' : data.message.message.createtime,
					'content' : data.message.message.content,
					'msgtype' : data.message.message.msgtype
				});
				$scope.$apply();
			}
		});
	}
	$scope.chatLogs = config.chatLogs;
	window.onbeforeunload  = function() {
		$.get(config.endurl, {}, function(data) {
		});
	}
}])