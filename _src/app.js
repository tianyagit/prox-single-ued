angular.module('we7app', ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'angular-clipboard']);
angular.module('we7app').run(function ($rootScope) {
	//此处可以定义一些超全局变量
	$rootScope.URL = 'test';
});
angular.module('we7app').factory("interceptors", [function() {
	return {
		// if beforeSend is defined call it
		'request': function(request) {
			if (request.beforeSend)
			request.beforeSend();

			return request;
		},
		// if complete is defined call it
		'response': function(response) {
			if (response.config.complete)
			response.config.complete(response);

			return response;
		}
	};
}]);
angular.module('we7app').config(function($httpProvider){
	$httpProvider.interceptors.push('interceptors');
	// Use x-www-form-urlencoded Content-Type
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

	$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
	/**
	* The workhorse; converts an object to x-www-form-urlencoded serialization.
	* @param {Object} obj
	* @return {String}
	*/ 
	var param = function(obj) {
		var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
		for(name in obj) {
			value = obj[name];

			if(value instanceof Array) {
				for(i=0; i<value.length; ++i) {
					subValue = value[i];
					fullSubName = name + '[' + i + ']';
					innerObj = {};
					innerObj[fullSubName] = subValue;
					query += param(innerObj) + '&';
				}
			}else if(value instanceof Object) {
				for(subName in value) {
					subValue = value[subName];
					fullSubName = name + '[' + subName + ']';
					innerObj = {};
					innerObj[fullSubName] = subValue;
					query += param(innerObj) + '&';
				}
			}else if(value !== undefined && value !== null) {
				query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
			}
		}
		return query.length ? query.substr(0, query.length - 1) : query;
	};

	// Override $http service's default transformRequest
	$httpProvider.defaults.transformRequest = [function(data) {
		return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
	}];
});
$(function(){
	//公共运行的一些代码
	util.cookie_message();
	// require(['we7.check'], function() {
	// 	$(':radio,:checkbox').we7_check();
	// });
	if (window.sysinfo.uid) {
		util.cookie.set('__lastvisit_' + window.sysinfo.uid, [window.sysinfo.uniacid, window.sysinfo.siteurl], 7*86400);
	}
	$('.js-clip').each(function(){
		util.clip(this, $(this).attr('data-url'));
	});
	//bootstrap初始化
	if($.fn.tooltip) {
		$('[data-toggle="tooltip"]').tooltip();
		$('[data-toggle="dropdown"]').dropdown();
        $('[data-toggle="popover"]').popover();
	}
	
	//为了保证能在img元素加载之后，才为这些元素设置error事件
	$("img").error(function () {
		if(!$(this).attr("onerror")){
			var img = "resource/images/nopic-107.png";
			if($(this).width() == $(this).height()){
				img = "resource/images/nopic-107.png";
			} else if($(this).width() < $(this).height()){
				img = "resource/images/nopic-203.png";
			}
			$(this).attr("src", img);
		}
	});
	function sync() {
		$.post("./index.php?c=utility&a=sync", function(){
			 setTimeout(sync, 60000);
		});
	}
	// sync();

	//模块升级检测
	if (window.sysinfo.module && window.sysinfo.module.name) {
		if (util.cookie.get('module_status:' + window.sysinfo.module.name) === null || util.cookie.get('module_status:' + window.sysinfo.module.name) === null) {
			$.getJSON("./index.php?c=module&a=manage-account&do=check_status&module=" + window.sysinfo.module.name, function(data) {
				if (data.message.errno == 1 || data.message.errno == 2 && window.sysinfo.isfounder == 1) {
					$('.head').after('<div class="system-tips we7-body-alert"><div class="container text-right"> <span class="alert-info"><a href="javascript:;">' + data.message.message + '</a></span></div></div>');
				}
			});
		} else {
			module_status = util.cookie.get('module_status:' + window.sysinfo.module.name);
			module_status = $.parseJSON(module_status);
			if (module_status.ban == 1) {
				$('.head').after('<div class="system-tips we7-body-alert"><div class="container text-right"> <span class="alert-info"><a href="javascript:;">' + '您的站点存在盗版模块, 请删除文件后联系客服' + '</a></span></div></div>');
			} else if (module_status.upgrade.upgrade == 1 && window.sysinfo.isfounder == 1) {
				$('.head').after('<div class="system-tips we7-body-alert"><div class="container text-right"> <span class="alert-info"><a href="javascript:;">' + '【' + module_status.upgrade.name + '】检测最新版为' + module_status.upgrade.version + '，请尽快更新！' + '</a></span></div></div>');
			}
		}
	}

	//系统升级检测
	if(window.sysinfo.isfounder) {
		function checkupgrade() {
			if (util.cookie.get('checkupgrade_sys')) {
				return;
			}
			$.getJSON("./index.php?c=utility&a=checkupgrade&do=system", function(ret){
				if (ret && ret.message && ret.message.upgrade == '1') {
					$('.head').after('<div id="upgrade-tips" class="upgrade-tips we7-body-alert"><div class="alert-info text-center color-red"><a href="./index.php?c=cloud&a=upgrade&">系统检测到新版本 '+ret.message.version+' ('+ ret.message.release +') ，请尽快更新！</a><span class="tips-close" onclick="checkupgrade_hide();"><i class="wi wi-error-sign"></i></span></div></div>');				
				}
			});
		}

		function checkupgrade_hide() {
			util.cookie.set('checkupgrade_sys', 1, 3600);
			$('#upgrade-tips').hide();
		}
		
		// checkupgrade();
	}
	$('.js-big-main').click(function(){
		var big = $('.skin-default').hasClass('main-lg-body') ? '0' : '1';
		util.cookie.set('main-lg',big);
		main_big();
	})
	function main_big() {
		var big = util.cookie.get('main-lg');
		if(big == 1) {
			$('.skin-default').addClass('main-lg-body');
			$('.js-big-main').text('正常');
		} else {
			$('.skin-default').removeClass('main-lg-body');
			$('.js-big-main').text('宽屏');
		}
	}

	if (window.sysinfo.uid) {
		var message_date = new Date();
		$.getJSON("./index.php?c=message&a=notice&do=event_notice", function (data) {
			var html = '';
			if (data.message.errno == 0) {
				if (data.message.message.total) {
					html += '<a href="javascript:;" class="dropdown-toogle" data-toggle="dropdown"><span class="wi wi-bell"><span class="badge">' + data.message.message.total + '</span></span> </a>';
					html += '<div class="dropdown-menu">' +
							'<div class="clearfix top">消息<a href="./index.php?c=message&a=notice" class="pull-right">查看更多</a><a href="./index.php?c=message&a=notice&do=all_read" class="pull-right" style="margin-right: 5px">全部已读</a></div>' +
							'<div class="msg-list-container">' +
							'<div class="msg-list">';
					$.each(data.message.message.lists, function (key, val) {
						html += '<div class="item">' +
								'<div class="info clearifx">' +
								'<div class="pull-right date">' + val.create_time + '</div>';
						if (val.type == 1) {
							html += '来自 <span>订单消息</span>';
						}
						if (val.type == 2 || val.type == 5) {
							html += '来自 <span>过期消息</span>';
						}
						if (val.type == 4) {
							html += '来自 <span>注册消息</span>';
						}
						if (val.type == 3) {
							html += '来自 <span>工单消息</span>';
						}
						if (val.type == 8) {
							html += '来自 <span>小程序升级模块消息</span>';
						}
						if (val.type == 10) {
							html += '来自 <span>系统更新通知消息</span>';
						}
						if (val.type == 11) {
							html += '来自 <span>官方动态消息</span>';
						}
						html += '</div>' +
								'<div class="msg-content">';
						html += '<a href=' + val.url + '>' + val.message + '</a>';
						html += '</div>' +
								'</div>';
					});
					html += '</div>' +
							'</div>' +
							'</div>';
					$('.header-notice').html(html);
				}
			}
			var notice_time = parseInt(message_date.getTime() / 1000);
			var expire_time = 60 * 60 * 6 + Math.ceil(Math.random() * 1800);
			var total_time = notice_time + expire_time;
			util.cookie.set('__notice', total_time, expire_time);
		});
	}
});
//调整页面视图高度为整屏
function resizeView(){
	var screenH = document.documentElement.clientHeight;
	var footerHeight = $('.footer').length > 0 ? $('.footer').css('height') : 0;
	var leftMenuHeight = $('.left-menu-content').length > 0 ? $('.left-menu-content').css('height') : 0;
	var footerWidth = $('.footer').length > 0 ? $('.footer').width() : 0;
	var rightContentWidth = $('.right-content').length > 0 ? $('.right-content').width() : 0;
	if($(".left-menu, .right-content").length == 2 && footerWidth != (rightContentWidth - 1)){
		$('.footer').length > 0 ? $('.footer').hide() : $('.footer').show();
	}
	$('.main-panel-body,.panel-cut').css('min-height' , screenH-100);
	$('.caret-wxapp .panel-app').css('min-height' , screenH-95);
	if(parseInt(leftMenuHeight) > screenH - 50){
		$('.skin-black .right-content>.content').css('min-height',parseInt(leftMenuHeight) - parseInt(footerHeight) -30 + 'px');
	}else{
		$('.skin-black .right-content>.content').css('min-height',screenH - parseInt(footerHeight) - 93 + 'px');
	}
	var $linkGroup = $('.link-group');
	$linkGroup.each(
		function(){
			var len = $(this).children('a').length;
			$(this).css('min-width', 100*len + 10);
		}
	);
}

