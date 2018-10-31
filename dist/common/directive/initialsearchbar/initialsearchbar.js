angular.module('we7app').directive('we7InitialSearchbar', function () {
  var directive = {
      'templateUrl': 'directive-initialsearchbar-searchbar.html',
      'scope': { 'doSearch': '&we7SearchCallback' },
      'link': function ($scope, element, attr) {
        $scope.alphabet = [
          'A',
          'B',
          'C',
          'D',
          'E',
          'F',
          'G',
          'H',
          'I',
          'J',
          'K',
          'L',
          'M',
          'N',
          'O',
          'P',
          'Q',
          'R',
          'S',
          'T',
          'U',
          'V',
          'W',
          'X',
          'Y',
          'Z'
        ];
        $scope.searchResult = function (letter) {
          $scope.activeLetter = letter;
          $scope.doSearch({ 'letter': letter });
        };
      }
    };
  return directive;
});