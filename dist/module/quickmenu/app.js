angular.module('quickMenuApp', ['wapeditorApp']);
angular.module('quickMenuApp').controller('MainCtrl', [
  '$scope',
  'config',
  'serviceCommon',
  'serviceQuickMenuBase',
  'serviceQuickMenuSubmit',
  function ($scope, config, serviceCommon, serviceQuickMenuBase, serviceQuickMenuSubmit) {
    $scope.submit = {};
    $scope.activeItem = config.activeItem ? config.activeItem : serviceQuickMenuBase.initActiveItem();
    serviceQuickMenuBase.initActiveItem($scope.activeItem);
    $scope.selectNavStyle = function () {
      var newval = $('input[name="nav_style"]:checked').val();
      $scope.activeItem.navStyle = serviceQuickMenuBase.selectNavStyle(newval);
    };
    $scope.addMenu = function () {
      $scope.activeItem.menus = serviceQuickMenuBase.addMenu();
    };
    $scope.addSubMenu = function (menu) {
      var index = _.findIndex($scope.activeItem.menus, menu);
      $scope.activeItem.menus[index].submenus = serviceQuickMenuBase.addSubMenu(menu);
    };
    $scope.submit = function (event) {
      $scope.submit = serviceQuickMenuSubmit.submit();
      $scope.$apply('submit');
      $(event.target).parents('form').submit();
    };
    $scope.removeMenu = function (menu) {
      $scope.activeItem.menus = serviceQuickMenuBase.removeMenu(menu);
    };
    $scope.removeSubMenu = function (index, submenu) {
      serviceQuickMenuBase.removeSubMenu(index, submenu);
      $scope.activeItem.menus[index].submenus = _.without($scope.activeItem.menus[index].submenus, submenu);
    };
    $scope.showSearchModules = function () {
      $scope.moduleDialog = $('#shop-modules-modal').modal();
      $('#shop-modules-modal .modal-body .btn-primary').html('\u53d6\u6d88');
      $('#shop-modules-modal').find('.modal-footer .btn-primary').unbind('click').click(function () {
        $scope.activeItem.ignoreModules = {};
        $('#shop-modules-modal .modal-body .btn-primary').each(function () {
          $scope.hasIgnoreModules = true;
          $scope.activeItem.ignoreModules[$(this).attr('js-name')] = {
            'name': $(this).attr('js-name'),
            'title': $(this).attr('js-title')
          };
        });
        $scope.$apply('activeItem');
        $scope.$apply('hasIgnoreModules');
        serviceQuickMenuBase.setQuickMenuData('ignoreModules', $scope.activeItem.ignoreModules);
      });
    };
    $('.js-editor-submit').click(function (event) {
      $scope.submit(event);
    });
    $scope.hasIgnoreModules = _.size($scope.activeItem.ignoreModules);
    $('.nav-menu').show();
    $('.app-shopNav-edit').show();
  }
]);