//更改ueditor的路径
window.UEDITOR_HOME_URL = './resource/components/ueditor/';
//左侧菜单定位滚动
$(function(){
	if($("[data-skin='black']").length == 1) {
		resizeView();
	}
	if($(".menu-fixed, .left-menu, .right-content").length == 3){
        require(['slimscroll'], function () {
            $('.plugin-menu-sub').slimscroll({
                width: '210px',
                height: '100%',
                opacity: .4,
                color: '#aaa',
            })
        })
		var screenH = document.documentElement.clientHeight;
		var $leftMenu = $('.left-menu');
		var top = $leftMenu.offset().top;
		var pos = $leftMenu.css("position");
		var footerHeight = $('.footer').length > 0 ? $('.footer').css('height') : 0;
		if($('.skin-default').attr('data-skin') == 'default'){
			$('.left-menu, .skin-default .right-content').css('min-height', ((screenH - 174) - parseInt(footerHeight)) + 'px');
		}
		if($('.skin-black').attr('data-skin') == 'black'){
			$('.left-menu, .skin-default .right-content').css('min-height',(screenH - 51) + 'px');
		}
		$(window).scroll(function(){
			var footerTop = ($('.footer').length > 0 && !$('.footer').is(':hidden')) ? $('.footer').offset().top : 0;
			var scrolls = $(document).scrollTop();
			var footerScrolls =  footerTop ? (footerTop - scrolls) : screenH;
			if($('.skin-default').attr('data-skin') == 'default'){

				(scrolls > top) ? $leftMenu.css({position: "fixed", height: 'auto', top: 0, bottom: screenH > footerScrolls ? screenH - footerScrolls + 31 + 'px' : '0'}) : $leftMenu.css({position: pos, height: screenH});
				(scrolls > top) ? $('.right-content').css({marginLeft: $leftMenu.css('width')}) : $('.right-content').css({marginLeft: 0, minHeight: $leftMenu.height()});

				//(screenH > footerScrolls) ? $leftMenu.css('height', footerScrolls - 31) : $leftMenu.css('height', screenH);
			}else if($('.skin-black').attr('data-skin') == 'black'){
				(scrolls > top) ? $leftMenu.css({position: "fixed", top: 0, bottom: 0}) : $leftMenu.css({position: pos, top: scrolls});
				(scrolls > top) ? $('.right-content').css({marginLeft: $leftMenu.css('width')}) : $('.right-content').css({marginLeft: 0, minHeight: $leftMenu.height()});

			}
		});
	}
	//经典皮肤
	if($("[data-skin='classical']").length == 1) {
		var screenH = document.documentElement.clientHeight;
		var footerHeight = $('.footer').length > 0 ? $('.footer').css('height') : 0;
		if($(".left-menu, .right-content").length == 2){
			$('.right-content>.content').css('min-height', (screenH - parseInt(footerHeight)) - 71);
		}
		if($('.panel-cut').length > 0){
			$('.panel-cut').css('min-height', (screenH - parseInt(footerHeight))-71);
		}
	}
	var we7_stats = document.createElement('script');
	we7_stats.src = '//tongji.w7.cc/s.php?sid=3';
	var s = document.getElementsByTagName("script")[0];
	s.parentNode.insertBefore(we7_stats, s);
});