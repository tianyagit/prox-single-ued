angular.module('replyFormApp', ['we7app']);
//关键字自动回复编辑
angular.module('replyFormApp').controller('KeywordReply', ['$scope', '$http', 'config', function($scope, $http, config) {
	$scope.reply = {
		//触发方式：true:模糊;false：精准
		advanceTrigger: false,
		status: true,
		//展开/收起高级设置
		showAdvance: false,
		//编辑时要展示的关键字数据
		keyword: {
			exact: '',
			indistinct: '',
			contain: '',
			regexp: ''
		},
		//数据库数据集
		entry: config.replydata
	};
	if ($scope.reply.entry) {
		$scope.reply.entry.istop = $scope.reply.entry.displayorder >= 255 ? 1 : 0;
		$scope.reply.status = $scope.reply.entry.status == 1 ? true : false;
		if (!$scope.reply.entry.keywords) {
			$scope.reply.entry.keywords = [];
		}
	} else {
		$scope.reply.entry = {
			istop: 0,
			displayorder: '',
			id: '',
			keywords: [],
			module: '',
			name: '',
			status: 1,
			uniacid: config.uniacid
		};
	};
	
	$scope.changeStatus = function() {
		$scope.reply.status = !$scope.reply.status;
	};

	$scope.changeKeywordType = function(type) {
		var type = parseInt(type);
		$scope.newKeyword = {'type': type, 'content': ''};
		$('#keyword-indistinct').next().text('');
		$('#keyword-exact').next().text('');
		$('#keyword-regexp').next().text('');
	};

	$scope.showAddkeywordModal = function() {
		$('#addkeywordModal').modal('show');
		$scope.newKeyword = {'type': 1, 'content': ''};
	};

	$scope.addNewKeyword = function() {
		$http.post('./index.php?c=platform&a=reply&do=post', {'keyword': $scope.newKeyword.content})
			.success(function(data) {
				if (data.message.errno == -2) {
					util.message(data.message.message);
					return false;
				}
				if (data.message.errno == 0) {
					$('#addkeywordModal').modal('hide');
					var keywordType = parseInt($scope.newKeyword.type);
					switch (keywordType) {
						case 1:
						case 2:
							var contents = $scope.newKeyword.content.replace(/，/g, ',').split(',');
							angular.forEach(contents, function(content) {
								if (content != '') {
									$scope.reply.entry.keywords.push({'type': keywordType, 'content': content});
								}
							});
							break;
						case 3:
							$scope.reply.entry.keywords.push($scope.newKeyword);
							break;
					}
				}
			});
	};

	$scope.delKeyword = function(keyword) {
		var index = _.findIndex($scope.reply.entry.keywords, keyword);
		$scope.reply.entry.keywords = _.without($scope.reply.entry.keywords, $scope.reply.entry.keywords[index]);
	};

	$scope.changeTriggerType = function() {
		if ($scope.reply.advanceTrigger == 'exact') {
			$scope.reply.advanceTrigger = false;
		}
		if ($scope.reply.advanceTrigger == 'indistinct') {
			$scope.reply.advanceTrigger = true;
		}

	};
	$scope.changeShowAdvance = function() {
		$scope.reply.showAdvance = !$scope.reply.showAdvance;
	};

	if ($.isFunction(window.initReplyController)) {
		window.initReplyController($scope, $http);
	};
	$scope.submitForm = function() {
		if ($scope.reply.entry.keywords.length == 0) {
			util.message('请输入有效的触发关键字.');
			return false;
		}
		var val = angular.toJson($scope.reply.entry.keywords);
		$(':hidden[name="keywords"]').val(val);
		if ($.isFunction(window.validateReplyForm)) {
			var validateReplyFormResult = window.validateReplyForm($('#reply-form'), $, _, util, $scope, $http);
			if (validateReplyFormResult) {
				$('.reply-form-submit').click();
			} else {
				return false;
			}
		} else {
			$('.reply-form-submit').click();
		}
	};
	$scope.initEmotion = function(obj) {
		util.emotion($("#emoji-exact"), $('#keyword-exact'), function(txt, elm, target) {
			$scope.newKeyword.content += txt;
			$scope.$apply($scope.newKeyword);
		});
		util.emotion($("#emoji-indistinct"), $('#keyword-indistinct'), function(txt, elm, target) {
			$scope.newKeyword.content += txt;
			$scope.$apply($scope.newKeyword);
		});
	};
	// 检测规则是否已经存在
	$scope.checkKeyWord = function(ev) {
		var key = $(ev.target);
		var keyword = key.val().trim();

		if (keyword == '') {
			key.next().text('');
			return false;
		}
		$http.post('./index.php?c=platform&a=reply&do=post', {'keyword': keyword})
			.success(function(data) {
				if (data.message.errno != 0) {
					if (data.message.errno == -2) {
						key.next().html(data.message.message);
						return false;
					}
					var rid = $('input[name="rid"]').val();
					var rules = data.message.message;
					var ruleurl = '';
					for (rule in rules) {
						if (rid != rules[rule].id) {
							var name = rules[rule].name ? rules[rule].name : rules[rule].id;
							ruleurl += "<a href='" + config.links.postUrl + "&rid=" + rules[rule].id + "' target='_blank'><strong class='text-danger'>" + name + "</strong></a>&nbsp;";
						}
					}
					if (ruleurl != '') {
						key.next().html('该关键字已存在于 ' + ruleurl + ' 规则中.');
					}
				} else {
					key.next().text('');
				}
			});
	};
}]);
//应用关键字编辑
angular.module('replyFormApp').controller('ApplyReply', ['$scope', function($scope) {
	$scope.alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
	$scope.activeLetter = '';
	$scope.searchModule = function(letter) {
		$scope.activeLetter = letter;
	}
}]);
//关键字回复列表
angular.module('replyFormApp').controller('KeywordDisplay', ['$scope', '$http', function($scope, $http) {
	$scope.changeStatus = function(id) {
		var classes = $('#key-'+id).attr('class');
		$http.post('./index.php?c=platform&a=reply&do=change_keyword_status', {'id': id})
			.success(function(data) {
				if (data.message.errno == 0) {
					if (classes.match('switchOn')) {
						$('#key-'+id).removeClass('switchOn');
					} else {
						$('#key-'+id).addClass('switchOn');
					}
					util.message('修改成功！');
				} else {
					util.message('网络错误，请稍候重试');
				}
			}).error(function(data) {
				util.message('网络错误，请稍候重试');
			});				
	}
}]);
angular.module('replyFormApp').controller('serviceDisplay', ['$scope', 'config', '$http', function($scope, config, $http) {
	$scope.changeStatusUrl = config.url;
	$scope.service = config.service;

	$scope.changeStatus = function(rid) {
		var rid = file = rid;
		$http.post($scope.changeStatusUrl, {'rid' : rid, 'file' : file, 'm' : 'service'})
			.success(function(data) {
				if (data.message.errno == 0) {
					$scope.service[rid].switch = $scope.service[rid].switch == '' ? 'checked' : '';
					location.reload();
				} else {
					util.message('网络错误，请稍候重试');
				}
			});
	}
}])
//特殊消息回复列表
angular.module('replyFormApp').controller('SpecialDisplay', ['$scope', 'config', '$http', function($scope, config, $http) {
	$scope.config = config;
	$scope.url = config.url;
	$scope.msgtypes = {
		'image' : $scope.config.image,
		'voice' : $scope.config.voice,
		'video' : $scope.config.video,
		'shortvideo' : $scope.config.shortvideo,
		'location' : $scope.config.location,
		'trace' : $scope.config.trace,
		'link' : $scope.config.link,
		'merchant_order' : $scope.config.merchant_order,
		'ShakearoundUserShake' : $scope.config.ShakearoundUserShake,
		'ShakearoundLotteryBind' : $scope.config.ShakearoundLotteryBind,
		'WifiConnected' : $scope.config.WifiConnected,
		'qr' : $scope.config.qr
	};
	$scope.switch_class = new Array();
	angular.forEach($scope.msgtypes, function(val, key) {
		$scope.switch_class[key] = val == 'module' || val == 'keyword'? 'switch switchOn special_switch' : 'switch special_switch';
	});
	$scope.changestatus = function(type) {
		$http.post($scope.url, {'type' : type}).success(function(data) {
			if (data.message.errno == 0) {
				$scope.switch_class[type] = $scope.switch_class[type] == 'switch switchOn special_switch' ? 'switch special_switch' : 'switch switchOn special_switch';
				util.message('修改成功！');
			} else {
				util.message(data.message.message);
			}
		});
	};
}]);
//特殊消息回复编辑
angular.module('replyFormApp').controller('PostCtrl', ['$scope', 'config', '$http', function($scope, config, $http) {
	require(['underscore', 'util'], function( _, util) {
		window.initReplyController($scope);
	});
	$scope.switch_class = config.class;
	$scope.status = config.status == 'module' || config.status == 'keyword' ? config.status : '';
	$scope.change = function(type, status) {
		$scope.status = status == 0 ? 1 : 0;
		$scope.switch_class = $scope.status == 1 ? 'switch switchOn special_switch' : 'switch special_switch';
	};
}]);
//首次访问自动回复
angular.module('replyFormApp').controller('WelcomeDisplay', ['$scope', function($scope) {
	if ($.isFunction(window.initReplyController)) {
		window.initReplyController($scope);
	};
}]);
//默认回复
angular.module('replyFormApp').controller('DefaultDisplay', ['$scope', function($scope) {
	if ($.isFunction(window.initReplyController)) {
		window.initReplyController($scope);
	};
}]);