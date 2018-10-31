angular.module('wapeditorApp').controller('HeaderCtrl', [
  '$scope',
  function ($scope) {
    $scope.addThumb = function (type) {
      require(['fileUploader'], function (uploader) {
        uploader.show(function (img) {
          $scope.activeItem.params[type] = img.url;
          $scope.$apply('activeItem');
        }, {
          'direct': true,
          'multiple': false
        });
      });
    };
    $scope.ifCheck = function () {
      $scope.activeItem.params.bottom_menu = !$scope.activeItem.params.bottom_menu;
    };
  }
]);