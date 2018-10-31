angular.module('userProfile', ['we7app']);
angular.module('userProfile').controller('UserProfileDisplay', [
  '$scope',
  '$window',
  '$http',
  'config',
  function ($scope, $window, $http, config) {
    $scope.user = config.user;
    $scope.profile = config.profile;
    $scope.extra_fields = config.extra_fields;
    $scope.account_num = config.account_num;
    if ($scope.profile == null) {
      $scope.profile = {
        avatar: '',
        realname: '',
        births: '',
        address: '',
        resides: ''
      };
    }
    $scope.links = config.links;
    $scope.group_info = config.group_info;
    $scope.groups = config.groups;
    $scope.changeGroup = $scope.user.groupid;
    $scope.wechats = config.wechats;
    $scope.wxapps = config.wxapps;
    $scope.changeAvatar = function () {
      require(['fileUploader'], function (uploader) {
        uploader.init(function (imgs) {
          $scope.profile.avatar = imgs.url;
          $scope.$apply($scope.profile);
          $scope.httpChange('avatar');
        }, {
          'direct': true,
          'multiple': false,
          'uniacid': 0
        });
      });
    };
    $('.js-clip').each(function () {
      util.clip(this, $(this).attr('data-url'));
    });
    $scope.editInfo = function (type, val) {
      $scope.userOriginal = {};
      $scope.userOriginal[type] = val;
    };
    $scope.httpChange = function (type) {
      switch (type) {
      case 'avatar':
        $http.post($scope.links.userPost, {
          type: type,
          avatar: $scope.profile.avatar,
          uid: $scope.user.uid
        }).success(function (data) {
          if (data.message.errno == 0) {
            util.message('\u4fee\u6539\u6210\u529f\uff01');
          } else {
            if (data.message.errno == -1)
              util.message(data.message.message);
            if (data.message.errno == 1)
              util.message(data.message.message);
            if (data.message.errno == 40035)
              util.message(data.message.message);
          }
        });
        break;
      case 'username':
        $('.modal').modal('hide');
        $http.post($scope.links.userPost, {
          type: type,
          username: $scope.userOriginal[type],
          uid: $scope.user.uid
        }).success(function (data) {
          if (data.message.errno == 0) {
            $scope.user[type] = $scope.userOriginal[type];
            util.message('\u4fee\u6539\u6210\u529f\uff01');
          } else {
            if (data.message.errno == -1)
              util.message(data.message.message);
            if (data.message.errno == 1)
              util.message(data.message.message);
            if (data.message.errno == 2)
              util.message(data.message.message);
            if (data.message.errno == 40035)
              util.message(data.message.message);
          }
        });
        break;
      case 'vice_founder_name':
        $('.modal').modal('hide');
        $http.post($scope.links.userPost, {
          type: type,
          vice_founder_name: $scope.userOriginal[type],
          uid: $scope.user.uid
        }).success(function (data) {
          if (data.message.errno == 0) {
            $scope.user[type] = $scope.userOriginal[type];
            util.message('\u4fee\u6539\u6210\u529f\uff01');
          } else {
            util.message(data.message.message);
            return false;
          }
        });
        break;
      case 'qq':
        $('.modal').modal('hide');
        $http.post($scope.links.userPost, {
          type: type,
          qq: $scope.userOriginal[type],
          uid: $scope.user.uid
        }).success(function (data) {
          if (data.message.errno == 0) {
            $scope.profile[type] = $scope.userOriginal[type];
            util.message('\u4fee\u6539\u6210\u529f\uff01');
          } else {
            util.message(data.message.message);
            return false;
          }
        });
        break;
      case 'remark':
        $('.modal').modal('hide');
        $http.post($scope.links.userPost, {
          type: type,
          remark: $scope.userOriginal[type],
          uid: $scope.user.uid
        }).success(function (data) {
          if (data.message.errno == 0) {
            $scope.user[type] = $scope.userOriginal[type];
            util.message('\u4fee\u6539\u6210\u529f\uff01');
          } else {
            util.message(data.message.message);
            return false;
          }
        });
        break;
      case 'welcome_link':
        $('.modal').modal('hide');
        $http.post($scope.links.userPost, {
          type: type,
          welcome_link: $scope.user.welcome_link,
          uid: $scope.user.uid
        }).success(function (data) {
          if (data.message.errno == 0) {
            util.message('\u4fee\u6539\u6210\u529f\uff01');
          } else {
            util.message(data.message.message);
            return false;
          }
        });
        break;
      case 'mobile':
        $('.modal').modal('hide');
        $http.post($scope.links.userPost, {
          type: type,
          mobile: $scope.userOriginal[type],
          uid: $scope.user.uid
        }).success(function (data) {
          if (data.message.errno == 0) {
            $scope.profile[type] = $scope.userOriginal[type];
            util.message('\u4fee\u6539\u6210\u529f\uff01');
          } else {
            util.message(data.message.message);
            return false;
          }
        });
        break;
      case 'password':
        $('.modal').modal('hide');
        if ($window.sysinfo.isfounder == 0 && $scope.user.register_type == 0) {
          var oldpwd = $('.old-password').val();
          if (_.isEmpty(oldpwd)) {
            util.message('\u539f\u5bc6\u7801\u4e0d\u53ef\u4e3a\u7a7a\uff01');
            return false;
          }
        }
        var newpwd = $('.new-password').val();
        var renewpwd = $('.renew-password').val();
        if (_.isEmpty(newpwd)) {
          util.message('\u65b0\u5bc6\u7801\u4e0d\u53ef\u4e3a\u7a7a\uff01');
          return false;
        }
        if (_.isEmpty(renewpwd)) {
          util.message('\u786e\u8ba4\u65b0\u5bc6\u7801\u4e0d\u53ef\u4e3a\u7a7a\uff01');
          return false;
        }
        if (newpwd != renewpwd) {
          util.message('\u4e24\u6b21\u5bc6\u7801\u4e0d\u4e00\u81f4\uff01');
          return false;
        }
        $http.post($scope.links.userPost, {
          type: type,
          oldpwd: oldpwd,
          newpwd: newpwd,
          renewpwd: renewpwd,
          uid: $scope.user.uid
        }).success(function (data) {
          if (data.message.errno == 0) {
            util.message('\u5bc6\u7801\u4fee\u6539\u6210\u529f\uff01');
          } else {
            if (data.message.errno == -1)
              util.message('\u62b1\u6b49\uff0c\u7528\u6237\u4e0d\u5b58\u5728\u6216\u662f\u5df2\u7ecf\u88ab\u5220\u9664\uff01');
            if (data.message.errno == 1)
              util.message('\u5bc6\u7801\u4fee\u6539\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\uff01');
            if (data.message.errno == 2)
              util.message('\u4e24\u6b21\u5bc6\u7801\u4e0d\u4e00\u81f4\uff01');
            if (data.message.errno == 3)
              util.message('\u539f\u5bc6\u7801\u4e0d\u6b63\u786e\uff01');
            if (data.message.errno == 4)
              util.message(data.message.message);
            if (data.message.errno == 40035)
              util.message('\u4e0d\u5408\u6cd5\u7684\u53c2\u6570\uff01');
          }
        });
        break;
      case 'endtime':
        $('.modal').modal('hide');
        var endtype = $scope.user.endtype;
        var endtime = $(':text[name="endtime"]').val();
        $http.post($scope.links.userPost, {
          type: type,
          endtype: endtype,
          endtime: endtime,
          uid: $scope.user.uid
        }).success(function (data) {
          if (data.message.errno == 0) {
            $scope.user.endtype = endtype;
            $scope.user.end = endtype == 1 ? '\u6c38\u4e45' : endtime;
            util.message('\u5230\u671f\u65f6\u95f4\u4fee\u6539\u6210\u529f\uff01');
          } else {
            if (data.message.errno == -1)
              util.message(data.message.message);
            if (data.message.errno == 1)
              util.message(data.message.message);
            if (data.message.errno == 40035)
              util.message(data.message.message);
          }
        });
        break;
      case 'realname':
        $('.modal').modal('hide');
        if (_.isEmpty($scope.userOriginal.realname)) {
          util.message('\u771f\u5b9e\u59d3\u540d\u4e0d\u53ef\u4e3a\u7a7a\uff01');
          return false;
        }
        $http.post($scope.links.userPost, {
          type: type,
          realname: $scope.userOriginal.realname,
          uid: $scope.user.uid
        }).success(function (data) {
          if (data.message.errno == 0) {
            $scope.profile.realname = $scope.userOriginal.realname;
            util.message('\u771f\u5b9e\u59d3\u540d\u4fee\u6539\u6210\u529f\uff01');
          } else {
            if (data.message.errno == -1)
              util.message(data.message.message);
            if (data.message.errno == 1)
              util.message(data.message.message);
            if (data.message.errno == 40035)
              util.message(data.message.message);
          }
        });
        break;
      case 'birth':
        $('.modal').modal('hide');
        var year = $('.tpl-year').val();
        var month = $('.tpl-month').val();
        var day = $('.tpl-day').val();
        $http.post($scope.links.userPost, {
          type: type,
          year: year,
          month: month,
          day: day,
          uid: $scope.user.uid
        }).success(function (data) {
          if (data.message.errno == 0) {
            $scope.profile.births = year + '\u5e74' + month + '\u6708' + day + '\u65e5';
            util.message('\u4fee\u6539\u6210\u529f\uff01');
          } else {
            if (data.message.errno == -1)
              util.message(data.message.message);
            if (data.message.errno == 1)
              util.message(data.message.message);
            if (data.message.errno == 40035)
              util.message(data.message.message);
          }
        });
        break;
      case 'address':
        $('.modal').modal('hide');
        if (_.isEmpty($scope.userOriginal.address)) {
          util.message('\u90ae\u5bc4\u5730\u5740\u4e0d\u53ef\u4e3a\u7a7a\uff01');
          return false;
        }
        $http.post($scope.links.userPost, {
          type: type,
          address: $scope.userOriginal.address,
          uid: $scope.user.uid
        }).success(function (data) {
          if (data.message.errno == 0) {
            $scope.profile.address = $scope.userOriginal.address;
            util.message('\u90ae\u5bc4\u5730\u5740\u4fee\u6539\u6210\u529f\uff01');
          } else {
            if (data.message.errno == -1)
              util.message(data.message.message);
            if (data.message.errno == 1)
              util.message(data.message.message);
            if (data.message.errno == 40035)
              util.message(data.message.message);
          }
        });
        break;
      case 'reside':
        $('.modal').modal('hide');
        var province = $('.tpl-province').val();
        var city = $('.tpl-city').val();
        var district = $('.tpl-district').val();
        $http.post($scope.links.userPost, {
          type: type,
          province: province,
          city: city,
          district: district,
          uid: $scope.user.uid
        }).success(function (data) {
          if (data.message.errno == 0) {
            $scope.profile.resides = province + ' ' + city + ' ' + district;
            util.message('\u4fee\u6539\u6210\u529f\uff01');
          } else {
            if (data.message.errno == -1)
              util.message(data.message.message);
            if (data.message.errno == 1)
              util.message(data.message.message);
            if (data.message.errno == 40035)
              util.message(data.message.message);
          }
        });
        break;
      }
    };
    $scope.changeText = function (ev) {
      var text = $(ev)[0].target.text;
      $(ev)[0].target.text = text == '\u5c55\u5f00' ? '\u6536\u8d77' : '\u5c55\u5f00';
    };
  }
]);
angular.module('userProfile').controller('userBindCtrl', [
  '$scope',
  '$http',
  'config',
  '$interval',
  function ($scope, $http, config, $interval) {
    $scope.bindqq = config.bindqq;
    $scope.bindwechat = config.bindwechat;
    $scope.bindmobile = config.bindmobile;
    $scope.login_urls = config.login_urls;
    $scope.thirdlogin = config.thirdlogin;
    $scope.bind_sign = config.bind_sign;
    $scope.image = config.image;
    $scope.mobile = '';
    $scope.password = '';
    $scope.repassword = '';
    $scope.links = config.links;
    $scope.imagecode = '';
    $scope.smscode = '';
    $scope.expire = 120;
    $scope.text = '\u53d1\u9001\u9a8c\u8bc1\u7801';
    $scope.isDisable = false;
    $scope.sendMessage = function (type) {
      if ($scope.mobile == '') {
        util.message('\u624b\u673a\u53f7\u4e0d\u80fd\u4e3a\u7a7a');
        return false;
      }
      $http.post($scope.links.valid_mobile_link, {
        mobile: $scope.mobile,
        type: type
      }).success(function (data) {
        if (data.message.errno != 0) {
          util.message(data.message.message);
        } else {
          $http.post($scope.links.send_code_link, {
            receiver: $scope.mobile,
            custom_sign: $scope.bind_sign
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
    $scope.mobileBind = function (type, bind_type) {
      if ($scope.mobile == '') {
        util.message('\u624b\u673a\u53f7\u4e0d\u80fd\u4e3a\u7a7a');
        return false;
      }
      if ($scope.imagecode == '') {
        util.message('\u56fe\u5f62\u9a8c\u8bc1\u7801\u4e0d\u80fd\u4e3a\u7a7a');
        return false;
      }
      if ($scope.smscode == '') {
        util.message('\u624b\u673a\u53f7\u9a8c\u8bc1\u7801\u4e0d\u80fd\u4e3a\u7a7a');
        return false;
      }
      if ($scope.bindmobile == null) {
        if ($scope.password == '') {
          util.message('\u5bc6\u7801\u4e0d\u80fd\u4e3a\u7a7a');
          return false;
        }
        if ($scope.repassword == '') {
          util.message('\u786e\u8ba4\u5bc6\u7801\u4e0d\u80fd\u4e3a\u7a7a');
          return false;
        }
        if ($scope.password != $scope.repassword) {
          util.message('\u4e24\u6b21\u8f93\u5165\u7684\u5bc6\u7801\u4e0d\u4e00\u81f4');
          return false;
        }
      }
      if ($scope.bindmobile == null) {
        $http.post($scope.links.bind_mobile_link, {
          mobile: $scope.mobile,
          password: $scope.password,
          repassword: $scope.repassword,
          imagecode: $scope.imagecode,
          smscode: $scope.smscode,
          type: type
        }).success(function (data) {
          if (data.message.errno == 0) {
            util.message(data.message.message, data.redirect, 'success');
          } else {
            util.message(data.message.message);
          }
        });
      } else {
        $http.post($scope.links.unbind_third_link, {
          mobile: $scope.mobile,
          password: $scope.password,
          repassword: $scope.repassword,
          imagecode: $scope.imagecode,
          smscode: $scope.smscode,
          type: type,
          bind_type: bind_type
        }).success(function (data) {
          if (data.message.errno == 0) {
            util.message(data.message.message, data.redirect, 'success');
          } else {
            util.message(data.message.message);
          }
        });
      }
    };
    $scope.unbind = function (third_type) {
      $http.post($scope.links.unbind_third_link, { bind_type: third_type }).success(function (data) {
        if (data.message.errno == 0) {
          util.message(data.message.message, data.redirect, 'success');
        } else {
          util.message(data.message.message);
        }
      });
    };
  }
]);