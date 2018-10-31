angular.module('wapeditorApp').controller('RichTextCtrl', [
  '$scope',
  '$sce',
  function ($scope, $sce) {
    $scope.trustAsHtml = function (string, params) {
      if (!string && params) {
        string = params.replace(/\#quot;/g, '&quot;');
      }
      return $sce.trustAsHtml(string);
    };
  }
]);