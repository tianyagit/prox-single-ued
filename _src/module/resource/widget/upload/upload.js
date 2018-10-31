
function UploadController($scope, $sce, uiUploader,$timeout) {

	var ctrl = this;
	ctrl.currentFile = null;
	$scope.uploading = true; // 是否上传中 必须
	ctrl.uploadProgress = 0; //上传进度
	ctrl.$onInit = function() {
		
	};

	// uploading 无法实时刷新的bug
	function uploading_state_change(loading) {
		$timeout(function(){
			$scope.uploading = loading;
		});
	}

	function initdrop() {
		if (document.addEventListener) {
			document.addEventListener('dragenter', function(e){  
				e.stopPropagation();  
				e.preventDefault();  
			}, false);  
			document.addEventListener('dragover', function(e){  
				e.stopPropagation();  
				e.preventDefault(); 
			}, false);  
			document.getElementById('material-Modal').addEventListener('drop',function(e){
				e.stopPropagation();  
				e.preventDefault();
				upload(e.dataTransfer.files); 
			});
		}
	}
	initdrop();
	function upload(files) {
		if (ctrl.uploading) { //如果在上传中直接返回
			return;
		}
		var file = files[0];
		ctrl.filename = file.name;
		ctrl.filesize = parseInt(file.size/1024);
		ctrl.files = files;
		uploading_state_change(true);
		var url = ctrl.uploadUrl;
		uiUploader.upload(files,url,{onProgress:onProgress}).then(function(response) {
			var repJson = JSON.parse(response);
			uploading_state_change(false);
			bindFileChange();

			if (repJson.message && repJson.message != '') {
				ctrl.onUploadError({mes:repJson.message});// 抛出上传错误信息
				return;
			}
			// if (repJson.error == 0 || repJson.error == 1) {
			// 	ctrl.onUploadError({mes:repJson.message});// 抛出上传错误信息
			// 	return;
			// }
			ctrl.onUploaded();
		},function(error){
			bindFileChange();
			uploading_state_change(false);
			ctrl.onUploadError('');// 抛出上传错误信息
		});
	}

	function onProgress(file) {
		var progress = parseInt(file.loaded / file.total*100);
		file.filename = file.name;
		file.filesize = parseInt(file.size/1024);
		file.progress = progress;
		ctrl.onProgress({file:file,progress:progress});
		$timeout(function(){
			$scope.progress = progress;
		});
	}
	// 绑定file change事件
	function bindFileChange() {
		// 组件内无法使用 指令
		var element = document.getElementById('we7resourceFile');
		element.value = null;
		element.addEventListener('change', function(e) {
			var files = e.target.files;
			upload(files);
		});
	}
	bindFileChange();
}

UploadController['$inject'] = ['$scope', '$sce', 'uiUploader','$timeout']; //注入需要的服务


angular.module('we7resource').component('we7UploaderBtn', {
	templateUrl : 'widget-upload-upload.html',//require('./upload.html'),
	controller : UploadController,
	transclude : true,
	replace : true,
	bindings: {
		name : '<',
		uploadUrl : '<', // 上传url
		accept : '<', // 上传文件 input accept 属性
		onUploading : '&', // 上传中....
		onUploaded : '&', // 上传成功
		onUploadError : '&', // 上传成功 
		onProgress : '&', // 上传进度事件  
		multiple : '<' // 多文件上传
	} 
});