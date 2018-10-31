angular.module('we7job', ['we7app']);
angular.module('we7job').controller('we7job-base-controller', ['$scope', '$http', 'config',
	function ($scope, $http, config) {
		var list = config.list;
		var jobid = config.jobid;
		var jobWorker = new Worker('resource/js/app/job.js?'+Math.random());
		$scope.list = list;

		function GetUrlRelativePath() {
			var url = document.location.toString();
			var arrUrl = url.split("//");

			var start = arrUrl[1].indexOf("/");
			var relUrl = arrUrl[1].substring(start);//stop省略，截取从start开始到结尾的所有字符

			if(relUrl.indexOf("?") != -1){
				relUrl = relUrl.split("?")[0];
			}
			$scope.relUrl = relUrl;
		}
		GetUrlRelativePath();

		$scope.start = function (job) {
			job.relUrl = $scope.relUrl;
			job.start = !job.start;
			jobWorker.postMessage(job);
		}

		jobWorker.onmessage = function (event) {
			var jobId = event.data.id;
			$scope.list[jobId].progress = event.data.progress;
			$scope.$apply();
		}

		if (jobid > 0) {
			var job = list[jobid];
			if (job) {
				$scope.start(job);
			}
		}
	}
]);