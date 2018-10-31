angular.module('wapeditorApp').service('serviceUpwardCompatible',['$rootScope', '$timeout', 'orderByFilter', function($rootScope, $timeout, orderByFilter){
	var serviceUpwardCompatible = {};
	serviceUpwardCompatible.compatibility = function(activeModules) {
		var newActiveModules = {};
		// 兼容长页面
		if(typeof activeModules[0].params.pageHeight != 'undefined'){
			activeModules[0].params.pageLength = Math.ceil(activeModules[0].params.pageHeight / 568); //兼容上版没有pageLength
		}
		// 兼容 orderby - displayorder 排序
		activeModules = orderByFilter(activeModules, 'displayorder');
		for(var i in activeModules){
			// style[]转换为{}，解决php端保存的问题
			if(activeModules[i].params.baseStyle instanceof Array){ activeModules[i].params.baseStyle = {}; }
			if(activeModules[i].params.borderStyle instanceof Array){ activeModules[i].params.borderStyle = {}; }
			if(activeModules[i].params.shadowStyle instanceof Array){ activeModules[i].params.shadowStyle = {}; }
			if(activeModules[i].params.positionStyle instanceof Array){ activeModules[i].params.positionStyle = {}; }
			var params = angular.copy(activeModules[i].params);
			activeModules[i].animationStyle = '';
			activeModules[i].params.animationStyle = {};
			if(activeModules[i].params.animate){
				var animationName = activeModules[i].params.animate.match(/(\w+)\s1/);
				animationName ? animationName = animationName[1] : animationName = 'noEffect';
				activeModules[i].params.animationStyle.name = animationName;	// 兼容动画
			}else{
				activeModules[i].params.animationStyle.name = 'noEffect';
			}
			activeModules[i].params.animationStyle = {'name' : activeModules[i].params.animationStyle.name, 'speed' : 1, 'delay' : 0.6};
			activeModules[i].animationStyle = 'animation: '+activeModules[i].params.animate+';';

			activeModules[i].params.positionStyle = _.isEmpty(activeModules[i].params.positionStyle) ? {} : activeModules[i].params.positionStyle;
			activeModules[i].params.baseStyle = _.isEmpty(activeModules[i].params.baseStyle) ? {} : activeModules[i].params.baseStyle;
			activeModules[i].params.borderStyle = _.isEmpty(activeModules[i].params.borderStyle) ? {} : activeModules[i].params.borderStyle;
			activeModules[i].params.shadowStyle = _.isEmpty(activeModules[i].params.shadowStyle) ? {} : activeModules[i].params.shadowStyle;
			activeModules[i].baseStyle = '';
			activeModules[i].borderStyle = '';
			activeModules[i].shadowStyle = '';
			activeModules[i].positionStyle = '';
			switch (activeModules[i].id) {
				case 'onlyText':
					activeModules[i].params.baseStyle.textAlign = params.postype;
					activeModules[i].params.baseStyle.fontSize = params.baseStyle.fontsize;
					activeModules[i].params.baseStyle.lineHeight = params.baseStyle.lineheight;
					activeModules[i].params.positionStyle.left = params.positionStyle.marginleft ? params.positionStyle.marginleft : 0;
					activeModules[i].params.positionStyle.width = params.positionStyle.width ? params.positionStyle.width : 290;
					activeModules[i].params.positionStyle.height = params.positionStyle.height ? params.positionStyle.height : 0;
					activeModules[i].baseStyle = 'font-size:'+params.baseStyle.fontsize+'px;text-align:'+params.postype+';line-height:'+params.baseStyle.lineheight+';';
					break;
				case 'image':
					activeModules[i].params.positionStyle.left = params.positionStyle.marginleft ? params.positionStyle.marginleft : 0;
					activeModules[i].params.positionStyle.width = params.positionStyle.width ? params.positionStyle.width : 0;
					activeModules[i].params.positionStyle.height = params.positionStyle.height ? params.positionStyle.height : 0;
					break;
				case 'shape':
					activeModules[i].params.positionStyle.left = params.positionStyle.marginleft ? params.positionStyle.marginleft : 0;
					activeModules[i].params.positionStyle.width = params.positionStyle.width ? params.positionStyle.width : 100;
					activeModules[i].params.positionStyle.height = params.positionStyle.height ? params.positionStyle.height : 0;
					break;
				case 'pureLink':
				case 'dial':
					activeModules[i].params.baseStyle.fontSize = params.baseStyle.fontsize ? params.baseStyle.fontsize+'px' : '14px';
					activeModules[i].params.baseStyle.textAlign = 'center';
					for(var j in params.items){
						if(params.items[j].active == 1){
							activeModules[i].params.baseStyle.backgroundColor = params.items[j].discolor;
							activeModules[i].params.baseStyle.color = params.items[j].color;
							break;
						}
					}
					activeModules[i].params.positionStyle.left = params.positionStyle.marginleft ? params.positionStyle.marginleft : 0;
					activeModules[i].params.positionStyle.width = params.positionStyle.width ? params.positionStyle.width : 320 - params.positionStyle.marginleft;
					activeModules[i].params.positionStyle.height = params.positionStyle.height ? params.positionStyle.height : 35;
					activeModules[i].params.baseStyle.lineHeight = activeModules[i].params.positionStyle.height+'px';
					activeModules[i].params.borderStyle.borderWidth = 1;
					activeModules[i].params.borderStyle.borderRadius = 8;
					activeModules[i].params.borderStyle.borderStyle = 'solid';
					activeModules[i].params.borderStyle.borderColor = '#ADADAD';
					activeModules[i].baseStyle = 'font-size:'+activeModules[i].params.baseStyle.fontSize+';text-align:center;background-color:'+params.items[j].discolor+';color:'+params.items[j].color+';line-height:'+activeModules[i].params.baseStyle.lineHeight+';';
					activeModules[i].borderStyle = 'border-radius:8px; border-width: 1px;border-style: solid;border-color: #ADADAD;';
					break;
				case 'good':
					activeModules[i].params.baseStyle.fontSize = params.baseStyle.fontsize+'px';
					activeModules[i].params.baseStyle.textAlign = 'center';
					activeModules[i].params.baseStyle.color = params.color;
					activeModules[i].params.baseStyle.backgroundColor = '#d15d82';
					activeModules[i].params.borderStyle.borderRadius = 5;
					activeModules[i].params.positionStyle.left = params.positionStyle.marginleft ? params.positionStyle.marginleft : 0;
					activeModules[i].params.positionStyle.width = params.positionStyle.width ? params.positionStyle.width : 320 - params.positionStyle.marginleft;
					if(params.layoutstyle == 1){
						activeModules[i].params.positionStyle.height = params.positionStyle.height ? params.positionStyle.height : 35;
					}else{
						activeModules[i].params.positionStyle.height = params.positionStyle.height ? params.positionStyle.height : 54;
					}
					activeModules[i].params.baseStyle.lineHeight = activeModules[i].params.positionStyle.height+'px';
					activeModules[i].baseStyle = 'font-size:'+activeModules[i].params.baseStyle.fontSize+';text-align:center;background-color:#d15d82;color:'+params.color+';line-height:'+activeModules[i].params.baseStyle.lineHeight+';';
					activeModules[i].borderStyle = 'border-radius:5px;';
					break;
				case 'countDown':
					activeModules[i].params.baseStyle.fontSize = params.baseStyle.fontsize+'px';
					activeModules[i].params.baseStyle.textAlign = 'center';
					activeModules[i].params.positionStyle.left = params.positionStyle.marginleft ? params.positionStyle.marginleft : 0;
					activeModules[i].params.positionStyle.width = params.positionStyle.width ? params.positionStyle.width : 320;
					activeModules[i].params.positionStyle.height = params.positionStyle.height ? params.positionStyle.height : 35;
					activeModules[i].params.baseStyle.lineHeight = activeModules[i].params.positionStyle.height+'px';
					activeModules[i].params.borderStyle.borderWidth = 1;
					activeModules[i].params.borderStyle.borderStyle = 'solid';
					activeModules[i].params.borderStyle.borderColor = '#ccc';
					activeModules[i].baseStyle = 'font-size:'+activeModules[i].params.baseStyle.fontSize+';text-align:center;line-height:'+activeModules[i].params.baseStyle.lineHeight+';';
					activeModules[i].borderStyle = 'border-width: 1px;border-style: solid;border-color: #ccc;';
					break;
				case 'title':
					activeModules[i].params.baseStyle.backgroundColor = params.tradition.bgcolor;
					activeModules[i].baseStyle = 'background-color:'+params.tradition.bgcolor+';';	
				case 'white':
					activeModules[i].params.positionStyle.height = activeModules[i].params.height;
				case 'richText':
				case 'adImg':
				case 'cube':
				case 'textNav':
				case 'navImg':
				case 'link':
				case 'line':
				case 'audio':
				case 'notice':
					if(typeof params.positionStyle != 'undefined'){
						activeModules[i].params.positionStyle.left = params.positionStyle.marginleft ? params.positionStyle.marginleft : 0; 	// left偏移
					}else{
						activeModules[i].params.positionStyle.left = 0;
					}
					activeModules[i].params.positionStyle.width = 320; 	// 宽度
					break;
			}
			var widthStyle = ''; heightStyle = '';
			if(activeModules[i].params.positionStyle.width){
				widthStyle = 'width:'+activeModules[i].params.positionStyle.width+'px;';
			}
			if(activeModules[i].params.positionStyle.height){
				heightStyle = 'height:'+activeModules[i].params.positionStyle.height+'px;';
			}
			activeModules[i].positionStyle = 'position:relative;left:'+activeModules[i].params.positionStyle.left+'px;'+widthStyle+heightStyle;
			// 将所有的marginTop记录下来，作为top偏移的一部分
			if(typeof params.positionStyle != 'undefined'){
				activeModules[i].marginTop = params.positionStyle.margintop ? params.positionStyle.margintop : 0;
			}else{
				activeModules[i].marginTop = 0;
			}
		}
		newActiveModules = activeModules;
		return newActiveModules;
	};
	return serviceUpwardCompatible;
}]);