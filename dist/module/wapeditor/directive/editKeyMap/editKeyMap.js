angular.module('wapeditorApp').directive('we7EditKeyMap', [
  'serviceBase',
  '$timeout',
  function (serviceBase, $timeout) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var $document = $(document);
        $document.unbind('keydown').keydown(function (e) {
          var activeModules = serviceBase.getBaseData('activeModules');
          var activeItem = serviceBase.getBaseData('activeItem');
          var index = _.findIndex(activeModules, activeItem);
          //快捷键删除
          if (e.keyCode == 46 && index > 0) {
            e.preventDefault();
            if (confirm('\u5220\u9664\u540e\u9700\u8981\u91cd\u65b0\u63d0\u4ea4\u624d\u4f1a\u751f\u6548\uff0c\u786e\u8ba4\u5417\uff1f')) {
              activeModules.splice(index, 1);
              serviceBase.setBaseData({
                'activeModules': activeModules,
                'activeItem': activeModules[0]
              });
            }
          }
          //方向键移动
          if (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) {
            if (!_.isEmpty(activeItem)) {
              e.preventDefault();
            }
            var step = 1;
            if (e.keyCode == 37) {
              //press left
              activeItem.params.positionStyle.left -= step;
            }
            if (e.keyCode == 38) {
              //press up
              activeItem.params.positionStyle.top -= step;
            }
            if (e.keyCode == 39) {
              //press right
              activeItem.params.positionStyle.left += step;
            }
            if (e.keyCode == 40) {
              //press down
              activeItem.params.positionStyle.top += step;
            }
          }
          $timeout(function () {
            scope.$apply();
          });
        }).unbind('keyup').keyup(function () {
          scope.$apply();
        });
      }
    };
  }
]);