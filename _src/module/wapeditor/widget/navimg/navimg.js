angular.module('wapeditorApp').controller('NavImgCtrl', ['$scope', function($scope) {
	$scope.changeItem = function(item) {
		require(['fileUploader'], function(uploader){
			uploader.show(function(imgs){
				item.id = imgs.id;
				item.imgurl = imgs.url;
				$scope.$apply();
			}, {'direct' : true, 'multiple' : false});
		});
	}
}]);