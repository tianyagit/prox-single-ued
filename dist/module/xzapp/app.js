angular.module('xzApp', [
  'we7app',
  'infinite-scroll'
]);
//熊掌号管理
//添加熊掌号-step1
angular.module('xzApp').controller('XzappPostStepOne', [
  '$scope',
  'config',
  function ($scope, config) {
  }
]);
//添加熊掌号-step2
angular.module('xzApp').controller('XzappPostStepTwo', [
  '$scope',
  function ($scope) {
    $scope.account = {};
    $scope.uploadMultiImage = function (type) {
      require(['fileUploader'], function (uploader) {
        uploader.init(function (imgs) {
          $scope.account[type] = imgs.url;
          $scope.$apply($scope.account);
        }, {
          'direct': true,
          'multiple': false
        });
      });
    };
    $scope.delMultiImage = function (type) {
      $scope.account[type] = '';
    };
  }
]);
//添加熊掌号-step3
angular.module('xzApp').controller('XzappPostStepThree', [
  '$scope',
  'config',
  'XzAppCommon',
  function ($scope, config, XzAppCommon) {
    $scope.notify = config.notify;
    $scope.owner = config.owner;
    $scope.links = config.links;
    $scope.selectOwner = function (ev) {
      ev.preventDefault();
      XzAppCommon.selectOwner();
    };
    $scope.changeGroup = function () {
      var user = $('input[name="uid"]').val();
      if (!user) {
        $('#groupid').val(0);
        util.message('\u8bf7\u5148\u9009\u62e9\u7ba1\u7406\u5458');
        return false;
      }
      XzAppCommon.update_package_list($('#groupid').find('option:selected').data('package'));
    };
    $scope.addPermission = XzAppCommon.addPermission;
  }
]);
//添加熊掌号-step4
angular.module('xzApp').controller('XzappPostStepFour', [
  '$scope',
  'config',
  function ($scope, config) {
    $scope.account = config.account;
    $scope.links = config.links;
    $scope.url = config.links.siteroot + 'api.php?id=' + $scope.account.acid;
    $scope.success = function (id) {
      var id = parseInt(id);
      var obj = $('<span class="label label-success" style="position:absolute;z-index:10"><i class="fa fa-check-circle"></i> \u590d\u5236\u6210\u529f</span>');
      AccountAppCommon.copySuccess(id, obj);
    };
  }
]);
//熊掌号管理-基础信息
angular.module('xzApp').controller('XzappManageBase', [
  '$scope',
  '$http',
  'config',
  'XzAppCommon',
  function ($scope, $http, config, XzAppCommon) {
    $scope.account = config.account;
    $scope.uniaccount = config.uniaccount;
    $scope.authstate = config.authstate;
    $scope.authurl = config.authurl;
    $scope.founder = config.founder;
    $scope.owner = config.owner;
    $scope.xzapp_normal = config.xzapp_normal;
    $scope.xzapp_auth = config.xzapp_auth;
    $scope.other = {
      headimgsrc: config.headimgsrc,
      qrcodeimgsrc: config.qrcodeimgsrc,
      serviceUrl: config.links.siteroot + 'api.php?id=' + $scope.account.acid,
      siteurl: config.links.siteroot
    };
    $scope.changeImage = function (type, uniacid) {
      if (type == 'headimgsrc' || type == 'qrcodeimgsrc') {
        require(['fileUploader'], function (uploader) {
          uploader.init(function (imgs) {
            $scope.other[type] = imgs.url;
            $scope.$apply($scope.other);
            $scope.httpChange(type);
          }, {
            'direct': true,
            'multiple': false,
            'uniacid': uniacid
          });
        });
      }
    };
    $scope.success = function (id) {
      var id = parseInt(id);
      var obj = $('<a href="javascript:;" class="btn btn-success btn-sm we7-margin-left-sm"><i class="fa fa-check-circle"></i> \u590d\u5236\u6210\u529f</a>');
      XzAppCommon.copySuccess(id, obj);
    };
    $scope.editInfo = function (type, val) {
      $scope.middleAccount = {};
      $scope.middleAccount[type] = val;
    };
    $scope.httpChange = function (type, newval) {
      switch (type) {
      case 'headimgsrc':
      case 'qrcodeimgsrc':
        $http.post(config.links.basePost, {
          type: type,
          imgsrc: $scope.other[type]
        }).success(function (data) {
          if (data.message.errno == 0) {
            $('.wechat-img').attr('src', $scope.other[type]);
            util.message('\u4fee\u6539\u6210\u529f\uff01', '', 'success');
          } else {
            if (data.message.errno == -1)
              util.message(data.message.message, data.redirect, 'error');
            if (data.message.errno == 1)
              util.message(data.message.message, '', 'error');
            if (data.message.errno == 40035)
              util.message(data.message.message, '', 'error');
          }
        });
        break;
      case 'name':
      case 'account':
      case 'original':
      case 'level':
      case 'key':
      case 'secret':
      case 'attachment_limit':
        $('#' + type).modal('hide');
        if ($scope.middleAccount[type].length == 0 && type != 'attachment_limit') {
          util.message('\u4e0d\u53ef\u4e3a\u7a7a\uff01', '', 'error');
          return false;
        }
        $http.post(config.links.basePost, {
          type: type,
          request_data: $scope.middleAccount[type]
        }).success(function (data) {
          if (data.message.errno == 0) {
            $scope.account[type] = $scope.middleAccount[type];
            util.message('\u4fee\u6539\u6210\u529f\uff01', '', 'success');
          } else {
            if (data.message.errno == 1)
              util.message(data.message.message, '', 'error');
            if (data.message.errno == 40035)
              util.message(data.message.message, '', 'error');
          }
        });
        break;
      case 'jointype':
        $('#jointype').modal('hide');
        if ($scope.middleAccount.type == $scope.xzapp_normal) {
          $http.post(config.links.basePost, {
            type: 'jointype',
            request_data: $scope.xzapp_normal
          }).success(function (data) {
            if (data.message.errno == 0) {
              $scope.account[type] = $scope.middleAccount[type];
              $scope.account.type = 1;
              util.message('\u4fee\u6539\u6210\u529f\uff01', '', 'success');
            } else {
              if (data.message.errno == 1)
                util.message(data.message.message, '', 'error');
              if (data.message.errno == 40035)
                util.message(data.message.message, '', 'error');
            }
          });
        }
        if ($scope.middleAccount.type == $scope.xzapp_auth) {
          util.message('\u6682\u4e0d\u652f\u6301\u6388\u6743\u63a5\u5165\uff01');
          return false;
          if (config.authurl.errno == 1) {
            util.message(config.authurl.url);
          } else {
            if (confirm('\u5fc5\u987b\u901a\u8fc7\u718a\u638c\u53f7\u6388\u6743\u767b\u5f55\u9875\u9762\u8fdb\u884c\u6388\u6743\u63a5\u5165\uff0c\u662f\u5426\u8df3\u8f6c\u81f3\u6388\u6743\u9875\u9762...')) {
              location.href = config.authurl.url;
            } else {
              return false;
            }
          }
        }
        break;
      case 'token':
        $('#token').modal('hide');
        if (typeof newval == 'undefined') {
          if (!confirm('\u786e\u5b9a\u8981\u751f\u6210\u65b0\u7684\u5417\uff1f')) {
            return false;
          }
          var token = XzAppCommon.tokenGen();
        } else {
          var token = $('#newtoken').val();
          if (token.length == 0) {
            util.message('\u4e0d\u53ef\u4e3a\u7a7a\uff01');
            return false;
          }
          var reg = new RegExp(/^[A-Za-z0-9]{3,32}$/);
          if (!reg.test(token)) {
            util.message('\u5fc5\u987b\u4e3a\u82f1\u6587\u6216\u8005\u6570\u5b57\uff0c\u957f\u5ea6\u4e3a3\u523032\u4e2a\u5b57\u7b26\uff01');
            return false;
          }
        }
        $http.post(config.links.basePost, {
          type: type,
          request_data: token
        }).success(function (data) {
          if (data.message.errno == 0) {
            $scope.account[type] = token;
            util.message('\u4fee\u6539\u6210\u529f\uff01');
          } else {
            if (data.message.errno == -1)
              util.message(data.message.message, data.redirect, 'error');
            if (data.message.errno == 1)
              util.message(data.message.message, '', 'error');
            if (data.message.errno == 40035)
              util.message(data.message.message, '', 'error');
          }
        });
        break;
      case 'encodingaeskey':
        $('#encodingaeskey').modal('hide');
        if (typeof newval == 'undefined') {
          if (!confirm('\u786e\u5b9a\u8981\u751f\u6210\u65b0\u7684\u5417\uff1f')) {
            return false;
          }
          var encoding = XzAppCommon.encodingAESKeyGen();
        } else {
          var encoding = $('#newencodingaeskey').val();
          if (encoding.length == 0) {
            util.message('\u4e0d\u53ef\u4e3a\u7a7a\uff01');
            return false;
          }
          var reg = new RegExp(/^[A-Za-z0-9]{43}$/);
          if (!reg.test(encoding)) {
            util.message('\u5fc5\u987b\u4e3a\u82f1\u6587\u6216\u8005\u6570\u5b57\uff0c\u957f\u5ea6\u4e3a43\u4e2a\u5b57\u7b26\uff01');
            return false;
          }
        }
        $http.post(config.links.basePost, {
          type: type,
          request_data: encoding
        }).success(function (data) {
          if (data.message.errno == 0) {
            $scope.account[type] = encoding;
            util.message('\u4fee\u6539\u6210\u529f\uff01');
          } else {
            if (data.message.errno == -1)
              util.message(data.message.message, data.redirect, 'error');
            if (data.message.errno == 1)
              util.message(data.message.message, '', 'error');
            if (data.message.errno == 40035)
              util.message(data.message.message, '', 'error');
          }
        });
        break;
      case 'highest_visit':
        if (typeof $scope.middleAccount.highest_visit == 'number') {
          $http.post(config.links.basePost, {
            type: type,
            request_data: $scope.middleAccount.highest_visit
          }).success(function (data) {
            if (data.message.errno == 0) {
              $scope.account[type] = $scope.middleAccount.highest_visit;
              util.message('\u4fee\u6539\u6210\u529f\uff01');
            } else {
              util.message(data.message.message, '', 'error');
            }
          });
        }
        break;
      case 'endtime':
        var endtime = $('[name="endtime"]').val();
        $http.post(config.links.basePost, {
          type: 'endtime',
          endtype: $scope.middleAccount.endtype,
          endtime: endtime
        }).success(function (data) {
          if (data.message.errno == 1) {
            util.message(data.message.message, '', 'info');
          } else {
            $scope.account.endtype = $scope.middleAccount.endtype;
            $scope.account.end = $scope.account.endtype == 2 ? endtime : '\u6c38\u4e45';
            util.message('\u4fee\u6539\u6210\u529f\uff01');
          }
        });
        break;
      }
    };
  }
]);