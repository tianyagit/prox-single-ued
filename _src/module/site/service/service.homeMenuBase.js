angular.module('wesiteApp').service('serviceHomeMenuBase', ['$rootScope', function($rootScope) {
	var serviceHomeMenuBase = {};
	serviceHomeMenuBase.initHomemenuInfo = function(){
		var info =  {
			css: {
				icon: {
					width: '',
					color: '',
					icon: '',
				},
			},
			name: '',
			description: '',
			url: '',
			status: 1,
			displayorder: 0,
			icon: '',
			icontype: 1,
			section: 0,
		};
		return info;
	};
	serviceHomeMenuBase.initSections = function() {
		var sections = [{num:0, val: '不设置位置'},{num:1, val: '位置1'},{num:2, val: '位置2'},{num:3, val: '位置3'},{num:4, val: '位置4'},{num:5, val: '位置5'},{num:6, val: '位置6'},{num:7, val: '位置7'},{num:8, val: '位置8'},{num:9, val: '位置9'},{num:10, val: '位置10'}];
		return sections;
	}
	return serviceHomeMenuBase;
}]);