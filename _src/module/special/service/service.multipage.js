angular.module('specialApp').service('serviceMultiPage', ['$rootScope', 'serviceCommon', 'serviceBase', 'serviceSpecialBase', '$window', function($rootScope, serviceCommon, serviceBase, serviceSpecialBase, $window){
	var serviceMultiPage = {};
	serviceMultiPage.insertPage = function () {
		serviceMultiPage.saveCurPage();
		var allPages = serviceSpecialBase.getBaseData('allPages');
		var activePageIndex = serviceSpecialBase.getBaseData('activePageIndex');
		allPages[activePageIndex].active = false;
		allPages.push({'property' : [], 'active' : true});
		$(".app-content").css('height', '568px');
		activePageIndex = _.findIndex(allPages, {'active' : true});

		serviceBase.setBaseData({'activeModules' : [], 'pageLength' : 1});
		serviceSpecialBase.setBaseData({'allPages' : allPages, 'isMultiPage' : true, 'isLongPage' : false, 'activePageIndex' : activePageIndex});

		$rootScope.$broadcast('updateScope', {'allPages' : allPages, 'isMultiPage' : true, 'isLongPage' : false, 'pageLength' : 1, 'activePageIndex' : activePageIndex, 'activeModules' : []});
	};
	serviceMultiPage.navToPage = function (index) {
		var activePageIndex = serviceSpecialBase.getBaseData('activePageIndex');
		if (activePageIndex == index) {
			return false;
		}
		serviceMultiPage.saveCurPage();
		var allPages = serviceSpecialBase.getBaseData('allPages');
		var activeModules = allPages[index].property;

		allPages[activePageIndex].active = false; 	// 上页取消激活
		allPages[index].active = true; 						// 当前页面激活
		activePageIndex = index; 							// 新的页码
		serviceBase.setBaseData('activeModules', activeModules);
		serviceBase.setBaseData('activeItem', activeModules[0]);
		serviceSpecialBase.setBaseData({'allPages' : allPages, 'activePageIndex' : activePageIndex});

		$rootScope.$broadcast('updateScope', {'allPages' : allPages, 'activePageIndex' : activePageIndex, 'activeModules' : activeModules});
	};
	serviceMultiPage.removePage = function (index) {
		var activeModules = [];
		var allPages = serviceSpecialBase.getBaseData('allPages');
		var multipage = serviceSpecialBase.getBaseData('multipage');
		// 仅剩一页不可删除
		if (allPages.length == 1) {
			return false;
		}
		serviceMultiPage.saveCurPage();
		multipage.splice(parseInt(index), 1);		// 删除页面html
		var items = _.clone(allPages);
		var length = allPages.length - 1;
		var active = length - index;
		allPages = [];
		for(var i in items) {
			if(i != index) {
				switch(active) {
					case 0:
						if((parseInt(i) + 1) == index) {
							allPages.push({'property' : items[i].property, 'active' : true});
							activeModules = items[i].property;
						}else {
							allPages.push({'property': items[i].property, 'active' : false});
						}
					break;
					default:
						if(i - 1 == index) {
							allPages.push({'property' : items[i].property, 'active' : true});
							activeModules = items[i].property;
						}else {
							allPages.push({'property': items[i].property, 'active' : false});
						}
					break;
				}
			}
		}
		// 当前页码
		activePageIndex = _.findIndex(allPages, {'active' : true});

		// 删除成功后，仅剩一页，可为长页面
		if (allPages.length == 1) {
			serviceSpecialBase.setBaseData({'isMultiPage' : true, 'isLongPage' : true});
			$rootScope.$broadcast('updateScope', {'isMultiPage' : true, 'isLongPage' : true});
		}
		serviceBase.setBaseData('activeModules', activeModules);
		serviceSpecialBase.setBaseData({'allPages' : allPages, 'activePageIndex' : activePageIndex});

		$rootScope.$broadcast('updateScope', {'allPages' : allPages, 'activePageIndex' : activePageIndex, 'activeModules' : activeModules});
	};
	serviceMultiPage.copyPage = function (index, $event) {
		serviceMultiPage.saveCurPage();
		var baseIndex = serviceBase.getBaseData('index');
		var allPages = serviceSpecialBase.getBaseData('allPages');
		var multipage = serviceSpecialBase.getBaseData('multipage');
		multipage.splice(parseInt(index), 0, multipage[index]);	// 复制html
		var items = angular.copy(allPages);

		allPages = [];
		for(var i in items) {
			if( i == index) {
				allPages.push({'property' : items[i].property, 'active' : false});
				var copyProperty = angular.copy(items[i].property);
				for(var j in copyProperty){
					copyProperty[j].index = baseIndex++;
				}
				allPages.push({'property' : copyProperty, 'active' : true});
				var activeModules = copyProperty;		// activeModules得变为复制页
			}else {
				allPages.push({'property' : items[i].property, 'active' : false});
			}
		}
		// 当前页码
		activePageIndex = _.findIndex(allPages, {'active' : true});

		serviceBase.setBaseData('activeModules', activeModules);
		serviceBase.setBaseData('index', baseIndex);	// 记得更新index(模块id一直递增)
		serviceSpecialBase.setBaseData({'allPages' : allPages, 'multipage' : multipage, 'isMultiPage' : true, 'isLongPage' : false, 'activePageIndex' : activePageIndex});

		// 阻止事件传播，不可去掉
		$event.stopPropagation();

		$rootScope.$broadcast('updateScope', {'allPages' : allPages, 'isMultiPage' : true, 'isLongPage' : false, 'activePageIndex' : activePageIndex, 'activeModules' : activeModules});
	};
	serviceMultiPage.saveCurPage = function () {
		var activeModules = serviceBase.getBaseData('activeModules');
		var pageLength = serviceBase.getBaseData('pageLength');
		var allPages = serviceSpecialBase.getBaseData('allPages');
		var multipage = serviceSpecialBase.getBaseData('multipage');

		var activePageNumb = _.findIndex(allPages, {'active' : true});
		var html = '';
		var temp = $($('.modules').html());
		temp.find("div.ng-scope[ng-controller$='Ctrl']").each(function(){
			var curModule = $(this).parent().parent();
			var i = _.findIndex(activeModules, {'index' : parseInt(curModule.attr('index'))});
			var widgetHtml = '';
			var widgetParams = angular.copy(activeModules[i]['params']);
			$(this).find('.js-default-content').remove();
			$(this).find('.bar').remove();
			var type = curModule.attr('name').toLowerCase();

			if(type != 'header'){
				// 获取position属性，jquery-ui 中设置，无法捕获，我们在最终调整结束，手动设置 params 
				var curTop = $(this).css('top');
				var curLeft = $(this).css('left');
				var curWidth = $(this).css('width');
				var curHeight = $(this).css('height');
				var positionStyle = 'position:absolute;top:'+curTop+';left:'+curLeft+';width:'+curWidth+';height:'+curHeight+';';
				activeModules[i].params.positionStyle.top = parseInt(curTop);
				activeModules[i].params.positionStyle.left = parseInt(curLeft);
				activeModules[i].params.positionStyle.width = parseInt(curWidth);
				activeModules[i].params.positionStyle.height = parseInt(curHeight);
				activeModules[i]['positionStyle'] = positionStyle;
			}else{
				// 保存页面长度，记录在每页的header上
				activeModules[i].params.pageLength = pageLength;
			}

			switch(type){
				case 'link':
					var $this = this;
					angular.forEach(widgetParams.items, function (value, key) {
						if (value['selectCate']['pid'] || value['selectCate']['cid']) {
							$($this).find('.list-group').children().eq(key).replaceWith('<div>'+serviceCommon.buildDataTagBegin('link', value)+'<div class="list-group-item ng-scope"><a href="\{$row[url]\}" class="clearfix"><span class="app-nav-title"> \{$row[title]\}<i class="pull-right fa fa-angle-right"></i></span></a></div>'+serviceCommon.buildDataTagEnd()+'</div>');
						}
					});
					break;
				case 'richtext':
					if (activeModules[i]) {
						activeModules[i]['params']['content'] = '';
					}
					break;
			}
			widgetHtml = $(this).html();
			// 兼容旧版
			if(!serviceBase.getBaseData('isNew')){
				// 所有的top减去64(header头)
				var h5Top = parseInt(curTop) - 64;
				$(this).css('top', h5Top+'px')
			}
			if(type != 'header') {
				var positionStyle = $(this).attr('style');
				html += '<div type="'+type+'" style="'+positionStyle+'">'+widgetHtml+'</div>';
			}
		});
		html = html.replace(/<\!\-\-([^-]*?)\-\->/g, '');
		html = html.replace(/ ng\-[a-zA-Z-]+=\"[^\"]*\"/g, '');
		html = html.replace(/ ng\-[a-zA-Z]+/g, '');
		multipage[activePageNumb] = html; 	// 记录html
		allPages[activePageNumb].property = activeModules;		// 记录activeModules

		serviceBase.setBaseData('activeModules', activeModules);
		serviceSpecialBase.setBaseData({'allPages' : allPages, 'multipage' : multipage});
		$rootScope.$broadcast('updateScope', {'activeModules' : activeModules, 'allPages' : allPages, 'multipage' : multipage});
	};
	return serviceMultiPage;
}]);