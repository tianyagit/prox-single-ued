angular.module('wapeditorApp').controller('TitleCtrl', [
  '$scope',
  function ($scope) {
    $scope.changeNavEnable = function (enable) {
      $scope.activeItem.params.tradition.nav.enable = enable;
    };
  }
]);