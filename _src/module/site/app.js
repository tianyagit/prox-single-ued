angular.module('wesiteApp', ['we7app']);
//微官网列表
angular.module('wesiteApp').controller('WesiteDisplay', ['$scope', '$http', 'serviceCommon',  'config', function($scope, $http, serviceCommon, config) {
	$scope.default_site = config.default_site;
	$scope.multis = config.multis;
	$scope.links = config.links;
	angular.forEach($scope.multis, function(v, k) {
		v.copyLink = $scope.links.appHome+'t='+v.id;
	});
	
	$scope.preview = function(id) {
		var id = parseInt(id);
		var content = '<iframe width="320px" scrolling="yes" height="480px" frameborder="0" src="about:blank"></iframe>';
		var footer ='<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>';
		var dialog = util.dialog('预览模板', content, footer);
		var url = $scope.links.appHome+ '&t=' + id;
		dialog.find('iframe').attr('src', url);
		dialog.find('.modal-dialog').css({'width': '322px'});
		dialog.find('.modal-body').css({'padding': '0', 'height': '480px'});
		dialog.modal('show');
	};

	$scope.switchOn = function(multi, id) {
		var index = _.indexOf($scope.multis, multi);
		var id = parseInt(id);
		if(index > -1) {
			$http.post($scope.links.switch, {'id' : id})
				.success(function(data){
					if(data.message.errno == 0) {
						$scope.multis[index].status = $scope.multis[index].status == 1 ? '0' : '1';
						util.message('修改成功！');
					}
				});
		}
	};

	$scope.success = function(id) {
		var id = parseInt(id);
		var obj = $('<span class="label label-success" style="position:absolute;z-index:10"><i class="fa fa-check-circle"></i> 复制成功</span>');
		serviceCommon.copySuccess(id, obj);
	};
}]);
//微官网编辑
angular.module('wesiteApp').controller('WesitePost', [
	'$scope', 
	'config', 
	'$http', 
	'serviceCommon', 
	'serviceHomeMenuBase', 
	'serviceQuickMenuBase', 
	'serviceQuickMenuSubmit', 
	function($scope, config, $http, serviceCommon, serviceHomeMenuBase, serviceQuickMenuBase, serviceQuickMenuSubmit) {
	$scope.links = config.links;
	$scope.attachurl = config.attachurl;
	//默认微站ID
	$scope.default_site = config.default_site;
	//所有模板分类
	$scope.temtypes = config.temtypes;
	//选中的模板分类（初始化为全部）
	$scope.temtype = {name: 'all', 'title': '全部'};
	$scope.searchedStyleName = '';

	//1、基础信息multi scope
	$scope.multi = config.multi;
	$scope.styles = config.styles;

	//2、微官网入口entrance scope
	$scope.siteEntrance = $scope.links.murl+'t='+$scope.multi.id;

	//3、幻灯片slide scope
	$scope.slideLists = [];
	$scope.showSlideSubmit = false;

	//4、导航菜单homemenu scope
		//切换编辑状态/列表状态
	$scope.addHomemenuStatus = false;
		//列表总menu
	$scope.homeMenu = [];
	$scope.sections = serviceHomeMenuBase.initSections();
		//编辑时menuInfo
	$scope.menuInfo = serviceHomeMenuBase.initHomemenuInfo();

	//5、底部快捷菜单quickmenu scope
	$scope.activeItem = {};
	$scope.modules = {};
	$scope.quickMenuStatus = true;
	$scope.hasIgnoreModules = 0;
	$scope.submit = {};

	//2、entrance Functions
	$scope.success = function(id) {
		var id = parseInt(id);
		var obj = $('<span class="label label-success" style="position:absolute;z-index:10;width:90px;height:34px;line-height:28px;"><i class="fa fa-check-circle"></i> 复制成功</span>');
		serviceCommon.copySuccess(id, obj);
	};
	//1、multi Functions
	$scope.selectStyle = function(style) {
		$scope.multi.style = style;
	};
	$scope.searchStyle = function() {
		$http.post($scope.links.searchStyleLink, {name: $scope.searchedStyleName})
			.success(function(data){
				if(data.message.errno == 0) $scope.styles = data.message.message;
			})
	};
	$scope.changeMultiStatus = function() {
		$scope.multi.status = $scope.multi.status == 1 ? 0 : 1;
	};
	$scope.uploadMultiImage = function() {
		require(['fileUploader'], function(uploader){
			uploader.init(function(imgs){
					$scope.multi.site_info.thumb = imgs.url;
					$scope.$apply($scope.multi.site_info);
			}, {'direct' : true, 'multiple' : false});
		});
	};
	$scope.delMultiImage = function() {
		$scope.multi.site_info.thumb = '';
	};
	//3、slide Functions
	$scope.loadSlideInfo = function() {
		$http.post($scope.links.slideDisplay, {multiid: config.multiid})
			.success(function(data) {
				if(data.message.errno == 0) {
					$scope.slideLists = data.message.message;
					if(!_.isEmpty($scope.slideLists)) $scope.showSlideSubmit = true;
				}
			});
	};
	$scope.addSlide = function() {
		$scope.slideLists.push({
			title: '',
			displayorder: 0,
			thumb: '',
			url: ''
		});
		$scope.showSlideSubmit = true;
	};
	$scope.delSlide = function(list) {
		var index = _.indexOf($scope.slideLists, list);
		if(index > -1) {
			$scope.slideLists = _.without($scope.slideLists, $scope.slideLists[index]);
		}
		if(_.isEmpty($scope.slideLists)) $scope.showSlideSubmit = false;
	};
	$scope.uploadSlideImage = function(list) {
		var index = _.indexOf($scope.slideLists, list);
		if(index > -1){
			require(['fileUploader'], function(uploader){
				uploader.init(function(imgs){
						$scope.slideLists[index].thumb = imgs.url;
						$scope.$apply($scope.slideLists);
				}, {'direct' : true, 'multiple' : false});
			});
		}else{
			util.message('参数错误，请刷新页面重试！');
		}
	};
	$scope.delSlideImage = function(list) {
		var index = _.indexOf($scope.slideLists, list);
		if(index > -1){
			$scope.slideLists[index].thumb = '';
		}
	};
	$scope.saveSlide = function() {
		$http.post($scope.links.slidePost, {slide: $scope.slideLists, multiid: config.multiid})
			.success(function(data){
				if(data.message.errno == 0){
					util.message(data.message.message);
				}else{
					util.message(data.message.message);
				}
			});
	};
	//4、homemenu Functions
	$scope.loadHomemenuInfo = function(){
		$http.post($scope.links.homeMenuDisplay, {multiid: config.multiid}, {cache: false})
			.success(function(data){
				if(data.message.errno == 0) {
					$scope.homeMenu = data.message.message;
					$scope.addHomemenuStatus = false;
				}
			});
	};
	$scope.changeHomemenuStatus = function(menu) {
		$scope.addHomemenuStatus = !$scope.addHomemenuStatus;
		if(!_.isEmpty(menu)) {
			$scope.menuInfo = menu;
			var index = parseInt($scope.menuInfo.section);
			index = (index <= 10 && index >= 0) ? index : 0;
			$scope.menuInfo.section = $scope.sections[index];
			if(!_.isEmpty($scope.menuInfo.icon)) {
				$scope.menuInfo.icontype = 2;
			}else {
				$scope.menuInfo.icontype = 1;
			}
		}else {
			$scope.menuInfo = serviceHomeMenuBase.initHomemenuInfo();
		}
	};
	$scope.updateMenu = function(menu, type) {
		var id = parseInt(menu.id);
		var index = _.indexOf($scope.homeMenu, menu);
		if(index > -1) {
			switch(type){
				case 'del':
					$http.post($scope.links.homeMenuDel, {id: id})
						.success(function(data){
							if(data.message.errno == 0){
								util.message('删除成功！');
								$scope.homeMenu = _.without($scope.homeMenu, menu);
							}else{
								if(data.message.errno == -1) util.message('本公众号不存在该导航！');
								if(data.message.errno == 1) util.message('删除失败，请稍候重试。');
							}
						});
					break;
				case 'switch':
					$http.post($scope.links.homeMenuSwith, {id: id})
						.success(function(data){
							if(data.message.errno == 0){
								$scope.homeMenu[index].status = !$scope.homeMenu[index].status;
							}else{
								if(data.message.errno == -1) util.message('本公众号不存在该导航！');
								if(data.message.errno == 1) util.message('更新失败，请稍候重试。');
							}
						});
					break;
			}
		}
	};
	$scope.uploadHomemenuImage = function(menuInfo) {
		require(['fileUploader'], function(uploader){
			uploader.init(function(imgs){
					$scope.menuInfo.icon = imgs.attachment;
					$scope.$apply($scope.menuInfo);
			}, {'direct' : true, 'multiple' : false});
		});
	};
	$scope.delHomemenuImage = function(menuInfo) {
		$scope.menuInfo.icon = '';
	};
	$scope.selectHomemenuIcon = function() {
		util.iconBrowser(function(ico){
			$scope.menuInfo.css.icon.icon = ico;
			$scope.$apply($scope.menuInfo.css);
		});
	};
	$scope.saveMenu = function() {
		$http.post($scope.links.homeMenuPost, {menu_info: $scope.menuInfo, multiid: config.multiid})
			.success(function(data){
				if(data.message.errno == 0){
					util.message('导航菜单保存成功！');
					$scope.loadHomemenuInfo();
				}else{
					if(data.message.errno == 1)	util.message('保存失败！');
					if(data.message.errno == -1) util.message('抱歉，请输入导航菜单的名称！');
				}
			});
	};
	$scope.successMenu = function(id) {
		var id = parseInt(id);
		var obj = $('<span class="label label-success" style="position:absolute;z-index:10;width:80px;margin-left:10px"><i class="fa fa-check-circle"></i> 复制成功</span>');
		serviceCommon.copySuccess(id, obj);
	};
	//5、quickmenu Functions
	$scope.quickMenuSwitch = function() {
		$scope.quickMenuStatus = !$scope.quickMenuStatus;
	}
	$scope.loadQuickmenuInfo = function(){
		$http.post($scope.links.quickMenuDisplay, {multiid: config.multiid})
			.success(function(data){
				if(data.message.errno == 0) {
					$scope.activeItem = data.message.message.params;
					if (!$scope.activeItem.position) {
						$scope.activeItem.position = {'homepage' : false, 'page' : false, 'article' : false}
					} else {
						$scope.activeItem.position.homepage = $scope.activeItem.position.homepage ? true : false;
						$scope.activeItem.position.page = $scope.activeItem.position.page ? true : false;
						$scope.activeItem.position.article = $scope.activeItem.position.article ? true : false;
					}
					serviceQuickMenuBase.initActiveItem($scope.activeItem);
					$scope.modules = data.message.message.modules;
					$scope.quickMenuStatus = data.message.message.status;
					$scope.hasIgnoreModules = _.size($scope.activeItem.ignoreModules);
				}else {
					util.message('请求错误：微站不存在，请按“Ctrl+F5”刷新重试！');
				}
			})
	};
	$scope.saveQucikMenu = function() {
		$scope.submit = serviceQuickMenuSubmit.submit();

		$http.post($scope.links.quickMenuPost, {multiid: config.multiid, postdata: $scope.submit, status: $scope.quickMenuStatus ? 1 : 0})
			.success(function(data){
				if(data.message.errno == 0) {
					util.message('保存成功。您可点击“预览刷新”查看效果！');
				} else {
					util.message(data.message.message);
				}
			});
	};
	$scope.showSearchModules = function() {
		$scope.moduleDialog = $('#shop-modules-modal').modal();
		$('#shop-modules-modal .modal-body .btn-primary').html('取消');
		$('#shop-modules-modal').find('.modal-footer .btn-primary').unbind('click').click(function(){
			$scope.activeItem.ignoreModules = {};
			$('#shop-modules-modal .modal-body .btn-primary').each(function(){
				$scope.hasIgnoreModules = true;
				$scope.activeItem.ignoreModules[$(this).attr('js-name')] = {'name' : $(this).attr('js-name'), 'title' : $(this).attr('js-title')};
			});
			$scope.$apply('activeItem');
			$scope.$apply('hasIgnoreModules');
			serviceQuickMenuBase.setQuickMenuData('ignoreModules', $scope.activeItem.ignoreModules);
		});
	};
	$scope.selectNavStyle = function(){
		var newval = $('#shop-nav-modal .alert input[type="radio"]:checked').val();
		$scope.activeItem.navStyle = serviceQuickMenuBase.selectNavStyle(newval);
	};
	$scope.addMenu = function() {
		$scope.activeItem.menus = serviceQuickMenuBase.addMenu();
	};
	$scope.addSubMenu = function(menu) {
		var index = _.findIndex($scope.activeItem.menus, menu);
		$scope.activeItem.menus[index].submenus = serviceQuickMenuBase.addSubMenu(menu);
	};
	$scope.removeMenu = function(menu) {
		$scope.activeItem.menus = serviceQuickMenuBase.removeMenu(menu);
	};
	$scope.removeSubMenu = function(index, submenu) {
		serviceQuickMenuBase.removeSubMenu(index,submenu);
		$scope.activeItem.menus[index].submenus = _.without($scope.activeItem.menus[index].submenus, submenu);
	};
}]);
//微官网模板列表
angular.module('wesiteApp').controller('WesiteTplDidplay', [
	'$scope', 
	'config', 
	function($scope, config) {
	$scope.stylesResult = config.stylesResult;
	$scope.temtypes = config.temtypes;
	$scope.type = config.type;
	$scope.setting = config.setting;
	$scope.links = config.links;
	//预览风格时,预览的是默认微站的导航链接和快捷操作
	$scope.preview = function(styleid) {
		var styleid = parseInt(styleid);
		var content = '<iframe width="320" scrolling="yes" height="480" frameborder="0" src="about:blank"></iframe>';
		var footer =
				'			<a href="'+$scope.links.default+'&styleid=' + styleid + '" class="btn btn-primary">设为默认模板</a>' +
				'			<a href="'+$scope.links.designer+'&styleid=' + styleid + '" class="btn btn-primary">设计风格</a>' +
				'			<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>';
		var dialog = util.dialog('预览模板', content, footer);
		dialog.find('iframe').on('load', function(){
			$('a', this.contentWindow.document.body).each(function(){
				var href = $(this).attr('href');
				if(href && href[0] != '#') {
					var arr = href.split(/#/g);
					var url = arr[0];
					if(url.slice(-1) != '&') {
						url += '&';
					}
					if(url.indexOf('?') != -1) {
						url += ('s=' + styleid);
					}
					if(arr[1]) {
						url += ('#' + arr[1]);
					}
					if (url.substr(0, 10) == 'javascript' || url.indexOf('?') == -1) {
						url = url.substr(0, url.lastIndexOf('&'));
					}
					$(this).attr('href', url);
				}
			});
		});
		var url = $scope.links.home+ '&s=' + styleid;
		dialog.find('iframe').attr('src', url);
		dialog.find('.modal-dialog').css({'width': '322px'});
		dialog.find('.modal-body').css({'padding': '0', 'height': '480px'});
		dialog.modal('show');
	};

	$scope.selectDefault = function(styleid) {
		var id = parseInt(styleid);
		location.href = $scope.links.default+ '&styleid='+ id;
	};
}]);
//微官网模板编辑
angular.module('wesiteApp').controller('WesiteTplPost', [
	'$scope', 
	'config', 
	function($scope, config) {
	$scope.style = config.style;
	$scope.styles = config.styles ? config.styles : {};
	$scope.template = config.template;
	$scope.systemtags = config.systemtags;
	$scope.customStyles = [];
	angular.forEach($scope.styles, function(v, k) {
		if(_.indexOf($scope.systemtags, v.variable) == -1) $scope.customStyles.push(v);
	});
	$scope.addCustomAttribute = function() {
		$('#customForm').append($('#item-form-html').html());
	};

	$scope.delCustomArrtibute = function(ev) {
		$(ev.target).parent().parent().remove();
	};

	$scope.uploadImage = function() {
		require(['fileUploader'], function(uploader){
			uploader.init(function(imgs){
					$scope.styles.indexbgimg = {content: imgs.url};
					$scope.$apply($scope.styles.indexbgimg.content);
			}, {'direct' : true, 'multiple' : false});
		});
	};

	$scope.delImage = function() {
		$scope.styles.indexbgimg = '';
	};

	$scope.checkSubmit = function(ev) {
		var name = $(':text[name="custom[name][]"]');
		var desc = $(':text[name="custom[desc][]"]');
		var val = $(':text[name="custom[value][]"]');
		for(var i = 0; i < name.length; i++) {
			if(_.isEmpty(name[i].value)) {
				util.message('自定义属性变量名不可为空！');
				return false;
			}
		}
		for(var j = 0; j < desc.length; j++) {
			if(_.isEmpty(desc[j].value)) {
				util.message('自定义属性变量描述不可为空！');
				return false;
			}
		}
		for(var k = 0; k < val.length; k++) {
			if(_.isEmpty(val[k].value)) {
				util.message('自定义属性变量值不可为空！');
				return false;
			}
		}
		$('#submit-post').click();
	};
}]);
//微官网文章列表
angular.module('wesiteApp').controller('wesiteArticleDisplay', [
	'$scope', 
	'config', 
	'serviceCommon',
	'$http',
	function($scope, config, serviceCommon, $http){
	$scope.category = config.category;
	$scope.articleList = config.articleList;
	$scope.commentListLink = config.commentListLink;
	$scope.articleComment = config.articleComment;
	$scope.setting = config.setting;
	$scope.commentLink = config.commentLink;
	angular.forEach($scope.articleList, function(val, key){
		if(val.pcate != 0) {
			var pcate = parseInt(val.pcate);
			if(val.ccate != 0) {
				var ccate = parseInt(val.ccate);
				if(angular.isDefined($scope.category[pcate]) && angular.isDefined($scope.category[ccate])) {
					val.title = '【'+$scope.category[pcate].name + '】-【' + $scope.category[ccate].name + '】' + val.title;
				}
			}else {
				if(angular.isDefined($scope.category[pcate])) {
					val.title = '【'+ $scope.category[pcate].name + '】' + val.title;
				}
			}
		}else {
			if(val.ccate != 0) {
				var ccate = parseInt(val.ccate);
				if(angular.isDefined($scope.category[ccate])) {
					val.title = '【'+ $scope.category[ccate].name + '】' + val.title;
				}
			}
		}
		val.link = config.copyCommonLink+val.id;
		var articlecomment = $scope.articleComment;
		val.count = (articlecomment && articlecomment[val.id]) ? $scope.articleComment[val.id].count : 0;
		$scope.articleList[key] = val;
	});

	$scope.success = function(id) {
		var id = parseInt(id);
		var obj = $('<span class="label label-success" style="position:absolute;z-index:10"><i class="fa fa-check-circle"></i> 复制成功</span>');
		serviceCommon.copySuccess(id, obj);
	};

	$scope.editArticle = function(id) {
		var id = parseInt(id);
		location.href = './index.php?c=site&a=article&do=post&id='+id;
	};

	$scope.delArticle = function(id) {
		if(confirm('此操作不可恢复，确认吗？')) {
			var id = parseInt(id);
			location.href = './index.php?c=site&a=article&do=del&id='+id;
		}
	};

	$scope.comment = function() {
		$http.post($scope.commentLink, {})
			.success(function(data){
				if (data.message.errno == 0) {
					$scope.setting.comment_status = data.message.message;
					util.message('设置成功');
				} else {
					util.message(data.message.message, data.direct);
				}
			});
	}
}]);
//微官网文章编辑
angular.module('wesiteApp').controller('WesiteArticlePost', [
	'$scope', 
	'config', 
	function($scope, config) {
	$scope.item = config.item;
	$scope.keywords = config.keywords;
	$scope.id = config.id;
	$scope.template = config.template;
	$scope.uploadImage = function() {
		require(['fileUploader'], function(uploader){
			uploader.init(function(imgs){
					$scope.item.thumb = imgs.url;
					$scope.$apply($scope.item.thumb);
			}, {'direct' : true, 'multiple' : false});
		});
	};
	$scope.delImage = function() {
		$scope.item.thumb = '';
	};
}]);
//微官网文章分类编辑
angular.module('wesiteApp').controller('WesiteCategoryPost', [
	'$scope', 
	'config', 
	function($scope, config){
	$scope.id = config.id;
	$scope.category = config.category;
	$scope.parent = config.parent;
	$scope.parentid = config.parentid;
	$scope.multis = config.multis;
	$scope.site_template = config.site_template;
	$scope.styles = config.styles;
	//是否启用状态
	if(angular.isUndefined($scope.category.enabled)) {
		$scope.enabled = true;
	}else {
		if($scope.id && $scope.category.enabled == 1) {$scope.enabled = true;}else {$scope.enabled = false;}

	}
	//导航样式类型
	if(angular.isUndefined($scope.category.icontype) || $scope.category.icontype == 0 || $scope.category.icontype == 1) {
		$scope.icontype = true;
	}else {
		$scope.icontype = false;
	}
	$scope.selectIcon = function() {
		util.iconBrowser(function(ico){
			$scope.category.css.icon.icon = ico;
			$scope.$apply($scope.category.css);
		});
	}
	$scope.showWesite = function() {
		$('.js-site-selector').show();
	};
	$scope.hideWesite = function() {
		$('.js-site-selector').hide();
	};
	$scope.changeStyle = function(id) {
		var styleId = parseInt(id);
		var title = $('.title-'+styleId).text();
		var preview = $('.preview-' + styleId).attr('src');
		$('.item-style').removeClass('active');
		$scope.category.styleid = styleId;
		$('#current-title').text(title);
		$('#current-preview').attr('src', preview);
		$('.title-'+styleId).parent().parent().addClass('active');
		$('#ListStyle').modal('hide');
		$scope.$apply($scope.category.styleid);
	};
	$scope.uploadImage = function() {
		require(['fileUploader'], function(uploader){
			uploader.init(function(imgs){
					$scope.category.icon = imgs.url;
					$scope.$apply($scope.category.icon);
			}, {'direct' : true, 'multiple' : false});
		});
	};
	$scope.delImage = function() {
		$scope.category.icon = '';
	};
}]);

//微官网文章评论
angular.module('wesiteApp').controller('articleComment',['$scope','config', '$http', function ($scope, config, $http) {
	$scope.articleId = config.articleId;
	$scope.order_sort = config.order_sort;
	$scope.is_comment = config.is_comment;
	$scope.articleList = config.articleList;
	$scope.links = config.links;
	$scope.content = '';
	$scope.replyarticle = function(comment) {
		comment.replying = true;
	}

	$scope.cancel = function(comment) {
		comment.replying = false;
	}

	$scope.send = function(comment) {
		var parentid = comment.id;
		$http.post($scope.links.reply, {'articleid': $scope.articleId, 'parentid':parentid, 'content': comment.replycontent})
			.success(function(data){
				if (data.message.errno == 0) {
					comment.son_comment.push(data.message.message);
					comment.replying = false;
					comment.replycontent = '';
				} else {
					util.message(data.message.message);
					return false;
				}
			});
	}

	$scope.changeSort = function() {
		$http.post($scope.links.display, {'order': $scope.order_sort, 'id':$scope.articleId})
			.success(function(data){
				$scope.articleList = data.message.message;
			});
	}

	$scope.changeComment = function() {
		$http.post($scope.links.display, {'iscommend': $scope.is_comment, 'id':$scope.articleId})
			.success(function(data){
				$scope.articleList = data.message.message;
			});
	}
	/*选择Emoji表情*/
	// $scope.selectEmoji = function ($event,comment) {
	// 	var options = {show:true, trigger:'manual'};
	// 	util.emotion($event.target, '', function (txt, elm, target) {
	// 		var txt = txt.replace(/\//,'[') + ']';
	// 		var reply =  comment.replycontent;
	// 		reply = (reply ? reply : '') + txt;
	// 		comment.replycontent = reply;
	// 		$scope.$digest();
	// 	}, options);
	// };
}]);
