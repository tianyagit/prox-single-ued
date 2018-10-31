angular.module('phoneApp', ['we7app']);
angular.module('phoneApp').controller('phoneCreateCtrl', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.uniacid = config.uniacid;
    $scope.version_id = config.version_id;
    $scope.modules = config.modules;
    $scope.selectedModule = config.version_info.modules;
    $scope.phoneappinfo = config.version_info;
    $scope.selectOrCancelModule = function (module) {
      module.selected = module.selected ? false : true;
      if (module.selected) {
        $scope.selectedModule = [];
        $scope.selectedModule.push(module);
        $('#add_module').modal('hide');
        return;
      }
    };
    $scope.savePhoneApp = function () {
      if (!$scope.phoneappinfo.name && !$scope.uniacid) {
        util.message('APP\u540d\u79f0\u4e0d\u53ef\u4e3a\u7a7a\uff01');
        return false;
      }
      if (!$scope.phoneappinfo.description) {
        util.message('\u8bf7\u586b\u5199\u63cf\u8ff0');
        return false;
      }
      if (!$scope.phoneappinfo.version || !/^[0-9]{1,2}\.[0-9]{1,2}(\.[0-9]{1,2})?$/.test($scope.phoneappinfo.version)) {
        util.message('\u7248\u672c\u53f7\u9519\u8bef\uff0c\u53ea\u80fd\u662f\u6570\u5b57\u3001\u70b9\uff0c\u6570\u5b57\u6700\u591a\u4e24\u4f4d\uff0c\u4f8b\u5982 1.1.1');
        return false;
      }
      $http.post(config.links.create_phone_url, {
        'uniacid': $scope.uniacid,
        'version_id': $scope.version_id,
        'module': $scope.selectedModule,
        'name': $scope.phoneappinfo.name,
        'description': $scope.phoneappinfo.description,
        'version': $scope.phoneappinfo.version
      }).success(function (data) {
        if (data.message.errno == 0) {
          util.message('\u8bbe\u7f6e\u6210\u529f', data.redirect, 'success');
        } else {
          util.message(data.message.message, '', 'error');
          return false;
        }
      });
    };
  }
]);
angular.module('phoneApp').controller('PhoneappWelcomeCtrl', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.notices = config.notices;
  }
]);
angular.module('phoneApp').controller('AccountManagePhoneappCtrl', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.phoneapp_version_lists = config.phoneapp_version_lists;
    $scope.phoneapp_modules = config.phoneapp_modules;
    $scope.version_exist = config.version_exist;
    $scope.delPhoneappVersion = function (id) {
      var id = parseInt(id);
      $http.post(config.links.del_version, { 'version_id': id }).success(function (data) {
        if (data.message.errno == 0) {
          util.message(data.message.message, data.redirect, 'success');
        } else {
          util.message(data.message.message);
        }
      });
    };
  }
]);