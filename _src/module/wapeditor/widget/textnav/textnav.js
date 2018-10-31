angular.module('wapeditorApp').controller('TextNavCtrl', ['$scope', function($scope) {
	$scope.addItem = function(){
		$scope.activeItem.params.items.push({'title':'','url':''});
		// 动态改变textNav高度
		$scope.changeInnerHeight();
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
		// 动态改变textNav高度
		$scope.changeInnerHeight();
	}
}]);