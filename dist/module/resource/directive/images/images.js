// 图片弹出框
angular.module('we7resource').directive('we7ResourceImageDialog', function () {
  return {
    scope: {},
    restrict: 'EA',
    templateUrl: 'directive-images-images.html',
    link: function (scope, ele, attrs, ctrl, trans) {
      ele.bind('click', 'pagination li a', function (event) {
        var page = $(event.target).attr('page');
        if (page) {
          scope.$broadcast('image_page_change', page);
        }
      });
    }
  };
});
angular.module('we7resource').controller('we7resource-image-controller', [
  '$scope',
  '$sce',
  'serviceResource',
  '$http',
  '$controller',
  'config',
  function ($scope, $sce, serviceResource, $http, $controller, config) {
    $scope.resourceType = 'image';
    $controller('we7resource-base-controller', { $scope: $scope });
    //继承父controller
    $scope.accept = 'image/gif, image/jpg, image/jpeg, image/bmp, image/png, image/x-ico';
    $scope.uploadname = '\u4e0a\u4f20\u56fe\u7247';
    $scope.multipleupload = true;
    //多文件上传
    $scope.quality = 0;
    $scope.netWorkurl = '';
    $scope.groups = [];
    var now = new Date();
    $scope.year = '0';
    //now.getFullYear();
    $scope.month = '0';
    //now.getMonth()+1;
    $scope.years = createYearOptions();
    $scope.months = createMonthOptions();
    $scope.selectedAllImage = false;
    $scope.groupid = -1;
    $scope.editable = false;
    $scope.config = config;
    if ($scope.config.typeName == '' || $scope.config.typeName == undefined || $scope.config.typeName == null) {
      $scope.config.typeName = '\u5e73\u53f0';
    }
    function msg(msg) {
      util.message(msg, '');
    }
    ;
    function fireSelected(items) {
      $(window).trigger('resource_selected', {
        type: 'image',
        items: items
      });
    }
    ;
    function getSelectedKeys() {
      var keys = [];
      var selecteditems = getSelectedItems();
      for (var i = 0; i < selecteditems.length; i++) {
        keys.push(selecteditems[i].id);
      }
      return keys;
    }
    function getSelectedItems() {
      var selecteitems = [];
      for (var i = 0; i < $scope.images.length; i++) {
        var item = $scope.images[i];
        if (item.selected) {
          selecteitems.push(item);
        }
      }
      return selecteitems;
    }
    $scope.isLocal = function () {
      return $scope.index == 1;
    };
    // 加载数据
    $scope.loadData = function () {
      loadData();
    };
    // 标签切换
    $scope.onIndexChange = function (index) {
      if (index != 2) {
        loadData();
        setUploadUrl();  //设置上传地址
      }
    };
    //抛出取消事件
    function fireCanceled() {
      $(window).trigger('resource_canceled');
    }
    $scope.itemClick = function (item) {
      if ($scope.converting) {
        //如果正在转换 return;
        return;
      }
      item.selected = !item.selected;
      var selAll = getSelectedItems().length == $scope.images.length;
      $scope.selectedAllImage = selAll;
    };
    // 获取选中的项目
    $scope.ok = function () {
      var items = getSelectedItems();
      if (items.length > 0) {
        //  如果需要转化的资源不支持多选 
        if (!$scope.multiple || $scope.needConvert()) {
          //如果不是多选直接抛事件 关闭
          items[0].selected = true;
          $scope.convert(items[0]);
          return;
        }
        fireSelected(items);
        return;
      }
      fireCanceled();
    };
    setUploadUrl();
    //设置上传地址
    $scope.fetchNetwork = function () {
      var url = $scope.netWorkurl;
      var isToLocal = $scope.needType == 2 ? true : false;
      netWorkconvert(url, isToLocal);  //转化为相应的图片资源
    };
    /**
    指令抛出的分页事件
  */
    $scope.$on('image_page_change', function (event, page) {
      $scope.setCurrentPage(page);
    });
    $scope.updateUploadUrl = function () {
      setUploadUrl();
    };
    // 设置上传url
    function setUploadUrl() {
      // 微信上传无需加global参数 否则没权限的 话上传不了
      var groupid = $scope.groupid;
      $scope.uploadurl = $scope.index == 0 ? './index.php?c=utility&a=file&do=wechat_upload&upload_type=image&mode=perm&uniacid=' + $scope.uniacid + '&dest_dir=' + $scope.dest_dir + '&quality=' + $scope.quality + '&group_id=' + groupid : './index.php?c=utility&a=file&do=upload&upload_type=image&global=' + $scope.global + '&dest_dir=' + $scope.dest_dir + '&uniacid=' + $scope.uniacid + '&quality=' + $scope.quality + '&group_id=' + groupid;
    }
    // int 转 Date
    $scope.timeToDate = function (time) {
      var date = new Date(time * 1000);
      return date;
    };
    // 获取标题
    $scope.getTitle = function (item) {
      return $scope.isLocal ? item.filename : item.attachment;
    };
    // 获取图片
    $scope.getImage = function (item) {
      return 'url(' + item.url + ')';
    };
    // 搜索图片
    $scope.search = function () {
      $scope.currentPage = 1;
      loadData();
    };
    // 删除选中图片
    $scope.delSel = function () {
      var keys = getSelectedKeys();
      if (keys.length == 0) {
        util.message('\u8bf7\u9009\u62e9\u8981\u5220\u9664\u7684\u56fe\u7247');
        return;
      }
      if (keys.length > 1 && !$scope.isLocal()) {
        util.message('\u5fae\u4fe1\u56fe\u7247\u53ea\u652f\u6301\u5355\u5f20\u5220\u9664');
        return;
      }
      if ($scope.isLocal()) {
        serviceResource.delMuti(keys, 'image', $scope.isLocal(), { uniacid: $scope.uniacid }).then(function (data) {
          util.message('\u5220\u9664\u6210\u529f');
          loadData();
        }, function (error) {
          util.message(error.message);
        });
      } else {
        // 微信删除走原有逻辑
        serviceResource.delItem(keys[0], 'image', $scope.isLocal(), $scope.uniacid).then(function (data) {
          util.message('\u5220\u9664\u6210\u529f');
          loadData();
        }, function (error) {
          util.message(error.message);
        });
      }
    };
    $scope.selectedAll = function (selectedAllImage) {
      for (var i = 0; i < $scope.images.length; i++) {
        $scope.images[i].selected = selectedAllImage;
      }
    };
    //加载全部
    $scope.loadAll = function () {
      loadImages(-1);
    };
    // 加载未分组
    $scope.loadNoGroup = function () {
      loadImages(0);
    };
    // 加载指定分组图片
    $scope.loadImages = function (group) {
      loadImages(group.id);
    };
    // 添加分组
    $scope.addGroup = function (name) {
      var groupname = name;
      var isLocal = $scope.index == 1;
      serviceResource.addGroup(groupname, isLocal).then(function (data) {
        $scope.groups.push({
          name: groupname,
          id: data.id,
          editable: false,
          deleted: false,
          changed: false
        });
      });
    };
    // 编辑分组
    $scope.editGroup = function (group) {
      var isLocal = $scope.index == 1;
      serviceResource.changeGroup(group, isLocal).then(function (data) {
        // 无需提示
        console.log('changegroup');
      });
    };
    // 变为可编辑状态
    $scope.doEditGroup = function (group) {
      // group.editable = true;
      group.editable = !group.editable;
      // group.editable = true;
      $scope.loadImages(group);
    };
    $scope.editing = function (group) {
      group.editing = true;
    };
    $scope.edited = function (group) {
      group.editing = false;
      group.editable = false;
      $scope.editGroup(group);
    };
    $scope.cancelEditing = function (group) {
      group.editing = false;
      group.editable = false;
    };
    // 取消编辑
    $scope.doAddGroup = function () {
      $scope.addGroup('\u672a\u547d\u540d');
    };
    // 删除分组
    $scope.delGroup = function (group) {
      // var group = $scope.group;
      $('#categoryEditModal').hide();
      group.deleted = true;
      var isLocal = $scope.index == 1;
      serviceResource.delGroup(group.id, isLocal).then(function (data) {
        //不做提示
        console.log('\u5220\u9664\u5206\u7ec4\u6210\u529f');
        $scope.loadAll();
      });
    };
    // 移动到分组
    $scope.moveToGroup = function (group) {
      var isLocal = $scope.index == 1;
      var keys = getSelectedKeys();
      if (keys.length == 0) {
        util.message('\u8bf7\u9009\u62e9\u56fe\u7247\u540e\u79fb\u52a8');
        return;
      }
      serviceResource.moveToGroup(keys, group.id, isLocal).then(function (data) {
        util.message('\u79fb\u52a8\u6210\u529f');
        loadImages(group.id);
      });
    };
    // 网络图片转化
    function netWorkconvert(url, toLocal) {
      util.loading('\u7f51\u7edc\u56fe\u7247\u8f6c\u5316\u4e2d...');
      serviceResource.netWorkconvert(url, toLocal, 'image').then(function (item) {
        util.loaded();
        fireSelected([item]);
      }, function (error) {
        msg('\u7f51\u7edc\u56fe\u7247\u8f6c\u5316\u5931\u8d25');
        util.loaded();
      });
    }
    //是否是正确的URL
    function isURL(str_url) {
      return !!str_url.match(/(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g);
    }
    function createYearOptions() {
      var now = new Date();
      var year = now.getFullYear();
      var years = [];
      for (var i = 0; i < 10; i++) {
        years.push(year - i);
      }
      return years;
    }
    function createMonthOptions() {
      var months = [];
      for (var i = 1; i <= 12; i++) {
        months.push(i);
      }
      return months;
    }
    // 加载数据
    function loadData() {
      loadImages($scope.groupid);
      loadGroup();
    }
    // 根据分组加载图片
    function loadImages(groupid) {
      $scope.selectedAllImage = false;
      $scope.groupid = groupid;
      setUploadUrl();
      // 上传路径添加分组id
      var isLocal = $scope.index == 1;
      serviceResource.getResources('image', $scope.currentPage, isLocal, {
        year: $scope.year,
        month: $scope.month,
        uniacid: $scope.uniacid,
        dest_dir: $scope.dest_dir,
        global: $scope.global,
        groupid: groupid
      }).then(function (data) {
        $scope.images = data.items;
        $scope.pager = $sce.trustAsHtml(data.pager);
      });
    }
    //加载分组
    function loadGroup() {
      var isLocal = $scope.index == 1;
      serviceResource.imageGroup(isLocal, []).then(function (data) {
        var groups = [];
        for (var index = 0; index < data.length; index++) {
          var element = data[index];
          element.editable = false;
          element.deleted = false;
          groups.push(element);
        }
        $scope.groups = groups;
      });
    }
    loadData();
  }
]);