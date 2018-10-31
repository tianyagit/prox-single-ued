angular.module('we7resource').directive('we7ResourceModuleDialog', [
  '$http',
  function ($http) {
    return {
      scope: {},
      restrict: 'EA',
      templateUrl: 'directive-module-module.html',
      link: function (scope, ele, attrs, ctrl, trans) {
        ele.bind('click', 'pagination li a', function (event) {
          // console.log(event.target.text);
          var page = $(event.target).attr('page');
          if (page) {
            scope.$broadcast('module_page_change', page);
          }
        });
      }
    };
  }
]);
angular.module('we7resource').controller('we7resource-module-controller', [
  '$scope',
  '$sce',
  'serviceResource',
  'config',
  function ($scope, $sce, serviceResource, config) {
    $scope.multiple = config.multiple;
    // 是否多选
    $scope.keyword = '';
    // 是否获取用户模块
    var user_module = 0;
    var others = config.others;
    var mtype = '';
    var cover = false;
    if (others && others.user_module) {
      user_module = 1;
    }
    if (others && others.mtype) {
      mtype = others.mtype;
    }
    if (others && others.cover) {
      cover = others.cover;
    }
    $scope.itemClick = function (item) {
      if ($scope.multiple) {
        if (item.selected) {
          item.selected = false;
          return;
        }
        item.selected = true;
      } else {
        item.selected = true;
        $(window).trigger('resource_selected', {
          type: 'module',
          items: [item]
        });
      }
    };
    $scope.$on('module_page_change', function (event, page) {
      $scope.setCurrentPage(page);
    });
    $scope.setCurrentPage = function (newPage) {
      if ($scope.currentPage != newPage) {
        $scope.currentPage = newPage;
        loadData();
      }
    };
    $scope.search = function () {
      loadData();
    };
    // 获取选中的项目
    $scope.ok = function () {
      var items = [];
      angular.forEach($scope.modules, function (item, key) {
        if (item.selected) {
          items.push(item);
        }
      });
      if (items.length > 0) {
        fireSelected(items);
        return;
      }
      fireCanceled();
    };
    //抛出选中事件
    function fireSelected(items) {
      $(window).trigger('resource_selected', {
        type: 'module',
        items: items
      });
    }
    //抛出取消事件
    function fireCanceled() {
      $(window).trigger('resource_canceled');
    }
    function loadData() {
      //模块不管是不是本地
      serviceResource.getResources('module', $scope.currentPage, true, {
        keyword: $scope.keyword,
        user_module: user_module,
        mtype: mtype,
        cover: cover
      }).then(function (data) {
        $scope.modules = data.items;
        $scope.pager = $sce.trustAsHtml(data.pager);
      });
    }
    loadData();
  }
]);