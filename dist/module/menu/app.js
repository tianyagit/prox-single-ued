angular.module('menuApp', ['we7app']);
angular.module('menuApp').controller('menuDisplay', [
  '$scope',
  'config',
  '$http',
  function ($scope, config, $http) {
    $scope.changeStatus = function (id, status, menu_type) {
      status = status == 1 ? 2 : 1;
      if (menu_type == 3) {
        if (status == 1) {
          $('.js-switch-' + id).addClass('switchOn');
        } else if (status == 2) {
          $('.js-switch-' + id).removeClass('switchOn');
        }
      }
      $http.post(config.push_url, { id: id }).success(function (data) {
        if (data.message.errno == 0) {
          if (menu_type == 3) {
            util.message(data.message.message, data.redirect);
          } else {
            util.message(data.message.message, data.redirect);
          }
        } else {
          if (menu_type == 3) {
            util.message(data.message.message, 'error');
          } else {
            util.message(data.message.message, data.redirect, 'error');
          }
        }
      });
    };
  }
]);
angular.module('menuApp').controller('conditionMenuDesigner', [
  '$scope',
  'config',
  '$http',
  function ($scope, config, $http) {
    current_menu_url = config.current_menu_url;
    require([
      'underscore',
      'jquery.ui',
      'jquery.caret',
      'district'
    ], function (_, $, $, dis) {
      $('.tpl-district-container').each(function () {
        var elms = {};
        elms.province = $(this).find('.tpl-province')[0];
        elms.city = $(this).find('.tpl-city')[0];
        var vals = {};
        vals.province = $(elms.province).data('value');
        vals.city = $(elms.city).data('value');
        dis.render(elms, vals, {
          withTitle: true,
          wechat: true
        });
      });
      $('.sub-designer-y').sortable({
        items: '.sub-js-sortable',
        axis: 'y',
        cancel: '.sub-js-not-sortable'
      });
      $('.designer-x').sortable({
        items: '.js-sortable',
        axis: 'x'
      });
    });
    $scope.context = {};
    $scope.context.group = config.group;
    if (config.id > 0 && config.type != 1 && config.status == 1) {
      $scope.context.group.disabled = 1;
    }
    $scope.initGroup = function () {
      $scope.context.group = {
        title: '',
        type: config.type,
        button: [{
            name: '\u83dc\u5355\u540d\u79f0',
            type: 'click',
            url: '',
            key: '',
            media_id: '',
            appid: '',
            pagepath: '',
            sub_button: []
          }],
        matchrule: {
          sex: 0,
          client_platform_type: 0,
          group_id: -1,
          country: '',
          province: '',
          city: '',
          language: ''
        }
      };
    };
    if (!$scope.context.group || !$scope.context.group.button) {
      $scope.initGroup();
    }
    $scope.$watch('context.group.matchrule.province', function (newValue, oldValue) {
      if (newValue == '') {
        $('.tpl-city').hide();
      } else {
        $('.tpl-city').show();
      }
    });
    $scope.context.activeIndex = 0;
    $scope.context.activeBut = $scope.context.group['button'][$scope.context.activeIndex];
    $scope.context.activeItem = $scope.context.activeBut;
    $scope.context.activeType = 1;
    //标识一级菜单
    //删除默认菜单
    $scope.context.remove = function () {
      if (!confirm('\u5220\u9664\u9ed8\u8ba4\u83dc\u5355\u4f1a\u6e05\u7a7a\u6240\u6709\u83dc\u5355\u8bb0\u5f55\uff0c\u786e\u5b9a\u5417\uff1f')) {
        return false;
      }
      location.href = config.delete_url;
      return false;
    };
    $scope.context.submit = function (submit_type) {
      var group = $scope.context.group;
      group.button = _.sortBy(group.button, function (h) {
        var elm = $(':hidden[data-role="parent"][data-hash="' + h.$$hashKey + '"]');
        return elm.parent().index();
      });
      angular.forEach(group.button, function (j) {
        j.sub_button = _.sortBy(j.sub_button, function (h) {
          var e = $(':hidden[data-role="sub"][data-hash="' + h.$$hashKey + '"]');
          return e.parent().index();
        });
      });
      var ched = $(':hidden[name="menu_media"]').val();
      if (!$.trim(group.title)) {
        util.message('\u6ca1\u6709\u8bbe\u7f6e\u83dc\u5355\u7ec4\u540d\u79f0', '', 'error');
        return false;
      }
      if (config.type == 2) {
        if (!group.matchrule.sex && !group.matchrule.client_platform_type && group.matchrule.group_id == -1 && !group.matchrule.province && !group.matchrule.city) {
          util.message('\u6ca1\u6709\u8bbe\u7f6e\u4e2a\u6027\u5316\u83dc\u5355\u7684\u5339\u914d\u89c4\u5219', '', 'error');
          return false;
        }
      }
      if (group.button.length < 1) {
        util.message('\u6ca1\u6709\u8bbe\u7f6e\u83dc\u5355', '', 'error');
        return false;
      }
      var error = {
          name: '',
          action: ''
        };
      angular.forEach(group.button, function (val, index) {
        if ($.trim(val.name) == '') {
          this.name += '\u7b2c' + (index + 1) + '\u4e2a\u4e00\u7ea7\u83dc\u5355\u672a\u8bbe\u7f6e\u83dc\u5355\u540d\u79f0<br>';
        }
        if (val.sub_button.length > 0) {
          angular.forEach(val.sub_button, function (v, index1) {
            if ($.trim(v.name) == '') {
              this.name += '\u7b2c' + (index + 1) + '\u4e2a\u4e00\u7ea7\u83dc\u5355\u4e2d\u7684\u7b2c' + (index1 + 1) + '\u4e2a\u4e8c\u7ea7\u83dc\u5355\u672a\u8bbe\u7f6e\u83dc\u5355\u540d\u79f0<br>';
            }
            if (v.type == 'view' && v.url.indexOf('http') < 0) {
              this.action += '\u7b2c' + (index + 1) + '\u4e2a\u4e00\u7ea7\u83dc\u5355\u4e2d\u7684\u7b2c' + (index1 + 1) + '\u4e2a\u4e8c\u7ea7\u83dc\u5355\u8df3\u8f6c\u94fe\u63a5\u7f3a\u5c11http\u6807\u8bc6<br>';
            }
            if (v.type == 'miniprogram') {
              if ($.trim(v.appid) == '') {
                this.action += '\u7b2c' + (index + 1) + '\u4e2a\u4e00\u7ea7\u83dc\u5355\u4e2d\u7684\u7b2c' + (index1 + 1) + '\u4e2a\u4e8c\u7ea7\u83dc\u5355\u9700\u8bbe\u7f6eAPPID<br>';
              }
              if ($.trim(v.pagepath) == '') {
                this.action += '\u7b2c' + (index + 1) + '\u4e2a\u4e00\u7ea7\u83dc\u5355\u4e2d\u7684\u7b2c' + (index1 + 1) + '\u4e2a\u4e8c\u7ea7\u83dc\u5355\u9700\u8bbe\u7f6e\u9875\u9762\u8df3\u8f6c\u5730\u5740<br>';
              }
              if ($.trim(v.url) == '') {
                this.action += '\u7b2c' + (index + 1) + '\u4e2a\u4e00\u7ea7\u83dc\u5355\u4e2d\u7684\u7b2c' + (index1 + 1) + '\u4e2a\u4e8c\u7ea7\u83dc\u5355\u9700\u8bbe\u7f6e\u5907\u7528\u9875\u8df3\u8f6c\u5730\u5740<br>';
              }
            }
            if (v.type == 'view' && $.trim(v.url) == '' || v.type == 'click' && (v.media_id == '' && v.key == '') || v.type != 'view' && v.type != 'click' && v.type != 'miniprogram' && $.trim(v.key) == '') {
              this.action += '\u83dc\u5355\u3010' + val.name + '\u3011\u7684\u5b50\u83dc\u5355\u3010' + v.name + '\u3011\u672a\u8bbe\u7f6e\u64cd\u4f5c\u9009\u9879. <br />';
            }
          }, error);
        } else {
          if (val.type == 'view' && val.url.indexOf('http') < 0) {
            this.action += '\u83dc\u5355\u3010' + val.name + '\u3011\u8df3\u8f6c\u94fe\u63a5\u7f3a\u5c11http\u6807\u8bc6. <br />';
          }
          if (val.type == 'miniprogram') {
            if ($.trim(val.appid) == '') {
              this.action += '\u83dc\u5355\u3010' + val.name + '\u3011\u9700\u8bbe\u7f6eAPPID. <br />';
            }
            if ($.trim(val.pagepath) == '') {
              this.action += '\u83dc\u5355\u3010' + val.name + '\u3011\u9700\u8bbe\u7f6e\u9875\u9762\u8df3\u8f6c\u5730\u5740. <br />';
            }
            if ($.trim(val.url) == '') {
              this.action += '\u83dc\u5355\u3010' + val.name + '\u3011\u9700\u8bbe\u7f6e\u5907\u7528\u9875\u8df3\u8f6c\u5730\u5740. <br />';
            }
          }
          if (val.type == 'view' && $.trim(val.url) == '' || val.type == 'click' && (val.media_id == '' && val.key == '') || val.type != 'view' && val.type != 'click' && val.type != 'miniprogram' && $.trim(val.key) == '') {
            this.action += '\u83dc\u5355\u3010' + val.name + '\u3011\u4e0d\u5b58\u5728\u5b50\u83dc\u5355\u5e76\u4e14\u672a\u8bbe\u7f6e\u64cd\u4f5c\u9009\u9879. <br />';
          }
        }
      }, error);
      if (error.name) {
        util.message(error.title, '', 'error');
        return;
      }
      if (error.action) {
        util.message(error.action, '', 'error');
        return;
      }
      $('#btn-submit').attr('disabled', true);
      $http.post(location.href, {
        'group': group,
        'method': 'post',
        'submit_type': submit_type
      }).success(function (dat) {
        if (dat.message.errno != 0) {
          $('#btn-submit').attr('disabled', false);
          util.message(dat.message.message, '', 'error');
        } else {
          util.message('\u521b\u5efa\u83dc\u5355\u6210\u529f. ', dat.redirect, 'success');
        }
      });
    };
    $scope.context.triggerActiveBut = function (but) {
      var index = $.inArray(but, $scope.context.group.button);
      if (index == -1)
        return false;
      $scope.context.activeIndex = index;
      $scope.context.activeBut = $scope.context.group['button'][$scope.context.activeIndex];
      $scope.context.activeItem = $scope.context.activeBut;
      $scope.context.activeType = 1;
      $scope.context.activeItem.forceHide = 0;
    };
    $scope.context.editBut = function (subbut, but, id) {
      $scope.context.triggerActiveBut(but);
      if (!subbut) {
        $scope.context.activeItem = but;
        $scope.context.activeType = 1;
      } else {
        $scope.context.activeItem = subbut;
        $scope.context.activeType = 2;
      }
      if ($scope.context.activeType == 1 && $scope.context.activeItem.sub_button.length > 0) {
        $scope.context.activeItem.forceHide = 1;
      } else {
        $scope.context.activeItem.forceHide = 0;
      }
      if (id) {
        $scope.context.activeItem.material = [];
        if ($scope.context.activeItem.type != 'view' && $scope.context.activeItem.type != 'click') {
          if (!$scope.context.activeItem.key) {
            current_type = 'click';
          } else {
            current_type = $scope.context.activeItem.key.substr(0, 6);
          }
          if (current_type == 'module') {
            $scope.context.activeItem.etype = 'module';
          } else {
            $scope.context.activeItem.etype = 'click';
          }
        }
        $http.post(current_menu_url, { current_menu: $scope.context.activeItem }).success(function (data) {
          if (data.message.errno == 0) {
            $scope.context.activeItem.material.push(data.message.message);
          }
        });
      }
    };
    $scope.context.addBut = function () {
      if ($scope.context.group['button'].length >= 3) {
        return;
      }
      $scope.context.group['button'].push({
        name: '\u83dc\u5355\u540d\u79f0',
        type: 'click',
        url: '',
        key: '',
        media_id: '',
        appid: '',
        pagepath: '',
        sub_button: []
      });
      var but = $scope.context.group['button'][$scope.context.group.button.length - 1];
      $scope.context.triggerActiveBut(but);
      $('.designer-x').sortable({
        items: '.js-sortable',
        axis: 'x'
      });
    };
    $scope.context.removeBut = function (but, type) {
      if (type == 1) {
        if (!confirm('\u5c06\u540c\u65f6\u5220\u9664\u6240\u6709\u5b50\u83dc\u5355,\u662f\u5426\u7ee7\u7eed')) {
          return false;
        }
        $scope.context.group.button = _.without($scope.context.group.button, but);
        $scope.context.triggerActiveBut($scope.context.group['button'][0]);
      } else {
        $scope.context.activeBut.sub_button = _.without($scope.context.activeBut.sub_button, but);
        $scope.context.triggerActiveBut($scope.context.activeBut);
      }
      if ($scope.context.activeItem.sub_button.length > 0) {
        $scope.context.activeItem.forceHide = 1;
      } else {
        $scope.context.activeItem.forceHide = 0;
      }
    };
    $scope.context.addSubBut = function (but) {
      if ($scope.context.group.disabled == 1) {
        return false;
      }
      $scope.context.triggerActiveBut(but);
      if ($scope.context.activeBut.sub_button.length >= 5) {
        return;
      }
      $scope.context.activeBut.sub_button.push({
        name: '\u5b50\u83dc\u5355\u540d\u79f0',
        type: 'click',
        url: '',
        key: '',
        appid: '',
        pagepath: '',
        media_id: ''
      });
      $('.sub-designer-y').sortable({
        items: '.sub-js-sortable',
        axis: 'y',
        cancel: '.sub-js-not-sortable'
      });
      $scope.context.activeItem = $scope.context.activeBut.sub_button[$scope.context.activeBut.sub_button.length - 1];
      $scope.context.activeType = 2;
      $scope.context.activeItem.forceHide = 0;
    };
    /*选择Emoji表情*/
    $scope.context.selectEmoji = function () {
      util.emojiBrowser(function (emoji) {
        var text = '::' + emoji.find('span').text() + '::';
        $('#title').setCaret();
        $('#title').insertAtCaret(text);
        $scope.context.activeItem.name = $('#title').val();
        $scope.$digest();
      });
    };
    //点击选择【系统连接】事件
    $scope.context.select_link = function () {
      var ipt = $(this).parent().prev();
      util.linkBrowser(function (href) {
        var site_url = config.site_url;
        if (href.substring(0, 4) == 'tel:') {
          util.message('\u81ea\u5b9a\u4e49\u83dc\u5355\u4e0d\u80fd\u8bbe\u7f6e\u4e3a\u4e00\u952e\u62e8\u53f7');
          return;
        } else if (href.indexOf('http://') == -1 && href.indexOf('https://') == -1) {
          href = href.replace('./index.php?', '/index.php?');
          href = site_url + 'app' + href;
        }
        $scope.context.activeItem.url = href;
        $scope.$digest();
      });
    };
    $scope.context.search = function () {
      var search_value = $('#ipt-forward').val();
      $.post(config.search_key_url, { 'key_word': search_value }, function (data) {
        var data = $.parseJSON(data);
        var total = data.length;
        var html = '';
        if (total > 0) {
          for (var i = 0; i < total; i++) {
            html += '<li><a href="javascript:;">' + data[i] + '</a></li>';
          }
        } else {
          html += '<li><a href="javascript:;" id="no-result">\u6ca1\u6709\u627e\u5230\u60a8\u8f93\u5165\u7684\u5173\u952e\u5b57</a></li>';
        }
        $('#key-result ul').html(html);
        $('#key-result ul li a[id!="no-result"]').click(function () {
          $('#ipt-forward').val($(this).html());
          $scope.context.activeItem.key = $(this).html();
          $('#key-result').hide();
        });
        $('#key-result').show();
      });
    };
    $scope.context.select_mediaid = function (type, otherVal) {
      var option = {
          type: type,
          isWechat: true,
          needType: 1
        };
      util.material(function (material) {
        $scope.context.activeItem.key = '';
        $scope.context.activeItem.media_id = material.media_id;
        $scope.context.activeItem.material = [];
        if (type == 'keyword') {
          $scope.context.activeItem.material.push(material);
          $scope.context.activeItem.material[0].type = 'keyword';
          $scope.context.activeItem.key = 'keyword:' + material.content;
          $scope.context.activeItem.media_id = '';
          if (otherVal == '1') {
            $scope.context.activeItem.material[0].etype = 'click';
            $scope.context.activeItem.material[0].name = material.name;
            $scope.context.activeItem.material[0].content = material.content;
          }
        } else if (type == 'image') {
          $scope.context.activeItem.material.push(material);
        } else if (type == 'news') {
          $scope.context.activeItem.material.push(material);
        } else if (type == 'voice') {
          $scope.context.activeItem.material.push(material);
        } else if (type == 'video') {
          $scope.context.activeItem.material.push(material);
        } else if (type == 'module') {
          $scope.context.activeItem.key = 'module:' + material.name;
          $scope.context.activeItem.material.push(material);
          $scope.context.activeItem.material[0].module_type = $scope.context.activeItem.material[0].type;
          $scope.context.activeItem.material[0].type = 'module';
          $scope.context.activeItem.material[0].etype = 'module';
        }
        $scope.$digest();
      }, option);
    };
    $scope.context.editBut('', $scope.context.group.button[0], $scope.context.group.id);
  }
]);