angular.module('paycenterApp').filter('credit1_num', [
  '$rootScope',
  function ($rootScope) {
    return function (credit1) {
      credit1 = Math.floor(credit1);
      return credit1;
    };
  }
]);