angular.module('replyFormApp').filter('nl2br', function($sce){
	return function(text) {
		return text ? $sce.trustAsHtml(text.replace(/\n/g, '<br/>')) : '';
	};
});