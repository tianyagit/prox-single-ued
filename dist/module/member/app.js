angular.module('memberAPP', ['we7app']);
angular.module('memberAPP').controller('group', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.config = config;
    $scope.group_level = $scope.config.group_level;
    $scope.group_person_count = $scope.config.group_person_count;
    $scope.group_list = $scope.config.group_list;
    $scope.default_group = $scope.config.default_group;
    $scope.set_group_detail_info = function (group_id) {
      $scope.group_detail = {};
      $http.post($scope.config.get_group_url, { 'group_id': group_id }).success(function (data) {
        if (data.message.errno == 1) {
          util.message(data.message.message, '', 'error');
        } else {
          $scope.group_detail = data.message.message;
        }
      });
      $('#group_detail').modal('show');
    };
    $scope.change_group_level = function () {
      $http.post($scope.config.change_group_level_url, { 'group_level': $scope.group_level }).success(function (data) {
        if (data.message.errno == 0) {
          util.modal_message('', '\u8bbe\u7f6e\u6210\u529f', '', 'success');
        } else {
          util.message('\u8bbe\u7f6e\u5931\u8d25', '', 'error');
        }
      });
    };
    $scope.save_group = function () {
      if ($scope.group_detail.title == '') {
        util.message('\u8bf7\u586b\u5199\u4f1a\u5458\u7ec4\u540d\u79f0', '', 'error');
        return false;
      }
      $http.post($scope.config.save_group_url, { 'group': $scope.group_detail }).success(function (data) {
        if (data.message.errno == 1) {
          util.message(data.message.message, '', 'error');
        }
        if (data.message.errno == 2) {
          $('#group_detail').modal('hide');
          $scope.group_list[$scope.group_detail.groupid] = $scope.group_detail;
          util.message(data.message.message, '', 'success');
        }
        if (data.message.errno == 3) {
          groupid = data.message.message.groupid;
          $scope.group_list[groupid] = data.message.message;
          $('#group_detail').modal('hide');
          util.message('\u6dfb\u52a0\u6210\u529f', '', 'success');
        }
      });
    };
    $scope.set_default = function (group_id) {
      $http.post($scope.config.set_default_url, { 'group_id': group_id }).success(function (data) {
        if (data.message.errno == 0) {
          $scope.group_list[group_id].isdefault = 1;
          $scope.group_list[$scope.default_group.groupid].isdefault = 0;
          $scope.default_group = $scope.group_list[group_id];
          $scope.apply($scope);
          util.message('\u8bbe\u7f6e\u6210\u529f', '', 'success');
        } else {
          util.message('\u8bbe\u7f6e\u5931\u8d25', '', 'error');
        }
      });
    };
    $scope.del_group = function (group_id) {
      if (!confirm('\u786e\u5b9a\u8981\u5220\u9664\u5417\uff1f')) {
        return false;
      }
      $http.post($scope.config.del_group_url, { 'group_id': group_id }).success(function (data) {
        if (data.message.errno == 0) {
          delete $scope.group_list[group_id];
          util.message('\u5220\u9664\u6210\u529f', '', 'success');
        } else {
          util.message('\u5220\u9664\u5931\u8d25', '', 'error');
        }
      });
    };
  }
]);
angular.module('memberAPP').controller('baseInformation', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.config = config;
    $scope.profile = $scope.config.profile;
    $scope.groups = $scope.config.groups;
    $scope.addresses = $scope.config.addresses;
    $scope.custom_fields = $scope.config.custom_fields;
    $scope.all_fields = $scope.config.all_fields;
    $scope.uniacid_fields = $scope.config.uniacid_fields;
    $scope.sexes = [
      {
        id: 0,
        name: '\u4fdd\u5bc6'
      },
      {
        id: 1,
        name: '\u7537'
      },
      {
        id: 2,
        name: '\u5973'
      }
    ];
    $scope.educations = [
      '\u535a\u58eb',
      '\u7855\u58eb',
      '\u672c\u79d1',
      '\u4e13\u79d1',
      '\u4e2d\u5b66',
      '\u5c0f\u5b66',
      '\u5176\u5b83'
    ];
    $scope.constellations = [
      '\u6c34\u74f6\u5ea7',
      '\u53cc\u9c7c\u5ea7',
      '\u767d\u7f8a\u5ea7',
      '\u91d1\u725b\u5ea7',
      '\u53cc\u5b50\u5ea7',
      '\u5de8\u87f9\u5ea7',
      '\u72ee\u5b50\u5ea7',
      '\u5904\u5973\u5ea7',
      '\u5929\u79e4\u5ea7',
      '\u5929\u874e\u5ea7',
      '\u5c04\u624b\u5ea7',
      '\u6469\u7faf\u5ea7'
    ];
    $scope.zodiacs = [
      '\u9f20',
      '\u725b',
      '\u864e',
      '\u5154',
      '\u9f99',
      '\u86c7',
      '\u9a6c',
      '\u7f8a',
      '\u7334',
      '\u9e21',
      '\u72d7',
      '\u732a'
    ];
    $scope.bloodtypes = [
      'A',
      'B',
      'AB',
      'O',
      '\u5176\u5b83'
    ];
    $scope.profile.births = $scope.profile.birthyear + '-' + $scope.profile.birthmonth + '-' + $scope.profile.birthday;
    $scope.profile.resides = $scope.profile.nationality + $scope.profile.resideprovince + $scope.profile.residecity + $scope.profile.residedist;
    $scope.other_field_name = '';
    $scope.other_field_title = '';
    $scope.addAddress = {
      name: '',
      phone: '',
      code: '',
      province: '',
      city: '',
      district: '',
      detail: ''
    };
    $scope.editAddress = {};
    $scope.uid = $scope.config.uid;
    angular.forEach($scope.addresses, function (data, index) {
      data['pcda'] = data.province + '-' + data.city + '-' + data.district + '-' + data.address;
    });
    $scope.addAdd = function () {
      $scope.addAddress.province = $('.tpl-province').eq(1).val();
      $scope.addAddress.city = $('.tpl-city').eq(1).val();
      $scope.addAddress.district = $('.tpl-district').eq(1).val();
      $('#address-add').modal('hide');
      $http.post(config.links.addAddressUrl, $scope.addAddress).success(function (data) {
        if (data.message.errno == 0) {
          var address = data.message.message;
          address['pcda'] = address.province + '-' + address.city + '-' + address.district + '-' + address.address;
          $scope.addresses.push(address);
          util.message('\u6536\u8d27\u5730\u5740\u6dfb\u52a0\u6210\u529f', '', 'success');
        } else {
          if (data.message.errno == 1)
            util.message(data.message.message, '', 'error');
        }
      });
    };
    $scope.choseEditAdd = function (id) {
      angular.forEach($scope.addresses, function (data, index) {
        if (data.id == id) {
          $scope.editAddress = {
            id: id,
            name: data.username,
            phone: data.mobile,
            code: data.zipcode,
            province: data.province,
            city: data.city,
            district: data.district,
            detail: data.address,
            uniacid: data.uniacid
          };
          $('.tpl-province').eq(2).attr('data-value', $scope.editAddress.province);
          $('.tpl-city').eq(2).attr('data-value', $scope.editAddress.city);
          $('.tpl-district').eq(2).attr('data-value', $scope.editAddress.district);
          require(['district'], function (dis) {
            $('.tpl-district-container').each(function () {
              var elms = {};
              elms.province = $(this).find('.tpl-province')[0];
              elms.city = $(this).find('.tpl-city')[0];
              elms.district = $(this).find('.tpl-district')[0];
              var vals = {};
              vals.province = $(elms.province).attr('data-value');
              vals.city = $(elms.city).attr('data-value');
              vals.district = $(elms.district).attr('data-value');
              dis.render(elms, vals, { withTitle: true });
            });
          });
        }
      });
    };
    $scope.editAdd = function (id) {
      $scope.editAddress.province = $('.tpl-province').eq(2).val();
      $scope.editAddress.city = $('.tpl-city').eq(2).val();
      $scope.editAddress.district = $('.tpl-district').eq(2).val();
      $('#address-edit').modal('hide');
      $http.post(config.links.editAddressUrl, $scope.editAddress).success(function (res) {
        if (res.message.errno == 0) {
          var address = res.message.message;
          address.pcda = address.province + '-' + address.city + '-' + address.district + '-' + address.address;
          angular.forEach($scope.addresses, function (data, index) {
            if (address.id == data.id) {
              data.pcda = address.pcda;
            }
          });
          util.message('\u6536\u8d27\u5730\u5740\u4fee\u6539\u6210\u529f', '', 'success');
        } else {
          if (data.message.errno == 1)
            util.message(res.message.message, '', 'error');
        }
      });
    };
    $scope.delAdd = function (id) {
      $http.post(config.links.delAddressUrl, { id: id }).success(function (res) {
        if (res.message.errno == 0) {
          angular.forEach($scope.addresses, function (data, index) {
            if (id == data.id) {
              $scope.addresses.splice(index, 1);
            }
          });
          util.message('\u6536\u8d27\u5730\u5740\u5220\u9664\u6210\u529f', '', 'success');
        } else {
          if (data.message.errno == 1)
            util.message(res.message.message, '', 'error');
        }
      });
    };
    $scope.setDefaultAdd = function (id) {
      $http.post(config.links.setDefaultAddressUrl, {
        id: id,
        uid: $scope.uid
      }).success(function (res) {
        if (res.message.errno == 0) {
          angular.forEach($scope.addresses, function (data, index) {
            if (id == data.id) {
              data.isdefault = 1;
            } else {
              data.isdefault = 0;
            }
          });
          util.message('\u8bbe\u7f6e\u6210\u529f', '', 'success');
        } else {
          util.message('\u8bbe\u7f6e\u5931\u8d25', '', 'success');
        }
      });
    };
    $scope.changeImage = function (type) {
      if (type == 'avatar') {
        require(['fileUploader'], function (uploader) {
          uploader.init(function (imgs) {
            $scope.profile.avatar = imgs.attachment;
            $scope.profile.avatarUrl = imgs.url;
            $scope.$apply($scope.profile);
            $scope.httpChange(type);
          }, {
            'direct': true,
            'multiple': false
          });
        });
      }
    };
    $scope.editInfo = function (type, val) {
      $scope.userOriginal = {};
      if (type == 'other_field') {
        $scope.userOriginal[val] = $scope.profile[val];
        $scope.other_field_name = $scope.all_fields[val];
        $scope.other_field_title = val;
      } else {
        $scope.userOriginal[type] = val;
      }
    };
    $scope.httpChange = function (type, newval) {
      switch (type) {
      case 'avatar':
        $http.post(config.links.basePost, {
          type: type,
          imgsrc: $scope.profile.avatar
        }).success(function (data) {
          if (data.message.errno == 0) {
            util.message('\u4fee\u6539\u6210\u529f\uff01', '', 'success');
          } else {
            if (data.message.errno == -1)
              util.message(data.message.message, data.redirect, 'error');
            if (data.message.errno == 1)
              util.message(data.message.message, '', 'error');
          }
        });
        break;
      case 'groupid':
      case 'gender':
      case 'education':
      case 'nickname':
      case 'realname':
      case 'address':
      case 'mobile':
      case 'qq':
      case 'email':
      case 'telephone':
      case 'msn':
      case 'taobao':
      case 'alipay':
      case 'graduateschool':
      case 'grade':
      case 'studentid':
      case 'revenue':
      case 'position':
      case 'occupation':
      case 'company':
      case 'nationality':
      case 'height':
      case 'weight':
      case 'idcard':
      case 'zipcode':
      case 'site':
      case 'affectivestatus':
      case 'lookingfor':
      case 'bio':
      case 'interest':
      case 'constellation':
      case 'zodiac':
      case 'bloodtype':
        $('#' + type).modal('hide');
        if ($scope.userOriginal[type] == '') {
          util.message('\u4e0d\u53ef\u4e3a\u7a7a\uff01', '', 'error');
          return false;
        }
        if (type == 'mobile') {
          var phonereg = /^\d{11}$/;
          if (!phonereg.test($scope.userOriginal[type])) {
            util.message('\u624b\u673a\u53f7\u683c\u5f0f\u9519\u8bef', '', 'error');
            return false;
          }
        }
        $http.post(config.links.basePost, {
          type: type,
          request_data: $scope.userOriginal[type]
        }).success(function (data) {
          if (data.message.errno == 0) {
            $scope.profile[type] = $scope.userOriginal[type];
            util.message('\u4fee\u6539\u6210\u529f\uff01', '', 'success');
          } else {
            if (data.message.errno == -1)
              util.message(data.message.message, data.redirect, 'error');
            if (data.message.errno == 1)
              util.message(data.message.message, '', 'error');
          }
        });
        break;
      case 'other_field':
        $('#' + type).modal('hide');
        if ($scope.userOriginal[$scope.other_field_title] == '') {
          util.message('\u4e0d\u53ef\u4e3a\u7a7a\uff01', '', 'error');
          return false;
        }
        $http.post(config.links.basePost, {
          type: $scope.other_field_title,
          request_data: $scope.userOriginal[$scope.other_field_title]
        }).success(function (data) {
          if (data.message.errno == 0) {
            $scope.profile[$scope.other_field_title] = $scope.userOriginal[$scope.other_field_title];
            util.message('\u4fee\u6539\u6210\u529f\uff01', '', 'success');
          } else {
            if (data.message.errno == -1)
              util.message(data.message.message, data.redirect, 'error');
            if (data.message.errno == 1)
              util.message(data.message.message, '', 'error');
          }
        });
        break;
      case 'births':
        $('.modal').modal('hide');
        var year = $('.tpl-year').val();
        var month = $('.tpl-month').val();
        var day = $('.tpl-day').val();
        $http.post(config.links.basePost, {
          type: type,
          birthyear: year,
          birthmonth: month,
          birthday: day
        }).success(function (data) {
          if (data.message.errno == 0) {
            $scope.profile.births = year + '-' + month + '-' + day;
            util.message('\u4fee\u6539\u6210\u529f\uff01', '', 'success');
          } else {
            if (data.message.errno == -1)
              util.message(data.message.message, data.redirect, 'error');
            if (data.message.errno == 1)
              util.message(data.message.message, '', 'error');
          }
        });
        break;
      case 'resides':
        $('.modal').modal('hide');
        var resideprovince = $('.tpl-province').eq(0).val();
        var residecity = $('.tpl-city').eq(0).val();
        var residedist = $('.tpl-district').eq(0).val();
        $http.post(config.links.basePost, {
          type: type,
          resideprovince: resideprovince,
          residecity: residecity,
          residedist: residedist
        }).success(function (data) {
          if (data.message.errno == 0) {
            $scope.profile.resides = $scope.profile.nationality + resideprovince + residecity + residedist;
            util.message('\u4fee\u6539\u6210\u529f\uff01', '', 'success');
          } else {
            if (data.message.errno == -1)
              util.message(data.message.message, data.redirect, 'error');
            if (data.message.errno == 1)
              util.message(data.message.message, '', 'error');
          }
        });
        break;
      case 'password':
        $('.modal').modal('hide');
        var newpwd = $('.new-password').val();
        var renewpwd = $('.renew-password').val();
        if (newpwd == '') {
          util.message('\u65b0\u5bc6\u7801\u4e0d\u53ef\u4e3a\u7a7a\uff01');
          return false;
        }
        if (renewpwd == '') {
          util.message('\u786e\u8ba4\u65b0\u5bc6\u7801\u4e0d\u53ef\u4e3a\u7a7a\uff01');
          return false;
        }
        if (newpwd != renewpwd) {
          util.message('\u4e24\u6b21\u5bc6\u7801\u4e0d\u4e00\u81f4\uff01');
          return false;
        }
        $http.post(config.links.basePost, {
          type: type,
          password: newpwd
        }).success(function (data) {
          if (data.message.errno == 0) {
            util.message('\u5bc6\u7801\u4fee\u6539\u6210\u529f\uff01');
          } else {
            if (data.message.errno == -1)
              util.message(data.message.message, data.redirect, 'error');
            if (data.message.errno == 1)
              util.message(data.message.message, '', 'error');
          }
        });
        break;
      }
    };
  }
]);