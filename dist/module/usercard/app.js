angular.module('userCardApp', ['wapeditorApp']).controller('MainCtrl', [
  '$scope',
  'widget',
  'config',
  'serviceBase',
  'serviceUserCardBase',
  'serviceSubmit',
  'serviceCommon',
  '$sanitize',
  function ($scope, widget, config, serviceBase, serviceUserCardBase, serviceSubmit, serviceCommon, $sanitize) {
    $scope.modules = [];
    $scope.editors = [];
    //全部插入模块数据
    $scope.activeModules = serviceBase.initActiveModules(config.activeModules);
    //当前活动的模块
    $scope.activeItem = {};
    //当前活动模块的索引
    $scope.activeIndex = 0;
    //模块流水id
    $scope.index = config.activeModules ? config.activeModules.length : 0;
    $scope.submit = {
      'params': {},
      'html': ''
    };
    $scope.newcard = config.newcard;
    $scope.fansFields = config.fansFields;
    // 监听事件区域
    $scope.$on('serviceBase.editors.update', function (event, editors) {
      $scope.editors = editors;
    });
    $scope.$on('serviceBase.activeItem.update', function (event, activeItem) {
      $scope.activeItem = activeItem;
    });
    $scope.$on('serviceBase.activeModules.update', function (event, activeModules) {
      $scope.activeModules = activeModules;
    });
    // base区域
    $scope.addItem = function (type) {
      serviceBase.addItem(type);
    };
    $scope.editItem = function (index) {
      serviceUserCardBase.editItem(index);
    };
    $scope.deleteItem = function (index) {
      serviceBase.deleteItem(index);
    };
    $scope.init = function (modules, showModules) {
      $scope.modules = serviceBase.setModules(modules, showModules);
      if ($scope.activeModules.length > 0) {
        var activeModulesKey = [];
        angular.forEach($scope.activeModules, function (module, index) {
          if (module) {
            activeModulesKey.push(module.id);
          }
        });
      }
      angular.forEach($scope.modules, function (module, index) {
        if (module.defaultshow && $.inArray(module.id, activeModulesKey) == -1) {
          serviceBase.addItem(module.id);
        }
      });
    };
    $scope.url = function (segment) {
      return serviceCommon.url(segment);
    };
    $scope.tomedia = function (url) {
      return serviceCommon.tomedia(url);
    };
    $scope.submit = function (event) {
      $scope.submit = serviceSubmit.submit();
      $scope.$apply('submit');
      $(event.target).parents('form').submit();
    };
    $scope.addFields = function () {
      serviceUserCardBase.addFields();
    };
    $scope.removeFields = function (item) {
      serviceUserCardBase.removeFields(item);
    };
    $scope.addNums = function () {
      serviceUserCardBase.addNums();
    };
    $scope.removeNums = function (item) {
      serviceUserCardBase.removeNums(item);
    };
    $scope.addRecharges = function () {
      serviceUserCardBase.addRecharges();
    };
    $scope.removeRecharges = function (item) {
      serviceUserCardBase.removeRecharges(item);
    };
    $scope.addTimes = function () {
      serviceUserCardBase.addTimes();
    };
    $scope.removeTimes = function (item) {
      serviceUserCardBase.removeTimes(item);
    };
    $scope.selectCoupon = function () {
      serviceUserCardBase.selectCoupon();
    };
    $scope.clearCoupon = function () {
      serviceUserCardBase.clearCoupon();
    };
    $scope.addThumb = function (type) {
      serviceUserCardBase.addThumb(type);
    };
    $scope.addBgThumb = function () {
      serviceUserCardBase.addBgThumb();
    };
    $('.single-submit').on('click', function (event) {
      $scope.submit(event);
    });
    $scope.init(null, [
      'cardBasic',
      'cardActivity',
      'cardNums',
      'cardTimes',
      'cardRecharge'
    ]);
    $scope.activeModules[1].params.discounts = config.discounts;
    $scope.editItem(0);
  }
]);