
angular.module('we7resource').directive('we7ResourceBasicDialog',function(config){
	return {
		scope : {},
		restrict : 'EA', 
		templateUrl : 'directive-basic-basic.html'
		
	};
});


angular.module('we7resource').controller('we7resource-basic-controller', 
	['$scope','config',
		function($scope,config){ 
			$("#basictext").val(config.otherVal);
			//文字编辑文字消失的bug
			$scope.ok = function() {
				var txt = $("#basictext").val();
				$(window).trigger('resource_selected',{type:'basic',items:[{content:txt}]});
			};

			$scope.emotion = function () {
				initSelectEmotion();
			};  

			$scope.emoji = function () {
				initSelectEmoji();
			};

			var initSelectEmotion = function() {
				var $t = $('#basictext')[0];
				var textbox = $("#basictext").val();
				util.emotion($('.emotion-triggers'), $("#basictext"), function(txt, elm, target){
					if ($t.selectionStart || $t.selectionStart == '0') {
						var startPos = $t.selectionStart;
						var endPos = $t.selectionEnd;
						var scrollTop = $t.scrollTop;
						$("#basictext").val($t.value.substring(0, startPos) + txt + $t.value.substring(endPos, $t.value.length));
						$("#basictext").focus();
						$t.selectionStart = startPos + txt.length;
						$t.selectionEnd = startPos + txt.length;
						$t.scrollTop = scrollTop;
					}
					else {
						$("#basictext").val(textbox+txt);
						$("#basictext").focus();
					}
				});
			};
			var initSelectEmoji = function() {
				var textbox = $("#basictext").val();
				util.emojiBrowser(function(emoji){
					var unshift = '[U+' + emoji.find("span").text() + ']';
					$("#basictext").val(textbox+unshift);
				});
			};
			// initSelectEmotion();

		}]);