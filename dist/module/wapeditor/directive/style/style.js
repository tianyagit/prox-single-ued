angular.module('wapeditorApp').directive('we7Style', [
  'serviceSetStyle',
  function (serviceSetStyle) {
    return { templateUrl: 'directive-style-style.html' };
  }
]);