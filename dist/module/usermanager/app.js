angular.module('userManageApp', ['we7app']);
//用户编辑-base(见userProfile)
//用户编辑-modules_tpl
angular.module('userManageApp').controller('UserEditModules', [
  '$scope',
  '$http',
  '$compile',
  'config',
  function ($scope, $http, $compile, config) {
    $scope.user = config.user;
    $scope.profile = config.profile;
    $scope.group_info = config.group_info;
    $scope.groups = config.groups;
    $scope.links = config.links;
    $scope.extend = config.extend;
    $scope.changeGroup = $scope.user.groupid;
    $scope.jurindex = 'account';
    $scope.allmodule = false;
    $scope.user_modules = config.user_modules;
    if (config.user_modules) {
      $scope.modules = config.user_modules.account || config.user_modules.wxapp || config.user_modules.webapp || config.user_modules.phoneapp || config.user_modules.xzapp;
    }
    $scope.source_templates = config.source_templates;
    $scope.templates = config.source_templates;
    $scope.httpChange = function (type) {
      $http.post($scope.links.editGroup + 'uid=' + $scope.user.uid, {
        type: type,
        groupid: $scope.changeGroup,
        founder_groupid: $scope.user.founder_groupid
      }).success(function (data) {
        if (data.message.errno == 0) {
          $scope.group_info = data.message.message;
          util.message('\u4fee\u6539\u6210\u529f\uff01');
        } else {
          util.message(data.message.message);
        }
      });
    };
    $scope.changeText = function (ev) {
      var text = $(ev)[0].target.text;
      $(ev)[0].target.text = text == '\u5c55\u5f00' ? '\u6536\u8d77' : '\u5c55\u5f00';
    };
    $scope.tabChange = function (type) {
      $scope.jurindex = type;
      $scope.modules = config.user_modules[type];
      $scope.loadMore(1);
    };
    $scope.loadMore = function (pageindex) {
      var pagesize = 18;
      if ($scope.jurindex == 'template') {
        var totalPage = Math.ceil($scope.source_templates.length / pagesize);
      } else {
        var totalPage = Math.ceil(config.user_modules[$scope.jurindex].length / pagesize);
      }
      if (totalPage < pageindex) {
        return false;
      }
      $scope.changePage(pageindex, pagesize);
      if (totalPage < 2) {
        $('.js-pager ul').html('');
        return false;
      }
      //重新生成页码
      pageindex = 1 * pageindex;
      var side = 4;
      var start = Math.max(1, pageindex - side);
      var end = Math.min(totalPage, pageindex + side);
      if (end - start < 2 * side + 1) {
        end = Math.min(totalPage, start + side * 2);
        start = Math.max(1, end - side * 2);
      }
      var liHtml = '';
      if (pageindex != 1) {
        liHtml = '<li><a href="javascript:;" page="1" ng-click="loadMore(1)">\u9996\u9875</a></li>';
      }
      for (var i = start; i <= end; i++) {
        liHtml += '<li><a href="javascript:;" page="' + i + '" ng-click="loadMore(\'' + i + '\')">' + i + '</a></li>';
      }
      if (pageindex != totalPage) {
        liHtml += '<li><a href="javascript:;" page="' + totalPage + '" ng-click="loadMore(\'' + totalPage + '\')">\u5c3e\u9875</a></li>';
      }
      $('.js-pager ul').html($compile(liHtml)($scope));
      //选中当前页码
      $('.js-pager li').attr('class', '');
      $('.js-pager a[page=\'' + pageindex + '\']').parent().attr('class', 'active');
      $('.js-pager .pager-nav').parent().attr('class', '');
    };
    $scope.changePage = function (pageindex, pagesize) {
      var i = -1;
      var start = (pageindex - 1) * pagesize;
      if ($scope.jurindex == 'template') {
        $scope.templates = [];
        for (index in $scope.source_templates) {
          i++;
          if (i < start) {
            continue;
          }
          if (i >= start + pagesize) {
            break;
          }
          $scope.templates.push($scope.source_templates[index]);
        }
      } else {
        $scope.modules = [];
        for (index in $scope.user_modules[$scope.jurindex]) {
          i++;
          if (i < start) {
            continue;
          }
          if (i >= start + pagesize) {
            break;
          }
          $scope.modules.push($scope.user_modules[$scope.jurindex][index]);
        }
      }
      return false;
    };
    $scope.allmodulechange = function (selected) {
      if ($scope.jurindex == 'template') {
        var divid = '#content-templates';
        angular.forEach($scope.source_templates, function (obj, index) {
          $scope.source_templates[index].checked = $scope.allmodule;
        });
      } else {
        var divid = '#content-modules';
        angular.forEach($scope.user_modules[$scope.jurindex], function (obj, index) {
          $scope.user_modules[$scope.jurindex][index].checked = $scope.allmodule;
        });
      }
      if (selected) {
        $('#jurisdiction-add ' + divid + ' .item').addClass('active');
      } else {
        $('#jurisdiction-add ' + divid + ' .item').removeClass('active');
      }
    };
    $scope.itemclick = function (data) {
      if ($scope.jurindex == 'template') {
        angular.forEach($scope.source_templates, function (item, index) {
          if (item.id == data) {
            $scope.source_templates[index].checked = !$scope.source_templates[index].checked;
          }
        });
      } else {
        angular.forEach($scope.user_modules[$scope.jurindex], function (item, index) {
          if ($scope.user_modules[$scope.jurindex][index].name == data) {
            $scope.user_modules[$scope.jurindex][index].checked = !$scope.user_modules[$scope.jurindex][index].checked;
          }
        });
      }
    };
    $scope.addExtend = function () {
      var templateid = [];
      angular.forEach($scope.source_templates, function (item, index) {
        if (item.checked == 1 || item.checked == true) {
          templateid.push(item.id);
        }
      });
      var checked_modules = {
          modules: [],
          wxapp: [],
          webapp: [],
          xzapp: [],
          phoneapp: []
        };
      angular.forEach($scope.user_modules, function (modules, type) {
        if (modules.length > 0) {
          if (type == 'account') {
            type = 'modules';
          }
          angular.forEach(modules, function (module, index) {
            if (module.name && (module.checked == 1 || module.checked == true)) {
              checked_modules[type].push(module.name);
            }
          });
        }
      });
      $('#jurisdiction-add').modal('hide');
      $http.post(config.links.editUsersPermission, {
        type: 'extend',
        module: checked_modules,
        tpl: templateid,
        uid: $scope.user.uid
      }).success(function (data) {
        if (data.message.errno == 0) {
          location.reload(true);
        } else {
          util.message('\u53c2\u6570\u9519\u8bef\uff01');
        }
      });
    };
    $scope.loadMore(1);
  }
]);
angular.module('userManageApp').controller('UserEditModulesTpl', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.user = config.user;
    $scope.profile = config.profile;
    $scope.group_info = config.group_info;
    $scope.groups = config.groups;
    $scope.links = config.links;
    $scope.extend = config.extend;
    $scope.changeGroup = $scope.user.groupid;
    $scope.jurindex = 0;
    $scope.allmodule = false;
    $scope.httpChange = function (type) {
      $http.post($scope.links.editGroup + 'uid=' + $scope.user.uid, {
        type: type,
        groupid: $scope.changeGroup,
        founder_groupid: $scope.user.founder_groupid
      }).success(function (data) {
        if (data.message.errno == 0) {
          $scope.group_info = data.message.message;
          util.message('\u4fee\u6539\u6210\u529f\uff01');
        } else {
          util.message(data.message.message);
        }
      });
    };
    $scope.changeText = function (ev) {
      var text = $(ev)[0].target.text;
      $(ev)[0].target.text = text == '\u5c55\u5f00' ? '\u6536\u8d77' : '\u5c55\u5f00';
    };
    $scope.tabChange = function (index) {
      $scope.jurindex = index;
      onTabChange();
    };
    $scope.allmodulechange = function (selected) {
      var divid = '#content-templates';
      if ($scope.jurindex == 0) {
        divid = '#content-modules';
      }
      if (selected) {
        $('#jurisdiction-add ' + divid + ' .item').addClass('active');
      } else {
        $('#jurisdiction-add ' + divid + ' .item').removeClass('active');
      }
    };
    $scope.addExtend = function () {
      var moduleshtml = '', templatehtml = '';
      var modulesname = [], templateid = [];
      $('#jurisdiction-add #content-modules').find('.active').each(function () {
        moduleshtml += '<div class="col-sm-3 text-left we7-margin-bottom"><a href="javascript:;" class="label label-info">' + $(this).attr('data-title') + '</a></div>';
        modulesname.push($(this).attr('data-name'));
      });
      $('#jurisdiction-add #content-templates').find('.active').each(function () {
        templatehtml += '<div class="col-sm-3 text-left we7-margin-bottom"><a href="javascript:;" class="label label-info">' + $(this).attr('data-title') + '</a></div>';
        templateid.push($(this).attr('data-id'));
      });
      if (moduleshtml || templatehtml) {
        $('.account-package-extra').show();
      } else {
        $('.account-package-extra').hide();
      }
      $('.account-package-extra .js-extra-modules').append(moduleshtml);
      $('.account-package-extra .js-extra-templates').append(templatehtml);
      $('#jurisdiction-add').modal('hide');
      $http.post(config.links.editUsersPermission, {
        type: 'extend',
        module: modulesname,
        tpl: templateid,
        uid: $scope.user.uid
      }).success(function (data) {
        if (data.message.errno == 0) {
          location.reload();
        } else {
          util.message('\u53c2\u6570\u9519\u8bef\uff01');
        }
      });
    };
    function onTabChange() {
      var divid = '#content-templates';
      if ($scope.jurindex == 0) {
        divid = '#content-modules';
      }
      if ($('#jurisdiction-add ' + divid + ' .item').size() == $('#jurisdiction-add ' + divid + ' .item.active').size()) {
        $scope.allmodule = true;
        return;
      }
      $scope.allmodule = false;
    }
  }
]);
//用户编辑-account
angular.module('userManageApp').controller('UserEditAccount', [
  '$scope',
  'config',
  function ($scope, config) {
    $scope.user = config.user;
    $scope.wechats = config.wechats;
    $scope.wxapps = config.wxapps;
    $scope.webapps = config.webapps;
    $scope.phoneapps = config.phoneapps;
    $scope.xzapps = config.xzapps;
    $scope.profile = config.profile;
  }
]);
//添加用户
angular.module('userManageApp').controller('UserCreate', [
  '$scope',
  'config',
  'UserManageCommon',
  function ($scope, config, UserManageCommon) {
    $scope.groups = config.groups;
    $scope.user = {
      username: '',
      password: '',
      repassword: '',
      groupid: 0,
      remark: ''
    };
    $scope.changeType = function (ev) {
      var targetHtml = $(ev)[0].target;
      $(targetHtml).attr('type', 'password');
    };
    $scope.checkSubmit = function (ev) {
      if ($.trim($('#username').val()) == '') {
        ev.preventDefault();
        util.message('\u8bf7\u8f93\u5165\u7528\u6237\u540d.', '', 'error');
        return false;
      }
      if ($('#password').val() == '') {
        ev.preventDefault();
        util.message('\u6ca1\u6709\u8f93\u5165\u5bc6\u7801.', '', 'error');
        return false;
      }
      if ($('#password').val().length < 8) {
        ev.preventDefault();
        util.message('\u5bc6\u7801\u957f\u5ea6\u4e0d\u80fd\u5c0f\u4e8e8\u4e2a\u5b57\u7b26.', '', 'error');
        return false;
      }
      if ($('#password').val() != $('#repassword').val()) {
        ev.preventDefault();
        util.message('\u4e24\u6b21\u8f93\u5165\u7684\u5bc6\u7801\u4e0d\u4e00\u81f4.', '', 'error');
        return false;
      }
      return true;
    };
    $scope.addPermission = UserManageCommon.addPermission;
  }
]);
//用户回收站、审核用户、用户列表-display
angular.module('userManageApp').controller('UsersDisplay', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.type = config.type;
    $scope.users = config.users;
    $scope.usergroups = config.usergroups;
    $scope.links = config.links;
    $scope.operate = function (uid, changetype) {
      $http.post($scope.links.link, {
        uid: uid,
        type: changetype
      }).success(function (data) {
        if (data.message.errno == 0) {
          util.message(data.message.message, data.redirect);
        } else {
          util.message(data.message.message, data.redirect);
        }
      });
    };
  }
]);
//用户属性设置-display
angular.module('userManageApp').controller('FieldsDisplay', [
  '$scope',
  'config',
  function ($scope, config) {
    $scope.fields = config.fields;
    $scope.links = config.links;
  }
]);
//用户属性设置-post
angular.module('userManageApp').controller('FieldsPost', [
  '$scope',
  'config',
  function ($scope, config) {
    $scope.item = config.item;
    if ($scope.item == null) {
      $scope.available = true;
      $scope.required = true;
      $scope.unchangeable = true;
      $scope.showinregister = true;
    } else {
      if ($scope.item.available == 1) {
        $scope.available = true;
      } else {
        $scope.available = false;
      }
      if ($scope.item.required == 1) {
        $scope.required = true;
      } else {
        $scope.required = false;
      }
      if ($scope.item.unchangeable == 1) {
        $scope.unchangeable = true;
      } else {
        $scope.unchangeable = false;
      }
      if ($scope.item.showinregister == 1) {
        $scope.showinregister = true;
      } else {
        $scope.showinregister = false;
      }
    }
    ;
    $scope.verifyField = function () {
      var field = $('input[name="field"]');
      field_value = field.val();
      reg = /^[A-Za-z0-9_]*$/;
      if (!reg.test(field_value)) {
        util.message('\u8bf7\u4f7f\u7528\u5b57\u6bcd\u6216\u6570\u5b57\u6216\u4e0b\u5212\u7ebf\u7ec4\u5408\u5b57\u6bb5\u540d\uff01');
        field.val('');
      }
    };
  }
]);
//用户注册设置
angular.module('userManageApp').controller('RegistersetCtrl', [
  '$scope',
  'config',
  function ($scope, config) {
    $scope.settings = config.settings;
    $scope.groups = config.groups;
  }
]);
//给副创始人分配权限
angular.module('userManageApp').controller('UserAssignPermissionsCtrl', [
  '$scope',
  'config',
  function ($scope, config) {
    $scope.user = config.user;
    $scope.profile = config.profile;
  }
]);
//找回手机密码
angular.module('userManageApp').controller('UsersFindMobilePwd', [
  '$scope',
  '$http',
  'config',
  '$interval',
  function ($scope, $http, config) {
    $scope.links = config.links;
    $scope.password = '';
    $scope.repassword = '';
    $scope.image = config.image;
    $scope.verify = '';
    $scope.mobile = '';
    $scope.changeVerify = function () {
      $scope.image = $scope.links.img_verify_link + 'r=' + Math.round(new Date().getTime());
      return false;
    };
    $scope.validCode = function () {
      if ($scope.mobile == '') {
        util.message('\u624b\u673a\u53f7\u4e0d\u80fd\u4e3a\u7a7a');
      }
      if ($scope.verify == '') {
        util.message('\u56fe\u5f62\u9a8c\u8bc1\u7801\u4e0d\u80fd\u4e3a\u7a7a');
      }
      $http.post($scope.links.valid_code_link, {
        mobile: $scope.mobile,
        verify: $scope.verify
      }).success(function (data) {
        if (data.message.errno == 0) {
          $('.step-2').removeClass('hide');
          $('.step-1').hide();
          $('.step-set-pwd').addClass('steps-status-finish');
        } else {
          util.message(data.message.message, '', 'error');
        }
      });
    };
    $scope.changePassword = function () {
      if ($scope.password == '') {
        $('.password').html('\u5bc6\u7801\u4e0d\u80fd\u4e3a\u7a7a');
        return false;
      }
      if ($scope.repassword == '') {
        $('.repassword').html('\u5bc6\u7801\u4e0d\u80fd\u4e3a\u7a7a');
        return false;
      }
      if ($scope.password != $scope.repassword) {
        $('.repassword').html('\u4e24\u6b21\u8f93\u5165\u7684\u5bc6\u7801\u4e0d\u4e00\u81f4');
        return false;
      }
      $http.post($scope.links.set_password_link, {
        password: $scope.password,
        repassword: $scope.repassword,
        mobile: $scope.mobile
      }).success(function (data) {
        if (data.message.errno == 0) {
          $('.step-3').removeClass('hide');
          $('.step-2').hide();
          $('.step-pwd-success').addClass('steps-status-finish');
        } else if (data.message.errno == -2) {
          $('.password').html(data.message.message);
          return false;
        } else {
          util.message(data.message.message);
        }
      });
    };
  }
]);
//设置系统短信签名
angular.module('userManageApp').controller('UserExpireCtrl', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.user_expire = config.user_expire;
    $scope.links = config.links;
    $scope.saveExpire = function () {
      $http.post($scope.links.user_expire_link, { day: $scope.user_expire.day }).success(function (data) {
        if (data.message.errno != 0) {
          util.message(data.message.message, data.redirect, 'error');
        } else {
          util.message('\u8bbe\u7f6e\u6210\u529f', data.redirect, 'success');
        }
      });
    };
    $scope.httpChange = function () {
      $http.post($scope.links.user_expire_status_link, {}).success(function (data) {
        if (data.message.errno == 0) {
          util.message('\u4fee\u6539\u6210\u529f', data.redirect);
        } else {
          util.message('\u4fee\u6539\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\uff01');
        }
      });
    };
  }
]);
//手机号注册
angular.module('userManageApp').controller('UsersRegisterMobile', [
  '$scope',
  '$http',
  'config',
  '$interval',
  function ($scope, $http, config, $interval) {
    $scope.links = config.links;
    $scope.smscode = '';
    $scope.password = '';
    $scope.repassword = '';
    $scope.image = config.image;
    $scope.verify = '';
    $scope.mobile = '';
    $scope.owner_uid = config.owner_uid;
    $scope.register_type = config.register_type;
    $scope.register_sign = config.register_sign;
    $scope.expire = 120;
    $scope.text = '\u53d1\u9001\u9a8c\u8bc1\u7801';
    $scope.isDisable = false;
    $scope.mobleInvalid = true;
    $scope.smscodeInvalid = true;
    $scope.imageInvalid = true;
    $scope.passwordInvalid = true;
    $scope.repasswordInvalid = true;
    $scope.sendMessage = function () {
      if ($scope.mobile == '') {
        util.message('\u624b\u673a\u53f7\u4e0d\u80fd\u4e3a\u7a7a');
        return false;
      }
      $http.post($scope.links.valid_mobile_link, { mobile: $scope.mobile }).success(function (data) {
        if (data.message.errno != 0) {
          util.message(data.message.message);
        } else {
          $http.post($scope.links.send_code_link, {
            receiver: $scope.mobile,
            custom_sign: $scope.register_sign
          }).success(function (data) {
            if (data == 'success') {
              util.message('\u53d1\u9001\u9a8c\u8bc1\u7801\u6210\u529f', '', 'success');
              var time = $interval(function () {
                  $scope.isDisable = true;
                  $scope.expire--;
                  $scope.text = $scope.expire + '\u79d2\u540e\u91cd\u65b0\u83b7\u53d6';
                  if ($scope.expire <= 0) {
                    $interval.cancel(time);
                    $scope.isDisable = false;
                    $scope.text = '\u91cd\u65b0\u70b9\u51fb\u83b7\u53d6\u9a8c\u8bc1\u7801';
                    $scope.expire = 120;
                  }
                }, 1000);
            } else {
              util.message(data, '', 'error');
            }
          });
        }
      });
    };
    $scope.changeVerify = function () {
      $scope.image = $scope.links.img_verify_link + 'r=' + Math.round(new Date().getTime());
      return false;
    };
    $scope.checkMobile = function () {
      var mobile = $scope.mobile;
      $http.post($scope.links.valid_mobile_link, { mobile: mobile }).success(function (data) {
        if (data.message.errno != 0) {
          $scope.mobileErr = true;
          $scope.mobileMsg = data.message.message;
        } else {
          $scope.mobileErr = false;
          $scope.mobleInvalid = false;
        }
      });
    };
    $scope.checkMobileCode = function () {
      var mobile = $scope.mobile;
      var smscode = $scope.smscode;
      if (smscode == '' || smscode == undefined) {
        $scope.smscodeErr = true;
        $scope.smscodeMsg = '\u77ed\u4fe1\u9a8c\u8bc1\u7801\u4e0d\u80fd\u4e3a\u7a7a';
      } else {
        $http.post($scope.links.check_mobile_code_link, {
          mobile: mobile,
          smscode: smscode
        }).success(function (data) {
          if (data.message.errno != 0) {
            $scope.smscodeErr = true;
            $scope.smscodeMsg = data.message.message;
          } else {
            $scope.smscodeErr = false;
            $scope.smscodeInvalid = false;
          }
        });
      }
    };
    $scope.checkImagecode = function () {
      if ($scope.imagecode == '' || $scope.imagecode == undefined) {
        $scope.imagecodeErr = true;
        $scope.imagecodeMsg = '\u8bf7\u8f93\u5165\u9a8c\u8bc1\u7801';
      } else {
        $http.post(config.links.check_code_link, { code: $scope.imagecode }).success(function (data) {
          if (data.message.errno != 0) {
            $scope.imagecodeErr = true;
            $scope.imagecodeMsg = '\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u9a8c\u8bc1\u7801';
            $scope.changeVerify();
          } else {
            $scope.imagecodeErr = false;
            $scope.imageInvalid = false;
          }
        });
      }
    };
    $scope.checkPassword = function () {
      if ($scope.password == '' || $scope.password == undefined) {
        $scope.passwordErr = true;
        $scope.passwordMsg = '\u8bf7\u8f93\u5165\u5bc6\u7801';
      } else if ($scope.password.length < 8) {
        $scope.passwordErr = true;
        $scope.passwordMsg = '\u5bc6\u7801\u957f\u5ea6\u4e0d\u80fd\u5c11\u4e8e8';
      } else {
        if (config.password_safe == 1) {
          $http.post(config.links.check_password_link, { password: $scope.password }).success(function (data) {
            if (data.message.errno != 0) {
              $scope.passwordErr = true;
              $scope.passwordMsg = data.message.message;
            } else {
              $scope.passwordErr = false;
              $scope.passwordInvalid = false;
            }
          });
        } else {
          $scope.passwordErr = false;
          $scope.passwordInvalid = false;
        }
      }
    };
    $scope.checkRepassword = function () {
      if ($scope.repassword == '' || $scope.repassword == undefined) {
        $scope.repasswordErr = true;
        $scope.repasswordMsg = '\u786e\u8ba4\u5bc6\u7801\u4e0d\u80fd\u4e3a\u7a7a';
      } else {
        if ($scope.repassword != $scope.password) {
          $scope.repasswordErr = true;
          $scope.repasswordMsg = '\u4e24\u6b21\u5bc6\u7801\u8f93\u5165\u4e0d\u4e00\u81f4';
        } else {
          $scope.repasswordErr = false;
          $scope.repasswordInvalid = false;
        }
      }
    };
    $scope.register = function () {
      $http.post($scope.links.register_link, {
        password: $scope.password,
        mobile: $scope.mobile,
        register_type: $scope.register_type,
        code: $scope.imagecode,
        smscode: $scope.smscode
      }).success(function (data) {
        if (data.message.errno == 0) {
          util.message(data.message.message, data.redirect, 'success');
        } else {
          util.message(data.message.message);
        }
      });
    };
  }
]);
// 系统注册
angular.module('userManageApp').controller('UserRegisterSystem', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.image = config.image;
    $scope.usernameInvalid = true;
    $scope.passwordInvalid = true;
    $scope.repasswordInvalid = true;
    $scope.codeInvalid = true;
    get_extendfields = function () {
      $http.get(config.links.get_extendfields_link).success(function (data) {
        if (data.message.errno != 0) {
          util.message('\u83b7\u53d6\u6ce8\u518c\u5b57\u6bb5\u4fe1\u606f\u5931\u8d25');
        } else {
          $scope.extendfields = data.message.message;
        }
      });
    };
    get_extendfields();
    $scope.checkUsername = function () {
      if ($scope.username == '' || $scope.username == undefined) {
        $scope.usernameErr = true;
        $scope.usernameMsg = '\u8bf7\u8f93\u5165\u7528\u6237\u540d';
      } else {
        $http.post(config.links.check_username_link, {
          username: $scope.username,
          owner_uid: $scope.owner_uid,
          password: $scope.password
        }).success(function (data) {
          if (data.message.errno != 0) {
            $scope.usernameErr = true;
            $scope.usernameMsg = '\u975e\u5e38\u62b1\u6b49\uff0c\u6b64\u7528\u6237\u540d\u5df2\u7ecf\u88ab\u6ce8\u518c\uff0c\u4f60\u9700\u8981\u66f4\u6362\u6ce8\u518c\u540d\u79f0\uff01';
          } else {
            $scope.usernameErr = false;
            $scope.usernameInvalid = false;
          }
        });
      }
    };
    $scope.checkPassword = function () {
      if ($scope.password == '' || $scope.password == undefined) {
        $scope.passwordErr = true;
        $scope.passwordMsg = '\u8bf7\u8f93\u5165\u5bc6\u7801';
      } else if ($scope.password.length < 8) {
        $scope.passwordErr = true;
        $scope.passwordMsg = '\u5bc6\u7801\u957f\u5ea6\u4e0d\u80fd\u5c11\u4e8e8';
      } else {
        if (config.password_safe == 1) {
          $http.post(config.links.check_password_link, { password: $scope.password }).success(function (data) {
            if (data.message.errno != 0) {
              $scope.passwordErr = true;
              $scope.passwordMsg = data.message.message;
            } else {
              $scope.passwordErr = false;
              $scope.passwordInvalid = false;
            }
          });
        } else {
          $scope.passwordErr = false;
          $scope.passwordInvalid = false;
        }
      }
    };
    $scope.checkRepassword = function () {
      if ($scope.repassword != $scope.password) {
        $scope.repasswordErr = true;
        $scope.repasswordMsg = '\u4e24\u6b21\u5bc6\u7801\u8f93\u5165\u4e0d\u4e00\u81f4';
      } else {
        $scope.repasswordErr = false;
        $scope.repasswordInvalid = false;
      }
    };
    $scope.changeVerify = function () {
      $scope.image = config.links.img_verify_link + 'r=' + Math.round(new Date().getTime());
      return false;
    };
    $scope.checkCode = function () {
      if ($scope.code == '' || $scope.code == undefined) {
        $scope.codeErr = true;
        $scope.codeMsg = '\u8bf7\u8f93\u5165\u9a8c\u8bc1\u7801';
      } else {
        $http.post(config.links.check_code_link, { code: $scope.code }).success(function (data) {
          if (data.message.errno != 0) {
            $scope.codeErr = true;
            $scope.codeMsg = '\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u9a8c\u8bc1\u7801';
            $scope.changeVerify();
          } else {
            $scope.codeErr = false;
            $scope.codeInvalid = false;
          }
        });
      }
    };
    $scope.checkExtendfield = function (field) {
      var objInput = document.getElementsByName(field);
      var valInput = objInput[0].value;
      switch (field) {
      case 'realname':
        var reg = /^.{2,5}$/;
        var fieldEmptyMsg = '\u8bf7\u8f93\u5165\u7528\u6237\u540d';
        var fieldRegMsg = '\u8bf7\u8f93\u5165\u60a8\u7684\u771f\u5b9e\u59d3\u540d';
        checkRes = checkField(valInput, field, fieldEmptyMsg, fieldRegMsg, reg);
        break;
      case 'nickname':
        var reg = /^.{3,15}$/;
        var fieldEmptyMsg = '\u8bf7\u8f93\u5165\u6635\u79f0';
        var fieldRegMsg = '\u6635\u79f0\u683c\u5f0f\u4e3a 3-15 \u4f4d\u5b57\u7b26';
        checkRes = checkField(valInput, field, fieldEmptyMsg, fieldRegMsg, reg);
        break;
      case 'qq':
        if (valInput == '' || valInput == undefined) {
          $scope.extendfields[field].fieldErr = true;
          $scope.extendfields[field].fieldMsg = '\u8bf7\u8f93\u5165QQ';
        } else {
          var reg = /^[1-9][0-9]{4,9}$/;
          var fieldEmptyMsg = '\u8bf7\u8f93\u5165QQ\u53f7\u7801';
          var fieldRegMsg = '\u8bf7\u8f93\u5165\u6b63\u786e\u7684QQ\u53f7\u7801';
          checkRes = checkField(valInput, field, fieldEmptyMsg, fieldRegMsg, reg);
        }
        break;
      }
    };
    function checkField(valInput, field, fieldEmptyMsg, fieldRegMsg, reg) {
      if (valInput == '' || valInput == undefined) {
        $scope.extendfields[field].fieldErr = true;
        $scope.extendfields[field].fieldMsg = fieldEmptyMsg;
      } else {
        if (!reg.test(valInput)) {
          $scope.extendfields[field].fieldErr = true;
          $scope.extendfields[field].fieldMsg = fieldRegMsg;
        } else {
          $scope.extendfields[field].fieldErr = false;
        }
      }
      return $scope.extendfields[field].fieldErr;
    }
    ;
  }
]);