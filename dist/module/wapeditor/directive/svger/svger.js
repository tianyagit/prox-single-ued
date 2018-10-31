angular.module('wapeditorApp').directive('we7Svger', function () {
  return {
    scope: { 'we7svg': '=we7Svg' },
    link: function (scope, element, attr) {
      scope.$watch('we7svg', function () {
        var editsvg = $(scope.we7svg);
        for (var i = 0; editsvg.length > i; i++) {
          if ('svg' == editsvg[i].tagName) {
            var svgtag = editsvg[i];
            $(svgtag).attr({
              'width': '100%',
              'height': '100%'
            });
            $(svgtag)[0].setAttribute('preserveAspectRatio', 'none');
            // note: jquery的attr()会将大写转为小写，使用原生js方法
            element.html(svgtag);
            break;
          }
        }
      });
    }
  };
});