angular.module('replyFormApp').directive('ngMyEditor', function(){
	var editor = {
		'scope' : {
			'value' : '=ngMyValue'
		},
		'template' : '<textarea id="editor" style="height:600px;width:100%;"></textarea>',
		'link' : function ($scope, element, attr) {
			if(!element.data('editor')) {
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
				editor = UE.getEditor('editor', ueditoroption);
				element.data('editor', editor);
				editor.addListener('contentChange', function() {
					$scope.value = editor.getContent().replace(/\&quot\;/g, '"');
					$scope.$root.$$phase || $scope.$apply('value');
				});
				$(element).parents('form').submit(function() {
					if (editor.queryCommandState('source')) {
						editor.execCommand('source');
					}
				});
				editor.addListener('ready', function(){
					if (editor && editor.getContent() != $scope.value) {
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