angular.module('specialApp', ['wapeditorApp']);
angular.module('specialApp').controller('MainCtrl', [
	'$scope',
	'$timeout',
	'$uibModal',
	'widget',
	'config',
	'serviceCommon',
	'serviceSetStyle',
	'serviceBase',
	'serviceSpecialBase',
	'serviceSubmit',
	'serviceMultiSubmit',
	'serviceMultiPage',
	'serviceUpwardCompatible',
	'$sanitize',
	function($scope, $timeout, $uibModal, widget, config, serviceCommon, serviceSetStyle, serviceBase, serviceSpecialBase, serviceSubmit, serviceMultiSubmit, serviceMultiPage, serviceUpwardCompatible, $sanitize) {
		$scope.modules = [];
		$scope.editors = [];
		$scope.allPages = config.allPages;
		$scope.multipage = config.multipage ? config.multipage : [];
		$scope.submit = {'params':{}, 'html':'', 'multipage' : []};
		//是否新旧版本	V0.1:false;	V0.2以后:true
		$scope.isNew = true;
		if(!!$scope.allPages && _.findIndex($scope.allPages, {'active' : true}) == -1){
			$scope.isNew = false;
			$scope.allPages = [{'property' : $scope.allPages, 'active' : true}];
		}
		serviceBase.setBaseData('isNew', $scope.isNew);
		$scope.allPages = $scope.allPages ? $scope.allPages : [{'property' : [], 'active' : true}];

		//提交时最后所在页面的全部数据
		var firstIndex = _.findIndex($scope.allPages, {'active' : true});
		$scope.activeModules = firstIndex > -1 ? serviceBase.initActiveModules($scope.allPages[firstIndex].property) : [];
		//记录全局页码(allPages永远是0,1,...自增数组)
		$scope.activePageIndex = firstIndex > -1 ? firstIndex : 0;
		serviceSpecialBase.setBaseData('activePageIndex', $scope.activePageIndex);
		//当前活动的模块
		$scope.activeItem = {};
		//当前活动模块的索引
		$scope.activeIndex = 0;
		//模块流水id。分多页，模块index为：最大页的最大模块index+1,(表示下一个模块的index)
		$scope.index = $scope.activeModules.length ? serviceCommon.getMaxScopeIndex($scope.allPages)+1 : 0;
		serviceBase.setBaseData('index', $scope.index);
		//页面长度
		$scope.pageLength = _.isEmpty($scope.activeModules) ? 1 : ($scope.activeModules[0].params.pageLength ? $scope.activeModules[0].params.pageLength : 1);
		$scope.isMultiPage = $scope.index == 0 ? true : ($scope.activeModules[serviceCommon.getHeaderIndex($scope.activeModules)].params.pageLength > 1 ? false : true);
		$scope.isLongPage = $scope.index == 0 ? true : ($scope.activeModules[serviceCommon.getHeaderIndex($scope.activeModules)].params.pageLength > 1 || $scope.activeModules[serviceCommon.getHeaderIndex($scope.activeModules)].params.pageLength == 1 && $scope.allPages.length == 1 ? true : false);
		// 下拉菜单配置
		$scope.pageLengths = { '1':1, '2':2, '3':3, '4':4, '5':5 };
		$scope.lineHeights = { '1':1, '1.25':1.25, '1.5':1.5, '2':2, '2.5':2.5 }; 
		$scope.fontSizes = { '12':12, '14':14, '16':16, '18': 18, '20':20, '22':22, '24':24, '26':26, '28':28, '30':30, '32':32, '34':34, '36':36, '38':38, '40':40 }; 

		serviceSpecialBase.setBaseData('allPages', $scope.allPages);
		serviceSpecialBase.setBaseData('multipage', $scope.multipage);
		serviceBase.setBaseData('pageLength', $scope.pageLength);

		if(!$scope.isNew){
			$scope.activeModules = serviceUpwardCompatible.compatibility($scope.activeModules);

			// 兼容第一版，uc
			if(typeof $scope.activeModules[0].params.pageLength == 'undefined'){
				$scope.activeModules[0].params.pageLength = Math.ceil($('.modules').height() / 568);
			}
			if($scope.activeModules[0].params.pageLength > 1){
				$scope.pageLength = $scope.activeModules[0].params.pageLength;
				$scope.isMultiPage = false;
				$scope.isLongPage = true;
				serviceBase.setBaseData('pageLength', $scope.pageLength);
				// 等待angular页面渲染，再改变页面长度
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
								$(this).find('div[ng-controller]').attr('style', $scope.activeModules[i].positionStyle);		// 上面一次是初始化$scope.$scope.activeModules，ng-repeat生成dom，这次dom已存在，我们得自己改变样式
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

		// base区域
		$scope.addItem = function(type) {
			serviceBase.addItem(type);
		};
		$scope.editItem = function(index) {
			serviceBase.editItem(index);
		};
		$scope.deleteItem = function(index) {
			serviceBase.deleteItem(index);
		};
		$scope.submit = function(event){
			$scope.submit = serviceSubmit.submit();
			$scope.$apply('submit');
			$(event.target).parents('form').submit();
		};
		$scope.multiSubmit = function(event){
			$scope.submit = serviceMultiSubmit.submit();
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
		$scope.clearModuleStyle = function() {
			serviceSetStyle.clearModuleStyle($scope.activeItem);
		}
		// multipage
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
			serviceBase.setBaseData('pageLength', parseInt(val));
			serviceBase.setBaseData('activeModules', activeModules);
		}
		$scope.insertPage = function () {
			serviceMultiPage.insertPage();
			$scope.init(null, ['header']);
		}
		$scope.navToPage = function (index) {
			serviceMultiPage.navToPage(index);
			$scope.activeHeader();
		}
		$scope.removePage = function (index) {
			serviceMultiPage.removePage(index);
			$scope.activeHeader();
		}
		$scope.copyPage = function (index, event) {
			serviceMultiPage.copyPage(index, event);
			$scope.activeHeader();
		}
		$scope.changeLock = function() {
			$scope.activeItem.params.baseStyle.lock = !$scope.activeItem.params.baseStyle.lock;
		};
		// 每次切换页面，激活header
		$scope.activeHeader = function() {
			for (var i in $scope.activeModules) {
				if ($scope.activeModules[i].id == 'header') {
					$scope.pageLength = $scope.activeModules[i].params.pageLength ? $scope.activeModules[i].params.pageLength : 1;
					serviceSetStyle.changePageLength($scope.pageLength, $scope.activeModules);
					serviceBase.setBaseData('activeItem', $scope.activeModules[0]);
					$scope.editItem($scope.activeModules[i].index);
					break;
				}
			}
		}
		$('.multi-submit').on('click', function(event){
			$scope.multiSubmit(event);
		});
		$('.single-submit').on('click', function(event){
			$scope.submit(event);
		});
		$scope.init(null, ['header']);
		$scope.activeHeader();  // 不论是哪个页面，初始化激活header

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

//专题列表
angular.module('specialApp').controller('SpecialDisplay', ['$scope', 'serviceCopy',  'config', function($scope, serviceCopy, config) {
	$scope.pages = config.pages;
	$scope.links = config.links;

	angular.forEach($scope.pages, function(v, k) {
		v.copyLink = $scope.links.appHome+'id='+v.id;
	});

	$scope.success = function(id) {
		var id = parseInt(id);
		var obj = $('<span class="label label-success" style="position:absolute;z-index:10"><i class="fa fa-check-circle"></i> 复制成功</span>');
		serviceCopy.copySuccess(id, obj);
	};
}]);