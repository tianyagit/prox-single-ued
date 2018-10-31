angular.module('wapeditorApp').controller('AdImgCtrl', ['$scope', function($scope) {
	$scope.addItem = function(){
		require(['fileUploader'], function(uploader){
			uploader.show(function(img){
				$scope.activeItem.params.items.push({
					'id' : img.id,
					'imgurl' : img.url,
					'title' : '',
					'url' : '',
					'isactive': false
				});
				$.each($scope.activeItem.params.items, function(index, item){
					$scope.activeItem.params.items[0].isactive = index == 0;
				});
				$scope.$apply('activeItem');
				// 动态改变adimg高度
				$scope.changeInnerHeight();
			}, {'direct' : true, 'multiple' : false});
		});
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
		// 动态改变adimg高度
		$scope.changeInnerHeight();
	}
	$scope.addEmpty = function(){
		$scope.activeItem.params.items.push({
			'imgurl' : '',
			'title' : '',
			'url' : ''
		});
		// 动态改变adimg高度
		$scope.changeInnerHeight();
	}
	$scope.changeItem = function(img) {
		require(['fileUploader'], function(uploader){
			uploader.init(function(imgs){
				var index = $.inArray(img, $scope.activeItem.params.items);
				if(index > -1){
					$scope.activeItem.params.items[index].id = imgs.id;
					$scope.activeItem.params.items[index].imgurl = imgs.url;
					$scope.$apply()
				}
			}, {'direct' : true, 'multiple' : false});
		});
		// 动态改变adimg高度
		$scope.changeInnerHeight();
	}
}]);