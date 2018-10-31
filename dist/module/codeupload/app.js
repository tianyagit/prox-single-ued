angular.module('we7codeuploadApp', ['we7app']);
angular.module('we7codeuploadApp').controller('code_upload_ctrl', [
  '$scope',
  'config',
  'codeservice',
  '$q',
  '$http',
  function ($scope, config, codeservice, $q, $http) {
    $scope.qrcode_src = '';
    //开发者工具登录二维码
    $scope.preview_qrcode = '';
    //预览二维码
    $scope.show_wait = false;
    $scope.step = 1;
    $scope.show_step1 = true;
    $scope.show_step2 = false;
    $scope.show_step3 = false;
    $scope.wait_sec = 15;
    $scope.user_desc = '';
    $scope.user_version = config.user_version;
    var uuid = null;
    //提交代码凭据
    var ticket = null;
    var sec = 15;
    var interval = setInterval(function () {
        sec--;
        if (sec <= 0) {
          sec = 0;
          clearInterval(interval);
        }
        $scope.$apply(function () {
          //wrapped this within $apply
          $scope.wait_sec = sec;
        });
      }, 1000);
    $scope.beginUpload = function () {
      if (!$scope.user_version || !/^[0-9]{1,2}\.[0-9]{1,2}(\.[0-9]{1,2})?$/.test($scope.user_version)) {
        util.message('\u7248\u672c\u53f7\u9519\u8bef\uff0c\u53ea\u80fd\u662f\u6570\u5b57\u3001\u70b9\uff0c\u6570\u5b57\u6700\u591a2\u4f4d\uff0c\u4f8b\u5982 1.1.1 \u62161.2');
        return false;
      }
      init();
    };
    // 初始化获取提交代码ticket 和 云服务返回的UUID
    var init = function () {
      $scope.show_wait = true;
      $scope.show_step1 = false;
      codeservice.codeuid(config.version_id, $scope.user_version).then(function (code_uuid) {
        return codeservice.retrycodegen(code_uuid);  // 不停检查是否 代码已生成了
      }).then(function (code_uuid) {
        uuid = code_uuid;
        $scope.show_wait = false;
        return codeservice.get_code_token();  // 获取微信UUID
      }).then(function (code_token) {
        $scope.qrcode_src = config.QRCODEURL + '&code_token=' + code_token;
        clearInterval(interval);
        //去掉倒计时
        var def = $q.defer();
        // $('#qrcode').unbind('load').bind('load', function(){
        // 	// def.resolve(code_token);
        // });
        def.resolve(code_token);
        return def.promise;
      }).then(function (code_token) {
        $scope.show_wait = false;
        // 显示第二步
        $scope.step = 2;
        $scope.show_step2 = true;
        return codeservice.retrychecksan(code_token, 408);  //不停获取扫码结果
      }).then(function (new_code_token) {
        //已扫码
        ticket = new_code_token;
        $scope.commit();  //提交代码
      }, function (err) {
        clearInterval(interval);
        //去掉倒计时
        util.message(err);
      });
    };
    // 预览小程序
    $scope.preview = function () {
      codeservice.preview(ticket, uuid).then(function (qrcode_img) {
        $scope.preview_qrcode = 'data:image/jpg;base64,' + qrcode_img;
        $('#qrCodeModal').modal('show');
      }, function (error) {
        util.message(error);
      });
    };
    //提交代码
    $scope.commit = function () {
      if (!$scope.user_version || !/^[0-9]{1,2}\.[0-9]{1,2}(\.[0-9]{1,2})?$/.test($scope.user_version)) {
        util.message('\u7248\u672c\u53f7\u9519\u8bef\uff0c\u53ea\u80fd\u662f\u6570\u5b57\u3001\u70b9\uff0c\u6570\u5b57\u6700\u591a2\u4f4d\uff0c\u4f8b\u5982 1.1.1 \u62161.2');
        return false;
      }
      codeservice.commit(ticket, uuid, $scope.user_version, $scope.user_desc).then(function () {
        $scope.step = 3;
        $scope.show_step2 = false;
        $scope.show_step3 = true;
        $http.post(config.upgrade_url, {
          'version_id': config.version_id,
          'version': $scope.user_version,
          'description': $scope.user_desc
        }).success(function (data) {
        });
      }, function (error) {
        util.message(error);
      });
    };
  }
]);