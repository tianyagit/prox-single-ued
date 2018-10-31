angular.module('wapeditorApp')
.directive('we7Nobar', function(){
	return {
		link : function($scope, element, attr){
			element.on('mousedown', function (e) {
				$('.bar').hide();	// 隐藏所有bar，header需要
			});
		}
	};
})
.directive('we7Drag',['serviceBase', '$timeout', function(serviceBase, $timeout){
	return {
		compile : function(element, attr){
			var $barN = $('<div class="bar bar-n ui-resizable-handle ui-resizable-n we7-hide"></div>');
			var $barS = $('<div class="bar bar-s ui-resizable-handle ui-resizable-s we7-hide"></div>');
			var $barE = $('<div class="bar bar-e ui-resizable-handle ui-resizable-e we7-hide"></div>');
			var $barW = $('<div class="bar bar-w ui-resizable-handle ui-resizable-w we7-hide"></div>');
			element.append($barN).append($barS).append($barE).append($barW);
			return function(scope, element, attr){
				var bindCtrl = element.parents("div[ng-controller$='Ctrl']").eq(0);
				bindCtrl.on('mousedown', function (e) {
					$('.bar').hide(); 		// 暂时所有的 bar 隐藏
					$(this).find('.bar').show();
					$(this).find('.bar-radius').show();
					$(this).draggable({'containment' : ''});
				});
				bindCtrl.mousedown();

				var activeItem = serviceBase.getBaseData('activeItem');
				if(activeItem.id){
					//首字母大写
					var activeCtrl = activeItem.id.replace(/[a-z]/,function($1){return $1.toLocaleUpperCase()}).replace(/^[a-z]/,function($1){return $1.toLocaleUpperCase()}) + 'Ctrl';
					if(activeCtrl != 'HeaderCtrl') {
						var curCtrl = $("#module-"+activeItem.index).find("div[ng-controller='"+activeCtrl+"']");
						curCtrl.on('mousedown', function (e) {
							$('.bar').hide();
							$(this).find('.bar').show();
							$(this).find('.bar-radius').show();
							$(this).draggable({'containment' : ''});
						});
						curCtrl.mousedown();
					}else{
						$('.bar').hide();
					}
				}
			}
		}	
	};
}])
.directive('we7Resize', function(){
	return {
		compile : function(element, attr){
			var barBall = $('<div class="bar-radius radius-s we7-hide"></div>');
			var $barNE = $('<div class="bar bar-nw bar-radius radius-s ui-resizable-handle ui-resizable-nw we7-hide"></div>');
			var $barNW = $('<div class="bar bar-se bar-radius radius-s ui-resizable-handle ui-resizable-se we7-hide"></div>');
			var $barSE = $('<div class="bar bar-sw bar-radius radius-s ui-resizable-handle ui-resizable-sw we7-hide"></div>');
			var $barSW = $('<div class="bar bar-ne bar-radius radius-s ui-resizable-handle ui-resizable-ne we7-hide"></div>');
			element.find('.bar-n,.bar-s,.bar-e,.bar-w').append(barBall)
			element.append($barNW).append($barSE).append($barSW).append($barNE)
			return function($scope, element, attr){
				var curCtrl = element.parents("div[ng-controller$='Ctrl']").eq(0);
				curCtrl.on('mousedown', function (e) {
					var handles = {
						n : $(this).find('.bar-n'),
						s : $(this).find('.bar-s'),
						e : $(this).find('.bar-e'),
						w : $(this).find('.bar-w'),
						nw : $(this).find('.bar-nw'),
						se : $(this).find('.bar-se'),
						sw : $(this).find('.bar-sw'),
						ne : $(this).find('.bar-ne'),
					};
					$(this).resizable({'handles' : handles , aspectRatio : true, onlyCorner: true});
				});
			}
		}
	};
})
.directive('we7Rotate', function(){
	return {
		link : function($scope, element, attr){
			var rotateDOM = '<div class="bar bar-rotate bar-radius radius-s ui-resizable-handle we7-hide"></div> <div class="bar bar-line ui-resizable-handle we7-hide"></div>';
			element.prepend(rotateDOM);

			// 给当前controller绑定事件
			var curCtrl = element.parents("div[ng-controller$='Ctrl']").eq(0);
			curCtrl.on('mousedown', function(e){

				// 设置rotate
				var rotateBar = curCtrl.find('.bar-rotate').get(0);
				var rotateDiv = curCtrl.children();
				var hm = new Hammer(rotateBar);
				var rotate, startPos = {};
				hm.get('pan').set({threhold:0});
				hm.on('panstart', function(e){
					$("body").css({
						"user-select": "none",
						cursor: 'url("./resource/images/mouserotate.ico"), default'
					});
					startPos = {
						x: rotateDiv.offset().left + rotateDiv.width()/2,
						y: rotateDiv.offset().top + rotateDiv.height()/2
					}
				});
				hm.on('panmove', function(e){
				var c = e.center,
					d = c.x - startPos.x,
					f = c.y - startPos.y + $(window).scrollTop(),
					i = Math.abs(d / f);
					rotate = Math.atan(i) / (2 * Math.PI) * 360, d > 0 && 0 > f ? rotate = 360 + rotate : d > 0 && f > 0 ? rotate = 180 - rotate : 0 > d && f > 0 ? rotate = 180 + rotate : 0 > d && 0 > f && (rotate = 360 - rotate), rotate > 360 && (rotate -= 360);
					rotate = parseInt(rotate);
					rotateDiv.css({transform: "rotateZ(" + rotate + "deg)"});
					$scope.activeItem.params.borderStyle.transform = rotate;
					$scope.$apply();
				});
				hm.on('panend', function(){
					$("body").css({
						"user-select": "initial",
						cursor: 'default'
					});
				});
			});
		}
	};
});