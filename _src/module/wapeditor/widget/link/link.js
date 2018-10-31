angular.module('wapeditorApp').controller('LinkCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.pageSize = _.range(0, 30);
	$scope.addItem = function(){
		$scope.activeItem.params.items.push({'title':'','url':'', 'type' : 1, 'selectCate' : {'name' : '', 'id' : 0}, 'pageSize' : 3});
	}
	$scope.removeItem = function(item){
		index = $.inArray(item, $scope.activeItem.params.items);
		items = _.clone($scope.activeItem.params.items),
		$scope.activeItem.params.items = [];
		for(i in items){
			if(i != index){
				$scope.activeItem.params.items.push(items[i]);
			}
		}
		// 动态改变link高度
		$scope.changeInnerHeight();
	}
	//添加分类
	$scope.showSearchCateList = function(item) {
		$scope.currentItem = item;
		var keyword = $('.js-search-cate-keyword').val();
		keyword = typeof keyword == 'undefined' ? '' : keyword;
		$http.get('./index.php?c=utility&a=link&do=catelist&keyword='+ keyword).success(function(data, status, headers, config){
			$scope.searchCateList = [];
			var catelist = data.message.message;
			for (i in catelist) {
				$scope.searchCateList.push({
					'id' : catelist[i].id,
					'name' : catelist[i].name,
					'children' : catelist[i].children,
				});
			}
			$scope.modalobj = $('#modal-search-cate-link').modal({'show' : true})
		});
		return true;
	};
	$scope.selectCateItem = function(pid, cid, catename) {
		$scope.currentItem.selectCate = {'pid' : pid, 'cid' : cid, 'name' : catename};
		$scope.modalobj.modal('hide');
		return true;
	};
}]);