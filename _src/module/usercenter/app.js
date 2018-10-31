angular.module('userCenterApp', ['wapeditorApp']);
angular.module('userCenterApp').controller('MainCtrl',[
	'$scope',
	'$timeout',
	'widget',
	'config',
	'serviceCommon',
	'serviceSetStyle',
	'serviceBase',
	'serviceUcSubmit',
	'serviceUpwardCompatible',
	function($scope, $timeout, widget, config, serviceCommon, serviceSetStyle, serviceBase, serviceUcSubmit, serviceUpwardCompatible) {
		$scope.modules = [];
		$scope.editors = [];
		$scope.activeModules = config.activeModules ? config.activeModules : [];
		$scope.activeMenus = config.activeMenus ? config.activeMenus : [];
		$scope.submit = {'params':{}, 'html':''};
		//是否新旧版本	V0.1:false;	V0.2以后:true
		$scope.isNew = true;
		$scope.siteroot = config.siteroot;
		$scope.logo_url = $scope.siteroot + '/app/resource/images/heading.jpg';
		if(!_.isEmpty($scope.activeModules) && $scope.activeModules[0].params.isnew != 1){
			$scope.isNew = false;
		}
		$scope.siteEntrance = config.links.murl;
		//当前活动的模块
		$scope.activeItem = {};
		//当前活动模块的索引
		$scope.activeIndex = 0;
		//模块流水id。分多页，模块index为：最大页的最大模块index+1,(表示下一个模块的index)
		$scope.index = $scope.activeModules.length ? $scope.activeModules.length : 0;
		serviceBase.setBaseData('index', $scope.index);
		serviceBase.setBaseData('activeModules', $scope.activeModules);
		//页面长度
		$scope.pageLength = (!_.isEmpty($scope.activeModules) && $scope.activeModules[0].params.pageLength) ? $scope.activeModules[0].params.pageLength : 1;
		$scope.isLongPage = true;
		// 下拉菜单配置
		$scope.pageLengths = { '1':1, '2':2, '3':3, '4':4, '5':5 }; 
		$scope.lineHeights = { '1':1, '1.25':1.25, '1.5':1.5, '2':2, '2.5':2.5 }; 
		$scope.fontSizes = { '12':12, '14':14, '16':16, '18': 18, '20':20, '22':22, '24':24, '26':26, '28':28, '30':30, '32':32, '34':34, '36':36, '38':38, '40':40}; 

		if(!$scope.isNew){
			$scope.activeModules = serviceUpwardCompatible.compatibility($scope.activeModules);
			$scope.activeModules[0].params.isnew = 1;
			// 兼容第一版，uc
			if(typeof $scope.activeModules[0].params.pageLength == 'undefined'){
				$scope.activeModules[0].params.pageLength = Math.ceil( ($('.modules').height()+520) / 568);
			}
			if($scope.activeModules[0].params.pageLength > 1){
				$scope.pageLength = $scope.activeModules[0].params.pageLength;
				serviceBase.setBaseData('pageLength', $scope.pageLength);
				$timeout(function(){
					$(".app-content").css('height', 568*$scope.pageLength + 'px');
				}, 100);
			}
			$timeout(function(){
				var plusHeight = 0;
				var i=0;
				var width = height = '';
				$('.modules>div').each(function(){
					var index = parseInt($(this).attr('index'));
					width = $(this).find("div.ng-scope[ng-controller$='Ctrl']").css('width');
					height = $(this).find("div.ng-scope[ng-controller$='Ctrl']").css('height');
					if(index > 0){
						for(var i in $scope.activeModules){
							if($scope.activeModules[i].index == index){
								plusHeight += parseInt($scope.activeModules[i].marginTop); 		// top偏移添加上margingTop
								// 记录position位置
								$scope.activeModules[i].params.positionStyle.width = parseInt(width);
								$scope.activeModules[i].params.positionStyle.height = parseInt(height);
								$scope.activeModules[i].params.positionStyle.top = plusHeight;
								$scope.activeModules[i].positionStyle = 'position:absolute;width:'+width+';height:'+height+';left:'+$scope.activeModules[i].params.positionStyle.left+'px;top:'+plusHeight+'px;';
								$(this).find('div[ng-controller]').attr('style', $scope.activeModules[i].positionStyle);
							}
						}
						plusHeight += parseInt(height);
					}
					i++;
				});
				serviceBase.setBaseData('activeModules', $scope.activeModules);
			}, 1000);
		}

		// 重置样式使用，等待兼容处理完毕后，再复制原始属性作为重置属性
		// (不考虑position属性的重置，因此这里正好避免了position，兼容上版使用$timeout导致position无法正确纪录)
		for(var i in $scope.activeModules){
			$scope.activeModules[i].originParams = angular.copy($scope.activeModules[i].params);
		}
		$scope.success = function(id) {
			var id = parseInt(id);
			var obj = $('<span class="label label-success" style="position:absolute;z-index:10;width:90px;height:34px;line-height:28px;"><i class="fa fa-check-circle"></i> 复制成功</span>');
			serviceCommon.copySuccess(id, obj);
		};
		// 监听事件区域
		$scope.$on('serviceBase.editors.update', function(event, editors){
			$scope.editors = editors;
		});
		$scope.$on('serviceBase.activeItem.update', function(event, activeItem){
			$scope.activeItem = activeItem;
		});
		$scope.$on('serviceBase.activeModules.update', function(event, activeModules){
			$scope.activeModules = activeModules;
		});
		$scope.$on('serviceBase.activeItem.params.update', function(event, params){
			$scope.activeItem.params = params;
		});
		$scope.$on('serviceBase.activeItem.animationName.update', function(event, name){
			$scope.activeItem.params.animationStyle.animationName = name;
		});
		$scope.$on('serviceBase.activeItem.style.update', function(event, style, paramsStyle, itemStyle, transform){
			$scope.activeItem.params[style] = paramsStyle;
			$scope.activeItem[style] = itemStyle;
			if(typeof transform != 'undefined'){
				$scope.activeItem['transform'] = transform;
			}
		});
		$scope.$on('updateScope', function(event, data){
			angular.forEach(data, function(val, key){
				$scope[key] = val;
			})
		});

		$scope.addItem = function(type) {
			serviceBase.addItem(type, 'uc');
		};
		$scope.editItem = function(index) {
			serviceBase.editItem(index);
		};
		$scope.deleteItem = function(index) {
			serviceBase.deleteItem(index);
		};
		$scope.submit = function(event){
			$scope.submit = serviceUcSubmit.submit();
			$scope.$apply('submit');
			$(event.target).parents('form').submit();
		};
		$scope.init = function(modules, showModules) {
			$scope.modules = serviceBase.setModules(modules, showModules);
			if ($scope.activeModules.length > 0) {
				var activeModulesKey = [];
				angular.forEach($scope.activeModules, function(module, index){
					if (module) {
						activeModulesKey.push(module.id);
					}
				});
			}
			angular.forEach($scope.modules, function(module, index){
				if (module.defaultshow && $.inArray(module.id, activeModulesKey) == -1) {
					serviceBase.addItem(module.id);
				}
			});
		};
		// styleset
		$scope.setModulePositionStyle = function (positionStyle) {
			serviceSetStyle.setModulePositionStyle(positionStyle);
		}
		$scope.eleAnimationIns = function (animationName) {
			serviceSetStyle.eleAnimationIns(animationName);
		}
		$scope.savePagePosition = function () {
			serviceSetStyle.savePagePosition($scope.activeModules);
		}
		$scope.saveModulePosition = function () {
			serviceSetStyle.saveModulePosition($scope.activeItem);
		}
		$scope.changeTextAlign = function (val) {
			serviceSetStyle.changeTextAlign($scope.activeItem, val);
		}
		$scope.changeBorderWidth = function () {
			serviceSetStyle.changeBorderWidth($scope.activeItem);
		}
		$scope.changeInnerHeight = function () {
			serviceSetStyle.changeInnerHeight($scope.activeItem);
		}
		$scope.changePageLength = function (val) {
			if(angular.isString(val)) {
				if(val == 'minus' && $scope.pageLength > 1) {
					val = $scope.pageLength - 1;
				}
				else if(val == 'plus' && $scope.pageLength < 5) {
					val = $scope.pageLength + 1;
				}else {
					return false;
				}
			}
			var activeModules = serviceSetStyle.changePageLength(val, $scope.activeModules);
			serviceBase.setBaseData({'pageLength' : parseInt(val), 'activeModules' : activeModules});
		}
		$scope.clearModuleStyle = function() {
			serviceSetStyle.clearModuleStyle($scope.activeItem);
		}

		$scope.addThumb = function(type) {
			require(['fileUploader'], function(uploader){
				uploader.show(function(img){
					$scope.activeItem.params[type] = img.url;
					$scope.$apply('activeItem');
				}, {'direct' : true, 'multiple' : false});
			});
		};
		$scope.showIconBrowser = function(menu) {
			util.iconBrowser(function(icon){
				menu.css.icon.icon = icon;
				$scope.$apply('activeMenus');
			});
		};
		$scope.addMenu = function() {
			$scope.activeMenus.push({
				'icon':'',
				'css':{'icon':{'icon' : 'fa fa-external-link'}},
				'name':'',
				'url':''
			});
		};
		$scope.removeMenu = function(menu) {
			$scope.activeMenus = _.without($scope.activeMenus, menu);
		};

		$('.single-submit').on('click', function(event){
			$scope.submit(event);
		});
		$scope.init(null, ['UCheader']);
		$scope.changePageLength($scope.pageLength);
		$scope.editItem(0);

		$scope.$watch("activeItem.params.baseStyle", function(newVal) {
			if(newVal){
				serviceSetStyle.setModuleBaseStyle(newVal);			
			}
		}, true);
		$scope.$watch("activeItem.params.borderStyle", function(newVal) {
			if(newVal){
				serviceSetStyle.setModuleBorderStyle(newVal);
			}
		}, true);
		$scope.$watch("activeItem.params.shadowStyle", function(newVal) {
			if(newVal){
				serviceSetStyle.setModuleShadowStyle(newVal);
			}
		}, true);
		$scope.$watch("activeItem.params.animationStyle", function(newVal) {
			if(newVal){
				serviceSetStyle.setModuleAnimationStyle(newVal);
			}
		}, true);
		$scope.$watch("activeItem.params.positionStyle", function(newVal) {
			if(newVal){
				serviceSetStyle.setModulePositionStyle(newVal);
			}
		}, true);
}]);