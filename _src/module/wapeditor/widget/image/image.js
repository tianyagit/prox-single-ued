angular.module('wapeditorApp').controller('ImageCtrl', ['$scope', function($scope) {
	$scope.addItem = function(){
		require(['fileUploader'], function(uploader){
			uploader.show(function(img) {
				$scope.saveModulePosition();	// 先同步模块之前的位置
				$scope.resetPosition(img);
				$scope.activeItem.params.items = {
					'id' : img.id,
					'imgurl' : img.url,
				};
				$scope.$apply();
			}, {'direct' : true, 'multiple' : false});
		});
	}
	$scope.changeItem = function(img) {
		require(['fileUploader'], function(uploader){
			uploader.init(function(imgs){
					$scope.saveModulePosition();	// 先同步模块之前的位置
					$scope.resetPosition(imgs);
					$scope.activeItem.params.items.id = imgs.id;
					$scope.activeItem.params.items.imgurl = imgs.url;
					$scope.$apply();
			}, {'direct' : true, 'multiple' : false});
		});
	}
	// 调整模块尺寸
	$scope.resetPosition = function(img) {
		if(img.width && img.height){
			w = img.width;
			h = img.height;
			if(w >= h){
				$scope.activeItem.params.positionStyle.width = 100;
				$scope.activeItem.params.positionStyle.height = $scope.activeItem.params.positionStyle.width * h / w;
			}else{
				$scope.activeItem.params.positionStyle.height = 100;
				$scope.activeItem.params.positionStyle.width = $scope.activeItem.params.positionStyle.height * w / h;
			}
			$scope.setModulePositionStyle($scope.activeItem.params.positionStyle);
		}
	}
}]);