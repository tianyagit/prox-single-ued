angular.module('paycenterApp').service('servicePaycenterBase', ['$rootScope', function($rootScope) {
	var servicePaycenterBase = {};
	var baseData = {
		config: {
			body: '刷卡支付收款',
			fee: '0',
			cardsn: '',
			card: '',
			credit1: 0,
			credit2: 0,
			last_money: 0,
			offset_money: 0,
			is_showCode: 0,
			loading : '',
			card_error : '',
			member: {
				uid: 0,
				credit2: 0,
			},
			nums : [['7' , '7'], ['8' , '8'], ['9' , '9'], ['4' , '4'], ['5' , '5'], ['6' , '6'], ['1' , '1'], ['2' , '2'], ['3' , '3'], ['0' , '0'], ['.' , '.'], ['clear' , '清除']]
		}
	};

	servicePaycenterBase.paycenterBaseData = function(card) {
		baseData.config.card = card;
		return baseData;
	};

	return servicePaycenterBase;
}]);