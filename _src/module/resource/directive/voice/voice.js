// require('./components');
// var util = require('../util');
angular.module('we7resource').directive('we7ResourceVoiceDialog',function(){
	return {
		scope : {},
		restrict : 'EA', 
		templateUrl : 'directive-voice-voice.html', 
		link:function(scope,ele,attrs,ctrl,trans){
			ele.bind('click','pagination li a',function(event){
				var page=$(event.target).attr('page');
				if (page) {
					scope.$broadcast('voice_page_change', page);
				}
			});
		}
	};
}); 


angular.module('we7resource').controller('we7resource-voice-controller', 
	['$scope', function($scope){
		$scope.$on('selected_voice',function(event, item){
			if (item && !item.url) {
				item.url = item.attachment;
			}
			$(window).trigger('resource_selected',{type:'voice',items:[item]});
		});
	}]);

