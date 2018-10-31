angular.module('userCardApp').controller('CardBasicCtrl', [
  '$scope',
  'config',
  function ($scope, config) {
    $scope.creditnames = config.creditnames;
    $scope.siteroot = config.siteroot;
    $scope.recharge_src = $scope.siteroot + '/app/resource/images/sum-recharge.png';
    $scope.scanpay_src = $scope.siteroot + '/app/resource/images/scan-pay.png';
  }
]);