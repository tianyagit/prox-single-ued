angular.module('wapeditorApp').controller('PureLinkCtrl', [
  '$scope',
  function ($scope) {
    $scope.changeItem = function (item) {
      if (item.id == 5) {
        $scope.activeItem.paddingTop = angular.copy($scope.activeItem.params.baseStyle.paddingTop);
        // 记录临时变量
        $scope.activeItem.params.baseStyle.paddingTop = 0;
      } else {
        // 从5切换到1-4，使用$scope.activeItem.paddingTop;1-4之间切换，不改变
        $scope.activeItem.params.baseStyle.paddingTop = $scope.activeItem.params.baseStyle.paddingTop ? $scope.activeItem.params.baseStyle.paddingTop : $scope.activeItem.paddingTop;
      }
      index = $.inArray(item, $scope.activeItem.params.items);
      for (i in $scope.activeItem.params.items) {
        if (i == index) {
          $scope.activeItem.params.items[i].active = 1;
          $scope.activeItem.params.baseStyle.color = $scope.activeItem.params.items[i].color;
          $scope.activeItem.params.baseStyle.backgroundColor = $scope.activeItem.params.items[i].discolor;
        } else {
          $scope.activeItem.params.items[i].active = 0;
        }
      }
    };
    $scope.addImage = function (item) {
      index = $.inArray(item, $scope.activeItem.params.items);
      for (i in $scope.activeItem.params.items) {
        if (i == index) {
          require(['fileUploader'], function (uploader) {
            uploader.show(function (img) {
              $scope.saveModulePosition();
              // 先同步模块之前的位置
              $scope.resetPosition(img);
              $scope.activeItem.params.items[i].imgurl = img.url;
              $scope.$apply();
            }, {
              'direct': true,
              'multiple': false
            });
          });
        }
      }
    };
    // 调整模块尺寸
    $scope.resetPosition = function (img) {
      if (img.width && img.height) {
        $scope.activeItem.params.positionStyle.width = img.width;
        $scope.activeItem.params.positionStyle.height = img.height;
        $scope.setModulePositionStyle($scope.activeItem.params.positionStyle);
      }
    };
  }
]);