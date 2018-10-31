angular.module('we7resource').directive('we7ResourceVideoDialog', function () {
  return {
    scope: {},
    restrict: 'EA',
    templateUrl: 'directive-video-video.html',
    link: function (scope, ele, attrs, ctrl, trans) {
      ele.bind('click', 'pagination li a', function (event) {
        var page = $(event.target).attr('page');
        if (page) {
          scope.$broadcast('video_page_change', page);
        }
      });
    }
  };
});
angular.module('we7resource').controller('we7resource-video-controller', [
  '$scope',
  '$sce',
  'serviceResource',
  'config',
  '$controller',
  function ($scope, $sce, serviceResource, config, $controller) {
    $scope.resourceType = 'video';
    $controller('we7resource-base-controller', { $scope: $scope });
    //继承父controller
    $scope.accept = 'video/rm, video/rmvb, video/wmv, video/avi, video/mpg, video/mpeg, video/mp4';
    $scope.uploadname = '\u4e0a\u4f20\u89c6\u9891';
    $scope.multiupload = false;
    $scope.onIndexChange = function (index) {
      loadData();
      setUploadUrl();  //设置上传地址
    };
    setUploadUrl();
    $scope.showNetWork = function () {
      return $scope.netWorkVideo;
    };
    $scope.loadData = function () {
      loadData();
    };
    $scope.sceurl = function () {
      return $sce.trustAsResourceUrl($scope.netWorkurl);
    };
    // 视频不能转换 
    $scope.canConvert = function (item) {
      return false;
    };
    /**
		指令抛出的事件
		*/
    $scope.$on('video_page_change', function (event, page) {
      $scope.setCurrentPage(page);
    });
    // 获取视频标题
    $scope.getTitle = function (item) {
      if (item.tag) {
        return item.tag.title ? item.tag.title : item.filename;
      }
      return item.filename;
    };
    $scope.fetchNetwork = function () {
      var url = $scope.netWorkurl;
      var video = {
          url: getIframeUrl(url),
          isRemote: true
        };
      fireSelected('video', [video]);
    };
    function getIframeUrl(url) {
      if (/^<iframe/.test(url)) {
        var conUrl = '';
        if (/src=\"[^\s"]+/i.test(url)) {
          conUrl = url.match(/src=\"[^\s"]+/i)[0].substr(5);
        }
        url = /http:\/\/|https:\/\//gi.test(conUrl) ? conUrl : 'http://' + conUrl;
      }
      return url;
    }
    $scope.timeToDate = function (time) {
      var date = new Date(time * 1000);
      return date;
    };
    function loadData() {
      serviceResource.getResources('video', $scope.currentPage, $scope.index == 1).then(function (data) {
        $scope.videos = data.items;
        $scope.pager = $sce.trustAsHtml(data.pager);
      });
    }
    // 网络视频转为本地
    function netWorkconvert(url, toLocal) {
      util.loading('\u89c6\u9891\u8f6c\u5316\u4e2d...');
      serviceResource.netWorkconvert(url, toLocal, 'video').then(function (item) {
        msg('\u7f51\u7edc\u89c6\u9891\u8f6c\u5316\u6210\u529f');
        $scope.setIndex($scope.needType - 1);
        // needType 从1 开始计数
        util.loaded();
      }, function (error) {
        msg('\u7f51\u7edc\u89c6\u9891\u8f6c\u5316\u5931\u8d25');
        util.loaded();
      });
    }
    var msg = function (msg) {
      util.message(msg, '');
    };
    var fireSelected = function (type, items) {
      $(window).trigger('resource_selected', {
        type: 'video',
        items: items
      });
    };
    // 设置上传url
    function setUploadUrl() {
      $scope.uploadurl = $scope.index === 0 ? './index.php?c=utility&a=file&do=wechat_upload&upload_type=video&mode=perm&uniacid=' + $scope.uniacid : './index.php?c=utility&a=file&do=upload&upload_type=video&global=' + $scope.global + '&dest_dir=' + $scope.dest_dir + '&uniacid=' + $scope.uniacid;
    }
    loadData();
  }
]);