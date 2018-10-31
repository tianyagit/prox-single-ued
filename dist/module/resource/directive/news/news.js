angular.module('we7resource').directive('we7ResourceNewsDialog', function () {
  return {
    scope: {},
    restrict: 'EA',
    templateUrl: 'directive-news-news.html',
    link: function (scope, ele, attrs, ctrl, trans) {
      ele.bind('click', 'pagination li a', function (event) {
        var page = $(event.target).attr('page');
        if (page) {
          scope.$broadcast('news_page_change', page);
        }
      });
    }
  };
});
angular.module('we7resource').controller('we7resource-news-controller', [
  '$scope',
  '$sce',
  'serviceResource',
  '$controller',
  function ($scope, $sce, serviceResource, $controller) {
    $scope.resourceType = 'news';
    $controller('we7resource-base-controller', { $scope: $scope });
    //继承父controller
    $scope.keyword = '';
    $scope.canConvert = function (item) {
      if (item && item.items && (item.items[0].author == '' && item.items[0].content == '')) {
        return false;  // 图文链接素材不能转换
      }
      return true;
    };
    $scope.timeToDate = function (time) {
      var date = new Date(time * 1000);
      return date;
    };
    /**
		指令抛出的事件
		*/
    $scope.$on('news_page_change', function (event, page) {
      $scope.setCurrentPage(page);
    });
    // 加载数据
    $scope.loadData = function () {
      loadData();
    };
    // 搜索 
    $scope.search = function () {
      $scope.currentPage = 1;
      loadData();
    };
    //获取数据
    function loadData() {
      serviceResource.getResources('news', $scope.currentPage, $scope.index == 1, { keyword: $scope.keyword }).then(function (data) {
        $scope.news = data.items;
        $scope.pager = $sce.trustAsHtml(data.pager);
      });
    }
    loadData();
  }
]);