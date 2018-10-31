angular.module('wapeditorApp').controller('GoodCtrl', [
  '$scope',
  function ($scope) {
    $scope.changeLayout = function (type) {
      switch (type) {
      case 'lr':
        $scope.activeItem.params.layoutstyle = 1;
        break;
      case 'ud':
        $scope.activeItem.params.layoutstyle = 2;
        break;
      }
    };
  }
]);