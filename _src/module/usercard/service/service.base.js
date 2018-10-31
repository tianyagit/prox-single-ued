angular.module('userCardApp').service('serviceUserCardBase', ['$rootScope', 'serviceBase', function($rootScope, serviceBase){
	var serviceUserCardBase = {};
	serviceUserCardBase.triggerActiveItem = function(index) {
		$('.app-side .editor').css('marginTop', '0');
		serviceBase.triggerActiveItem(index);
	};
	serviceUserCardBase.editItem = function(index) {
		//保存数据到数组结构中
		//切换当前选中的模块到activeItem
		var activeModules = serviceBase.getBaseData('activeModules');
		if (typeof(index) == 'string') {
			angular.forEach(activeModules, function(active){
				if (active.id == index) {
					index = active.index;
				};
			});
		}
		serviceBase.editItem(index);
	};
	serviceUserCardBase.addFields = function() {
		var activeItem = serviceBase.getBaseData('activeItem');
		activeItem.params.fields.push({
			title: '',
			require: 1,
			bind: '',
			issystem: 0
		});
		serviceBase.setBaseData('activeItem', activeItem);
		$rootScope.$broadcast('serviceBase.activeItem.update', activeItem);
	};
	serviceUserCardBase.removeFields = function(item) {
		if(item.bind == 'mobile' || item.bind == 'realname') {
			return false;
		}
		var activeItem = serviceBase.getBaseData('activeItem');
		activeItem.params.fields = _.without(activeItem.params.fields, item);
		serviceBase.setBaseData('activeItem', activeItem);
		$rootScope.$broadcast('serviceBase.activeItem.update', activeItem);
	};
	serviceUserCardBase.addNums = function() {
		var activeItem = serviceBase.getBaseData('activeItem');
		activeItem.params.nums.push({
			recharge: '',
			num: ''
		}); 
	};
	serviceUserCardBase.removeNums = function(item) {
		var activeItem = serviceBase.getBaseData('activeItem');
		activeItem.params.nums = _.without(activeItem.params.nums, item);
		serviceBase.setBaseData('activeItem', activeItem);
		$rootScope.$broadcast('serviceBase.activeItem.update', activeItem);
	};
	serviceUserCardBase.addRecharges = function() {
		var activeItem = serviceBase.getBaseData('activeItem');
		activeItem.params.recharges.push({
			condition: '',
			back: '',
			backtype: '0',
			backunit: '元',
		});
		serviceBase.setBaseData('activeItem', activeItem);
		$rootScope.$broadcast('serviceBase.activeItem.update', activeItem);
	};
	serviceUserCardBase.removeRecharges = function(item) {
		var activeItem = serviceBase.getBaseData('activeItem');
		activeItem.params.recharges = _.without(activeItem.params.recharges, item);
		serviceBase.setBaseData('activeItem', activeItem);
		$rootScope.$broadcast('serviceBase.activeItem.update', activeItem);
	};
	serviceUserCardBase.addTimes = function() {
		var activeItem = serviceBase.getBaseData('activeItem');
		activeItem.params.times.push({
			recharge: '',
			time: ''
		});
		serviceBase.setBaseData('activeItem', activeItem);
		$rootScope.$broadcast('serviceBase.activeItem.update', activeItem);
	};
	serviceUserCardBase.removeTimes = function(item) {
		var activeItem = serviceBase.getBaseData('activeItem');
		activeItem.params.times = _.without(activeItem.params.times, item);
		serviceBase.setBaseData('activeItem', activeItem);
		$rootScope.$broadcast('serviceBase.activeItem.update', activeItem);
	};
	serviceUserCardBase.selectCoupon = function() {
		var activeItem = serviceBase.getBaseData('activeItem');
		util.coupon(function(coupon) {
			activeItem.params.grant.coupon = [];
			angular.forEach(coupon, function(single){
				activeItem.params.grant.coupon.push({
					couponTitle : single.title,
					coupon : single.id,
				});
			});
			serviceBase.setBaseData('activeItem', activeItem);
			$rootScope.$apply();
			$rootScope.$broadcast('serviceBase.activeItem.update', activeItem);
		}, {'multiple' : true});
	};
	serviceUserCardBase.clearCoupon = function() {
		var activeItem = serviceBase.getBaseData('activeItem');
		activeItem.params.grant.coupon = [];
		serviceBase.setBaseData('activeItem', activeItem);
		$rootScope.$broadcast('serviceBase.activeItem.update', activeItem);
	};
	serviceUserCardBase.addThumb = function(type) {
		var activeItem = serviceBase.getBaseData('activeItem');
		require(['fileUploader'], function(uploader){
			uploader.show(function(img){
				activeItem.params[type] = img.url;
				serviceBase.setBaseData('activeItem', activeItem);
				$rootScope.$apply();
				$rootScope.$broadcast('serviceBase.activeItem.update', activeItem);
			}, {'direct' : true, 'multiple' : false});
		});
	};
	serviceUserCardBase.addBgThumb = function() {
		var activeItem = serviceBase.getBaseData('activeItem');
		require(['fileUploader'], function(uploader){
			uploader.show(function(img){
				activeItem.params.background.image = img.url;
				serviceBase.setBaseData('activeItem', activeItem);
				$rootScope.$apply();
				$rootScope.$broadcast('serviceBase.activeItem.update', activeItem);
			}, {'direct' : true, 'multiple' : false});
		});
	};
	return serviceUserCardBase;
}]);