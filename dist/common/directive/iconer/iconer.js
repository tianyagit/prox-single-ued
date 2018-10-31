angular.module('we7app').directive('we7Iconer', [
  '$templateCache',
  function ($templateCache) {
    var templateNavPills = $templateCache.get('directive-iconer-nav-pills-inline.html');
    var templateTabContent = $templateCache.get('directive-iconer-tab-content-inline.html');
    var editor = {
        'scope': {
          'image': '=we7MyImage',
          'icon': '=we7MyIcon',
          'iconcolor': '=we7MyIconColor'
        },
        'transclude': true,
        'templateUrl': 'directive-iconer-iconer.html',
        'link': function ($scope, element, attr) {
          $scope.selectIcon = function () {
            require(['fileUploader'], function (uploader) {
              var modalobj = uploader.show(function (icon) {
                  $scope.icon = {};
                  $scope.icon.name = icon.name;
                  $scope.icon.color = icon.color;
                  $scope.$apply('image');
                  $scope.$apply('icon');
                }, {
                  'direct': true,
                  'multiple': false,
                  type: 'icon',
                  otherVal: $scope.iconcolor
                });
            });
          };
          $scope.removeIcon = function () {
            $scope.image = '';
            $scope.icon = {};
          };
        }
      };
    return editor;
  }
]);