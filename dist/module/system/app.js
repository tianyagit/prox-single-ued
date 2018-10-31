angular.module('systemApp', ['we7app']);
//更新缓存
angular.module('systemApp').controller('UpdateCacheCtrl', [
  '$scope',
  '$http',
  function ($scope, $http) {
    $scope.updateCache = function () {
      $http({
        method: 'POST',
        url: './index.php?c=system&a=updatecache',
        data: { submit: 'submit' },
        beforeSend: function () {
          $('.loader').show();
        },
        complete: function () {
          $('.loader').hide();
        }
      }).success(function (data) {
        if (data.message.errno == 0) {
          util.message(data.message.message);
        }
      });
    };
  }
]);
//系统菜单管理
angular.module('systemApp').controller('MenuCtrl', [
  '$scope',
  '$http',
  function ($scope, $http) {
    $scope.subItemGroup = {};
    $scope.displayStatus = {};
    $scope.mainMenu = {
      'permission': '',
      'displayorder': 0
    };
    $scope.editItemPanel = function (data) {
      if (!data) {
        return;
      }
      $scope.activeItem = {};
      $scope.activeItem = data;
      $('.js-edit-panel').modal();
    };
    $scope.editMainMenu = function (order, permission) {
      $scope.mainMenu.displayorder = order;
      $scope.mainMenu.permission = permission;
      $('#editorder').modal('show');
    };
    $scope.saveorder = function () {
      $http.post('./index.php?c=system&a=menu&do=change_displayorder', $scope.mainMenu).success(function (data) {
        if (data.message.errno == 0) {
          $('#editorder').modal('hide');
          util.message('\u64cd\u4f5c\u6210\u529f', data.redirect, 'ajax');
        } else {
          util.message('\u64cd\u4f5c\u5931\u8d25', '', 'info');
        }
      });
    };
    $scope.editItem = function () {
      $http.post('./index.php?c=system&a=menu&do=post', $scope.activeItem).success(function (data) {
        if (data.message.errno) {
          util.message(data.message.message);
        } else {
          if ($scope.activeItem.isNew) {
            $scope.subItemGroup[$scope.activeItem.group].push($scope.activeItem);
          }
          util.message(data.message.message, data.redirect, 'ajax');
          $('.js-edit-panel').modal('hide');
        }
      });
    };
    $scope.addSubItem = function (group, menu) {
      if (!$scope.subItemGroup[group]) {
        $scope.subItemGroup[group] = [];
      }
      var menu = {
          title: menu.title,
          url: menu.url,
          permissionName: menu.permissionName,
          icon: menu.icon,
          displayorder: menu.displayorder,
          isDisplay: menu.isDisplay,
          isSystem: false,
          group: group,
          isNew: true
        };
      $scope.editItemPanel(menu);
    };
    $scope.selectMenuIcon = function () {
      util.iconBrowser(function (icon) {
        $scope.activeItem.icon = icon;
        $scope.$apply('activeItem');
      });
    };
    $scope.removeSubItem = function (group, index) {
      if (!group) {
        return;
      }
      if (!confirm('\u786e\u8ba4\u5220\u9664\u6b64\u83dc\u5355\uff1f')) {
        return;
      }
      if (typeof index == 'undefined') {
        $http.post('./index.php?c=system&a=menu&do=delete', { 'permission_name': group }).success(function (data) {
          if (data.message.errno) {
            util.message(data.message.message);
          } else {
            util.message(data.message.message, 'refresh');
          }
        });
      } else {
        $scope.subItemGroup[group].splice(index, 1);
      }
    };
    $scope.changeDisplay = function (key) {
      if ($scope.displayStatus[key] == true) {
        status = 0;
      } else {
        status = 1;
      }
      $http.post('./index.php?c=system&a=menu&do=display_status', {
        'status': status,
        'permission_name': key
      }).success(function (data) {
        $scope.displayStatus[key] = parseInt(status) ? true : false;
      });
    };
  }
]);
//系统管理欢迎
angular.module('systemApp').controller('WelcomeCtrl', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    //微擎推荐模块
    $scope.loaderror = 0;
    $scope.ads = null;
    //模块统计信息
    $scope.account_uninstall_modules_nums = 0;
    $scope.wxapp_uninstall_modules_nums = 0;
    $scope.account_modules_total = 0;
    $scope.wxapp_modules_total = 0;
    $scope.not_installed_module = [];
    $scope.not_installed_show = 0;
    $scope.get_module_statistics = function () {
      $http({
        url: config.moduleStatisticsUrl,
        method: 'POST',
        data: {},
        beforeSend: function () {
        },
        complete: function () {
        }
      }).success(function (data) {
        if (data.message.errno == 0) {
          $scope.module_statistics = data.message.message;
        }
      });
    };
    //模块升级信息
    $scope.upgrade_module_nums = [];
    $scope.upgrade_module_nums['account_upgrade_module_nums'] = 0;
    $scope.upgrade_module_nums['wxapp_upgrade_module_nums'] = 0;
    $scope.upgrade_module_list = [];
    $scope.upgrade_modules = [];
    $scope.get_upgrade_modules = function () {
      $http({
        url: config.upgradeModulesUrl,
        method: 'POST',
        data: {},
        beforeSend: function () {
        },
        complete: function () {
        }
      }).success(function (data) {
        if (data.message.errno == 0) {
          $scope.upgrade_module_list = data.message.message;
          if ($scope.upgrade_module_list) {
            $scope.upgrade_modules = $scope.upgrade_module_list;
            $scope.upgrade_modules_show = 1;
          }
        }
      });
    };
    $scope.searchType = function (type) {
      $scope.upgrade_modules = [];
      if (type == 'all') {
        $scope.upgrade_modules = $scope.upgrade_module_list;
      } else if (type == 'has_new_version') {
        angular.forEach($scope.upgrade_module_list, function (item) {
          if (item.has_new_version == 1) {
            $scope.upgrade_modules.push(item);
          }
        });
      } else if (type == 'has_new_branch') {
        angular.forEach($scope.upgrade_module_list, function (item) {
          if (item.has_new_branch == 1) {
            $scope.upgrade_modules.push(item);
          }
        });
      }
    };
    //系统升级信息
    $scope.upgrade_show = 0;
    $scope.get_system_upgrade = function () {
      $http({
        url: config.systemUpgradeUrl,
        method: 'POST',
        data: {},
        beforeSend: function () {
        },
        complete: function () {
          util.loaded();
        }
      }).success(function (data) {
        if (data.message.errno == 0) {
          var upgrade = data.message.message;
          $scope.upgrade = upgrade;
          if (upgrade.file_nums > 0 || upgrade.database_nums > 0 || upgrade.script_nums > 0) {
            $scope.upgrade_show = 1;
          }
        }
      });
    };
    $scope.get_ads = function () {
      $http.post('./index.php?c=home&a=welcome&do=get_ads').success(function (data) {
        if (data.message.errno == 0) {
          $scope.ads = data.message.message.we7_index_ads;
          if ($scope.getCookie('closed_system_ads') == angular.toJson($scope.ads)) {
            $scope.ads = null;
          }
        } else {
          $scope.ads = null;
          $scope.loaderror = 1;
        }
      });
    };
    $scope.close_ads = function () {
      $scope.setCookie('closed_system_ads', angular.toJson($scope.ads), 365);
      $scope.ads = null;
    };
    $scope.setCookie = function (cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
      var expires = 'expires=' + d.toGMTString();
      document.cookie = cname + '=' + cvalue + '; ' + expires;
    };
    $scope.getCookie = function (cname) {
      var name = cname + '=';
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0)
          return c.substring(name.length, c.length);
      }
      return '';
    };
    $scope.get_not_installed_module = function () {
      $http.post('./index.php?c=home&a=welcome&do=get_not_installed_modules').success(function (data) {
        if (data.message.errno == 0) {
          $scope.not_installed_module = data.message.message;
          if ($scope.not_installed_module) {
            $scope.not_installed_show = 1;
          }
        }
      });
    };
    //欢迎页忽略模块升级
    $scope.ignoreUpdate = function (name) {
      $http.post(config.ignoreUpdateUrl, { 'name': name }).success(function (data) {
        if (data.message.errno == 0) {
          $scope.upgrade_module_list[name].is_ignore = 1;
        }
      });
    };
    $scope.get_module_statistics();
    $scope.get_upgrade_modules();
    $scope.get_system_upgrade();
    $scope.get_not_installed_module();
    $scope.get_ads();
  }
]);
angular.module('systemApp').controller('ipWhiteListCtrl', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.lists = config.lists;
    $scope.links = config.links;
    $scope.ips = '';
    $scope.changeStatus = function (ip) {
      $http.post($scope.links.change_status, { ip: ip }).success(function (data) {
        if (data.message.errno == 0) {
          location.reload();
        } else {
          util.message(data.message.message, data.redirect, 'ajax');
        }
      });
    };
    $scope.saveIp = function () {
      $('#myModalIp').modal('hide');
      $http.post($scope.links.add_link_ips, { ips: $scope.ips }).success(function (data) {
        if (data.message.errno != 0) {
          util.message(data.message.message);
        } else {
          util.message('\u6dfb\u52a0\u6210\u529f', data.redirect, 'ajax');
        }
      });
    };
  }
]);
angular.module('systemApp').controller('sensitiveWord', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.lists = config.lists;
    $scope.links = config.links;
    $scope.word = '';
    $scope.saveWords = function () {
      $('#myModalSensitive').modal('hide');
      $http.post($scope.links.add_word_link, { word: $scope.word }).success(function (data) {
        if (data.message.errno != 0) {
          util.message(data.message.message);
        } else {
          util.message('\u6dfb\u52a0\u6210\u529f', data.redirect, 'ajax');
        }
      });
    };
    $scope.del = function (list) {
      $http.post($scope.links.del_word_link, { word: list }).success(function (data) {
        if (data.message.errno != 0) {
          util.message(data.message.message);
        } else {
          util.message('\u5220\u9664\u6210\u529f', data.redirect, 'ajax');
        }
      });
    };
  }
]);
angular.module('systemApp').controller('SystemThirdpartyLogin', [
  '$scope',
  '$http',
  'serviceCommon',
  'config',
  function ($scope, $http, serviceCommon, config) {
    $scope.thirdlogin = config.thirdlogin;
    $scope.links = config.links;
    $scope.siteroot = config.siteroot;
    $scope.url = config.url;
    $scope.newappid = '';
    $scope.newappsecret = '';
    $scope.httpChange = function (set_type, auth_type) {
      switch (set_type) {
      case 'authstate':
        $http.post($scope.links.save_setting, {
          'authstate': 'authstate',
          'type': auth_type
        }).success(function (data) {
          if (data.message.errno == 0) {
            util.message('\u4fee\u6539\u6210\u529f', data.redirect);
          } else {
            util.message('\u4fee\u6539\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\uff01');
          }
        });
        break;
      case 'appid':
        $('#AppID').modal('hide');
        $http.post($scope.links.save_setting, {
          'appid': $scope.newappid,
          'type': auth_type
        }).success(function (data) {
          if (data.message.errno == 0) {
            util.message('\u4fee\u6539\u6210\u529f', data.redirect);
          } else {
            util.message('\u4fee\u6539\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\uff01');
          }
        });
        break;
      case 'appsecret':
        $('#AppSecret').modal('hide');
        $http.post($scope.links.save_setting, {
          'appsecret': $scope.newappsecret,
          'type': auth_type
        }).success(function (data) {
          if (data.message.errno == 0) {
            util.message('\u4fee\u6539\u6210\u529f', data.redirect);
          } else {
            util.message('\u4fee\u6539\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\uff01');
          }
        });
        break;
      }
    };
    $scope.success = function (id) {
      var id = parseInt(id);
      var obj = $('<span class="label label-success" style="position:absolute;z-index:10;margin-top:10px"><i class="fa fa-check-circle"></i> \u590d\u5236\u6210\u529f</span>');
      serviceCommon.copySuccess(id, obj);
    };
  }
]);
angular.module('systemApp').controller('systemOauthCtrl', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.oauthHost = config.oauthHost;
    $scope.originalHost = config.oauthHost;
    $scope.oauthAccount = config.oauthAccount;
    $scope.oauthtitle = config.oauthAccounts[config.oauthAccount];
    $scope.links = config.links;
    $scope.saveOauth = function () {
      $http.post($scope.links.oauth_link, {
        'account': $scope.oauthAccount,
        'host': $scope.oauthHost
      }).success(function (data) {
        if (data.message.errno != 0) {
          util.message(data.message.message);
        } else {
          $scope.originalHost = $scope.oauthHost;
          util.message('\u6210\u529f', data.redirect, 'ajax');
        }
      });
    };
  }
]);
//设置系统短信签名
angular.module('systemApp').controller('SmsSignCtrl', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.all_signatures = config.all_signatures;
    $scope.site_sms_sign = config.site_sms_sign;
    $scope.links = config.links;
    $scope.saveSms = function (type) {
      $http.post($scope.links.site_sms_sign_link, {
        register: $scope.site_sms_sign.register,
        find_password: $scope.site_sms_sign.find_password,
        user_expire: $scope.site_sms_sign.user_expire
      }).success(function (data) {
        if (data.message.errno != 0) {
          util.message(data.message.message, data.redirect, 'error');
        } else {
          util.message('\u8bbe\u7f6e\u6210\u529f', data.redirect, 'success');
        }
      });
    };
  }
]);
angular.module('systemApp').controller('systemInfoCtrl', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.content = '\u67e5\u770b';
    $scope.attachSize = function () {
      if ($scope.content.indexOf('\u67e5\u770b') != -1) {
        $scope.content = '\u8bf7\u7a0d\u5019...';
        $http.get(config.get_attach_size_url).success(function (data) {
          if (data.message.message.attach_size) {
            $scope.content = data.message.message.attach_size;
          } else {
            $scope.content = 0;
          }
        });
      }
    };
  }
]);