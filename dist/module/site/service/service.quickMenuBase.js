angular.module('wesiteApp').service('serviceQuickMenuBase', [
  '$rootScope',
  function ($rootScope) {
    var serviceQuickMenuBase = {};
    var quickMenuData = {};
    serviceQuickMenuBase.initActiveItem = function (val) {
      if (angular.isObject(val)) {
        quickMenuData = val;
      } else {
        quickMenuData = {
          'navStyle': 1,
          'bgColor': '#2B2D30',
          'menus': [],
          'extend': [],
          'position': {
            'homepage': true,
            'usercenter': true,
            'page': true,
            'article': true
          },
          'ignoreModules': {}
        };
      }
      return quickMenuData;
    };
    serviceQuickMenuBase.selectNavStyle = function (val) {
      quickMenuData.navStyle = val;
      return quickMenuData.navStyle;
    };
    serviceQuickMenuBase.addMenu = function () {
      if (typeof quickMenuData.menus == 'undefined') {
        quickMenuData.menus = [];
      }
      quickMenuData.menus.push({
        'title': '\u6807\u9898',
        'url': '',
        'submenus': [],
        'icon': {
          'name': 'fa-home',
          'color': '#00ffff'
        },
        'image': '',
        'hoverimage': '',
        'hovericon': ''
      });
      return quickMenuData.menus;
    };
    serviceQuickMenuBase.removeMenu = function (menu) {
      var index = $.inArray(menu, quickMenuData.menus);
      var items = angular.copy(quickMenuData.menus);
      quickMenuData.menus = [];
      for (i in items) {
        if (i != index) {
          quickMenuData.menus.push(items[i]);
        }
      }
      return quickMenuData.menus;
    };
    serviceQuickMenuBase.addSubMenu = function (menu) {
      var index = _.findIndex(quickMenuData.menus, menu);
      if (typeof quickMenuData.menus[index].submenus == 'undefined') {
        quickMenuData.menus[index].submenus = [{
            'title': '\u6807\u9898',
            'url': ''
          }];
      } else {
        quickMenuData.menus[index].submenus.push({
          'title': '\u6807\u9898',
          'url': ''
        });
      }
      return quickMenuData.menus[index].submenus;
    };
    serviceQuickMenuBase.removeSubMenu = function (index, submenu) {
      quickMenuData.menus[index].submenus = _.without(quickMenuData.menus[index].submenus, submenu);
      return quickMenuData.menus[index].submenus;
    };
    serviceQuickMenuBase.getQuickMenuData = function (name) {
      if (angular.isString(name)) {
        return quickMenuData[name];
      } else {
        return quickMenuData;
      }
    };
    serviceQuickMenuBase.setQuickMenuData = function (name, value) {
      if (angular.isObject(name)) {
        angular.forEach(name, function (val, key) {
          quickMenuData[key] = val;
        });
      } else {
        quickMenuData[name] = value;
      }
    };
    return serviceQuickMenuBase;
  }
]);