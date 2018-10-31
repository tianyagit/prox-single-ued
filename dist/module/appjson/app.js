angular.module('we7codeAppjsonApp', ['we7app']);
angular.module('we7codeAppjsonApp').controller('code_appjson_ctrl', [
  '$scope',
  '$q',
  'config',
  '$http',
  function ($scope, $q, config, $http) {
    var default_appjson = config.default_appjson;
    var save_url = config.save_url;
    var default_url = config.default_url;
    var convert_img_url = config.convert_img_url;
    if (angular.isString(default_appjson)) {
      default_appjson = JSON.parse(default_appjson);
    }
    if (!default_appjson) {
      default_appjson = {
        pages: {},
        windows: {}
      };
    }
    var tabBar = default_appjson.hasOwnProperty('tabBar') ? default_appjson.tabBar : { list: [] };
    if (tabBar && !tabBar.list) {
      tabBar.list = [];
    }
    if (tabBar && !tabBar.isSystemTabBar) {
      tabBar.isSystemTabBar = 1;
    }
    if (default_appjson && default_appjson.windows) {
      if (default_appjson.windows.navigationBarTitleText) {
        if (default_appjson.windows.navigationBarTitleText.indexOf('\u5fae\u64ce')) {
          default_appjson.windows.navigationBarTitleText = '\u5c0f\u7a0b\u5e8f';
        }
      }
    }
    $scope.pages = default_appjson['pages'];
    $scope.window = default_appjson['window'];
    $scope.tabBar = tabBar;
    $('body').on('click', '.js-image', function () {
      var index = $(this).data('index');
      var pathname = $(this).data('selected') == '0' ? 'iconPath' : 'selectedIconPath';
      util.image({}, function (item) {
        $http.post(convert_img_url, {
          'version_id': config.version_id,
          'att_id': item.id
        }).then(function (data) {
          if (data.data.message.errno == 0) {
            $scope.tabBar.list[index][pathname] = data.data.message.message;  //						$scope.$digest();
          }
        });
      });
    });
    $scope.toJson = function () {
      var json = {
          pages: $scope.pages,
          window: $scope.window,
          tabBar: $scope.tabBar
        };
      return json;
    };
    $scope.iconPath = function (item) {
      return item.iconPath;
    };
    $scope.save = function (item) {
      var json = $scope.toJson();
      $http.post(save_url, {
        json: json,
        'version_id': config.version_id
      }).then(function (data) {
        if (data.data.message.errno == 0) {
          util.message(data.data.message.message, data.data.redirect, 'success');
        } else {
          util.message(data.data.message.message, '', 'error');
        }
      });
    };
    $scope.add = function () {
      $scope.tabBar.list.push({
        'iconSelectedPath': '',
        'iconPath': '',
        'pagePath': $scope.pages[0],
        'text': ''
      });
    };
    $scope.del = function (index) {
      $scope.tabBar.list.splice(index, 1);
    };
    $scope.default = function () {
      $http.post(default_url, { 'version_id': config.version_id }).then(function (data) {
        if (data.data.message.errno == 0) {
          util.message(data.data.message.message, data.data.redirect, 'success');
        } else {
          util.message(data.data.message.message, '', 'error');
        }
      });
    };
    util.colorpicker('.js-color', function () {
    });  //回调不做任何处理
  }
]);