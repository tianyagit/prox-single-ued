angular.module('qrApp', ['we7app']);
angular.module('qrApp').controller('QrDisplay', ['$scope', function($scope){
	$('.js-clip').each(function(){
		util.clip(this, $(this).attr('data-url'));
	});
}]);
//新建/编辑二维码
angular.module('qrApp').controller('QrPost', ['$scope', '$http', 'config', function($scope, $http, config){
	//二维码类型
	if(config.id > 0) {
		$scope.type = 0;
	}else {
		$scope.type = 1;
	}
	$('.we7-select').change(function(){
		var val = $('.we7-select').val();
		if(val == 1){
			$scope.type = 1;
		}else {
			$scope.type = 2;
		}
		$scope.$apply($scope.type);
	});

	if($.isFunction(window.initReplyController)) {
		window.initReplyController($scope, $http);
	};

	$('.submit').on('click', function(){
		if($scope.checkSubmit()) {
			return true;
		}
		return false;
	});
	$scope.checkSubmit = function() {
		if($(":text[name='scene-name']").val() == '') {
			util.message('抱歉，二维码名称为必填项，请返回修改！');
			return false;
		}

		if($scope.type == 1) {
			if ($(":text[name='expire-seconds']").val() == '') {
				util.message('抱歉，临时二维码过期时间为必填项，请返回修改！');
				return false;
			}
			var r2 = /^\+?[1-9][0-9]*$/;
			if(!r2.test($(":text[name='expire-seconds']").val())){
				util.message('抱歉，临时二维码过期时间必须为正整数，请返回修改！');
				return false;
			}
			if(parseInt($(":text[name='expire-seconds']").val())<30 || parseInt($(":text[name='expire-seconds']").val())>2592000) {
				util.message('抱歉，临时二维码过期时间必须在30-2592000秒之间，请返回修改！');
				return false;
			}
		}
		if($scope.type == 2) {
			var scene_str = $.trim($('#scene_str').val());
			if(!scene_str) {
				util.message('场景值不能为空！');
				return false;
			}
			var reg =  /^\d+$/g;
			if(reg.test(scene_str)){
				util.message('场景值不能是数字！');
				return false;
			}
			$http.post("{php echo url('platform/qr/check_scene_str')}", {'scene_str':scene_str})
				.success(function(data){
					if(data.message.errno == 1 && data.message.message == 'repeat') {
						util.message('场景值和现有二维码场景值重复，请修改场景值');
						return false;
					}
				});
		}
		if($(":hidden[name='reply[reply_keyword]']").val() == '') {
			util.message('抱歉，请选择二维码要触发的关键字！');
			return false;
		}
		return true;
	};
}]);
//长连接转二维码
angular.module('qrApp').controller('UrlToQr', ['$scope', '$http', 'config', function($scope, $http, config) {
	$scope.copyLink = '';
	//点击选择【系统连接】事件
	$scope.selectUrl = function() {
		var ipt = $('#longurl');
		util.linkBrowser(function(href){
			var site_url = config.site_url;
			if(href.substring(0, 4) == 'tel:') {
				util.message('长链接不能设置为一键拨号');
				return false;
			} else if(href.indexOf("http://") == -1 && href.indexOf("https://") == -1) {
				href = href.replace('./index.php?', '/index.php?');
				href = site_url + 'app' + href;
			}
			ipt.val(href);
		});
	};
	//转换成链接
	$scope.transformUrl = function() {
		var longurl = $('#longurl').val().trim();
		if(longurl == '') {
			util.message('请输入长链接');
			return false;
		} else if(longurl.indexOf("http://") == -1 && longurl.indexOf("https://") == -1 && longurl.indexOf("weixin://") == -1) {
			util.message('请输入有效的长链接');
			return false;
		}
		var change = $('#change');
		var img_url = config.img_url;
		change.html('<i class="fa fa-spinner"></i> 转换中');
		$http.post(config.transform_url, {'longurl' : longurl})
			.success(function(data){
				if(data.message.errno == -1) {
					util.message(data.message.message);
					change.html('立即转换');
					return false;
				} else {
					$('#shorturl').val(data.message.message.short_url);
					$scope.copyLink = data.message.message.short_url;
					$('.url-short').next().attr({'data-url': data.message.message.short_url}).removeClass('disabled');
					$('#qrsrc').attr('src', img_url + 'url=' + data.message.message.short_url);
					$('.qr-img').next().removeClass('disabled');
					change.html('立即转换');
				}
			});
	};
	//保存二维码
	$scope.downQr = function() {
		var qr = $('#shorturl').val();
		var down_url = config.down_url;
		window.location.href = down_url + 'qrlink=' + qr;
	};
	$scope.success = function(id) {
		var id = parseInt(id);
		var obj = $('<span class="label label-success" style="position:absolute;height:33px;line-height:28px;"><i class="fa fa-check-circle"></i> 复制成功</span>');
		var enext = $('#copy-'+id).next().html();
		if (!enext || enext.indexOf('<span class="label label-success" style="position:absolute;z-index:10"><i class="fa fa-check-circle"></i> 复制成功</span>')<0) {
			$('#copy-'+id).after(obj);
		}
		setTimeout(function(){
			obj.remove();
		}, 2000);
	};
}]);

angular.module('qrApp').controller('QrStatistics', ['$scope', '$http', 'config', function($scope, $http, config){
	$scope.link = config.link;
	$scope.changeStatus = function() {
		$http.post($scope.link.changeStatus, {})
			.success(function(data){
				if(data.message.errno == 0) {
					location.reload();
				}else{
					util.message(data.message.message, data.redirect, 'ajax');
				}
			});
	}
}]);