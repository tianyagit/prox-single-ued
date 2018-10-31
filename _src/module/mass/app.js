angular.module('massApp', ['we7app']);
//群发记录
angular.module(['massApp']).controller('MassSend', ['$scope', '$http', 'config', function($scope, $http, config){
	$scope.showLog = function(id){
		var tid = parseInt(id);
		var obj = $('#'+tid);
		$http.post(config.logUrl, {tid: tid, type: 'mass', module: 'task'})
			.success(function(data) {
				data = angular.toJson(data);
				var html = '';
				if(!data.message || data.message.items.length == 0) {
					html = '<tr><td class="text-center"><i class="fa fa-info-circle"></i> 暂无数据</td></tr>';
				} else{
					$.each(data.message.items, function(k, v){
						html += '<tr><td>' + v.createtime + ' ' + v.note + '</td></tr>';
					});
				}
				obj.popover({
					'html':true,
					'placement':'left',
					'trigger':'manual',
					'title':'触发日志',
					'content':'<table class="table-cron table">' + html + '</table>'
				});
				obj.popover('toggle');
			});
	};
	$scope.hideLog = function(id){
		var tid = parseInt(id);
		var obj = $('#'+tid);
		obj.popover('toggle');
	}
}]);
//定时群发编辑
angular.module('massApp').controller('MassPost', ['$scope', 'config', function($scope, config) {
	$scope.groups = config.groups;
	$scope.massdata = config.massdata;
	$scope.clock = config.massdata ? config.massdata.clock : '08:00';
	if ($.isFunction(window.initReplyController)) {
		window.initReplyController($scope);
	};
	if ($scope.massdata.type==1) {
		$('.sendtime').show();
	} else {
		$('.sendtime').hide();
	}

	$('.mass-type').change(function(){
		if ($("select[name='type']").val()==1) {
			$('.sendtime').show();
		} else {
			$('.sendtime').hide();
		}
	})

	$scope.checkSubmit = function(e) {
		var selectedGroup = $('.mass-group').val();
		if(selectedGroup == '') {
			e.preventDefault();
			util.message('请选择群发对象');
			return false;
		}else {
			if (selectedGroup == -1) {
				var group_fans_all = {'id':-1, 'name':'全部粉丝', 'count':0};
				$(':hidden[name="group"]').val(angular.toJson(group_fans_all));
			} else {
				angular.forEach($scope.groups, function(group_v, group_k) {
					if(group_v.id == selectedGroup) {
						$(':hidden[name="group"]').val(angular.toJson(group_v));
					}
				});
			}
		};

		if($scope.clock == '') {
			e.preventDefault();
			util.message('请选择群发具体时间');
			return false;
		}else {
			if(config.day == '0') {
				var selectedTime = $scope.clock.split(':');
				var d = new Date();
				var hours = d.getHours();
				var minutes = d.getMinutes();
				if((selectedTime[0] < hours) || (selectedTime[0] == hours && selectedTime[1] < minutes)){
					e.preventDefault();
					util.message('发送时间不能小于当前时间');
					return false;
				}	
			}
		};
		var reply_news = $(':hidden[name="reply[reply_news]"]').val();
		var reply_image = $(':hidden[name="reply[reply_image]"]').val();
		var reply_music = $(':hidden[name="reply[reply_music]"]').val();
		var reply_voice = $(':hidden[name="reply[reply_voice]"]').val();
		var reply_video = $(':hidden[name="reply[reply_video]"]').val();
		var reply_basic = $(':hidden[name="reply[reply_basic]"]').val();
		if(reply_news == '' && reply_image == '' && reply_music == '' && reply_voice == '' && reply_video == '' && reply_basic == '') {
			e.preventDefault();
			util.message('请选择群发素材');
			return false;
		};
		if (reply_news != '') {
			reply_news = eval('('+reply_news+')');
			if (reply_news.model != 'perm') {
				e.preventDefault();
				util.message('群发不支持本地/服务器素材，请选择微信素材');
				return false;
			}
			$(':hidden[name="reply[reply_news]"]').val(reply_news.mediaid);
		}
		if (reply_image != '') {
			reply_image = eval('('+reply_image+')');
			$(':hidden[name="reply[reply_image]"]').val(reply_image);
		}
		if (reply_music != '') {
			reply_music = eval('('+reply_music+')');
			$(':hidden[name="reply[reply_music]"]').val(reply_music);
		}
		if (reply_voice != '') {
			reply_voice = eval('('+reply_voice+')');
			$(':hidden[name="reply[reply_voice]"]').val(reply_voice);
		}
		if (reply_video != '') {
			reply_video = eval('('+reply_video+')');
			$(':hidden[name="reply[reply_video]"]').val(reply_video.mediaid);
		}
	};
	$('.clockpicker').clockpicker({autoclose: true});
}]);
//定时群发列表
angular.module('massApp').controller('MassDisplay',['$scope', '$http', 'config', function($scope, $http, config){
	$scope.days = config.days;
	$scope.delMass = function(id, index){
		var id = parseInt(id);
		var index = parseInt(index);
		if(!confirm('确认清空这条群发吗?')) {
			return false;
		}
		$http.post("./index.php?c=platform&a=mass&do=del", {id: id})
			.success(function(data, status){
				if(!data.message.errno) {
					$scope.days[index].info = '';
				} else {
					util.message('清空群发失败:<br>' + data.message.message, "", 'error');
				}
			});
		return false;
	};
	$scope.toEdit = function(index) {
		var index = parseInt(index);
		window.location.href = './index.php?c=platform&a=mass&do=post&day='+index;
	};
	$scope.preview = function(index){
		var index = parseInt(index);
		if($scope.days[index].info) {
			var media_id = $scope.days[index].info.media_id;
			var type = $scope.days[index].info.msgtype;
			$('#modal-view').modal('show');

			$('#modal-view .btn-view').unbind().click(function(){
				var wxname = $.trim($('#modal-view #wxname').val());
				if(!wxname) {
					util.message('微信号不能为空', '', 'error');
					return false;
				}
				$('#modal-view').modal('hide');
				$http.post('./index.php?c=platform&a=mass&do=preview', {media_id: media_id, wxname: wxname, type: type})
					.success(function(data){
						if(data.message.errno != 0) {
							util.message(data.message.message);
						} else {
							util.message('发送成功', '', 'success');
						}
					});
				return false;
			});
		}else {
			util.message('群发内容错误！');
			return false;
		}
	};
}]);