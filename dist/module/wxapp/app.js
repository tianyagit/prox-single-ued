angular.module('wxApp', ['we7app']);
angular.module('wxApp').controller('MainCtrl', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.module_bindings = [];
    $scope.create_type = config.create_type;
    $scope.wxappinfo = {
      'name': config.wxappinfo.name,
      'version': '',
      'choose': {
        modules: [],
        template: 1
      },
      'quickmenu': {
        'show': true,
        'bottom': {
          bgcolor: '#bebebe',
          boundary: '#fff',
          selectedColor: '#0f0',
          color: '#428bca'
        },
        'menus': [
          {
            name: '\u9996\u9875',
            defaultImage: './resource/images/bottom-default.png',
            selectedImage: './resource/images/bottom-default.png',
            module: {}
          },
          {
            name: '\u9996\u9875',
            defaultImage: './resource/images/bottom-default.png',
            selectedImage: './resource/images/bottom-default.png',
            module: {}
          }
        ]
      },
      'submit': 'yes',
      'token': config.token,
      'uniacid': config.uniacid,
      'modules': []
    };
    //小程序添加的应用集合
    $scope.apps = [];
    //创建小程序到第几步
    $scope.createStep = 1;
    $scope.version = config.version;
    $scope.isMuti = config.create_type == 2;
    // 1单模块 2 多模块 0 默认原生小程序
    $scope.mtype = config.create_type == 0 ? 'wxapp' : 'account';
    //小程序设计类型，2模板，3直接跳转
    $scope.designMethod = config.designMethod;
    if (config.isedit) {
      $scope.wxappinfo.choose.modules = config.wxappinfo.modules;
      $scope.wxappinfo.quickmenu = config.wxappinfo.quickmenu;
      $scope.wxappinfo.version = config.wxappinfo.version;
      $scope.wxappinfo.description = config.wxappinfo.description;
    }
    $scope.uploadMultiImage = function (type) {
      require(['fileUploader'], function (uploader) {
        uploader.init(function (imgs) {
          $scope.wxappinfo[type] = imgs.url;
          $scope.$apply($scope.wxappinfo);
        }, {
          'direct': true,
          'multiple': false
        });
      });
    };
    $scope.delMultiImage = function (type) {
      $scope.wxappinfo[type] = '';
    };
    var bindingsUrl = config.bindingsUrl;
    $scope.moduleEntries = [];
    $scope.prevStep = function () {
      if ($scope.createStep <= 1) {
        $scope.createStep = 1;
      } else {
        $scope.createStep -= 1;
      }
      if ($scope.createStep == 3 && $scope.designMethod == 3) {
        if (!$scope.isMuti) {
          $scope.createStep = 1;
        }
      }
    };
    $scope.nextStep = function () {
      if ($scope.createStep > 4) {
        $scope.createStep = 4;
      } else {
        var checked = $scope.checkComplete();
        if (checked) {
          $scope.createStep += 1;
        }
      }
      if ($scope.createStep == 2 && $scope.designMethod == 3) {
        if ($scope.isMuti) {
          loadBindings();
          $scope.createStep = 3;
        } else {
          $scope.createStep = 4;
        }
      }
    };
    function loadBindings() {
      var mnames = [];
      angular.forEach($scope.wxappinfo.choose.modules, function (module) {
        mnames.push(module.name);
      });
      mnames = mnames.join(',');
      $http.post(bindingsUrl, { modules: mnames }).then(function (response) {
        if (response.data.message.errno == '0') {
          var modules = response.data.message.message;
          var bindings = [];
          angular.forEach(modules, function (item) {
            item.module = item.name;
            // 兼容php 获取方式
            for (var i = 0; i < item.bindings.length; i++) {
              item.bindings[i].modulename = item.title;
              bindings.push(item.bindings[i]);
            }
          });
          $scope.module_bindings = bindings;
          $scope.wxappinfo.choose.modules = modules;
        }
      });
    }
    $scope.backToStep = function (step) {
      var toStep = parseInt(step);
      if (toStep < $scope.createStep) {
        if (toStep <= 2) {
          $scope.type = 0;
        }
        $scope.createStep = toStep;
      }
    };
    $scope.selectType = function (type) {
      $scope.type = parseInt(type);
      $(':hidden[name="type"]').val(type);
    };
    $scope.changeType = function (type) {
      $scope.type = parseInt(type);
      $(':hidden[name="type"]').val(type);
    };
    $scope.searchTpl = function () {
      var searchname = $(':text[id="searchtpl"]').val();
      var name = '\u9ed8\u8ba4\u6a21\u7248';
      if (!name.match(searchname)) {
        $(':hidden[name="template"]').val('');
        $('.select-tem-list > ul').hide();
      } else {
        $(':hidden[name="template"]').val(1);
        $('.select-tem-list > ul').show();
      }
    };
    $scope.selectTpl = function (templateid) {
      $scope.wxappinfo.choose.template = templateid;
    };
    $scope.getModuleEntries = function () {
      if ($scope.moduleEntries.length == 0 && $scope.wxappinfo.choose.modules) {
        for (i in $scope.wxappinfo.choose.modules) {
          if ($scope.wxappinfo.choose.modules[i].bindings) {
            for (j in $scope.wxappinfo.choose.modules[i].bindings) {
              $scope.moduleEntries.push({
                title: $scope.wxappinfo.choose.modules[i].bindings[j].title,
                url: $scope.wxappinfo.choose.modules[i].bindings[j].do,
                module: $scope.wxappinfo.choose.modules[i].title
              });
            }
          }
        }
      }
    };
    $scope.showMenu = function () {
      $scope.wxappinfo.quickmenu.show = !$scope.wxappinfo.quickmenu.show;
    };
    $scope.addMenu = function () {
      if ($scope.wxappinfo.quickmenu.menus.length >= 5) {
        return false;
      }
      $scope.wxappinfo.quickmenu.menus.push({
        name: '\u9996\u9875',
        defaultImage: './resource/images/bottom-default.png',
        selectedImage: './resource/images/bottom-default.png',
        module: {}
      });
    };
    $scope.delMenu = function (index) {
      $scope.wxappinfo.quickmenu.menus = _.without($scope.wxappinfo.quickmenu.menus, $scope.wxappinfo.quickmenu.menus[index]);
    };
    $scope.addDefaultImg = function (index) {
      require(['fileUploader'], function (fileUploader) {
        fileUploader.show(function (img) {
          $scope.wxappinfo.quickmenu.menus[index].defaultImage = img.url;
          $scope.$apply($scope.wxappinfo);
        }, {
          'direct': true,
          'multiple': false
        });
      });
    };
    $scope.addSelectedImg = function (index) {
      require(['fileUploader'], function (fileUploader) {
        fileUploader.show(function (img) {
          $scope.wxappinfo.quickmenu.menus[index].selectedImage = img.url;
          $scope.$apply($scope.wxappinfo);
        }, {
          'direct': true,
          'multiple': false
        });
      });
    };
    $scope.addModuleImage = function (module) {
      require(['fileUploader'], function (fileUploader) {
        fileUploader.show(function (img) {
          module.newicon = img.url;
          $scope.$apply($scope.wxappinfo);
        }, {
          'direct': true,
          'multiple': false
        });
      });
    };
    //点击下一步：检测是否可以进入下一步
    $scope.checkComplete = function () {
      var step = $scope.createStep;
      if (!$scope.wxappinfo.uniacid) {
        if (!$scope.wxappinfo.name) {
          util.message('\u5c0f\u7a0b\u5e8f\u540d\u79f0\u4e0d\u53ef\u4e3a\u7a7a\uff01');
          return false;
        }
        if (!$scope.wxappinfo.account) {
          util.message('\u5c0f\u7a0b\u5e8f\u8d26\u53f7\u4e0d\u53ef\u4e3a\u7a7a\uff01');
          return false;
        }
        if (!$scope.wxappinfo.original) {
          util.message('\u539f\u59cbID\u4e0d\u53ef\u4e3a\u7a7a\uff01');
          return false;
        }
        if (!$scope.wxappinfo.appid) {
          util.message('AppId\u4e0d\u53ef\u4e3a\u7a7a\uff01');
          return false;
        }
        if (!$scope.wxappinfo.appsecret) {
          util.message('AppSecret\u4e0d\u53ef\u4e3a\u7a7a\uff01');
          return false;
        }
      }
      if (!$scope.wxappinfo.description) {
        util.message('\u8bf7\u586b\u5199\u63cf\u8ff0');
        return false;
      }
      if (!$scope.wxappinfo.version || !/^[0-9]{1,2}\.[0-9]{1,2}(\.[0-9]{1,2})?$/.test($scope.wxappinfo.version)) {
        util.message('\u7248\u672c\u53f7\u9519\u8bef\uff0c\u53ea\u80fd\u662f\u6570\u5b57\u3001\u70b9\uff0c\u6570\u5b57\u6700\u591a2\u4f4d\uff0c\u4f8b\u5982 1.1.1 \u62161.2');
        return false;
      }
      return true;
    };
    // 网页小程序选择模块后的处理
    $scope.wxapp_module_select = function (type, modules) {
      // $scope.single_module = single_module;
      if (!angular.isArray(modules)) {
        modules = [modules];
      }
      $scope.wxappinfo.choose.modules = modules;
      angular.forEach($scope.wxappinfo.choose.modules, function (item, index, arr) {
        item.module = item.name;
      });
      $scope.$apply();
    };
    $scope.package = function (event) {
      if ($scope.wxappinfo.choose.modules.length == 0) {
        if (!confirm('\u6dfb\u52a0\u6a21\u5757\u5e94\u7528\u540e\u624d\u53ef\u8fdb\u884c\u6253\u5305\u64cd\u4f5c\uff0c\u662f\u5426\u7ee7\u7eed\u4ec5\u4fdd\u5b58\uff1f')) {
          return false;
        }
      }
      $http.post(config.wxappPostUrl, $scope.wxappinfo).success(function (data) {
        if (!data.message.errno) {
          util.message(data.message.message, data.redirect, 'success');
        } else {
          util.message(data.message.message, '', 'error');
        }
      });
      return false;
    };
    $('#resource_module').unbind('click').click(function () {
      require(['fileUploader'], function (fileUploader) {
        fileUploader.show(function (modules) {
          $scope.wxapp_module_select('module', modules);
        }, {
          'direct': true,
          'multiple': $scope.isMuti,
          'isWechat': false,
          'type': 'module',
          'others': {
            'user_module': 2,
            'mtype': $scope.mtype,
            'cover': $scope.mtype == 'account'
          }
        });
      });
    });
  }
]);
angular.module('wxApp').controller('WxappEditCtrl', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.uniacid = config.uniacid;
    $scope.multiid = config.multiid;
    $scope.success_url = config.success_url;
    $scope.account_list = [];
    $scope.current_module = '';
    $scope.category = {
      'id': '',
      'name': '',
      'displayorder': '',
      'linkurl': ''
    };
    $scope.wxapp = config.wxapp;
    $scope.slideedit = function (id) {
      $scope.wxapp = 'slideedit';
      $scope.slideid = id;
    };
    $scope.navedit = function (id) {
      $scope.wxapp = 'navedit';
      $scope.navid = id;
    };
    $scope.recommendedit = function (id, pid) {
      $scope.wxapp = 'recommendedit';
      $scope.recommendid = id;
      $scope.recommendpid = pid;
    };
    $scope.showAccount = function (module) {
      $scope.account_list = '';
      $http.post(config.links.accountList, { module: module }).success(function (data) {
        $scope.account_list = data.message.message;
        $scope.current_module = module;
        console.dir(data);
      });
      $('#show_account').modal('show');
    };
    $scope.selectAccount = function (module, uniacid) {
      var referer = window.location.href;
      $http.post(config.links.saveConnection, {
        module: module,
        uniacid: uniacid
      }).success(function (data) {
        if (data.message.errno == 0) {
          $('.js-connection-img-' + module).attr('src', data.message.message.thumb);
          $('.js-connection-name-' + module).text(data.message.message.name);
          util.message('\u4fee\u6539\u6210\u529f', referer, 'success');
        } else {
          util.message(data.message.message, '', 'error');
        }
        $('#show_account').modal('hide');
      });
    };
    $scope.categoryedit = function (id, pid) {
      $scope.wxapp = 'categoryedit';
      $scope.categoryeditid = id;
      $scope.categoryparentid = pid;
    };
    $scope.get_categorys = function () {
      $http.post(config.links.getCategorys, {
        'uniacid': $scope.uniacid,
        'multiid': $scope.multiid
      }).success(function (data) {
        $scope.categorys = data.message.message;
      });
    };
    $scope.get_categorys();
    $scope.edit_category = function () {
      $scope.categorys.push({
        'name': '',
        'displayorder': '',
        'linkurl': ''
      });
    };
    $scope.del_category = function (index) {
      if ($scope.categorys[index].id != undefined) {
        $http.post(config.links.delCategory, { 'id': $scope.categorys[index].id }).success(function () {
        });
        $scope.get_categorys();
      } else {
        $scope.categorys.splice(index, 1);
      }
    };
    $scope.save_category = function () {
      $scope.name_exist = false;
      angular.forEach($scope.categorys, function (val) {
        if (val.name == '') {
          util.message('\u8bf7\u586b\u5199\u7c7b\u540d');
          $scope.name_exist = true;
        }
      });
      if ($scope.name_exist == true) {
        return false;
      }
      $http.post(config.links.saveCategory, {
        'post': $scope.categorys,
        'uniacid': uniacid,
        'multiid': config.multiid
      }).success(function (data) {
      });
      $scope.get_categorys();
      $('#myModal').modal('hide');
    };
  }
]);
angular.module('wxApp').controller('AccountManageWxappCtrl', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.wxapp_version_lists = config.wxapp_version_lists;
    $scope.wxapp_modules = config.wxapp_modules;
    $scope.version_exist = config.version_exist;
    $scope.activeVersion = {};
    $scope.modules = config.wxapp_modules;
    $scope.search = {};
    $scope.searchModuleName = function () {
      if ($scope.search.moduleName) {
        $scope.modules = {};
        for (key in $scope.wxapp_modules) {
          if ($scope.wxapp_modules[key].title.indexOf($scope.search.moduleName) != -1) {
            $scope.modules[key] = $scope.wxapp_modules[key];
          }
        }
      }
    };
    $scope.showEditVersionInfoModal = function (version) {
      $('#modal_edit_versioninfo').modal('show');
      $scope.activeVersion = version ? version : {};
      $scope.middleVersion = angular.copy($scope.activeVersion);
      if (!_.isEmpty($scope.activeVersion) && _.isEmpty($scope.activeVersion.modules)) {
        $('.wxapp-module-list .add').css('display', '');
      }
    };
    $scope.showEditModuleModal = function () {
      $('#modal_edit_module').modal('show');
      $scope.newWxModule = {};
    };
    $scope.selectedWxModule = function (module, e) {
      var current = $(e.target).parents('.select-module-wxapp');
      current.find('span').removeClass('hide');
      current.siblings().find('span').addClass('hide');
      $scope.newWxModule = module;
    };
    $scope.changeWxModules = function () {
      if (!$scope.newWxModule)
        util.message('\u8bf7\u9009\u62e9\u4e00\u4e2a\u5e94\u7528\u6a21\u5757\uff01');
      if ($scope.activeVersion.modules && $scope.activeVersion.design_method != 3) {
        var index = _.indexOf($scope.activeVersion.modules, $scope.newWxModule);
        if (index > -1) {
          util.message('\u8be5\u5e94\u7528\u6a21\u5757\u5df2\u5b58\u5728\uff01');
        } else {
          $scope.activeVersion.modules.push($scope.newWxModule);
        }
      } else {
        $scope.activeVersion.modules = [$scope.newWxModule];
        $('.wxapp-module-list .add').css('display', 'none');
      }
      $('#modal_edit_module').modal('hide');
    };
    $scope.editVersionInfo = function () {
      if (_.isEmpty($scope.activeVersion.modules)) {
        util.message('\u5e94\u7528\u6a21\u5757\u4e0d\u53ef\u4e3a\u7a7a\uff01');
        return false;
      }
      ;
      $http.post(config.links.edit_version, { 'version_info': $scope.activeVersion }).success(function (data) {
        $('#modal_edit_versioninfo').modal('hide');
        if (data.message.errno == 0) {
          util.message(data.message.message, data.redirect, 'success');
        } else {
          util.message(data.message.message);
        }
      });
    };
    $scope.cancelVersionInfo = function () {
      if ($scope.middleVersion.modules) {
        $scope.activeVersion.modules = $scope.middleVersion.modules;
      } else {
        $scope.activeVersion.modules = [];
      }
    };
    $scope.delWxappVersion = function (id) {
      var id = parseInt(id);
      $http.post(config.links.del_version, { 'versionid': id }).success(function (data) {
        if (data.message.errno == 0) {
          util.message(data.message.message, data.redirect, 'success');
        } else {
          util.message(data.message.message);
        }
      });
    };
    $scope.delModule = function (module) {
      var index = _.indexOf($scope.activeVersion.modules, module);
      if (index > -1) {
        $scope.activeVersion.modules = _.without($scope.activeVersion.modules, $scope.activeVersion.modules[index]);
      }
      if (_.isEmpty($scope.activeVersion.modules)) {
        $('.wxapp-module-list .add').css('display', '');
      }
    };
  }
]);
angular.module('wxApp').controller('PaymentCtrl', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.config = config;
    $scope.paysetting = config.paysetting;
    $scope.saveEdit = function (type) {
      if (type == 'wechat') {
        if ($scope.paysetting.wechat.mchid == '') {
          util.message('\u8bf7\u586b\u5199\u5546\u6237\u53f7', '', 'info');
          return false;
        }
        if ($scope.paysetting.wechat.signkey == '') {
          util.message('\u8bf7\u586b\u5199\u652f\u4ed8\u79d8\u94a5', '', 'info');
          return false;
        }
      }
      $http.post($scope.config.saveurl, {
        'type': type,
        'param': $scope.paysetting[type]
      }).success(function (data) {
        if (data.message.errno == 0) {
          $('.modal').modal('hide');
          util.message(data.message.message, data.redirect, 'success');
        } else {
          util.message(data.message.message, '', 'info');
          return false;
        }
      });
    };
    $('.modal').on('hide.bs.modal', function () {
      $http.post($scope.config.get_setting_url, {}).success(function (data) {
        $scope.paysetting = data.message.message;
      });
    });
    $scope.tokenGen = function (name) {
      if (confirm('\u786e\u5b9a\u8981\u4fee\u6539\u5bc6\u94a5\u5417\uff1f')) {
        var letters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        var token = '';
        for (var i = 0; i < 32; i++) {
          var j = parseInt(Math.random() * (31 + 1));
          token += letters[j];
        }
        if (name == 'wechat.signkey') {
          $scope.paysetting.wechat.signkey = token;
        }
      }
    };
  }
]);
angular.module('wxApp').controller('WxappWelcomeCtrl', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.notices = config.notices;
    $scope.loaderror = 0;
    $scope.last_modules = null;
    $scope.daily_visittrend = [];
    $http({
      method: 'POST',
      url: './index.php?c=wxapp&a=version&do=get_daily_visittrend'
    }).success(function (data) {
      if (data.message.errno == 0) {
        $scope.daily_visittrend = data.message.message;
      }
    });
    $scope.get_last_modules = function () {
      $http.post('./index.php?c=home&a=welcome&do=get_last_modules').success(function (data) {
        if (data.message.errno == 0) {
          var wxapp_last_modules = [];
          angular.forEach(data.message.message, function (val, key) {
            if (val.wxapp) {
              wxapp_last_modules.push(val);
            }
          });
          $scope.last_modules = wxapp_last_modules;
        } else {
          $scope.last_modules = null;
          $scope.loaderror = 1;
        }
      });
    };
    $scope.get_last_modules();
  }
]);
angular.module('wxApp').controller('moduleLinkUniacidCtrl', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.versionInfo = config.version_info;
    $scope.module = '';
    $scope.linkWebappAccounts = '';
    $scope.linkAppAccounts = '';
    $scope.linkWxappAccounts = '';
    $scope.selectedAccount = '';
    $scope.tabChange = function (index) {
      $scope.jurindex = index;
      if (index == 1 && !$scope.linkAppAccounts) {
        $scope.searchLinkAccount($scope.module, 'app');
      } else if (index == 2 && !$scope.linkAppAccounts) {
        $scope.searchLinkAccount($scope.module, 'wxapp');
      }
      if ($scope.jurindex == 2) {
        $('#account-wxapp .row').find('.item').removeClass('active');
      } else if ($scope.jurindex == 1) {
        $('#account-app .row').find('.item').removeClass('active');
      } else if ($scope.jurindex == 0) {
        $('#account-webapp .row').find('.item').removeClass('active');
      }
      $scope.selectedAccount = '';
    };
    $scope.searchLinkAccount = function (modulename, type) {
      if (!type || !modulename) {
        return false;
      }
      $scope.module = modulename;
      $('#show-account').modal('show');
      if (type == 'webapp') {
        $scope.tabChange(0);
      }
      $scope.loadingData = true;
      $http.post(config.links.search_link_account, {
        'module_name': modulename,
        'type': type == 'webapp' ? config.webapp : type == 'wxapp' ? config.wxapp : config.app
      }).success(function (data) {
        $scope.loadingData = false;
        if (type == 'webapp') {
          $scope.linkWebappAccounts = data.message.message;
          $scope.linkAppAccounts = '';
        } else if (type == 'wxapp') {
          $scope.linkWxappAccounts = data.message.message;
          $scope.linkAppAccounts = '';
        } else {
          $scope.linkAppAccounts = data.message.message;
        }
      });
    };
    $scope.selectLinkAccount = function (account, ev) {
      $(ev.target).parentsUntil('.col-sm-2').addClass('active');
      $(ev.target).parentsUntil('.col-sm-2').parent().siblings().find('.item').removeClass('active');
      $scope.selectedAccount = account;
    };
    $scope.module_unlink_uniacid = function () {
      $http.post(config.links.module_unlink_uniacid, { 'version_id': $scope.versionInfo.id }).success(function (data) {
        if (data.message.errno == 0) {
          util.message(data.message.message, data.redirect);
        } else {
          util.message(data.message.message, data.redirect);
        }
      });
    };
    $scope.moduleLinkUniacid = function () {
      $('#show-account').modal('hide');
      $http.post(config.links.module_link_uniacid, {
        'module_name': $scope.module,
        'submit': 'yes',
        'token': config.token,
        'uniacid': $scope.selectedAccount.uniacid,
        'version_id': $scope.versionInfo.id
      }).success(function (data) {
        if (data.message.errno == 0) {
          util.message('\u5173\u8054\u6210\u529f', 'refresh', 'success');
        } else {
          util.message(data.message.message);
        }
      });
      $scope.module = '';
    };
  }
]);
angular.module('wxApp').controller('WxappEntranceCtrl', [
  '$scope',
  '$http',
  'serviceCommon',
  'config',
  function ($scope, $http, serviceCommon, config) {
    $scope.moduleList = config.moduleList;
    $scope.success = function (id) {
      var id = parseInt(id);
      var obj = $('<span class="label label-success" style="position:absolute;z-index:10;width:90px;height:34px;line-height:28px;"><i class="fa fa-check-circle"></i> \u590d\u5236\u6210\u529f</span>');
      serviceCommon.copySuccess(id, obj);
    };
  }
]);
angular.module('wxApp').controller('StatisticeCtrl', [
  '$scope',
  '$http',
  'serviceCommon',
  'config',
  function ($scope, $http, serviceCommon, config) {
    require(['echarts'], function (echarts) {
      var visitChart = echarts.init(document.getElementById('chart-line'));
      option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'line' }
        },
        grid: {
          left: '3%',
          right: '3%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: { data: [] },
        yAxis: { splitArea: { show: true } },
        series: [{
            name: '\u6570\u91cf',
            type: 'line',
            smooth: true,
            data: []
          }]
      };
      visitChart.showLoading();
      $scope.dateRange = {
        startDate: moment().format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD')
      };
      $scope.changeDivideType = function (type) {
        $scope.visitDivideType = type;
        $scope.getVisitApi('week');
      };
      $scope.getVisitApi = function (timeType) {
        $scope.timeType = timeType;
        $http.post(config.links.visitApi, {
          'divide_type': $scope.visitDivideType,
          'time_type': timeType,
          'daterange': $scope.dateRange
        }).success(function (data) {
          console.log(data);
          visitChart.hideLoading();
          option.xAxis.data = data.message.message.data_x;
          option.series[0].data = data.message.message.data_y;
          visitChart.setOption(option);
        });
      };
      $scope.visitDivideType = 'session_cnt';
      $scope.visitTimeType = 'week';
      $scope.getVisitApi($scope.visitTimeType);
      $scope.$watch('dateRange', function (newVal, oldVal) {
        if (newVal && newVal != oldVal) {
          $scope.dateRange.startDate = moment(newVal.startDate).format('YYYY-MM-DD');
          $scope.dateRange.endDate = moment(newVal.endDate).format('YYYY-MM-DD');
          $scope.getVisitApi('daterange');
        }
      }, true);
    });
  }
]);
angular.module('wxApp').controller('MiniappManageCtrl', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.version_lists = config.version_lists;
    $scope.miniapp_modules = config.miniapp_modules;
    $scope.version_exist = config.version_exist;
    $scope.activeVersion = {};
    $scope.modules = config.miniapp_modules;
    $scope.search = {};
    $scope.searchModuleName = function () {
      if ($scope.search.moduleName) {
        $scope.modules = {};
        for (key in $scope.miniapp_modules) {
          if ($scope.miniapp_modules[key].title.indexOf($scope.search.moduleName) != -1) {
            $scope.modules[key] = $scope.miniapp_modules[key];
          }
        }
      }
    };
    $scope.showEditVersionInfoModal = function (version) {
      $('#modal_edit_versioninfo').modal('show');
      $scope.showadd = false;
      $scope.activeVersion = version ? version : {};
      $scope.middleVersion = angular.copy($scope.activeVersion);
      if (!_.isEmpty($scope.activeVersion) && _.isEmpty($scope.activeVersion.modules)) {
        $scope.showadd = true;
      }
    };
    $scope.showEditModuleModal = function () {
      $('#modal_edit_module').modal('show');
      $scope.newWxModule = {};
    };
    $scope.selectedWxModule = function (module, e) {
      var current = $(e.target).parents('.select-module-wxapp');
      current.find('span').removeClass('hide');
      current.siblings().find('span').addClass('hide');
      $scope.newWxModule = module;
    };
    $scope.changeWxModules = function () {
      if (!$scope.newWxModule)
        util.message('\u8bf7\u9009\u62e9\u4e00\u4e2a\u5e94\u7528\u6a21\u5757\uff01');
      $scope.activeVersion.module = {
        'name': $scope.newWxModule.name,
        'version': $scope.newWxModule.version,
        'module_info': $scope.newWxModule
      };
      $scope.showadd = false;
      $('#modal_edit_module').modal('hide');
    };
    $scope.editVersionInfo = function () {
      if (_.isEmpty($scope.activeVersion.module)) {
        util.message('\u5e94\u7528\u6a21\u5757\u4e0d\u53ef\u4e3a\u7a7a\uff01');
        return false;
      }
      ;
      $http.post(config.links.edit_version, {
        'version_id': $scope.activeVersion.id,
        'name': $scope.activeVersion.module.name
      }).success(function (data) {
        $('#modal_edit_versioninfo').modal('hide');
        if (data.message.errno == 0) {
          util.message(data.message.message, data.redirect, 'success');
        } else {
          util.message(data.message.message);
        }
      });
    };
    $scope.cancelVersionInfo = function () {
      if ($scope.middleVersion.modules) {
        $scope.activeVersion.modules = $scope.middleVersion.modules;
      } else {
        $scope.activeVersion.modules = [];
      }
    };
    $scope.delWxappVersion = function (id) {
      var id = parseInt(id);
      $http.post(config.links.del_version, { 'versionid': id }).success(function (data) {
        if (data.message.errno == 0) {
          util.message(data.message.message, data.redirect, 'success');
        } else {
          util.message(data.message.message);
        }
      });
    };
    $scope.delModule = function (module) {
      $scope.activeVersion.modules = [];
      $scope.showadd = true;
    };
  }
]);
angular.module('wxApp').controller('CreateMiniappCtrl', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.mtype = 'aliapp';
    $scope.miniapp = {
      'name': config.miniapp.name,
      'version': '',
      'choose_module': [],
      'submit': 'yes',
      'token': config.token,
      'uniacid': config.uniacid,
      'modules': [],
      'type': config.type
    };
    //小程序添加的应用集合
    $scope.apps = [];
    //创建小程序到第几步
    $scope.createStep = 1;
    $scope.version = config.version;
    $scope.newversion = config.uniacid > 0 ? true : false;
    //小程序设计类型，2模板，3直接跳转
    $scope.designMethod = config.designMethod;
    var bindingsUrl = config.bindingsUrl;
    $scope.moduleEntries = [];
    $scope.uploadMultiImage = function (type) {
      require(['fileUploader'], function (uploader) {
        uploader.init(function (imgs) {
          $scope.miniapp[type] = imgs.url;
          $scope.$apply($scope.miniapp);
        }, {
          'direct': true,
          'multiple': false
        });
      });
    };
    $scope.delMultiImage = function (type) {
      $scope.miniapp[type] = '';
    };
    $scope.prevStep = function () {
      $scope.createStep = 1;
    };
    $scope.nextStep = function () {
      var checked = $scope.checkComplete();
      if (checked) {
        $scope.createStep = 2;
      }
    };
    //点击下一步：检测是否可以进入下一步
    $scope.checkComplete = function () {
      if ($scope.miniapp.uniacid == 0) {
        if (!$scope.miniapp.name) {
          util.message('\u652f\u4ed8\u5b9d\u5c0f\u7a0b\u5e8f\u540d\u79f0\u4e0d\u53ef\u4e3a\u7a7a\uff01');
          return false;
        }
        if (!$scope.miniapp.appid) {
          util.message('AppId\u4e0d\u53ef\u4e3a\u7a7a\uff01');
          return false;
        }
      }
      if (!$scope.miniapp.description) {
        util.message('\u8bf7\u586b\u5199\u63cf\u8ff0');
        return false;
      }
      if (!$scope.miniapp.version || !/^[0-9]{1,2}\.[0-9]{1,2}(\.[0-9]{1,2})?$/.test($scope.miniapp.version)) {
        util.message('\u7248\u672c\u53f7\u9519\u8bef\uff0c\u53ea\u80fd\u662f\u6570\u5b57\u3001\u70b9\uff0c\u6570\u5b57\u6700\u591a2\u4f4d\uff0c\u4f8b\u5982 1.1.1 \u62161.2');
        return false;
      }
      return true;
    };
    $scope.package = function (event) {
      if (!$scope.miniapp.choose_module) {
        if (!confirm('\u6dfb\u52a0\u6a21\u5757\u5e94\u7528\u540e\u624d\u53ef\u8fdb\u884c\u6253\u5305\u64cd\u4f5c\uff0c\u662f\u5426\u7ee7\u7eed\u4ec5\u4fdd\u5b58\uff1f')) {
          return false;
        }
      }
      $http.post(config.postUrl, $scope.miniapp).success(function (data) {
        if (data.message.errno == 0) {
          util.message(data.message.message, data.redirect, 'success');
        } else {
          util.message(data.message.message, '', 'error');
        }
      });
      return false;
    };
    $('#resource_module').unbind('click').click(function () {
      require(['fileUploader'], function (fileUploader) {
        fileUploader.show(function (modules) {
          $scope.miniapp.choose_module = modules;
          $scope.$apply($scope.miniapp.choose_module);
        }, {
          'direct': true,
          'multiple': $scope.isMuti,
          'isWechat': false,
          'type': 'module',
          'others': {
            'user_module': 0,
            'mtype': $scope.mtype,
            'cover': $scope.mtype == 'account'
          }
        });
      });
    });
  }
]);