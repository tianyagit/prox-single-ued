angular.module('userCardApp').controller('CardRechargeCtrl', [
  '$scope',
  function ($scope) {
    require(['bootstrap'], function ($) {
      $('.dropdown-toggle').dropdown();
    });
  }
]);