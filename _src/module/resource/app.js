angular.module('we7resource',['we7app']);

angular.module('we7resource').controller('we7resource-base-controller', 
	['$scope', '$sce', 'serviceResource', '$http', 'config', 
		function($scope, $sce, serviceResource, $http, config){
			$scope.currentPage = 1; //当前页
			$scope.isWechat = config.isWechat; // 是否默认显示微信
			$scope.needType = config.needType; //config.needType; // 1 返回微信 2 返回本地 3 微信和本地 都行
			$scope.multiple = config.multiple; // 是否多选
			$scope.showType = config.showType; // 1 微信 2 本地 3 微信和本地都显示
			$scope.global = config.global ? 'global' : ''; //是否上传到全局
			$scope.dest_dir = config.dest_dir; // 上传的目录
			$scope.uniacid = config.uniacid;
			$scope.netWorkVideo = config.netWorkVideo;
			if (config.others && config.others[$scope.resourceType]) { //如果有特别配置使用特别配置
				$scope.needType = config.others[$scope.resourceType].needType;
			}

			$scope.selectedItems = {}; //选中的元素
			$scope.index = 0; //3个选项卡 0 微信 1 本地 2 网络
			$scope.converting = false; // 是否在转换中

			$scope.showWx = function() {
				return true;
				// return $scope.isWechat || $scope.showType == 1 || $scope.showType == 3;
			};

			$scope.showLocal = function() {
				return true;
				// return !$scope.isWechat || $scope.showType == 2 || $scope.showType == 3;
			};

			$scope.showNetWork = function() {
				return true;
			};

			//加载数据  子类重写
			$scope.loadData = function() {

			};

			// 切换标签 加载数据
			$scope.onIndexChange = function(index) {
				$scope.loadData();
			};

			// 设置index
			$scope.setIndex = function(index) {
				if ($scope.index !== index){
					$scope.index = index;
					$scope.selectedItems = {}; //清空选中
					$scope.onIndexChange(index);
				}
			};

			//判断切换为本地
			if (! $scope.isWechat) {
				$scope.setIndex(1);
			}

			// 设置当前页
			$scope.setCurrentPage = function(newPage) {
				if ($scope.currentPage != newPage) {
					$scope.currentPage = newPage;
					$scope.loadData();
				}
			};


			// 元素选中
			$scope.itemClick = function(item) {
				
				if ($scope.converting) { //如果正在转换 return;
					return ;
				}
				if (item.selected) {
					item.selected = false;
					return;
				}
				//  如果需要转化的资源不支持多选 
				if (!$scope.multiple || $scope.needConvert()) { //如果不是多选直接抛事件 关闭
					item.selected = true;
					$scope.convert(item);
					return;
				}

				item.selected = !item.selected;
				delete $scope.selectedItems[item.id];//删除对象选中的元素
				if (item.selected) {
					$scope.selectedItems[item.id] = item;
				}
			};

			$scope.delItem = function (item, $event) {
				$event.stopPropagation();
				if (!confirm('删除不可恢复确认删除吗？')) {
					return false;
				}
				serviceResource.delItem(item.id, $scope.resourceType,
					 $scope.index == 1, $scope.uniacid)
					.then(function(){
						$scope.loadData();
					},function(error){
						util.message(error.message);
					});
			}

			// 是否可以转化
			$scope.canConvert = function(item) {
				return true;
			};

			// 判断是否需要转化
			$scope.needConvert = function () {
				if ($scope.needType === 3) {
					return false;
				}
				if ($scope.index + 1 !== $scope.needType) {
					return true;
				}
				return false;
			};

			$scope.convert = function (item) {
				var rname = $scope.index == 0 ? '本地' : '微信';

				if (! $scope.needConvert()) {
					fireSelected([item]); //不需要转化 直接抛出事件
					return ;
				}
				if (!$scope.canConvert(item)) {
					// msg('当前所选资源不支持转换为'+rname+'资源');
					item.selected = false;
					msg('当前资源无法选择');
					return;
				}
				var confirmYN = confirm('当前资源转换为'+rname+'素材方可使用,是否转换');
				if (!confirmYN) {
					item.selected = false;
					return;
				}
				util.loading('正在转换为'+rname+'资源');
				doConvert(item);
			};

			function doConvert(item) {
				$scope.converting = true;
       
				var totype = $scope.needType == 2 ? true : false;// true 转化为本地 false 转化为wechat
				serviceResource.convert(item.id, $scope.resourceType, totype)
					.then(function(item){
						util.loaded();
						$scope.converting = false;
						if (item) {
							fireSelected([item]);
						}
						item.selected = false;
					},function(){
						$scope.converting = false;
						msg('资源转换失败');
						item.selected = false;
						util.loaded();
					});
			}

			// 获取选中的项目
			$scope.ok = function() {
				var items = [];
				for (var itemId in $scope.selectedItems) {
					items.push($scope.selectedItems[itemId]);
				}
				if (items.length > 0) {
					fireSelected(items);
					return;
				}
				fireCanceled();
				
			};

			// 当上传成功回调
			$scope.uploaded = function () {
				// msg('上传成功');
				$scope.loadData(); 
			};
			// 上传失败回调
			$scope.uploaderror = function(mes) {
				if (!mes || mes == '') {
					mes = '上传失败';
				}
				msg(mes);
			};

			$scope.selectedItems = function() {
				return selectedItems;
			};

			function msg(mes) {
				util.message(mes);
			}

			//抛出选中事件
			function fireSelected(items) {
				$(window).trigger('resource_selected',{type:$scope.resourceType,items:items});
			}

			//抛出取消事件
			function fireCanceled() {
				$(window).trigger('resource_canceled');
			}




		}]);