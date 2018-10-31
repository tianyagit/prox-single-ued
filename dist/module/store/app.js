angular.module('storeApp', ['we7app']);
angular.module('storeApp').controller('goodsSellerCtrl', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.status = config.status;
    $scope.moduleList = config.moduleList;
    $scope.keyword = '';
    $scope.selectedModule = '';
    $scope.visitTimes = 0;
    $scope.visitPrice = 0;
    $scope.showModule = function () {
      $('#add_module').modal('show');
    };
    $scope.selectModule = function (module, ev) {
      $(ev.target).parents('.select-module').find('.item').addClass('active');
      $(ev.target).parents('.select-module').siblings().find('.item').removeClass('active');
      $scope.selectedModule = module;
    };
    $scope.editPrice = function (type) {
      switch (type) {
      case 'add_module':
        $http.post(config.links.add, {
          'module': $scope.selectedModule,
          'toedit': true
        }).success(function (data) {
          if (data.message.errno == 0) {
            location.href = config.links.post + '&id=' + data.message.message;
          } else {
            util.message(data.message.message);
          }
        });
        break;
      case 'add_api':
        $http.post(config.links.add, {
          'title': '\u5e94\u7528\u8bbf\u95ee\u6d41\u91cf(API)',
          'visit_times': $scope.visitTimes,
          'price': $scope.visitPrice,
          'online': true
        }).success(function (data) {
          if (data.message.errno == 0) {
            location.href = config.links.online;
          } else {
            util.message(data.message.message);
          }
        });
        break;
      }
    };
    $scope.toOffline = function (type) {
      switch (type) {
      case 'add_module':
        $http.post(config.links.add, { 'module': $scope.selectedModule }).success(function (data) {
          if (data.message.errno == 0) {
            location.href = config.links.offline;
          } else {
            util.message(data.message.message);
          }
        });
        break;
      case 'add_api':
        $http.post(config.links.add, {
          'title': '\u5e94\u7528\u8bbf\u95ee\u6d41\u91cf(API)',
          'visit_times': $scope.visitTimes,
          'price': $scope.visitPrice
        }).success(function (data) {
          if (data.message.errno == 0) {
            location.href = config.links.offline;
          } else {
            util.message(data.message.message);
          }
        });
        break;
      }
    };
  }
]);
angular.module('storeApp').controller('goodsPostCtrl', [
  '$scope',
  '$http',
  '$compile',
  'config',
  function ($scope, $http, $compile, config) {
    $scope.slideLists = [];
    $scope.goodsInfo = config.goodsInfo;
    $scope.userGroups = config.userGroups;
    $scope.changeGroup = function (index, $event) {
      var isChange = true;
      $('[name="user_group_id[]"]').each(function (key, item) {
        if ($event.currentTarget.dataset.id == $(item).val()) {
          isChange = false;
        }
      });
      if (isChange) {
        $('.user-group-price-content .form-group-' + index + ' .group-title').text($event.currentTarget.dataset.title);
        $('.user-group-price-content .form-group-' + index + ' [name="user_group_id[]"]').val($event.currentTarget.dataset.id);
        $('.user-group-price-content .form-group-' + index + ' [name="user_group_name[]"]').val($event.currentTarget.dataset.title);
      }
    };
    $scope.addGroupPrice = function (group_id, group_name, price) {
      var index = $('.user-group-price-content .form-group').length + 1;
      var liHmlt = $scope.getuserGroupsLi(index);
      var w = $scope.goodsInfo.type == 6 ? 10 : 8;
      var html = '<div class="form-group form-group-' + index + '">' + '<label class="control-label col-sm-2"></label>' + '<div class="col-sm-' + w + '">' + '<div class="input-group">' + '<div class="input-group-btn">' + '<button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="min-width:120px;background-color: #f8f9f9;color: #666;">' + '<span class="group-title">' + (price ? group_name : '\u9009\u62e9\u7528\u6237\u7ec4') + '</span> ' + '<span class="caret" style="color: #3071a9"></span>' + '<input type="hidden" name="user_group_id[]" value="' + group_id + '"/>' + '<input type="hidden" name="user_group_name[]" value="' + group_name + '"/>' + '</button>' + '<ul class="dropdown-menu dropdown-menu-right">';
      html += liHmlt;
      html += '</ul>' + '</div>' + '<input type="number" class="form-control" min="0" name="user_group_price[]" value="' + price + '" step="0.01">' + '<span class="input-group-addon" >\u5143 / <span ng-if="num > 0" ng-bind="num"></span><span ng-bind="unitTitle"></span></span>' + '<div class="input-group-btn" style="padding-left: 10px"><button type="button" class="btn btn-default" ng-click="deleteGroupPrice(' + index + ')">\u5220\u9664</button></div>' + '</div>' + '</div>' + '</div>';
      $('.user-group-price-content').append($compile(html)($scope));
    };
    $scope.getuserGroupsLi = function (index) {
      var html = '';
      for (key in $scope.userGroups) {
        html += '<li>' + '<a href="" ng-click="changeGroup(' + index + ', $event)" ' + 'data-title="' + $scope.userGroups[key].name + '" data-id="' + $scope.userGroups[key].id + '">' + $scope.userGroups[key].name + '</a>' + '</li>';
      }
      return html;
    };
    $scope.getUnitName = function () {
      switch ($scope.unit) {
      case 'day':
        return '\u65e5';
      case 'month':
        return '\u6708';
      case 'year':
        return '\u5e74';
      }
    };
    $scope.deleteGroupPrice = function (index) {
      $('.user-group-price-content .form-group-' + index).remove();
    };
    $scope.changeUnit = function (unit) {
      $scope.unit = unit;
      $('[name="unit"]').val(unit);
      $scope.unitTitle = $scope.getUnitName();
    };
    $scope.addSlide = function () {
      require(['fileUploader'], function (uploader) {
        uploader.init(function (imgs) {
          $scope.slideLists.push(imgs.url);
          $scope.$apply($scope.slideLists);
        }, {
          'direct': true,
          'multiple': false,
          'uniacid': -1
        });
      });
    };
    $scope.delSlide = function (index) {
      $scope.slideLists.splice(index, 1);
    };
    if ($scope.goodsInfo) {
      $scope.unit = $scope.goodsInfo.unit;
      if ($scope.goodsInfo.type == 7 || $scope.goodsInfo.type == 8) {
        $scope.num = $scope.goodsInfo.account_num || $scope.goodsInfo.account_num;
      }
      $scope.slideLists = $scope.goodsInfo.slide;
      $('#description').html($scope.goodsInfo.description);
      if ($scope.goodsInfo.user_group_price) {
        console.log($scope.goodsInfo.user_group_price);
        for (id in $scope.goodsInfo.user_group_price) {
          $scope.addGroupPrice(id, $scope.goodsInfo.user_group_price[id].group_name, $scope.goodsInfo.user_group_price[id].price);
        }
      }
    } else {
      $scope.unit = 'month';
    }
    $scope.unitTitle = $scope.getUnitName();
  }
]);
angular.module('storeApp').controller('storePaySettingCtrl', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.alipay = config.alipay;
  }
]);
angular.module('storeApp').controller('storeOrdersCtrl', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.orderList = config.orderList;
    $scope.role = config.role;
    $scope.links = config.links;
    $scope.newPrice = [];
    $scope.showChangePriceModal = function (id) {
      $('#change-price').modal('show');
      var id = parseInt(id);
      $scope.newPrice.orderid = id;
    };
    $scope.changePrice = function () {
      $http.post(config.links.changePrice, {
        'id': $scope.newPrice.orderid,
        'price': $scope.newPrice.price
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
angular.module('storeApp').controller('goodsBuyerCtrl', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.duration = 1;
    $scope.unit = config.unit;
    $scope.expiretime = config.expiretime;
    $scope.singlePrice = config.singlePrice;
    $scope.price = config.singlePrice;
    $scope.account_list = config.account_list;
    $scope.wxapp = config.wxapp;
    $scope.wxapp_account_list = config.wxapp_account_list;
    $scope.uniacid = config.first_uniacid;
    $scope.goods = config.goods;
    $scope.pay_way_list = config.pay_way;
    $scope.packages = config.packages;
    if ($scope.pay_way_list.length == 0) {
      $scope.pay_way = '';
    } else {
      $scope.pay_way = $scope.pay_way_list.alipay ? 'alipay' : 'wechat';
    }
    $scope.changePayWay = function (way) {
      $scope.pay_way = way;
    };
    $scope.changeDuration = function (duration) {
      $scope.duration = duration;
    };
    $scope.submit_order = function (submit_type) {
      if ($scope.duration <= 0) {
        util.message('\u8d2d\u4e70\u65f6\u957f\u4e0d\u5408\u6cd5\uff0c\u8bf7\u91cd\u65b0\u586b\u5199\uff01');
        return false;
      }
      var order_data = {
          uniacid: $scope.uniacid,
          price: config.singlePrice,
          goodsid: $scope.goods.id,
          duration: $scope.duration,
          'type': $scope.pay_way,
          'wxapp': $scope.wxapp
        };
      $http.post('./index.php?c=site&a=entry&m=store&do=goodsbuyer&operate=submit_order&direct=1', order_data).success(function (data) {
        if (data.message.errno == 0) {
          location.href = './index.php?c=site&a=entry&m=store&do=goodsbuyer&operate=pay_order&direct=1&orderid=' + data.message.message;
        } else {
          util.message(data.message.message);
          return false;
        }
        if (submit_type == 'order') {
          location.href = './index.php?c=site&a=entry&m=store&do=orders&direct=1';
        } else {
          location.href = './index.php?c=site&a=entry&m=store&do=goodsbuyer&operate=pay_order&direct=1&orderid=' + data.message.message;
        }
      });
    };
    $scope.changeExpire = function (duration, uniacid) {
      duration = duration == '' || duration == undefined ? $scope.duration : duration;
      uniacid = uniacid == '' || uniacid == undefined ? $scope.uniacid : uniacid;
      $http.post('./index.php?c=site&a=entry&operate=change_order_expire&direct=1&do=changeorderexpire&m=store', {
        'duration': duration,
        'unit': $scope.unit,
        'uniacid': uniacid,
        'goodsid': $scope.goods.id
      }).success(function (data) {
        if (data.message.errno == 0) {
          $scope.expiretime = data.message.message;
          $scope.price = $scope.singlePrice * 100 * duration / 100;
        }
      });
    };
    $scope.$watch('duration', function (durationNew, durationOld, $scope) {
      $scope.changeExpire(durationNew, '');
    });
    $scope.$watch('uniacid', function (uniacidNew, uniacidOld, $scope) {
      $scope.changeExpire('', uniacidNew);
    });
  }
]);
angular.module('storeApp').controller('storePermissionCtrl', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.blacklist = config.blacklist;
    $scope.whitelist = config.whitelist;
    $scope.permissionStatus = config.permissionStatus;
    $scope.addUsername = '';
    $scope.changeType = function (type) {
      if (type == 'close' && !$scope.permissionStatus.close) {
        if (confirm('\u786e\u5b9a\u8981\u5173\u95ed\u6743\u9650\u8bbe\u7f6e\u5417\uff1f\u5982\u82e5\u8fd9\u6837\u505a\uff0c\u6240\u6709\u7cfb\u7edf\u7528\u6237\u90fd\u53ef\u8bbf\u95ee\u5546\u57ce\uff01')) {
          $scope.type = type;
          $scope.changeStatus();
        }
      } else {
        $scope.type = type;
      }
    };
    $scope.changeStatus = function () {
      $http.post(config.links.changeStatus, { 'type': $scope.type }).success(function (data) {
        console.log(data);
        if (data.message.errno == 0) {
          if ($scope.type == 'close') {
            $scope.permissionStatus.close = true;
            util.message(data.message.message);
          } else {
            util.message(data.message.message, data.redirect, 'success');
          }
        } else {
          util.message(data.message.message);
        }
      });
    };
    $scope.addUser = function () {
      $http.post(config.links.addUser, {
        'type': $scope.type,
        'username': $scope.addUsername
      }).success(function (data) {
        $scope.addUsername = '';
        if (data.message.errno == 0) {
          util.message(data.message.message, data.redirect, 'success');
        } else {
          util.message(data.message.message);
        }
      });
    };
    $scope.deleteUser = function (user) {
      $http.post(config.links.deleteUser, {
        'type': $scope.type,
        'username': user
      }).success(function (data) {
        if (data.message.errno == 0) {
          util.message(data.message.message, data.redirect, 'success');
        } else {
          util.message(data.message.message);
        }
      });
    };
    $scope.changeType(config.type);
  }
]);