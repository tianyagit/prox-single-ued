angular.module('wapeditorApp').factory('serviceBase', [
  '$rootScope',
  'widget',
  'config',
  'serviceCommon',
  'serviceSetStyle',
  '$timeout',
  function ($rootScope, widget, config, serviceCommon, serviceSetStyle, $timeout) {
    var serviceBase = {};
    var baseData = {
        'modules': [],
        'editors': [],
        'activeModules': [],
        'index': 0,
        'activeItem': {},
        'activeIndex': 0,
        'pageLength': 1,
        'isNew': true
      };
    serviceBase.setModules = function (modules, showModules) {
      if (_.isNull(modules)) {
        baseData.modules = widget;
      }
      if (_.isArray(modules)) {
        for (i in modules) {
          var index = _.findIndex(widget, { 'id': modules[i] }), item;
          if (index > -1) {
            item = angular.copy(widget[index]);
            baseData.modules.push(item);
          }
        }
      }
      if (_.isArray(showModules)) {
        for (i in showModules) {
          var index = _.findIndex(baseData.modules, { 'id': showModules[i] });
          if (index > -1) {
            baseData.modules[index]['defaultshow'] = true;
          }
        }
      }
      return baseData.modules;
    };
    serviceBase.setEditors = function (id) {
      baseData.editors.push(id);
    };
    serviceBase.updateActiveModules = function (module, ispush) {
      if (ispush) {
        baseData.activeModules.push({
          'id': module.id,
          'name': module.name,
          'params': angular.copy(module.params),
          'originParams': angular.copy(module.params),
          'issystem': module.issystem ? 1 : 0,
          'index': baseData.index,
          'displayorder': module.displayorder ? module.displayorder : baseData.activeModules.length
        });
      } else {
      }
    };
    serviceBase.initActiveModules = function (val) {
      baseData.activeModules = val ? angular.copy(val) : [];
      return baseData.activeModules;
    };
    serviceBase.addItem = function (type, curdo) {
      angular.forEach(baseData.modules, function (module, index) {
        if (module.id == type) {
          var newmodule = {};
          newmodule = angular.copy(module);
          if ($.inArray(type, baseData.editors) == -1) {
            serviceBase.setEditors(module.id);
            serviceBase.broadcast('editors');
          }
          if (type != 'header' && type != 'UCheader') {
            newmodule.params = curdo === 'uc' ? serviceSetStyle.UcInitStyleParams(module.params) : serviceSetStyle.initStyleParams(module.params);
          }
          serviceBase.updateActiveModules(newmodule, true);
          baseData.activeIndex = _.findIndex(baseData.activeModules, { 'index': parseInt(baseData.index) });
          baseData.activeItem = curdo === 'uc' ? baseData.activeModules[baseData.index] : baseData.activeModules[baseData.activeIndex];
          baseData.index++;
          serviceBase.triggerActiveItem(baseData.activeIndex);
          $('.app-text-edit').find('.nav-tabs').find('a[href=\'#attribute\']').click();
          serviceBase.broadcast('activeItem');
          serviceBase.broadcast('activeModules');
          if (type != 'header' && type != 'UCheader') {
            serviceSetStyle.initSetStyle(newmodule.params);
          }
          return;
        }
      });
    };
    serviceBase.editItem = function (index) {
      //切换当前选中的模块到activeItem
      var index = _.findIndex(baseData.activeModules, { 'index': parseInt(index) });
      if (index > -1) {
        baseData.activeIndex = index;
        baseData.activeItem = baseData.activeModules[index];
      }
      if ($.inArray(baseData.activeItem.id, baseData.editors) == -1) {
        serviceBase.setEditors(baseData.activeItem.id);
        serviceBase.broadcast('editors');
      }
      serviceBase.triggerActiveItem(index);
      $('.app-text-edit').find('.nav-tabs').find('a[href=\'#attribute\']').click();
      serviceBase.broadcast('activeItem');
    };
    serviceBase.deleteItem = function (index) {
      if (confirm('\u5220\u9664\u540e\u9700\u8981\u91cd\u65b0\u63d0\u4ea4\u624d\u4f1a\u751f\u6548\uff0c\u786e\u8ba4\u5417\uff1f')) {
        var prevIndex = $('#module-' + index).prev().attr('index');
        var index = _.findIndex(baseData.activeModules, { 'index': parseInt(index) });
        baseData.activeModules = _.without(baseData.activeModules, baseData.activeModules[index]);
        baseData.activeIndex = _.findIndex(baseData.activeModules, { 'index': parseInt(prevIndex) });
        baseData.activeItem = baseData.activeModules[baseData.activeIndex];
        serviceBase.broadcast('activeItem');
        serviceBase.broadcast('activeModules');
      }
    };
    serviceBase.triggerActiveItem = function (index) {
      if ($('#module-' + baseData.activeModules[index].index).size() && $('#editor' + baseData.activeModules[index].id).size()) {
        clearTimeout(timer);
      } else {
        timer = $timeout(function () {
          serviceBase.triggerActiveItem(index);
        }, 50);
      }
    };
    serviceBase.getBaseData = function (name) {
      return baseData[name];
    };
    serviceBase.setBaseData = function (name, value) {
      if (angular.isObject(name)) {
        angular.forEach(name, function (val, key) {
          baseData[key] = val;
        });
      } else {
        baseData[name] = value;
      }
      serviceBase.broadcast(name);
    };
    serviceBase.broadcast = function (name) {
      //name为字符串和对象时，分别处理
      switch (name) {
      case 'activeItem':
        $rootScope.$broadcast('serviceBase.activeItem.update', baseData.activeItem);
        break;
      case 'activeModules':
        $rootScope.$broadcast('serviceBase.activeModules.update', baseData.activeModules);
        break;
      case 'editors':
        $rootScope.$broadcast('serviceBase.editors.update', baseData.editors);
        break;
      case 'modules':
      case 'index':
      case 'activeIndex':
      case 'pageLength':
      case 'isNew':
        break;
      default:
        //name为对象时
        if (angular.isObject(name)) {
          angular.forEach(name, function (val, key) {
            switch (key) {
            case 'activeItem':
              $rootScope.$broadcast('serviceBase.activeItem.update', baseData.activeItem);
              break;
            case 'activeModules':
              $rootScope.$broadcast('serviceBase.activeModules.update', baseData.activeModules);
              break;
            case 'editors':
              $rootScope.$broadcast('serviceBase.editors.update', baseData.editors);
              break;
            case 'modules':
            case 'index':
            case 'activeIndex':
            case 'pageLength':
            case 'isNew':
              break;
            }
          });
        }
        break;
      }
    };
    return serviceBase;
  }
]);