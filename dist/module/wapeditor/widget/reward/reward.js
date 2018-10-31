angular.module('wapeditorApp').controller('RewardCtrl', [
  '$scope',
  function ($scope) {
    $scope.changeSize = function (size) {
      $scope.activeItem.params.fontactive = size;
      $scope.activeItem.params.fonttype = size;
      switch (size) {
      case 'big':
        $scope.activeItem.params.baseStyle.fontSize = '36px';
        break;
      case 'middle':
        $scope.activeItem.params.baseStyle.fontSize = '26px';
        break;
      case 'small':
        $scope.activeItem.params.baseStyle.fontSize = '16px';
        break;
      }
    };
  }
]);