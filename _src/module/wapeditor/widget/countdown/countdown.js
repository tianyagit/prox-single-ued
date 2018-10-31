angular.module('wapeditorApp').controller('CountDownCtrl', ['$scope', '$timeout', function($scope, $timeout){
	$scope.$watch('activeItem.params.deadtime', function(newVal, oldVal){
		$scope.activeItem.params.leftTimeText = {'day' : 0, 'hour' : 0, 'min' : 0, 'sec' : 0};
		if(newVal && typeof(newVal) != 'undefined'  && newVal != 0){
			var tmp_datetime = newVal.replace(/:/g,'-');
			tmp_datetime = tmp_datetime.replace(/ /g,'-');
			var arr = tmp_datetime.split("-");
			dtime = new Date(Date.UTC(arr[0],arr[1]-1,arr[2],arr[3]-8,arr[4],arr[5]));
			dtime = parseInt(dtime.getTime());
				d = new Date(dtime);
		}else {
			var time = 2592000000;//30天
			var nowTime = Date.parse(new Date());
			dtime = parseInt(time+nowTime);
			d = new Date(dtime);
		}
		$scope.activeItem.params.deadtime = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
		$scope.activeItem.params.deadtimeToMin = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes();
		leftTime();
	});
	var leftTime = function(){
		var nowTime = Date.parse(new Date());
		var diff = dtime - nowTime > 0 ? dtime - nowTime : 0;
		$scope.activeItem.params.leftTimeText.day = parseInt(diff / (24 * 60 * 60 * 1000));
		$scope.activeItem.params.leftTimeText.hour = parseInt(diff / (60 * 60 * 1000) % 24);
		$scope.activeItem.params.leftTimeText.min = parseInt(diff / (60 * 1000) % 60);
		$scope.activeItem.params.leftTimeText.sec = parseInt(diff / 1000 % 60);
		$timeout(leftTime, 1000);
	}
}]);