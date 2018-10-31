angular.module('cloudApp', ['we7app']);
angular.module('cloudApp')
.controller('FileProcessorCtrl', function($scope, $http, config) {
	$scope.files = config.files;
	$scope.fails = [];

	var total = $scope.files.length;
	var i = 1;
	var errormsg = '';
	var tasknum = config.tasknum && config.type != '' ? config.tasknum : 1;
	if (tasknum > total) {
		tasknum = 1;
	}
	var proc = function() {
		var path = $scope.files.pop();
		if(!path && i >= total) {
			util.message('文件同步完成，正在处理数据同步......');
			if (config.type == 'theme') {
				location.href = './index.php?c=cloud&a=process&step=schemas&t=' + config.appname + '&is_upgrade=' + config.is_upgrade;
			} else if (config.type == 'webtheme') {
				location.href = './index.php?c=cloud&a=process&step=schemas&w=' + config.appname + '&is_upgrade=' + config.is_upgrade;
			} else {
				location.href = './index.php?c=cloud&a=process&step=schemas&m=' + config.appname + '&is_upgrade=' + config.is_upgrade + '&batch=1&account_type=' + config.account_type;
			}
			return;
		}
		$scope.file = path;
		$scope.pragress = i + '/' + total;
		var params = {path: path, type : config.type};
		$http.post(location.href, params).success(function(dat){
			i++;
			if(dat != 'success') {
				$scope.fails.push('['+dat+'] ' + path);
				errormsg = dat;
			}
			proc();
		}).error(function(){
			i++;
			$scope.fails.push(path);
			proc();
		});
	}
	for (j = 0; j < tasknum; j++) {
		proc();
	}
})
.controller('SchemasProcessorCtrl', function($scope, $http, config){
	$scope.schemas = config.schemas;
	$scope.fails = [];
	var is_m_install = config.is_module_install;
	var total = $scope.schemas.length;
	var i = 1;
	var error = function() {
		util.message('未能成功执行处理数据库, 请联系开发商解决. ');
	}
	var proc = function() {
		var schema = $scope.schemas.pop();
		if(!schema) {
			if($scope.fails.length > 0) {
				error();
				return;
			} else {
				if(is_m_install == 1) {
					location.href = '';
				} else {
					location.href = '';
				}
				return;
			}
		}
		$scope.schema = schema;
		$scope.pragress = i + '/' + total;
		var params = {table: schema};
		$http.post(location.href, params).success(function(dat){
			i++;
			if(dat != 'success') {
				$scope.fails.push(schema)
			}
			if (dat['message']) {
				util.message(dat['message']);
				return;
			}
			proc();
		}).error(function(){
			i++;
			$scope.fails.push(schema);
			proc();
		});
	}
	proc();
})
.controller('CloudDiagnoseCtrl', ['$scope', '$http', 'config', function($scope, $http, config){
	$scope.showToken = function() {
		util.message('Token:' + $('#token').val(), '', 'info');
	};

	$('.js-checkip p').each(function(){
		var $this = $(this);
		$.getJSON('./index.php?c=cloud&a=diagnose&do=testapi&ip='+$this.find('#serverdnsip').html(), function(testdata) {
			$this.find('#checkresult').html(testdata.message.message);
		});
	});
	$.ajax({
		type : "get",
		data : {'date' : config.date, 'version' : config.version, 'siteurl' : config.siteurl},
		url : "//s.we7.cc/index.php?c=site&a=diagnose&jsonpcallback=?",
		dataType : "jsonp",
		success : function(data){
			if (data['check_time']['errno'] == '0') {
				$('#check-time').html('<i class="fa fa-check text-success"></i> 正常');
			} else {
				$('#check-time').html('<i class="fa fa-remove text-warning"></i> 异常，当前时间为：'+data['check_time']['message']['localtime']+"; 服务器时间为："+data['check_time']['message']['servertime']);
			}
			if (data['check_touch']['errno'] == '0') {
				$('#check-touch').html('<i class="fa fa-check text-success"></i> 正常');
			} else {
				$('#check-touch').html('<i class="fa fa-remove text-warning"></i> 异常，'+data['check_touch']['message']);
			}
		},
		error:function(){
			alert('fail');
		}
	});
}]);