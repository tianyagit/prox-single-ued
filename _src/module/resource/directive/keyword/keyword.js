
angular.module('we7resource').directive('we7ResourceKeywordDialog', function(){
	return {
		scope : {},
		restrict : 'EA',
		templateUrl : 'directive-keyword-keyword.html',
		link:function(scope,ele,attrs,ctrl,trans){
			ele.bind('click','pagination li a',function(event){
				var page=$(event.target).attr('page');
				if (page) {
					scope.$broadcast('keyword_page_change', page);
				}
			});
         
		}
	};
});    

angular.module('we7resource').controller('we7resource-keyword-controller', ['$scope','$sce','serviceResource', 
	function($scope,$sce,serviceResource){

		$scope.keyword = '';
		$scope.currentId = '';
		$scope.currentPage = 1;
		$scope.itemClick=function(item) {
			item.selected = true;
			$(window).trigger('resource_selected',{type:'keyword', items:[item]});
		};

		/**
		指令抛出的事件
	*/
		$scope.$on('keyword_page_change',function(event,page){

			$scope.setCurrentPage(page);

		});

		// 设置当前页
		$scope.setCurrentPage = function(newPage) {
			if ($scope.currentPage !== newPage) {
				$scope.currentPage = newPage;
				loadData();
			}
		};

		// 搜索关键字
		$scope.search = function () {
			$scope.currentPage = 1;
			loadData();
		};

		var loadData = function () {
			serviceResource.getResources('keyword', $scope.currentPage, true, {keyword:$scope.keyword})
				.then(function(data) {
					$scope.keywords= data.items;
					$scope.pager = $sce.trustAsHtml(data.pager);
				}
				);
		};
		loadData();
	

	}]);