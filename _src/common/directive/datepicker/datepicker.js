angular.module('we7app').directive('we7DatePicker', ['$http', '$parse', function(){
	var myDatePicker = {
		transclude:true,
		template : '<span ng-transclude></span>',
		scope: {
			'dateValue': '=we7DateValue'
		},
		'link' : function($scope, element, attr){
			var option = {
				lang : 'zh',
				step : '1',
				format : 'Y-m-d H:i:s',
				closeOnDateSelect : true,
				onSelectDate : function(current_time, input){
					$scope.dateValue = current_time.dateFormat('Y-m-d H:i:s');
					$scope.$apply('dateValue');
				},
				onSelectTime : function(current_time, input){
					$scope.dateValue = current_time.dateFormat('Y-m-d H:i:s');
					$scope.$apply('dateValue');
				}
			};
			$(element).datetimepicker(option);
		}
	};
	return myDatePicker;
}]);