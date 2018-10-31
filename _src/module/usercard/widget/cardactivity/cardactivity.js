angular.module('userCardApp').controller('CardActivityCtrl', ['$scope', function($scope){
	$scope.$watch('activeItem.params.grant_rate', function(newVal, oldVal){
		newVal += '';
		if (newVal.match(/^([1-9]\d*(\.(\d)?)?|0(\.(\d)?)?)?$/)){
			$scope.activeItem.params.grant_rate = newVal;
		} else {
			$scope.activeItem.params.grant_rate	= oldVal;
		}
	});
}]);