angular.module('paycenterApp', ['cfp.hotkeys']).controller('microPay', [
  '$scope',
  '$timeout',
  'config',
  '$http',
  'hotkeys',
  'servicePaycenterBase',
  function ($scope, $timeout, config, $http, hotkeys, servicePaycenterBase) {
    card = $.parseJSON(config.card_set_str);
    hotkeys.add({
      combo: 'return+up',
      description: 'Description goes here',
      allowIn: ['INPUT'],
      callback: function (event, hotkey) {
        $scope.micro.submit();
      }
    });
    hotkeys.add({
      combo: 'esc',
      description: 'Description goes here',
      allowIn: ['INPUT'],
      callback: function (event, hotkey) {
        $scope.micro.reset();
      }
    });
    hotkeys.add({
      combo: 'backspace',
      description: 'Description goes here',
      allowIn: ['INPUT'],
      callback: function (event, hotkey) {
        $scope.micro.counter_handler('backspace');
        event.preventDefault();
      }
    });
    hotkeys.add({
      combo: '-',
      description: 'Description goes here',
      allowIn: ['INPUT'],
      callback: function (event, hotkey) {
        if ($scope.micro.config.fee != '0') {
          $scope.micro.mcardPayManage();
        } else {
          util.message('\u8bf7\u8f93\u5165\u91d1\u989d', '', 'error');
        }
      }
    });
    hotkeys.add({
      combo: '+',
      description: 'Description goes here',
      allowIn: ['INPUT'],
      callback: function (event, hotkey) {
        if ($scope.micro.config.fee != '0') {
          $scope.micro.wechatPayManage();
        } else {
          util.message('\u8bf7\u8f93\u5165\u91d1\u989d', '', 'error');
        }
      }
    });
    nums = [
      '7',
      '8',
      '9',
      '4',
      '5',
      '6',
      '1',
      '2',
      '3',
      '0',
      '.'
    ];
    $scope.micro = servicePaycenterBase.paycenterBaseData(card);
    angular.forEach(nums, function (data, index) {
      hotkeys.add({
        combo: data,
        description: 'Description goes here',
        allowIn: ['INPUT'],
        callback: function (event, hotkey) {
          $scope.micro.counter_handler(event.key);
        }
      });
    });
    $scope.micro.mcardPayManage = function () {
      $('#mcard-pay').on('shown.bs.modal', function () {
        $('.js-input').focus();
        var index = 2;
        hotkeys.add({
          combo: 'return',
          description: 'Description goes here',
          allowIn: ['INPUT'],
          callback: function (event, hotkey) {
            input_count = $scope.micro.input_count();
            if (index > input_count) {
              // index = 1;
              $scope.micro.submit();
            }
            $('input[tabindex="' + index + '"]').focus();
            index++;
          }
        });
        hotkeys.del('backspace');
        angular.forEach(nums, function (data, index) {
          hotkeys.del(data);
        });
      });
      $('#mcard-pay').on('hidden.bs.modal', function () {
        hotkeys.del('return');
        angular.forEach(nums, function (data, index) {
          hotkeys.add({
            combo: data,
            description: 'Description goes here',
            allowIn: ['INPUT'],
            callback: function (event, hotkey) {
              $scope.micro.counter_handler(event.key);
            }
          });
        });
      });
      $('#mcard-pay').modal('show');
    };
    $scope.micro.wechatPayManage = function () {
      $('#wechat-pay').on('shown.bs.modal', function () {
        $('.js-input').focus();
        hotkeys.add({
          combo: 'return',
          description: 'Description goes here',
          allowIn: ['INPUT'],
          callback: function (event, hotkey) {
            $scope.micro.submit();
          }
        });
        hotkeys.del('backspace');
        angular.forEach(nums, function (data, index) {
          hotkeys.del(data);
        });
      });
      $('#wechat-pay').on('hidden.bs.modal', function () {
        hotkeys.del('return');
        angular.forEach(nums, function (data, index) {
          hotkeys.add({
            combo: data,
            description: 'Description goes here',
            allowIn: ['INPUT'],
            callback: function (event, hotkey) {
              $scope.micro.counter_handler(event.key);
            }
          });
        });
      });
      $('#wechat-pay').modal('show');
    };
    $scope.micro.num = function (key) {
      $scope.micro.counter_handler(key);
    };
    $scope.$watch('micro.config.code', function (newValue, oldValue) {
      if (newValue && newValue.length > 0) {
        $('.js-pay-warning').html('');
      }
    });
    $scope.micro.counter_handler = function (newValue) {
      newValue += '';
      if (newValue == 'backspace') {
        current_fee_length = $scope.micro.config.fee.length;
        if (current_fee_length == '1') {
          $scope.micro.config.fee = '0';
        } else {
          $scope.micro.config.fee = $scope.micro.config.fee.substr(0, current_fee_length - 1);
        }
        return;
      }
      if (newValue == 'clear') {
        $scope.micro.config.fee = '0';
        return;
      }
      ;
      if ($scope.micro.config.fee == '0' && $scope.micro.config.fee.length == '1' && newValue != '.') {
        $scope.micro.config.fee = newValue;
        return;
      }
      ;
      if ($scope.micro.config.fee.length >= 9 || $scope.micro.config.fee.length == 8 && newValue == '.') {
        return;
      }
      ;
      if ($scope.micro.config.fee.indexOf('.') > -1) {
        float = $scope.micro.config.fee.split('.');
        if (float[1] && float[1].length >= 2 || newValue == '.') {
          return;
        }
      }
      $scope.micro.config.fee += newValue;
    };
    $scope.micro.reset = function () {
      $scope.micro.config.fee = '0';
    };
    $scope.$watch('micro.config.offset_money', function (newValue, oldValue) {
      var offset_max_money = Math.floor($scope.micro.config.member.credit1 / $scope.micro.config.card.offset_rate);
      $scope.micro.config.offset_money = parseInt(newValue);
      if (newValue >= offset_max_money) {
        $scope.micro.config.offset_money = offset_max_money;
      }
      if (!newValue) {
        $scope.micro.config.offset_money = 0;
      }
      $scope.micro.config.credit1 = $scope.micro.config.card.offset_rate * $scope.micro.config.offset_money;
      $scope.micro.checkLast_money();
    });
    $scope.$watch('micro.config.credit2', function (newValue, oldValue) {
      reg = /^\d*\.{0,1}\d{0,1}\d{0,1}$/;
      if (!reg.test(newValue)) {
        $scope.micro.config.credit2 = oldValue;
      }
      if (newValue > $scope.micro.config.member.credit2) {
        $scope.micro.config.credit2 = $scope.micro.config.member.credit2;
      }
      ;
      $scope.micro.checkLast_money();
    });
    $scope.$watch('micro.config.last_money', function (newValue, oldValue) {
      if (newValue < 0) {
        $scope.config.last_money = 0;
      }
      ;
      $scope.micro.checkLast_money();
    });
    $scope.micro.checkBasic = function () {
      var body = $.trim($scope.micro.config.body);
      if (!body) {
        util.message('\u5546\u54c1\u540d\u79f0\u4e0d\u80fd\u4e3a\u7a7a');
        return false;
      }
      var reg = /^(([1-9]{1}\d*)|([0]{1}))(\.(\d){1,2})?$/;
      var fee = $.trim($scope.micro.config.fee);
      if (!reg.test(fee)) {
        util.message('\u652f\u4ed8\u91d1\u989d\u4e0d\u80fd\u5c11\u4e8e0.01\u5143');
        return false;
      }
    };
    $scope.micro.input_count = function () {
      input_count = $('#mcard-pay input.js-input').length;
      return input_count;
    };
    $scope.$watch('micro.config.cardsn', function (newValue, oldValue) {
      if (newValue.length == 11) {
        $scope.micro.checkCard();
      } else {
        $scope.micro.config.member.uid = -1;
        $scope.micro.config.credit2 = 0;
        if (newValue.length > 11) {
          $scope.micro.config.card_error = '\u4f1a\u5458\u5361\u5361\u53f7\u9519\u8bef';
        }
      }
    });
    $scope.micro.mcardPay = function (type) {
      if ($scope.micro.config.fee == '0') {
        util.message('\u8bf7\u8f93\u5165\u91d1\u989d', '', 'error');
      } else {
        $scope.micro.config.cardsn = '';
        $scope.micro.config.member.uid = -1;
      }
      if (type == '1') {
        $scope.micro.mcardPayManage();
      } else if (type == '2') {
        $scope.micro.wechatPayManage();
      }
    };
    $scope.micro.is_showCode = function () {
      var offset_rate = Math.floor($scope.micro.config.member.credit1 / $scope.micro.config.card.offset_rate);
      if ($scope.micro.config.fact_fee <= $scope.micro.config.member.credit2) {
        $scope.micro.config.is_showCode = 0;
      } else {
        if ($scope.micro.config.card.offset_rate > 0) {
          max = $scope.micro.config.fact_fee - $scope.micro.config.member.credit2 - Math.floor($scope.micro.config.member.credit1 / $scope.micro.config.card.offset_rate);
          reg = /^-?[1-9]\d*$/;
          if (max > 0) {
            $scope.micro.config.is_showCode = 1;
          } else if (max == 0) {
            $scope.micro.config.is_showCode = 0;
          } else {
            if (!reg.test(max)) {
              $scope.micro.config.is_showCode = 1;
            } else {
              $scope.micro.config.is_showCode = 0;
            }
          }
        } else {
          max = $scope.micro.config.fact_fee - $scope.micro.config.member.credit2;
          if (max > 0) {
            $scope.micro.config.is_showCode = 1;
          } else {
            $scope.micro.config.is_showCode = 0;
          }
        }
      }
    };
    $scope.micro.checkCard = function () {
      $scope.micro.checkBasic();
      var cardsn = $.trim($scope.micro.config.cardsn);
      if (cardsn.length == 11) {
        $scope.micro.config.loading = '\u52a0\u8f7d\u4e2d..';
        $scope.micro.config.card_error = '';
        $http.post(config.card_check_url, { cardsn: cardsn }).success(function (dat) {
          $scope.micro.config.loading = '';
          if (dat.message.errno == -1) {
            $scope.micro.config.card_error = dat.message.message;
          } else {
            $scope.micro.config.card_error = '';
            $scope.micro.config.member = dat.message.message;
            $scope.micro.config.fact_fee = $scope.micro.config.fee;
            var fee = parseInt($scope.micro.config.fee);
            var condition = parseInt($scope.micro.config.member.discount.condition);
            if ($scope.micro.config.member.discount_type > 0 && $scope.micro.config.member.discount && fee >= condition) {
              if ($scope.micro.config.member.discount_type == 1) {
                $scope.micro.config.fact_fee = $scope.micro.config.fee - $scope.micro.config.member.discount.discount;
                $scope.micro.config.fact_fee = $scope.micro.config.fact_fee.toFixed(2);
              } else {
                $scope.micro.config.fact_fee = $scope.micro.config.fee * $scope.micro.config.member.discount.discount;
              }
              if ($scope.micro.config.fact_fee < 0) {
                $scope.micro.config.fact_fee = 0;
              }
            }
            $scope.micro.last_money = $scope.micro.config.fact_fee;
            $scope.micro.checkCredit2();
            $scope.micro.is_showCode();
            return false;
          }
        });
      } else {
        util.message('\u5361\u53f7\u4e0d\u8db311\u4f4d', '', 'error');
        return false;
      }
    };
    $scope.micro.checkCredit2 = function () {
      $scope.micro.checkLast_money();
      $scope.micro.config.credit2 = Math.min.apply(null, [
        $scope.micro.config.member.credit2,
        $scope.micro.last_money
      ]);
      $scope.micro.checkLast_money();
    };
    $scope.micro.checkLast_money = function () {
      var last_money = $scope.micro.config.fact_fee - $scope.micro.config.credit2 - $scope.micro.config.offset_money;
      if (last_money < 0) {
        $scope.config.last_money = 0;
      }
      $scope.micro.last_money = last_money.toFixed(2);
    };
    $scope.micro.query = function () {
      if (!$scope.micro.uniontid) {
        util.message('\u7cfb\u7edf\u9519\u8bef', '', 'error');
        return false;
      }
      $http.post('{php echo url(\'paycenter/wxmicro/query\');}', { uniontid: $scope.micro.uniontid }).success(function (data) {
        if (data.message.errno == 0) {
          util.message('\u652f\u4ed8\u6210\u529f', '', 'success');
          location.reload();
        } else {
          util.message('\u652f\u4ed8\u5931\u8d25:' + data.message.message, '', 'error');
        }
      });
    };
    $scope.micro.checkpay = function () {
      $http.post(config.checkpay_url, { uniontid: $scope.micro.uniontid }).success(function (data) {
        console.dir(data);
        if (data.message.trade_state == 'SUCCESS') {
          util.message('\u652f\u4ed8\u6210\u529f', config.redirect_url, 'error');
        } else if (data.message.trade_state == 'NOTPAY') {
          util.message('\u652f\u4ed8\u5931\u8d25:\u7528\u6237\u53d6\u6d88\u652f\u4ed8', config.redirect_url, 'error');
        } else if (data.message.trade_state == 'USERPAYING') {
          $timeout(function () {
            $scope.micro.checkpay();
          }, 5000);
        } else {
          util.message(data.message.trade_state_desc, config.redirect_url, 'error');
        }
      });
    };
    $scope.micro.submit = function () {
      if (!confirm('\u786e\u8ba4\u652f\u4ed8\u5417?')) {
        return false;
      }
      if ($scope.micro.config.is_showCode == 1 || $scope.micro.config.member.uid <= 0) {
        if (!$.trim($scope.micro.config.code)) {
          $('.js-pay-warning').html('\u652f\u4ed8\u6388\u6743\u7801\u4e0d\u80fd\u4e3a\u7a7a');
          return false;
        }
      }
      if ($scope.micro.config.is_showCode == 1) {
        $scope.micro.config.cash = $scope.micro.last_money;
      } else {
        $scope.micro.config.cash = 0;
      }
      if ($scope.micro.config.member.uid > 0) {
        $scope.micro.checkLast_money();
        if ($scope.micro.last_money - $scope.micro.config.cash != 0) {
          util.message('\u652f\u4ed8\u65b9\u5f0f\u8bbe\u7f6e\u7684\u652f\u4ed8\u91d1\u989d\u4e0d\u7b49\u4e8e\u5b9e\u9645\u652f\u4ed8\u91d1\u989d', '', 'error');
          return false;
        }
      }
      $http.post(config.pay_url, $scope.micro.config).success(function (data) {
        if (data.message.errno == 0) {
          util.message(data.message.message, data.redirect, 'success');
        } else if (data.message.errno == -1) {
          util.message('\u652f\u4ed8\u5931\u8d25:' + data.message.message, '', 'error');
          $('#form1 :text[name="code"]').val('');
        } else if (data.message.errno == -10) {
          $('.js-userpaying').show();
          // $scope.micro.show_query = 1;
          $scope.micro.uniontid = data.message.uniontid;
          $timeout(function () {
            $scope.micro.checkpay();
          }, 5000);
        }
        return false;
      });
    };
  }
]);