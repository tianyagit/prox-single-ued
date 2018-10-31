angular.module('profileApp', ['we7app']);
angular.module('profileApp').controller('oauthCtrl', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.config = config;
    $scope.oauthHost = config.oauthHost;
    $scope.oauthAccount = config.oauthAccount;
    $scope.oauthtitle = config.oauthAccounts[config.oauthAccount];
    $scope.jsOauthAccount = config.jsOauth;
    $scope.jsOauthtitle = config.jsOauthAccounts[config.jsOauth];
    $scope.originalHost = $scope.oauthHost;
    $scope.recover = function () {
      $scope.oauthHost = $scope.originalHost;
    };
    $scope.saveOauth = function (type) {
      param = {};
      if (type == 'oauth') {
        param = {
          'type': 'oauth',
          'account': $scope.oauthAccount,
          'host': $scope.oauthHost
        };
      }
      if (type == 'jsoauth') {
        param = {
          'type': 'jsoauth',
          'account': $scope.jsOauthAccount
        };
      }
      $http.post($scope.config.oauth_url, param).success(function (data) {
        if (data.message.errno == 0) {
          location.reload();
        } else {
          util.message('\u57df\u540d\u4e0d\u5408\u6cd5', '', 'error');
        }
      });
    };
  }
]).controller('tplCtrl', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.tplList = config.tplList;
    $scope.active = '';
    $scope.activetpl = '';
    $scope.changeActive = function (key) {
      $scope.active = key;
      $scope.activetpl = $scope.tplList[key]['tpl'];
    };
    $scope.saveTpl = function () {
      original_tpl = $scope.tplList[$scope.active]['tpl'];
      $scope.tplList[$scope.active]['tpl'] = $scope.activetpl;
      $http.post(config.url, { 'tpl': $scope.tplList }).success(function (data) {
        if (data.message.errno == 1) {
          $scope.tplList[$scope.active]['tpl'] = original_tpl;
          util.message('\u8bf7\u586b\u5199\u6b63\u786e\u7684' + data.message.message + '\u6a21\u677fid', '', 'info');
        } else {
          $('.modal').modal('hide');
        }
      });
    };
  }
]).controller('emailCtrl', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.config = config;
    $scope.setting = $scope.config.setting;
    $scope.type = $scope.setting['smtp'] == undefined ? '163' : $scope.setting.smtp.type;
    $scope.changeType = function (ev) {
      var targetHtml = $(ev)[0].target;
      $(targetHtml).attr('type', 'password');
    };
  }
]).controller('paymentCtrl', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.config = config;
    $scope.paysetting = config.paysetting;
    $scope.aliaccounthelp = false;
    $scope.alipartnerhelp = false;
    $scope.alisecrethelp = false;
    $scope.saveEdit = function (type) {
      if (type == 'wechat_facilitator') {
        if ($scope.paysetting.wechat_facilitator.pay_switch === true || $scope.paysetting.wechat_facilitator.recharge_switch === true) {
          if ($scope.paysetting.wechat_facilitator.mchid == '') {
            util.message('\u8bf7\u586b\u5199\u670d\u52a1\u5546\u5546\u6237\u53f7', '', 'info');
            return false;
          }
          if ($scope.paysetting.wechat_facilitator.signkey == '') {
            util.message('\u8bf7\u586b\u5199\u670d\u52a1\u5546\u5546\u6237\u652f\u4ed8\u5bc6\u94a5', '', 'info');
            return false;
          }
        }
      }
      if (type == 'alipay') {
        if ($scope.paysetting.alipay.pay_switch === true || $scope.paysetting.alipay.recharge_switch === true) {
          if ($scope.paysetting.alipay.partner == '') {
            util.message('\u8bf7\u586b\u5199\u5408\u4f5c\u8005\u8eab\u4efd', '', 'info');
            return false;
          }
          if ($scope.paysetting.alipay.account == '') {
            util.message('\u8bf7\u586b\u5199\u6536\u6b3e\u652f\u4ed8\u5b9d\u8d26\u53f7', '', 'info');
            return false;
          }
          if ($scope.paysetting.alipay.secret == '') {
            util.message('\u8bf7\u586b\u5199\u6821\u9a8c\u5bc6\u94a5', '', 'info');
            return false;
          }
        }
      }
      if (type == 'wechat') {
        if ($scope.paysetting.wechat.switch == 1) {
          if ($scope.paysetting.wechat.version == 1) {
            if ($scope.paysetting.wechat.partner == '') {
              util.message('\u8bf7\u586b\u5199\u5546\u6237\u8eab\u4efd', '', 'info');
              return false;
            }
            if ($scope.paysetting.wechat.key == '') {
              util.message('\u8bf7\u586b\u5199\u5546\u6237\u79d8\u94a5', '', 'info');
              return false;
            }
            if ($scope.paysetting.wechat.signkey == '') {
              util.message('\u8bf7\u586b\u5199\u901a\u4fe1\u79d8\u94a5', '', 'info');
              return false;
            }
          } else {
            if ($scope.paysetting.wechat.mchid == '') {
              util.message('\u8bf7\u586b\u5199\u5546\u6237\u53f7', '', 'info');
              return false;
            }
            if ($scope.paysetting.wechat.apikey == '') {
              util.message('\u8bf7\u586b\u5199\u652f\u4ed8\u79d8\u94a5', '', 'info');
              return false;
            }
          }
        }
        if ($scope.paysetting.wechat.switch == 3) {
          if ($scope.paysetting.wechat.service == '') {
            util.message('\u8bf7\u9009\u62e9\u670d\u52a1\u5546\u516c\u4f17\u53f7', '', 'info');
            return false;
          }
          if ($scope.paysetting.wechat.sub_mch_id == '') {
            util.message('\u8bf7\u586b\u5199\u5b50\u5546\u6237\u53f7', '', 'info');
            return false;
          }
        }
      }
      if (type == 'unionpay') {
        if ($scope.paysetting.unionpay.pay_switch == true || $scope.paysetting.unionpay.recharge_switch == true) {
          if ($scope.paysetting.unionpay.merid == '') {
            util.message('\u8bf7\u586b\u5199\u5546\u6237\u53f7', '', 'info');
            return false;
          }
          if ($scope.paysetting.unionpay.signcertpwd == '') {
            util.message('\u8bf7\u586b\u5199\u5546\u6237\u79c1\u94a5\u8bc1\u4e66\u5bc6\u7801', '', 'info');
            return false;
          }
        }
      }
      if (type == 'baifubao') {
        if ($scope.paysetting.baifubao.pay_switch === true || $scope.paysetting.baifubao.recharge_switch === true) {
          if ($scope.paysetting.baifubao.mchid == '') {
            util.message('\u8bf7\u586b\u5199\u5546\u6237\u53f7', '', 'info');
            return false;
          }
          if ($scope.paysetting.baifubao.signkey == '') {
            util.message('\u8bf7\u586b\u5199\u5546\u6237\u652f\u4ed8\u5bc6\u94a5', '', 'info');
            return false;
          }
        }
      }
      if (type == 'line') {
        if (($scope.paysetting.line.pay_switch === true || $scope.paysetting.line.recharge_switch === true) && $scope.paysetting.line.message == '') {
          util.message('\u8bf7\u586b\u5199\u8d26\u6237\u4fe1\u606f', '', 'info');
          return false;
        }
      }
      if (type == 'jueqiymf') {
        if ($scope.paysetting.jueqiymf.pay_switch === true || $scope.paysetting.jueqiymf.recharge_switch === true) {
          if ($scope.paysetting.jueqiymf.url == '' || $scope.paysetting.jueqiymf.url == undefined) {
            util.message('\u8bf7\u586b\u5199\u4e00\u7801\u4ed8\u540e\u53f0\u5730\u5740', '', 'info');
            return false;
          }
          if ($scope.paysetting.jueqiymf.mchid == '' || $scope.paysetting.jueqiymf.mchid == undefined) {
            util.message('\u8bf7\u586b\u5199\u5546\u6237\u53f7', '', 'info');
            return false;
          }
        }
      }
      $http.post($scope.config.saveurl, {
        'type': type,
        'param': $scope.paysetting[type]
      }).success(function (data) {
        if (data.message.errno == 0) {
          util.message(data.message.message, data.redirect, 'success');
        }
      });
    };
    $scope.switchStatus = function (paytype, switchtype) {
      if (!paytype || !switchtype) {
        util.message('\u53c2\u6570\u9519\u8bef', '', 'error');
      }
      $scope.paysetting[paytype][switchtype] = !$scope.paysetting[paytype][switchtype];
      if (paytype == 'delivery' || paytype == 'credit' || paytype == 'mix' || paytype == 'line') {
        $scope.paysetting[paytype]['recharge_switch'] = false;
      }
      $http.post(config.change_status, {
        'type': paytype,
        'param': $scope.paysetting[paytype]
      }).success(function (data) {
        if (data.message.errno == 0) {
          util.message(data.message.message, data.redirect, 'success');
        } else {
          util.message(data.message.message);
        }
      });
    };
    $scope.check_wechat = function () {
      if (config.account_level < 3 || config.services != undefined && config.borrows.length < 1 && config.services.length < 1 && config.account_level != 4 || config.services == undefined && config.borrows.length < 1 && config.account_level != 4) {
        util.message('\u60a8\u6ca1\u6709\u6709\u6548\u7684\u5fae\u4fe1\u652f\u4ed8\u65b9\u5f0f', '', 'error');
        return false;
      }
      $('#weixin').modal('show');
    };
    $('.modal').on('hide.bs.modal', function () {
      $http.post($scope.config.get_setting_url, {}).success(function (data) {
        $scope.paysetting = data.message.message;
      });
    });
    $scope.test_alipay = function () {
      $http.post($scope.config.text_alipay_url, { 'param': $scope.paysetting.alipay }).success(function (data) {
        if (data.message.message !== null) {
          location.href = data.message.message;
          return false;
        } else {
          util.message('\u914d\u7f6e\u5931\u8d25\uff01');
        }
      });
    };
    $scope.changeSwitch = function (type, status) {
      $scope.paysetting[type].switch = status;
    };
    $scope.changeVersion = function (status) {
      $scope.paysetting.wechat.version = status;
    };
    $scope.tokenGen = function (name) {
      if (confirm('\u786e\u5b9a\u8981\u4fee\u6539\u5bc6\u94a5\u5417\uff1f')) {
        var letters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        var token = '';
        for (var i = 0; i < 32; i++) {
          var j = parseInt(Math.random() * (31 + 1));
          token += letters[j];
        }
        if (name == 'wechat_facilitator.signkey') {
          $scope.paysetting.wechat_facilitator.signkey = token;
        }
        if (name == 'wechat.apikey') {
          $scope.paysetting.wechat.apikey = token;
        }
      }
    };
  }
]).controller('creditCtrl', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.config = config;
    $scope.creditSetting = config.creditSetting;
    $scope.tactics = {
      'activity': config.activity,
      'currency': config.currency
    };
    $scope.creditTitle = '';
    $scope.activeCredit = '';
    $scope.activeTacticsType = '';
    $scope.enabledCredit = config.enabledCredit;
    $scope.activeTactics = '';
    $scope.syncSetting = config.syncSetting;
    $scope.changeEnabled = function (credit) {
      $scope.creditSetting = $scope.creditSetting == null ? {} : $scope.creditSetting;
      if ($scope.creditSetting[credit] == undefined) {
        $scope.creditSetting[credit] = {
          title: '',
          'enabled': 0
        };
      }
      $scope.creditSetting[credit].enabled = $scope.creditSetting[credit].enabled == 1 ? 0 : 1;
      $http.post($scope.config.saveCreditSetting, { 'credit_setting': $scope.creditSetting }).success(function (data) {
        if (data.message.errno == 0) {
          util.message(data.message.message, data.redirect, 'success');
        } else {
          util.message(data.message.message);
        }
      });
    };
    $scope.editCreditTactics = function (type) {
      $('#tactics').modal('show');
      $scope.activeTacticsType = type;
      $scope.activeTactics = $scope.tactics[type];
    };
    $scope.editCreditName = function (credit) {
      $scope.activeCredit = credit;
      $('#credit-name').modal('show');
      if ($scope.creditSetting[credit] == undefined) {
        $scope.creditSetting[credit] = {
          title: '',
          'enabled': 0
        };
      }
      $scope.creditTitle = $scope.creditSetting[credit].title;
    };
    $scope.setCreditName = function () {
      $scope.creditSetting[$scope.activeCredit].title = $scope.creditTitle;
      $http.post($scope.config.saveCreditSetting, { 'credit_setting': $scope.creditSetting }).success(function (data) {
        if (data.message.errno == 0) {
          util.message(data.message.message, data.redirect, 'success');
        } else {
          util.message(data.message.message);
        }
      });
    };
    $scope.setCreditTactics = function () {
      $http.post($scope.config.saveTacticsSetting, { 'setting': $scope.tactics }).success(function (data) {
        if (data.message.errno == 0) {
          util.message(data.message.message, data.redirect, 'success');
        } else {
          util.message(data.message.message);
        }
      });
    };
  }
]).controller('syncCtrl', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.config = config;
    $scope.syncSetting = config.syncSetting;
    $scope.setSync = function () {
      $scope.syncSetting = $scope.syncSetting == 1 ? 0 : 1;
      $http.post($scope.config.saveSyncSetting, { 'setting': $scope.syncSetting }).success(function (data) {
      });
    };
  }
]).controller('ucCtrl', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.config = config;
    $scope.uc = config.uc;
    $('#submit').click(function () {
      var textarea = $('#textarea').val();
      var arr = textarea.split(';');
      var data = new Array();
      for (var i in arr) {
        var index0 = arr[i].indexOf('UC');
        var index1 = arr[i].indexOf('\', \'');
        var index2 = arr[i].indexOf('\')');
        var key = arr[i].substring(index0, index1);
        var value = arr[i].substring(index1 + 4, index2);
        data[key] = value;
      }
      $scope.uc.connect = data['UC_CONNECT'];
      $scope.uc.appid = data['UC_APPID'];
      $scope.uc.key = data['UC_KEY'];
      $scope.uc.charset = data['UC_CHARSET'];
      $scope.uc.dbhost = data['UC_DBHOST'];
      $scope.uc.dbuser = data['UC_DBUSER'];
      $scope.uc.dbname = data['UC_DBNAME'];
      $scope.uc.dbpw = data['UC_DBPW'];
      $scope.uc.dbcharset = data['UC_DBCHARSET'];
      $scope.uc.dbtablepre = data['UC_DBTABLEPRE'];
      $scope.uc.dbconnect = data['UC_DBCONNECT'];
      $scope.uc.api = data['UC_API'];
      $scope.uc.ip = data['UC_IP'];
      $scope.$digest();
    });
    $('#form1').submit(function () {
      if ($(':radio[name="status"]:checked').val() == '1') {
        if ($.trim($(':text[name="title"]').val()) == '') {
          util.message('\u5fc5\u987b\u8f93\u5165\u901a\u884c\u8bc1\u540d\u79f0.', '', 'error');
          return false;
        }
        var appid = parseInt($(':text[name="appid"]').val());
        if (isNaN(appid)) {
          util.message('\u5fc5\u987b\u8f93\u5165UCenter\u5e94\u7528\u7684ID.', '', 'error');
          return false;
        }
        if ($.trim($(':text[name="key"]').val()) == '') {
          util.message('\u5fc5\u987b\u8f93\u5165\u4e0eUCenter\u7684\u901a\u4fe1\u5bc6\u94a5.', '', 'error');
          return false;
        }
        if ($.trim($(':text[name="charset"]').val()) == '') {
          util.message('\u5fc5\u987b\u8f93\u5165UCenter\u7684\u5b57\u7b26\u96c6.', '', 'error');
          return false;
        }
        if ($(':radio[name="connect"]:checked').val() == 'mysql') {
          if ($.trim($(':text[name="dbhost"]').val()) == '') {
            util.message('\u5fc5\u987b\u8f93\u5165UCenter\u6570\u636e\u5e93\u4e3b\u673a\u5730\u5740.', '', 'error');
            return false;
          }
          if ($.trim($(':text[name="dbuser"]').val()) == '') {
            util.message('\u5fc5\u987b\u8f93\u5165UCenter\u6570\u636e\u5e93\u7528\u6237\u540d.', '', 'error');
            return false;
          }
          if ($.trim($(':text[name="dbpw"]').val()) == '') {
            util.message('\u5fc5\u987b\u8f93\u5165UCenter\u6570\u636e\u5e93\u5bc6\u7801.', '', 'error');
            return false;
          }
          if ($.trim($(':text[name="dbname"]').val()) == '') {
            util.message('\u5fc5\u987b\u8f93\u5165UCenter\u6570\u636e\u5e93\u540d\u79f0.', '', 'error');
            return false;
          }
          if ($.trim($(':text[name="dbcharset"]').val()) == '') {
            util.message('\u5fc5\u987b\u8f93\u5165UCenter\u6570\u636e\u5e93\u5b57\u7b26\u96c6.', '', 'error');
            return false;
          }
          if ($.trim($(':text[name="dbtablepre"]').val()) == '') {
            util.message('\u5fc5\u987b\u8f93\u5165UCenter\u6570\u636e\u8868\u524d\u7f00.', '', 'error');
            return false;
          }
        } else if ($(':radio[name="connect"]:checked').val() == 'http') {
          if ($.trim($(':text[name="api"]').val()) == '') {
            util.message('\u5fc5\u987b\u8f93\u5165UCenter \u670d\u52a1\u7aef\u7684URL\u5730\u5740.', '', 'error');
            return false;
          }
          if ($.trim($(':text[name="ip"]').val()) == '') {
            util.message('\u5fc5\u987b\u8f93\u5165UCenter\u7684IP.', '', 'error');
            return false;
          }
        }
      }
    });
  }
]).controller('refundCtrl', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.setting = config.setting;
    $scope.wechat_refund = $scope.setting.wechat_refund;
    $scope.ali_refund = $scope.setting.ali_refund;
    $scope.change_switch = function (type, val) {
      if (type == 'wechat_refund') {
        $scope.wechat_refund.switch = val;
      }
      if (type == 'ali_refund') {
        $scope.ali_refund.switch = val;
      }
    };
    $('#key').change(function () {
      $scope.wechat_refund.key = $('#key').val();
      $scope.$apply();
    });
    $('#cert').change(function () {
      $scope.wechat_refund.cert = $('#cert').val();
      $scope.$apply();
    });
    $('#form_wechat').submit(function () {
      if ($scope.wechat_refund.switch == 1) {
        if ($scope.wechat_refund.cert == '') {
          util.message('\u8bf7\u4e0a\u4f20apiclient_cert.pem\u8bc1\u4e66');
          return false;
        }
        if ($scope.wechat_refund.key == '') {
          util.message('\u8bf7\u4e0a\u4f20apiclient_key.pem\u8bc1\u4e66');
          return false;
        }
      }
    });
    $('#private_key').change(function () {
      $scope.ali_refund.private_key = $('#private_key').val();
      $scope.$apply();
    });
    $('#form_ali').submit(function () {
      if ($scope.ali_refund.switch == 1) {
        if ($scope.ali_refund.app_id == '') {
          util.message('\u8bf7\u586b\u5199app_id');
          return false;
        }
        if ($scope.ali_refund.private_key == '') {
          util.message('\u8bf7\u4e0a\u4f20rsa_private_key.pem\u8bc1\u4e66');
          return false;
        }
      }
    });
  }
]).controller('bindDomainCtrl', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.account = config.account;
    $scope.middleAccount = { 'bind_domain': '' };
    $scope.httpChange = function () {
      $http.post(config.links.post, {
        'bind_domain': $scope.middleAccount.bind_domain,
        'submit': true,
        'token': config.token
      }).success(function (data) {
        if (data.message.errno == 0) {
          util.message('\u4fee\u6539\u6210\u529f\uff01', data.redirect, 'success');
        } else {
          util.message(data.message.message);
        }
      });
    };
  }
]).controller('appModuleLinkUniacidCtrl', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.modules = config.modules;
    $scope.module = '';
    $scope.linkWxappAccounts = '';
    $scope.linkPcAccounts = '';
    $scope.selectedAccount = '';
    $scope.tabChange = function (index) {
      $scope.jurindex = index;
      if (index == 1 && !$scope.linkPcAccounts) {
        $scope.searchLinkAccount($scope.module, 'pc');
      }
      if ($scope.jurindex == 1) {
        $('#account-wxapp .row').find('.item').removeClass('active');
      }
      if ($scope.jurindex == 0) {
        $('#account-pc .row').find('.item').removeClass('active');
      }
      $scope.selectedAccount = '';
    };
    $scope.searchLinkAccount = function (modulename, type) {
      $scope.module = modulename;
      $('#show-account').modal('show');
      if (type == 'wxapp') {
        $scope.tabChange(0);
        $scope.loadingWxappData = true;
      } else {
        $scope.loadingPcData = true;
      }
      $http.post(config.links.search_link_account, {
        'module_name': modulename,
        'type': type == 'wxapp' ? config.wxapp : config.webapp
      }).success(function (data) {
        if (type == 'wxapp') {
          $scope.loadingWxappData = false;
          $scope.linkWxappAccounts = data.message.message;
          $scope.linkPcAccounts = '';
        } else {
          $scope.loadingPcData = false;
          $scope.linkPcAccounts = data.message.message;
        }
      });
    };
    $scope.selectLinkAccount = function (account, ev) {
      $(ev.target).parentsUntil('.col-sm-2').addClass('active');
      $(ev.target).parentsUntil('.col-sm-2').parent().siblings().find('.item').removeClass('active');
      $scope.selectedAccount = account;
    };
    $scope.module_unlink_uniacid = function (module_name) {
      $http.post(config.links.module_unlink_uniacid, { 'module_name': module_name }).success(function (data) {
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
        'uniacid': $scope.selectedAccount.uniacid
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