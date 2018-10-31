angular.module('quickMenuApp').service('serviceQuickMenuSubmit', [
	'serviceCommon',
	'serviceQuickMenuBase',
	function(serviceCommon, serviceQuickMenuBase) {
	var serviceQuickMenuSubmit = {};

	serviceQuickMenuSubmit.submit = function() {
		var submit = {'params':{}, 'html':''};
		submit.params = serviceQuickMenuBase.getQuickMenuData();
		serviceCommon.stripHaskey(submit.params);

		var html = $('.nav-menu').html();
		html = html.replace(/<\!\-\-([^-]*?)\-\->/g, '');
		html = html.replace(/ng\-[a-zA-Z-]+=\"[^\"]*\"/g, '');
		html = html.replace(/ng\-[a-zA-Z]+/g, '');
		html = html.replace(/[\t\n\n\r]/g, '');
		submit.html = html;
		return submit;
	};
	return serviceQuickMenuSubmit;
}]);