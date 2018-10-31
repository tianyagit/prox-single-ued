angular.module('cloudApp', ['we7app']);
angular.module('cloudApp').controller('FileProcessorCtrl', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.files = config.files;
    $scope.fails = [];
    var total = $scope.files.length;
    var i = 1;
    var errormsg = '';
    var tasknum = config.tasknum && config.type != '' ? config.tasknum : 1;
    if (tasknum > total) {
      tasknum = 1;
    }
    var proc = function () {
      var path = $scope.files.pop();
      if (!path && i >= total) {
        util.message('\u6587\u4ef6\u540c\u6b65\u5b8c\u6210\uff0c\u6b63\u5728\u5904\u7406\u6570\u636e\u540c\u6b65......');
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
      var params = {
          path: path,
          type: config.type
        };
      $http.post(location.href, params).success(function (dat) {
        i++;
        if (dat != 'success') {
          $scope.fails.push('[' + dat + '] ' + path);
          errormsg = dat;
        }
        proc();
      }).error(function () {
        i++;
        $scope.fails.push(path);
        proc();
      });
    };
    for (j = 0; j < tasknum; j++) {
      proc();
    }
  }
]).controller('SchemasProcessorCtrl', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.schemas = config.schemas;
    $scope.fails = [];
    var is_m_install = config.is_module_install;
    var total = $scope.schemas.length;
    var i = 1;
    var error = function () {
      util.message('\u672a\u80fd\u6210\u529f\u6267\u884c\u5904\u7406\u6570\u636e\u5e93, \u8bf7\u8054\u7cfb\u5f00\u53d1\u5546\u89e3\u51b3. ');
    };
    var proc = function () {
      var schema = $scope.schemas.pop();
      if (!schema) {
        if ($scope.fails.length > 0) {
          error();
          return;
        } else {
          if (is_m_install == 1) {
            location.href = '';
          } else {
            location.href = '';
          }
          return;
        }
      }
      $scope.schema = schema;
      $scope.pragress = i + '/' + total;
      var params = { table: schema };
      $http.post(location.href, params).success(function (dat) {
        i++;
        if (dat != 'success') {
          $scope.fails.push(schema);
        }
        if (dat['message']) {
          util.message(dat['message']);
          return;
        }
        proc();
      }).error(function () {
        i++;
        $scope.fails.push(schema);
        proc();
      });
    };
    proc();
  }
]).controller('CloudDiagnoseCtrl', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.showToken = function () {
      util.message('Token:' + $('#token').val(), '', 'info');
    };
    $('.js-checkip p').each(function () {
      var $this = $(this);
      $.getJSON('./index.php?c=cloud&a=diagnose&do=testapi&ip=' + $this.find('#serverdnsip').html(), function (testdata) {
        $this.find('#checkresult').html(testdata.message.message);
      });
    });
    $.ajax({
      type: 'get',
      data: {
        'date': config.date,
        'version': config.version,
        'siteurl': config.siteurl
      },
      url: '//s.we7.cc/index.php?c=site&a=diagnose&jsonpcallback=?',
      dataType: 'jsonp',
      success: function (data) {
        if (data['check_time']['errno'] == '0') {
          $('#check-time').html('<i class="fa fa-check text-success"></i> \u6b63\u5e38');
        } else {
          $('#check-time').html('<i class="fa fa-remove text-warning"></i> \u5f02\u5e38\uff0c\u5f53\u524d\u65f6\u95f4\u4e3a\uff1a' + data['check_time']['message']['localtime'] + '; \u670d\u52a1\u5668\u65f6\u95f4\u4e3a\uff1a' + data['check_time']['message']['servertime']);
        }
        if (data['check_touch']['errno'] == '0') {
          $('#check-touch').html('<i class="fa fa-check text-success"></i> \u6b63\u5e38');
        } else {
          $('#check-touch').html('<i class="fa fa-remove text-warning"></i> \u5f02\u5e38\uff0c' + data['check_touch']['message']);
        }
      },
      error: function () {
        alert('fail');
      }
    });
  }
]);