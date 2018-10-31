angular.module('we7app').directive('we7Colorpicker', [function(){
	var directive = {
		templateUrl : 'directive-colorpicker-colorpicker.html',
		scope: {
			'colorValue': '=we7MyColor',
			'colorDefault' : '=we7MyDefaultColor',
			'colorFormName' : '=we7FormName'
		},
		'link' : function($scope, elm, attr){
			if (!$(elm).data('data-colorpicker-init')) {
				util.colorpicker(elm, function(color){
					$(elm).parent().parent().find(":text").val(color.toHexString());
					$scope.colorValue = color.toHexString();
					$scope.$apply('colorValue');

					$scope.$watch('colorValue', function (value) {
						if ($(elm).spectrum('get') != value) {
							$(elm).spectrum('set', value ? value : $scope.colorDefault);
							$(elm).parent().parent().find(":text").val(value ? value : $scope.colorDefault);
							$(elm).parent().parent().find(".input-group-addon").css('background-color', value ? value : $scope.colorDefault);
						}
					});
				});
				$(elm).find(".colorclean").click(function(){
					$(elm).find(':text').val('rgba(0,0,0,0)');
					$(elm).find('.input-group-addon').css('background-color', 'rgba(0,0,0,0)');
					$scope.colorValue = $scope.colorDefault = 'rgba(0,0,0,0)';
					$(elm).spectrum('set', $scope.colorDefault);
					$scope.$apply('colorValue');
					return false;
				});
				$(elm).data('data-colorpicker-init', true);
			}
		}
	};
	return directive;
}]);