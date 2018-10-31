angular.module('replyFormApp').directive('ngInvoker', function($parse){
	return function (scope, element, attr) {
		scope.$eval(attr.ngInvoker);
	};
});