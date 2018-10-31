angular.module('qrApp', ['we7app']);
angular.module('qrApp').controller('QrDisplay', [
  '$scope',
  function ($scope) {
    $('.js-clip').each(function () {
      util.clip(this, $(this).attr('data-url'));
    });
  }
]);
//新建/编辑二维码
angular.module('qrApp').controller('QrPost', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    //二维码类型
    if (config.id > 0) {
      $scope.type = 0;
    } else {
      $scope.type = 1;
    }
    $('.we7-select').change(function () {
      var val = $('.we7-select').val();
      if (val == 1) {
        $scope.type = 1;
      } else {
        $scope.type = 2;
      }
      $scope.$apply($scope.type);
    });
    if ($.isFunction(window.initReplyController)) {
      window.initReplyController($scope, $http);
    }
    ;
    $('.submit').on('click', function () {
      if ($scope.checkSubmit()) {
        return true;
      }
      return false;
    });
    $scope.checkSubmit = function () {
      if ($(':text[name=\'scene-name\']').val() == '') {
        util.message('\u62b1\u6b49\uff0c\u4e8c\u7ef4\u7801\u540d\u79f0\u4e3a\u5fc5\u586b\u9879\uff0c\u8bf7\u8fd4\u56de\u4fee\u6539\uff01');
        return false;
      }
      if ($scope.type == 1) {
        if ($(':text[name=\'expire-seconds\']').val() == '') {
          util.message('\u62b1\u6b49\uff0c\u4e34\u65f6\u4e8c\u7ef4\u7801\u8fc7\u671f\u65f6\u95f4\u4e3a\u5fc5\u586b\u9879\uff0c\u8bf7\u8fd4\u56de\u4fee\u6539\uff01');
          return false;
        }
        var r2 = /^\+?[1-9][0-9]*$/;
        if (!r2.test($(':text[name=\'expire-seconds\']').val())) {
          util.message('\u62b1\u6b49\uff0c\u4e34\u65f6\u4e8c\u7ef4\u7801\u8fc7\u671f\u65f6\u95f4\u5fc5\u987b\u4e3a\u6b63\u6574\u6570\uff0c\u8bf7\u8fd4\u56de\u4fee\u6539\uff01');
          return false;
        }
        if (parseInt($(':text[name=\'expire-seconds\']').val()) < 30 || parseInt($(':text[name=\'expire-seconds\']').val()) > 2592000) {
          util.message('\u62b1\u6b49\uff0c\u4e34\u65f6\u4e8c\u7ef4\u7801\u8fc7\u671f\u65f6\u95f4\u5fc5\u987b\u572830-2592000\u79d2\u4e4b\u95f4\uff0c\u8bf7\u8fd4\u56de\u4fee\u6539\uff01');
          return false;
        }
      }
      if ($scope.type == 2) {
        var scene_str = $.trim($('#scene_str').val());
        if (!scene_str) {
          util.message('\u573a\u666f\u503c\u4e0d\u80fd\u4e3a\u7a7a\uff01');
          return false;
        }
        var reg = /^\d+$/g;
        if (reg.test(scene_str)) {
          util.message('\u573a\u666f\u503c\u4e0d\u80fd\u662f\u6570\u5b57\uff01');
          return false;
        }
        $http.post('{php echo url(\'platform/qr/check_scene_str\')}', { 'scene_str': scene_str }).success(function (data) {
          if (data.message.errno == 1 && data.message.message == 'repeat') {
            util.message('\u573a\u666f\u503c\u548c\u73b0\u6709\u4e8c\u7ef4\u7801\u573a\u666f\u503c\u91cd\u590d\uff0c\u8bf7\u4fee\u6539\u573a\u666f\u503c');
            return false;
          }
        });
      }
      if ($(':hidden[name=\'reply[reply_keyword]\']').val() == '') {
        util.message('\u62b1\u6b49\uff0c\u8bf7\u9009\u62e9\u4e8c\u7ef4\u7801\u8981\u89e6\u53d1\u7684\u5173\u952e\u5b57\uff01');
        return false;
      }
      return true;
    };
  }
]);
//长连接转二维码
angular.module('qrApp').controller('UrlToQr', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.copyLink = '';
    //点击选择【系统连接】事件
    $scope.selectUrl = function () {
      var ipt = $('#longurl');
      util.linkBrowser(function (href) {
        var site_url = config.site_url;
        if (href.substring(0, 4) == 'tel:') {
          util.message('\u957f\u94fe\u63a5\u4e0d\u80fd\u8bbe\u7f6e\u4e3a\u4e00\u952e\u62e8\u53f7');
          return false;
        } else if (href.indexOf('http://') == -1 && href.indexOf('https://') == -1) {
          href = href.replace('./index.php?', '/index.php?');
          href = site_url + 'app' + href;
        }
        ipt.val(href);
      });
    };
    //转换成链接
    $scope.transformUrl = function () {
      var longurl = $('#longurl').val().trim();
      if (longurl == '') {
        util.message('\u8bf7\u8f93\u5165\u957f\u94fe\u63a5');
        return false;
      } else if (longurl.indexOf('http://') == -1 && longurl.indexOf('https://') == -1 && longurl.indexOf('weixin://') == -1) {
        util.message('\u8bf7\u8f93\u5165\u6709\u6548\u7684\u957f\u94fe\u63a5');
        return false;
      }
      var change = $('#change');
      var img_url = config.img_url;
      change.html('<i class="fa fa-spinner"></i> \u8f6c\u6362\u4e2d');
      $http.post(config.transform_url, { 'longurl': longurl }).success(function (data) {
        if (data.message.errno == -1) {
          util.message(data.message.message);
          change.html('\u7acb\u5373\u8f6c\u6362');
          return false;
        } else {
          $('#shorturl').val(data.message.message.short_url);
          $scope.copyLink = data.message.message.short_url;
          $('.url-short').next().attr({ 'data-url': data.message.message.short_url }).removeClass('disabled');
          $('#qrsrc').attr('src', img_url + 'url=' + data.message.message.short_url);
          $('.qr-img').next().removeClass('disabled');
          change.html('\u7acb\u5373\u8f6c\u6362');
        }
      });
    };
    //保存二维码
    $scope.downQr = function () {
      var qr = $('#shorturl').val();
      var down_url = config.down_url;
      window.location.href = down_url + 'qrlink=' + qr;
    };
    $scope.success = function (id) {
      var id = parseInt(id);
      var obj = $('<span class="label label-success" style="position:absolute;height:33px;line-height:28px;"><i class="fa fa-check-circle"></i> \u590d\u5236\u6210\u529f</span>');
      var enext = $('#copy-' + id).next().html();
      if (!enext || enext.indexOf('<span class="label label-success" style="position:absolute;z-index:10"><i class="fa fa-check-circle"></i> \u590d\u5236\u6210\u529f</span>') < 0) {
        $('#copy-' + id).after(obj);
      }
      setTimeout(function () {
        obj.remove();
      }, 2000);
    };
  }
]);
angular.module('qrApp').controller('QrStatistics', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.link = config.link;
    $scope.changeStatus = function () {
      $http.post($scope.link.changeStatus, {}).success(function (data) {
        if (data.message.errno == 0) {
          location.reload();
        } else {
          util.message(data.message.message, data.redirect, 'ajax');
        }
      });
    };
  }
]);