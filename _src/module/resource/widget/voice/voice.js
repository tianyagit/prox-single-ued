
function VoiceController($scope, $sce, serviceResource, $controller) {

	$scope.resourceType = 'voice';
	$controller('we7resource-base-controller', {$scope:$scope}); //继承父controller

	$scope.uploadname = '上传语音';
	$scope.accept = 'audio/amr,audio/mp3,audio/wma,audio/wmv,audio/amr';
	

	var ctrl = this;
	ctrl.$onInit = function() {
		ctrl.multiple = false; //多选设置成false
	}; 

	ctrl.itemClick = function(item) {
		if (!ctrl.multiple) { //如果不是多选直接抛事件 关闭

			if ($scope.needConvert()) {
				util.message('当前资源无法选择');
				return;
			}
			if (item.selected) { 
				item.selected = false;
				return;
			}
			item.selected = true;
			$scope.$emit('selected_voice',item);
			return;
		}
	};

	$scope.canConvert = function(item) {
		return false;
	};
	
	$scope.loadData = function() {
		loadData();
	};

	$scope.onIndexChange = function(index) {
		loadData();
		setUploadUrl();//设置上传地址
	};

	setUploadUrl();
	/**
		指令抛出的事件
	*/
	$scope.$on('voice_page_change',function(event,page){
		$scope.setCurrentPage(page);
	});


	ctrl.timeToDate = function (time) {
		var date=new Date(time*1000);
		return date;
	};

	ctrl.getTitle = function(item) {
		return !ctrl.isWechat ? item.filename : item.attachment;
	};
	

	function loadData () {
		serviceResource.getResources('voice',$scope.currentPage,$scope.index==1).then(function(data){
			ctrl.voices= data.items;
			ctrl.pager = $sce.trustAsHtml(data.pager);
		});
	}


	// 设置上传url
	function setUploadUrl () {
		$scope.uploadurl= $scope.index === 0 ? './index.php?c=utility&a=file&do=wechat_upload&upload_type=audio&mode=perm&uniacid='+$scope.uniacid :
			'./index.php?c=utility&a=file&do=upload&upload_type=audio&global='+$scope.global+'&dest_dir='+$scope.dest_dir+'&uniacid='+$scope.uniacid;
	}

	loadData();
}

VoiceController['$inject'] = ['$scope','$sce','serviceResource','$controller']

angular.module('we7resource').component('we7ResourceVoice',{
	templateUrl : 'widget-voice-voice.html',
	controller : VoiceController,
	transclude : true,
	bindings: {
		isWechat : '<', //是否获取微信数据
		showType : '<', //是否显示本地服务器数据  1 微信 2 本地 3 微信和本地都显示
		// onSelected : '&' //form 点击确定后的事件
	}
});