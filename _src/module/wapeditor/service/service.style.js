angular.module('wapeditorApp').service('serviceSetStyle', ['$rootScope', '$timeout', 'serviceCommon', 'config', function($rootScope, $timeout, serviceCommon, config){
	var serviceSetStyle = {};
	var i = 1;//initStyleParams()函数初始化位置时使用
	serviceSetStyle.defBaseStyle = { 'backgroundColor' : 'rgba(0,0,0,0)', 'color' : '#000', 'opacity' : 0, 'paddingTop' : 0, 'lineHeight' : 2, 'fontSize': 14, 'textAlign': "left", 'lock' : false};
	serviceSetStyle.defBorderStyle = { 'borderWidth' : 0, 'borderRadius' : 2, 'borderStyle' : 'solid', 'borderColor' : 'rgba(0,0,0,1)', 'transform' : 0 };
	serviceSetStyle.defShadowStyle = { 'shadowSize': 0, 'shadowBlur': 0, 'shadowColor': "rgba(0,0,0,0.5)", 'shadowDirection': 1 };
	serviceSetStyle.defAnimationStyle = { 'animationName' : 'noEffect', 'animationDuration' : 1, 'animationTimingFunction' : 'ease', 'animationDelay' : 0.6, 'animationFillMode' : 'both'};
	serviceSetStyle.defPositionStyle = { 'top' : 259, 'left' : 40, 'width' : 240, 'height' : 50};
	//专题样式初始化
	serviceSetStyle.initStyleParams = function(params) {
		var middleParams = {};
		var middleParams = angular.copy(params);
		middleParams.baseStyle = $.extend(false, serviceSetStyle.defBaseStyle, params.baseStyle);
		middleParams.borderStyle = $.extend(false, serviceSetStyle.defBorderStyle, params.borderStyle);
		middleParams.shadowStyle = $.extend(false, serviceSetStyle.defShadowStyle, params.shadowStyle);
		middleParams.animationStyle = $.extend(false, serviceSetStyle.defAnimationStyle, params.animationStyle);
		middleParams.positionStyle = $.extend(false, serviceSetStyle.defPositionStyle, params.positionStyle);
		if($('.app-preview').scrollTop() > 0) {
			middleParams.positionStyle.top += parseInt($('.app-preview').scrollTop());
		}
		middleParams.positionStyle.left > 200 ? middleParams.positionStyle.left = 10 : middleParams.positionStyle.left += 5*i;
		middleParams.positionStyle.top += 5*i;
		i > 20 ? i = 1 : i++;
		return middleParams;
	};
	//会员中心样式初始化
	serviceSetStyle.UcInitStyleParams = function(params) {
		var middleParams = {};
		var middleParams = angular.copy(params);
		middleParams.baseStyle = $.extend(false, serviceSetStyle.defBaseStyle, params.baseStyle);
		middleParams.borderStyle = $.extend(false, serviceSetStyle.defBorderStyle, params.borderStyle);
		middleParams.shadowStyle = $.extend(false, serviceSetStyle.defShadowStyle, params.shadowStyle);
		middleParams.animationStyle = $.extend(false, serviceSetStyle.defAnimationStyle, params.animationStyle);
		middleParams.positionStyle = $.extend(false, serviceSetStyle.defPositionStyle, params.positionStyle);
		if($('.app-preview').scrollTop() > 0) {
			middleParams.positionStyle.top += parseInt($('.app-preview').scrollTop());
		}
		middleParams.positionStyle.left > 200 ? middleParams.positionStyle.left = 10 : middleParams.positionStyle.left += 5*i;
		middleParams.positionStyle.top += 5*i - $('.app-usercenter').height();
		i > 10 ? i = 1 : i++;
		return middleParams;
	};
	serviceSetStyle.initSetStyle = function(params){
		serviceSetStyle.setModuleBaseStyle(params.baseStyle);
		serviceSetStyle.setModuleBorderStyle(params.borderStyle);
		serviceSetStyle.setModuleShadowStyle(params.shadowStyle);
		serviceSetStyle.setModulePositionStyle(params.positionStyle);
		serviceSetStyle.setModuleAnimationStyle(params.animationStyle);
	}
	serviceSetStyle.setModuleBaseStyle = function(baseStyle) {
		baseStyle = $.extend(false, serviceSetStyle.defBaseStyle, baseStyle);
		var newBaseStyle = '';
		for(var i in baseStyle){
			switch(i) {
				case 'fontSize':
					if( typeof baseStyle[i] == 'number') {
						newBaseStyle += serviceCommon.getCssname(i)+":"+parseInt(baseStyle[i])+"px;";
					}else {
						baseStyle[i].search(/rem/) ? newBaseStyle += serviceCommon.getCssname(i)+":14px;" : newBaseStyle += serviceCommon.getCssname(i)+":"+parseInt(baseStyle[i])+"px;";
					}
				case 'paddingTop':
				case 'paddingBottom':
					newBaseStyle += serviceCommon.getCssname(i)+":"+parseInt(baseStyle[i])+"px;";
					break;
				case 'backgroundColor':
				case 'color':
				case 'textAlign':
				case 'lineHeight':
					newBaseStyle += serviceCommon.getCssname(i)+":"+baseStyle[i]+";";
					break;
				case 'opacity':
					newBaseStyle += serviceCommon.getCssname(i)+":"+(100-parseInt(baseStyle[i]))/100+";";
					break;
			}
		}
		$rootScope.$broadcast('serviceBase.activeItem.style.update', 'baseStyle', baseStyle, newBaseStyle);
	};
	serviceSetStyle.setModuleBorderStyle = function(borderStyle) {
		borderStyle = $.extend(false, serviceSetStyle.defBorderStyle, borderStyle);
		var newBorderStyle = newTransformStyle = '';
		for ( var i in borderStyle) {
			switch (i) {
				case 'borderWidth':
				case 'borderRadius':
					newBorderStyle += serviceCommon.getCssname(i)+":"+parseInt(borderStyle[i])+"px;";
					break;
				case 'borderStyle':
				case 'borderColor':
					newBorderStyle += serviceCommon.getCssname(i)+":"+borderStyle[i]+";";
					break;
				case 'transform':
					newTransformStyle += 'transform: rotateZ('+parseInt(borderStyle[i])+'deg);';
					break;
			}
		}
		$rootScope.$broadcast('serviceBase.activeItem.style.update', 'borderStyle', borderStyle, newBorderStyle, newTransformStyle);
	};
	serviceSetStyle.setModuleShadowStyle = function(shadowStyle) {
		shadowStyle = $.extend(false, serviceSetStyle.defShadowStyle, shadowStyle);
		var newShadowStyle = '';
		var shadowX = shadowY = 0;
		shadowX = -Math.sin(shadowStyle.shadowDirection * Math.PI / 180) * shadowStyle.shadowSize;
		shadowY = Math.cos(shadowStyle.shadowDirection * Math.PI / 180) * shadowStyle.shadowSize;
		newShadowStyle = 'box-shadow: '+shadowX+'px '+shadowY+'px '+shadowStyle.shadowBlur+'px '+shadowStyle.shadowColor+';';
		$rootScope.$broadcast('serviceBase.activeItem.style.update', 'shadowStyle', shadowStyle, newShadowStyle);
	};
	serviceSetStyle.setModuleAnimationStyle = function(animationStyle) {
		animationStyle = $.extend(false, serviceSetStyle.defAnimationStyle, animationStyle);
		var newAnimationStyle = '';
		var animateValue = animationStyle.animationName+' '+animationStyle.animationDuration+'s '+animationStyle.animationTimingFunction+' '+animationStyle.animationDelay+'s '+animationStyle.animationFillMode;
		newAnimationStyle = serviceSetStyle.cssCompatible('animation', animateValue);
		$rootScope.$broadcast('serviceBase.activeItem.style.update', 'animationStyle', animationStyle, newAnimationStyle);
	};
	serviceSetStyle.setModulePositionStyle = function(positionStyle) {
		positionStyle = $.extend(false, serviceSetStyle.defPositionStyle, positionStyle);
		var newPositionStyle = 'position:absolute;';
		for ( var i in positionStyle) {
			switch (i) {
				case 'top':
				case 'left':
				case 'width':
				case 'height':
					newPositionStyle += ' '+i+': '+positionStyle[i]+'px;';
					break;
			}
		}
		$rootScope.$broadcast('serviceBase.activeItem.style.update', 'positionStyle', positionStyle, newPositionStyle);
	};
	serviceSetStyle.clearModuleStyle = function(item) {
		item.params.baseStyle = item.originParams.baseStyle;
		item.params.borderStyle = item.originParams.borderStyle;
		item.params.shadowStyle = item.originParams.shadowStyle;
		item.params.animationStyle = item.originParams.animationStyle;
		$rootScope.$broadcast('serviceBase.activeItem.update', item);
	};
	serviceSetStyle.eleAnimationIns = function(animationName) {
		var animateCssName = serviceCommon.getCssname(animationName);
		// 等待页面渲染，改变select状态
		$timeout(function(){
			$('.'+animateCssName).parent().addClass('select').siblings('.select').removeClass('select');
		}, 100);
		$rootScope.$broadcast('serviceBase.activeItem.animationName.update', animationName);
	};
	// 手动同步，当前页面所有模块的positionStyle - 右键菜单需要。但可能其他地方也会使用到
	serviceSetStyle.savePagePosition = function(activeModules) {
		$('.modules').find("div.ng-scope[ng-controller$='Ctrl']").each(function(){
			var curModule = $(this).parent().parent();
			var i = _.findIndex(activeModules, {'index' : parseInt(curModule.attr('index'))});
			var curTop = $(this).css('top');
			var curLeft = $(this).css('left');
			var curWidth = $(this).css('width');
			var curHeight = $(this).css('height');
			var positionStyle = 'position:absolute;top:'+curTop+';left:'+curLeft+';width:'+curWidth+';height:'+curHeight+';';
			activeModules[i]['params']['positionStyle']['top'] = parseInt(curTop);
			activeModules[i]['params']['positionStyle']['left'] = parseInt(curLeft);
			activeModules[i]['params']['positionStyle']['width'] = parseInt(curWidth);
			activeModules[i]['params']['positionStyle']['height'] = parseInt(curHeight);
			activeModules[i]['positionStyle'] = positionStyle;
		});
		$rootScope.$broadcast('serviceBase.activeModules.update', activeModules);
	};
	// 手动同步，当前模块的positionStyle - 部分组件需要
	serviceSetStyle.saveModulePosition = function(activeItem) {
		var moduleId = '#module-' + activeItem.index;
		var obj = $(moduleId).find("div.ng-scope[ng-controller$='Ctrl']");
		var curTop = obj.css('top');
		var curLeft = obj.css('left');
		var curWidth = obj.css('width');
		var curHeight = obj.css('height');
		var positionStyle = 'position:absolute;top:'+curTop+';left:'+curLeft+';width:'+curWidth+';height:'+curHeight+';';
		activeItem['params']['positionStyle']['top'] = parseInt(curTop);
		activeItem['params']['positionStyle']['left'] = parseInt(curLeft);
		activeItem['params']['positionStyle']['width'] = parseInt(curWidth);
		activeItem['params']['positionStyle']['height'] = parseInt(curHeight);
		activeItem['positionStyle'] = positionStyle;
		$rootScope.$broadcast('serviceBase.activeItem.update', activeItem);
		return activeItem;
	};
	// 特殊属性修改，调用方法
	serviceSetStyle.changeTextAlign = function(activeItem, val){
		activeItem.params.baseStyle.textAlign = val;	
		$rootScope.$broadcast('serviceBase.activeItem.update', activeItem);
	};
	serviceSetStyle.changeBorderWidth = function(activeItem) {
		if(activeItem.id == 'adImg' || activeItem.id == 'cube' || activeItem.id == 'title' || activeItem.id == 'textNav' || activeItem.id == 'link' || activeItem.id == 'audio'){
			$timeout(function(){
				var newActiveItem = serviceSetStyle.saveModulePosition(activeItem);
				newActiveItem.positionStyle.height += newActiveItem.borderStyle.borderWidth*2;
				if(activeItem.id == 'audio'){
					newActiveItem.positionStyle.height += 20; 	// 有多余的20padding
				}
				serviceSetStyle.setModulePositionStyle(newActiveItem.params.positionStyle);
			}, 100);
		}	
	};
	serviceSetStyle.changeInnerHeight = function(activeItem) {
		$timeout(function(){
			var newActiveItem = serviceSetStyle.saveModulePosition(activeItem);
			var index = newActiveItem.index;
			var innerDiv = $('#module-'+index).find('.inner');
			var height = parseInt(innerDiv.css('height'));
			height += newActiveItem.params.borderStyle.borderWidth*2;
			newActiveItem.params.positionStyle.height = height;
			serviceSetStyle.setModulePositionStyle(newActiveItem.params.positionStyle);
		}, 100);
	};
	// 激活header调用。调整页面长度也使用
	serviceSetStyle.changePageLength = function(val, activeModules) {
		var val = parseInt(val);
		var isMultiPage =  val > 1 ? false : true;
		var pageLength = val;
		// 这里实在不清楚为什么，不知道angular的渲染机制是啥.. '.app-content' 确实是可以获取到的
		$timeout(function(){
			$(".app-content").css('height', 568*val + 'px');
		}, 100);
		activeModules[serviceCommon.getHeaderIndex(activeModules)].params.pageLength = val;
		$rootScope.$broadcast('updateScope', {'isMultiPage' : isMultiPage, 'pageLength' : pageLength, 'activeModules' : activeModules});	// 使用事件捕捉
		return activeModules; 		// 暂时返回，因为要同时修改 baseService 中的activeModules
	};
	serviceSetStyle.cssCompatible = function(type, value) {
		var newTypeStyle = '';
		if(angular.isString(type) && angular.isString(value)) {
			newTypeStyle = 	type + ': ' + value
							+';-webkit-'+ type +': ' + value
							+ ';-moz-'+ type + ': ' + value
							+ ';-o-' + type + ': ' + value
							+ ';-ms-' + type + ': ' + value + ';';
			return newTypeStyle;
		}
	};

	return serviceSetStyle;
}]);