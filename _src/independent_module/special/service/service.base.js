angular.module('ModuleSpecialApp').service('serviceSpecialBase', ['$rootScope', 'serviceBase', function($rootScope, serviceBase){
	var serviceSpecialBase = {};
	var baseData = {
		'activePageIndex' : 0,
		'isMultiPage' : true,
		'isLongPage' : true,
		'allPages' : [],
		'multipage' : []
	};
	serviceSpecialBase.getBaseData = function(name) {
		return baseData[name];
	};
	serviceSpecialBase.setBaseData = function(name, value) {
		if(angular.isObject(name)){
			angular.forEach(name, function(val, key){
				baseData[key] = val;
			});
		} else {
			baseData[name] = value;
		}
	};
	return serviceSpecialBase;
}]);