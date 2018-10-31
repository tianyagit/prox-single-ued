angular.module('userGroup', ['we7app']);
//用户组管理列表
angular.module('userGroup').controller('UserGroupDisplay', [
  '$scope',
  'config',
  function ($scope, config) {
    $scope.lists = config.lists;
    $scope.links = config.links;
    $scope.editGroup = function (id) {
      var id = parseInt(id);
      location.href = $scope.links.groupPost + 'id=' + id;
    };
    $scope.delGroup = function (id) {
      var id = parseInt(id);
      location.href = $scope.links.groupDel + 'id=' + id;
    };
  }
]);
//用户组管理-添加/编辑
angular.module('userGroup').controller('UserGroupPost', [
  '$scope',
  '$compile',
  'config',
  function ($scope, $compile, config) {
    $scope.groupInfo = config.groupInfo;
    $scope.packages = config.packages;
    $scope.changeText = function (ev) {
      var text = $(ev)[0].target.text;
      $(ev)[0].target.text = text == '\u5c55\u5f00' ? '\u6536\u8d77' : '\u5c55\u5f00';
    };
    if ($scope.groupInfo == null) {
      $scope.groupInfo = { check_all: false };
    }
    $scope.hideCheckAll = false;
    $scope.searchKeywords = '';
    var pagesize = config.pagesize;
    var side = 4;
    //左右两边页码个数
    var totalPage = Math.ceil(config.packages.length / pagesize);
    $scope.checkedGroup = [];
    //选中的组
    if ($scope.groupInfo.check_all) {
      $scope.checkedGroup = angular.copy(config.packages);
      $scope.checkedGroup.unshift({
        id: '-1',
        name: '\u6240\u6709\u670d\u52a1'
      });
    } else if (config.checkedGroup.length > 0) {
      for (var i in config.checkedGroup) {
        $scope.checkedGroup.push(config.checkedGroup[i]);
      }
    }
    //选中 packages 中的项目
    $scope.setChecked = function () {
      var checkedGroupIds = [];
      angular.forEach($scope.checkedGroup, function (item) {
        checkedGroupIds.push(item.id);
      });
      if ($.inArray('-1', checkedGroupIds) != -1) {
        angular.forEach($scope.packages, function (item, index) {
          $scope.packages[index]['checked'] = true;
        });
      } else {
        angular.forEach($scope.packages, function (item, index) {
          if ($.inArray(item.id, checkedGroupIds) == -1) {
            $scope.packages[index]['checked'] = false;
          } else {
            $scope.packages[index]['checked'] = true;
          }
        });
      }
    };
    //标签关闭
    $scope.removeCheckedGroupItem = function (id) {
      angular.forEach($scope.checkedGroup, function (item, index) {
        if (item.id == id) {
          $scope.checkedGroup.splice(index, 1);
        }
        if (id * 1 == -1) {
          $scope.groupInfo.check_all = false;
          $scope.checkedGroup = [];
        }
      });
      $scope.setChecked();
    };
    //列表选中
    $scope.pushCheckedGroupItem = function (pack, event) {
      if (event.target.checked) {
        var has = false;
        angular.forEach($scope.checkedGroup, function (item, index) {
          if (item.id == pack.id) {
            has = true;
          }
        });
        if (!has) {
          $scope.checkedGroup.push(pack);
          $scope.setChecked();
        }
      } else {
        if ($scope.checkedGroup[0]['id'] * 1 == -1) {
          $scope.checkedGroup = [];
          $scope.groupInfo.check_all = false;
          $scope.setChecked();
        } else {
          $scope.removeCheckedGroupItem(pack.id);
        }
      }
    };
    //选择所有服务
    $scope.checkAllGroup = function (event) {
      if (event.target.checked) {
        $scope.checkedGroup = angular.copy(config.packages);
        $scope.checkedGroup.unshift({
          id: '-1',
          name: '\u6240\u6709\u670d\u52a1'
        });
        $scope.groupInfo.check_all = true;
      } else {
        $scope.checkedGroup = [];
        $scope.groupInfo.check_all = false;
      }
      $scope.setChecked();
    };
    //分页获取package list
    $scope.setPackagesData = function (pageindex) {
      var i = -1;
      var start = (pageindex - 1) * pagesize;
      $scope.packages = [];
      var total = 0;
      for (id in config.packages) {
        if ($scope.searchKeywords && config.packages[id]['name'].indexOf($scope.searchKeywords) <= -1) {
          continue;
        }
        total += 1;
      }
      for (id in config.packages) {
        if ($scope.searchKeywords && config.packages[id]['name'].indexOf($scope.searchKeywords) <= -1) {
          continue;
        }
        i++;
        if (i < start) {
          continue;
        }
        if (i >= start + pagesize) {
          break;
        }
        $scope.packages.push(config.packages[id]);
      }
      $scope.setChecked();
      return Math.ceil(total / pagesize);
    };
    $scope.loadMore = function (url, pageindex, obj) {
      pageindex = 1 * pageindex;
      if (pageindex == 1 && $scope.searchKeywords == '') {
        $scope.hideCheckAll = false;
      } else {
        $scope.hideCheckAll = true;
      }
      totalPage = $scope.setPackagesData(pageindex);
      if (totalPage < pageindex) {
        return false;
      }
      //重新生成页码
      var start = Math.max(1, pageindex - side);
      var end = Math.min(totalPage, pageindex + side);
      if (end - start < 2 * side + 1) {
        end = Math.min(totalPage, start + side * 2);
        start = Math.max(1, end - side * 2);
      }
      var liHtml = '<li>' + $('.js-pager li:first').html() + '</li>';
      for (var i = start; i <= end; i++) {
        liHtml += '<li><a href="javascript:;" page="' + i + '" ng-click="loadMore(\'' + url + '\',' + i + ')">' + i + '</a></li>';
      }
      if (pageindex != totalPage) {
        liHtml += '<li><a href="javascript:;" page="' + totalPage + '" ng-click="loadMore(\'' + url + '\',' + totalPage + ')">\u5c3e\u9875</a></li>';
      }
      $('.js-pager ul').html($compile(liHtml)($scope));
      //选中当前页码
      $('.js-pager li').attr('class', '');
      $('.js-pager a[page=\'' + pageindex + '\']').parent().attr('class', 'active');
      $('.js-pager .pager-nav').parent().attr('class', '');
    };
    $scope.loadMore('', 1);
  }
]);
//副创始人组管理列表
angular.module('userGroup').controller('ViceGroupDisplay', [
  '$scope',
  'config',
  function ($scope, config) {
    $scope.lists = config.lists;
    $scope.links = config.links;
    $scope.editGroup = function (id) {
      var id = parseInt(id);
      location.href = $scope.links.groupPost + 'id=' + id;
    };
    $scope.delGroup = function (id) {
      var id = parseInt(id);
      location.href = $scope.links.groupDel + 'id=' + id;
    };
  }
]);
//副创始人管理-添加/编辑
angular.module('userGroup').controller('ViceGroupPost', [
  '$scope',
  'config',
  function ($scope, config) {
    $scope.groupInfo = config.groupInfo;
    $scope.packages = config.packages;
    $scope.changeText = function (ev) {
      var text = $(ev)[0].target.text;
      $(ev)[0].target.text = text == '\u5c55\u5f00' ? '\u6536\u8d77' : '\u5c55\u5f00';
    };
  }
]);