angular.module('replyFormApp').directive('ngInvoker', [
  '$parse',
  function ($parse) {
    return function (scope, element, attr) {
      scope.$eval(attr.ngInvoker);
    };
  }
]);