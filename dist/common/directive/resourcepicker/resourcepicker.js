/***
 *  素材管理器 的angular 调用方式
 *  用法示例
 {template 'common/header'}
 <div id="test"  ng-controller="ACtrl" >

 <div class="btn btn-default" we7-resource-picker
        type="image" is-wechat="false"
        multiple="false" on-select="select(type,items)">
        上传图片
 </div>
 <div ng-repeat = "(key,item) in items">
        <img ng-src="{{item.url}}"></img>
 </div>
 </div>


 <script>
 angular.module('apptest',['we7app']);
 angular.module('apptest').controller('ACtrl',function($scope){
		$scope.select = function(type,items) {
			$scope.items = items;
			$scope.$apply();
		}
	})
 angular.bootstrap($('#test'), ['apptest']);
 </script>
 {template 'common/footer'}
 */
angular.module('we7app').directive('we7ResourcePicker', function () {
  var directive = {
      'scope': {
        'type': '@type',
        'isWechat': '@isWechat',
        'multiple': '@mutiple',
        'showType': '@showType',
        'needType': '@needType',
        'global': '@global',
        'dest_dir': '@dest_dir',
        'onSelect': '&onSelect'
      },
      'link': function ($scope, element, attr) {
        $(element).unbind('click').on('click', function () {
          $scope.show();
        });
        $(window).unbind('resource_selected').on('resource_selected', function (event, data) {
          $scope.finish(data.type, data.items);
        });
      },
      'controller': function ($scope) {
        var buildhtml = function (type) {
          var label = 'we7-resource-' + type + '-dialog';
          var dialog = '<div ' + label + ' class="uploader-modal modal fade ' + type + '" id="material-Modal" ' + 'tabindex="-1" role="dialog" aria-labelledby="myModalLabel2">' + '</div>';
          return dialog;
        };
        $scope.show = function () {
          var options = {
              'type': $scope.type,
              'isWechat': $scope.isWechat === 'true' ? true : false,
              'multiple': $scope.multiple === 'true' ? true : false,
              'needType': $scope.needType <= 3 ? $scope.needType : 3,
              'global': $scope.global === 'true' ? true : false,
              'dest_dir': $scope.dest_dir
            };
          $('#material-Modal').remove();
          var html = buildhtml($scope.type);
          $(document.body).prepend(html);
          var modalobj = $('#material-Modal');
          modalobj.modal('show');
          var we7resource = angular.module('we7resource');
          we7resource.value('config', options);
          angular.bootstrap(modalobj, ['we7resource']);
        };
        $scope.finish = function (type, items) {
          $scope.onSelect({
            type: type,
            items: items
          });
          $('#material-Modal').modal('hide');
        };
      }
    };
  return directive;
});