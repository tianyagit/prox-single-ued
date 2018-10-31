angular.module('menuApp', ['we7app']);
angular.module('menuApp').controller('menuDisplay', ['$scope', 'config', '$http', function($scope, config, $http){
	$scope.changeStatus = function(id, status, menu_type) {
		status = status == 1 ? 2 : 1;
		if (menu_type == 3) {
			if (status == 1) {
				$('.js-switch-' + id).addClass('switchOn');
			} else if (status == 2) {
				$('.js-switch-' + id).removeClass('switchOn');
			}
		}
		$http.post(config.push_url, {id : id}).success(function(data) {
			if (data.message.errno == 0) {
				if (menu_type == 3) {
					util.message(data.message.message,data.redirect);
				} else {
					util.message(data.message.message, data.redirect);
				}
			} else {
				if (menu_type == 3) {
					util.message(data.message.message, 'error');
				} else {
					util.message(data.message.message, data.redirect, 'error');
				}
			}
		});
	};
}]);
angular.module('menuApp').controller('conditionMenuDesigner', ['$scope', 'config', '$http', function($scope, config, $http){
	current_menu_url = config.current_menu_url;
	require(['underscore', 'jquery.ui', 'jquery.caret', 'district'], function(_, $, $, dis) {
		$(".tpl-district-container").each(function(){
			var elms = {};
			elms.province = $(this).find(".tpl-province")[0];
			elms.city = $(this).find(".tpl-city")[0];
			var vals = {};
			vals.province = $(elms.province).data('value');
			vals.city = $(elms.city).data('value');
			dis.render(elms, vals, {withTitle: true, wechat : true});
		});
		$('.sub-designer-y').sortable({
			items: '.sub-js-sortable',
			axis: 'y',
			cancel: '.sub-js-not-sortable'
		});

		$('.designer-x').sortable({
			items: '.js-sortable',
			axis: 'x'
		});
	});
	$scope.context = {};
	$scope.context.group = config.group;
	if (config.id > 0 && config.type != 1 && config.status == 1) {
		$scope.context.group.disabled = 1;
	}
	$scope.initGroup = function() {
		$scope.context.group = {
			title: '',
			type: config.type,
			button: [{
				name: '菜单名称',
				type: 'click',
				url: '',
				key: '',
				media_id: '',
				appid: '',
				pagepath: '',
				sub_button: []
			}],
			matchrule: {
				sex: 0,
				client_platform_type: 0,
				group_id: -1,
				country: '',
				province: '',
				city: '',
				language: ''
			}
		};
	}

	if(!$scope.context.group || !$scope.context.group.button) {
		$scope.initGroup();
	}
	$scope.$watch('context.group.matchrule.province', function(newValue, oldValue) {
		if (newValue == '') {
			$('.tpl-city').hide();
		} else {
			$('.tpl-city').show();
		}
	});
	$scope.context.activeIndex = 0;

	$scope.context.activeBut = $scope.context.group['button'][$scope.context.activeIndex];
	$scope.context.activeItem = $scope.context.activeBut;
	$scope.context.activeType = 1; //标识一级菜单
	//删除默认菜单
	$scope.context.remove = function(){
		if(!confirm('删除默认菜单会清空所有菜单记录，确定吗？')) {
			return false;
		}
		location.href = config.delete_url;
		return false;
	};

	$scope.context.submit = function(submit_type){
		var group = $scope.context.group;
		group.button = _.sortBy(group.button, function(h){
			var elm = $(':hidden[data-role="parent"][data-hash="' + h.$$hashKey + '"]');
			return elm.parent().index();
		});
		angular.forEach(group.button, function(j){
			j.sub_button = _.sortBy(j.sub_button, function(h){
				var e = $(':hidden[data-role="sub"][data-hash="' + h.$$hashKey + '"]');
				return e.parent().index();
			});
		});
		var ched = $(':hidden[name="menu_media"]').val();
		if(!$.trim(group.title)) {
			util.message('没有设置菜单组名称', '', 'error');
			return false;
		}
		if (config.type == 2) {
			if(!group.matchrule.sex && !group.matchrule.client_platform_type && group.matchrule.group_id == -1 && !group.matchrule.province && !group.matchrule.city) {
				util.message('没有设置个性化菜单的匹配规则', '', 'error');
				return false;
			}
		}
		if(group.button.length < 1) {
			util.message('没有设置菜单', '', 'error');
			return false;
		}
		var error = {name: '', action: ''};
		angular.forEach(group.button, function(val, index){
			if($.trim(val.name) == '') {
				this.name += '第' + (index + 1) + '个一级菜单未设置菜单名称<br>';
			}
			if(val.sub_button.length > 0) {
				angular.forEach(val.sub_button, function(v, index1){
					if($.trim(v.name) == '') {
						this.name += '第' + (index + 1) + '个一级菜单中的第' + (index1 + 1) + '个二级菜单未设置菜单名称<br>';
					}
					if (v.type == 'view' && (v.url.indexOf('http') < 0)) {
						this.action += '第' + (index + 1) + '个一级菜单中的第' + (index1 + 1) + '个二级菜单跳转链接缺少http标识<br>';
					}
					if (v.type == 'miniprogram') {
						if ($.trim(v.appid) == '') {
							this.action += '第' + (index + 1) + '个一级菜单中的第' + (index1 + 1) + '个二级菜单需设置APPID<br>';
						}
						if ($.trim(v.pagepath) == '') {
							this.action += '第' + (index + 1) + '个一级菜单中的第' + (index1 + 1) + '个二级菜单需设置页面跳转地址<br>';
						}
						if ($.trim(v.url) == '') {
							this.action += '第' + (index + 1) + '个一级菜单中的第' + (index1 + 1) + '个二级菜单需设置备用页跳转地址<br>';
						}
					}
					if ((v.type == 'view' && $.trim(v.url) == '') || (v.type == 'click' && (v.media_id == '' && v.key == '')) || (v.type != 'view' && v.type != 'click' && v.type != 'miniprogram' && $.trim(v.key) == '')) {
						this.action += '菜单【' + val.name + '】的子菜单【' + v.name + '】未设置操作选项. <br />';
					}
				}, error);
			} else {
				if(val.type == 'view' && (val.url.indexOf('http') < 0)){
					this.action += '菜单【' + val.name + '】跳转链接缺少http标识. <br />';
				}
				if (val.type == 'miniprogram') {
					if ($.trim(val.appid) == '') {
						this.action += '菜单【' + val.name + '】需设置APPID. <br />';
					}
					if ($.trim(val.pagepath) == '') {
						this.action += '菜单【' + val.name + '】需设置页面跳转地址. <br />';
					}
					if ($.trim(val.url) == '') {
						this.action += '菜单【' + val.name + '】需设置备用页跳转地址. <br />';
					}
				}
				if ((val.type == 'view' && $.trim(val.url) == '') || (val.type == 'click' && (val.media_id == '' && val.key == '')) || (val.type != 'view' && val.type != 'click' && val.type != 'miniprogram' && $.trim(val.key) == '')) {
					this.action += '菜单【' + val.name + '】不存在子菜单并且未设置操作选项. <br />';
				}
			}
		}, error);

		if(error.name) {
			util.message(error.title, '', 'error');
			return;
		}
		if(error.action) {
			util.message(error.action, '', 'error');
			return;
		}
		$('#btn-submit').attr('disabled', true);
		$http.post(location.href, {'group': group, 'method': 'post', 'submit_type': submit_type}).success(function(dat){
			if(dat.message.errno != 0) {
				$('#btn-submit').attr('disabled', false);
				util.message(dat.message.message, '', 'error');
			} else {
				util.message('创建菜单成功. ', dat.redirect, 'success');
			}
		});
	}

	$scope.context.triggerActiveBut = function(but){
		var index = $.inArray(but, $scope.context.group.button);
		if(index == -1) return false;
		$scope.context.activeIndex = index;
		$scope.context.activeBut = $scope.context.group['button'][$scope.context.activeIndex];
		$scope.context.activeItem = $scope.context.activeBut;
		$scope.context.activeType = 1;
		$scope.context.activeItem.forceHide = 0;
	};

	$scope.context.editBut = function(subbut, but, id){
		$scope.context.triggerActiveBut(but);
		if(!subbut) {
			$scope.context.activeItem = but;
			$scope.context.activeType = 1;
		} else {
			$scope.context.activeItem = subbut;
			$scope.context.activeType = 2;
		}

		if ($scope.context.activeType == 1 && $scope.context.activeItem.sub_button.length > 0) {
			$scope.context.activeItem.forceHide = 1;
		}else{
			$scope.context.activeItem.forceHide = 0;
		}

		if (id) {
			$scope.context.activeItem.material = [];
			if ($scope.context.activeItem.type != 'view' && $scope.context.activeItem.type != 'click') {
				if(!$scope.context.activeItem.key) {
					current_type = 'click';
				} else {
					current_type = $scope.context.activeItem.key.substr(0, 6);
				}
				if (current_type == 'module') {
					$scope.context.activeItem.etype = 'module';
				} else {
					$scope.context.activeItem.etype = 'click';
				}
			}
			$http.post(current_menu_url, {current_menu : $scope.context.activeItem}).success(function(data) {
				if (data.message.errno == 0) {
					$scope.context.activeItem.material.push(data.message.message);
				}
			});
		}
	};

	$scope.context.addBut = function(){
		if($scope.context.group['button'].length >= 3) {
			return;
		}
		$scope.context.group['button'].push({
			name: '菜单名称',
			type: 'click',
			url: '',
			key: '',
			media_id: '',
			appid: '',
			pagepath: '',
			sub_button: []
		});
		var but = $scope.context.group['button'][$scope.context.group.button.length - 1];
		$scope.context.triggerActiveBut(but);
		$('.designer-x').sortable({
			items: '.js-sortable',
			axis: 'x'
		});
	}

	$scope.context.removeBut = function(but, type){
		if(type == 1) {
			if(!confirm('将同时删除所有子菜单,是否继续')) {
				return false;
			}
			$scope.context.group.button = _.without($scope.context.group.button, but);
			$scope.context.triggerActiveBut($scope.context.group['button'][0]);
		} else {
			$scope.context.activeBut.sub_button = _.without($scope.context.activeBut.sub_button, but);
			$scope.context.triggerActiveBut($scope.context.activeBut);
		}
		if($scope.context.activeItem.sub_button.length>0){
			$scope.context.activeItem.forceHide = 1;
		}else{
			$scope.context.activeItem.forceHide = 0;
		}
	};

	$scope.context.addSubBut = function(but){
		if($scope.context.group.disabled == 1) {
			return false;
		}
		$scope.context.triggerActiveBut(but);
		if($scope.context.activeBut.sub_button.length >= 5) {
			return;
		}
		$scope.context.activeBut.sub_button.push({
			name: '子菜单名称',
			type: 'click',
			url: '',
			key: '',
			appid: '',
			pagepath: '',
			media_id: ''
		});
		$('.sub-designer-y').sortable({
			items: '.sub-js-sortable',
			axis: 'y',
			cancel: '.sub-js-not-sortable'
		});
		$scope.context.activeItem = $scope.context.activeBut.sub_button[$scope.context.activeBut.sub_button.length - 1];
		$scope.context.activeType = 2;
		$scope.context.activeItem.forceHide = 0;
	}

	/*选择Emoji表情*/
	$scope.context.selectEmoji = function() {
		util.emojiBrowser(function(emoji){
			var text = '::' + emoji.find("span").text() + '::';
			$('#title').setCaret();
			$('#title').insertAtCaret(text);
			$scope.context.activeItem.name = $('#title').val();
			$scope.$digest();
		});
	};

	//点击选择【系统连接】事件
	$scope.context.select_link = function(){
		var ipt = $(this).parent().prev();
		util.linkBrowser(function(href){
			var site_url = config.site_url;
			if(href.substring(0, 4) == 'tel:') {
				util.message('自定义菜单不能设置为一键拨号');
				return;
			} else if(href.indexOf("http://") == -1 && href.indexOf("https://") == -1) {
				href = href.replace('./index.php?', '/index.php?');
				href = site_url + 'app' + href;
			}
			$scope.context.activeItem.url = href;
			$scope.$digest();
		});
	};

	$scope.context.search = function(){
		var search_value = $('#ipt-forward').val();
		$.post(config.search_key_url, {'key_word' : search_value}, function(data){
			var data = $.parseJSON(data);
			var total = data.length;
			var html = '';
			if(total > 0) {
				for(var i = 0; i < total; i++) {
					html += '<li><a href="javascript:;">' + data[i] + '</a></li>';
				}
			} else {
				html += '<li><a href="javascript:;" id="no-result">没有找到您输入的关键字</a></li>';
			}
			$('#key-result ul').html(html);
			$('#key-result ul li a[id!="no-result"]').click(function(){
				$('#ipt-forward').val($(this).html());
				$scope.context.activeItem.key = $(this).html();
				$('#key-result').hide();
			});
			$('#key-result').show();
		});
	};

	$scope.context.select_mediaid = function(type, otherVal) {
		var option = {
			type: type,
			isWechat : true,
			needType : 1
		};
		util.material(function(material){
			$scope.context.activeItem.key = '';
			$scope.context.activeItem.media_id = material.media_id;
			$scope.context.activeItem.material = [];
			if (type == 'keyword') {
				$scope.context.activeItem.material.push(material);
				$scope.context.activeItem.material[0].type = 'keyword';
				$scope.context.activeItem.key = 'keyword:' + material.content;
				$scope.context.activeItem.media_id = '';
				if (otherVal == '1') {
					$scope.context.activeItem.material[0].etype = 'click';
					$scope.context.activeItem.material[0].name = material.name;
					$scope.context.activeItem.material[0].content = material.content;
				}
			} else if (type == 'image') {
				$scope.context.activeItem.material.push(material);
			} else if (type == 'news') {
				$scope.context.activeItem.material.push(material);
			} else if (type == 'voice') {
				$scope.context.activeItem.material.push(material);
			} else if (type == 'video') {
				$scope.context.activeItem.material.push(material);
			} else if (type == 'module') {
				$scope.context.activeItem.key = 'module:' + material.name;
				$scope.context.activeItem.material.push(material);
				$scope.context.activeItem.material[0].module_type = $scope.context.activeItem.material[0].type;
				$scope.context.activeItem.material[0].type = 'module';
				$scope.context.activeItem.material[0].etype = 'module';
			}
			$scope.$digest();
		}, option);
	};

	$scope.context.editBut('', $scope.context.group.button[0], $scope.context.group.id);
}]);
