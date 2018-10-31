// require('./musicform.js');
// require('../voice/components');//加载语音组件
// var util = require('../util');
angular.module('we7resource').directive('we7ResourceMusicDialog', function () {
  return {
    scope: {},
    restrict: 'EA',
    replace: false,
    templateUrl: 'directive-music-music.html'
  };
});
angular.module('we7resource').controller('we7resource-music-controller', [
  '$scope',
  '$sce',
  'serviceResource',
  'config',
  function ($scope, $sce, serviceResource, config) {
    $scope.needType = config.needType;
    $scope.multiple = config.multiple;
    $scope.showMusicForm = true;
    $scope.musicurl = '';
    // 选择语音文件
    $scope.selectVoice = function () {
      $scope.showMusicForm = false;
    };
    //选中的语音文件
    var selectedVoice = null;
    $scope.$on('selected_voice', function (event, item) {
      selectedVoice = item;
      $scope.musicurl = item.attachment;
      $scope.showMusicForm = true;
    });
    $scope.$on('add_music', function (event, item) {
      $(window).trigger('resource_selected', {
        type: 'music',
        items: [item]
      });
    });
  }
]);