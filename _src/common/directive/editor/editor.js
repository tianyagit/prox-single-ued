angular.module('we7app').directive('we7Editor', function(){
	var editor = {
		'scope' : {
			'value' : '=?we7MyValue',
			'params' : '=?we7MyParams'
		},
		'template' : '<textarea id="" rows="10" style="height:600px;width:100%"></textarea>',
		'link' : function ($scope, element, attr) {
			if(!element.data('editor')) {
				element.find('textarea').attr('id', 'editor' + new Date().getTime());
				var ueditoroption = {
					'autoClearinitialContent': false,
					'toolbars': [
						['fullscreen', 'source', 'preview', '|', 'bold', 'italic', 'underline', 'strikethrough', 'forecolor', 'backcolor', '|',
							'justifyleft', 'justifycenter', 'justifyright', '|', 'insertorderedlist', 'insertunorderedlist', 'blockquote', 'emotion',
							'link', 'removeformat', '|', 'rowspacingtop', 'rowspacingbottom', 'lineheight', 'indent', 'paragraph', 'fontfamily', 'fontsize', '|',
							'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol',
							'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', '|', 'anchor', 'map', 'print', 'drafts'
						]
					],
					'elementPathEnabled': false,
					'initialFrameHeight': 200,
					'focus': false,
					'maximumWords': 9999999999999,
					'autoFloatEnabled': false
				};
				editor = UE.getEditor(element.find('textarea').attr('id'), ueditoroption);
				element.data('editor', editor);
				editor.addListener('contentChange', function() {
					$scope.value = editor.getContent();
					if ($scope.value) {
						$scope.params = $scope.value.replace(/\&quot;/g, '#quot;');
					}
					$scope.$root.$$phase || $scope.$apply('value');
				});
				editor.addListener('ready', function(){
					if (!$scope.value && $scope.params) {
						$scope.value = $scope.params.replace(/\#quot;/g, '&quot;');
					}
					if ($scope.value && editor && editor.getContent() != $scope.value) {
						editor.setContent($scope.value);
					}
					$scope.$watch('value', function (value) {
						if (editor && editor.getContent() != value) {
							editor.setContent(value ? value : '');
						}
					});
				});
			}
		}
	};
	return editor;
});