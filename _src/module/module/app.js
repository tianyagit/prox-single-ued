var letterindex = ['全部', 'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
angular.module('moduleApp', ['we7app', 'infinite-scroll']);
angular.module('moduleApp')
	.controller('ModuleMoreCtrl', ['$scope', 'config', function ($scope, config) {
		$scope.activeLetter = '';
		$scope.searchModule = function (letter) {
			location.href = config.searchurl + '&letter=' + letter;
		}
	}])
	.controller('moduleGroupCtrl', ['$scope', function ($scope) {
		$scope.changeText = function (ev) {
			var text = $(ev)[0].target.text;
			$(ev)[0].target.text = text == '展开' ? '收起' : '展开';
		}
	}])
	.controller('moduleGroupPostCtrl', ['$scope', '$http', 'config', function ($scope, $http, config) {
		$scope.config = config;
		$scope.moduleGroup = config.moduleGroup === null ? { 'title': '' } : config.moduleGroup;
		$scope.groupHaveModuleApp = config.groupHaveModuleApp.length == 0 ? {} : config.groupHaveModuleApp;
		$scope.groupHaveModuleWxapp = config.groupHaveModuleWxapp.length == 0 ? {} : config.groupHaveModuleWxapp;
		$scope.groupHaveModuleWebapp = config.groupHaveModuleWebapp.length == 0 ? {} : config.groupHaveModuleWebapp;
		$scope.groupHaveModulePhoneapp = config.groupHaveModulePhoneapp.length == 0 ? {} : config.groupHaveModulePhoneapp;
		$scope.groupHaveModuleXzapp = config.groupHaveModuleXzapp.length == 0 ? {} : config.groupHaveModuleXzapp;
		$scope.groupHaveModuleAliapp = config.groupHaveModuleAliapp.length == 0 ? {} : config.groupHaveModuleAliapp;

		$scope.groupNotHaveModuleApp = config.groupNotHaveModuleApp;
		$scope.groupNotHaveModuleWxapp = config.groupNotHaveModuleWxapp;
		$scope.groupNotHaveModuleWebapp = config.groupNotHaveModuleWebapp;
		$scope.groupNotHaveModulePhoneapp = config.groupNotHaveModulePhoneapp;
		$scope.groupNotHaveModuleXzapp = config.groupNotHaveModuleXzapp;
		$scope.groupNotHaveModuleAliapp = config.groupNotHaveModuleAliapp;
		$scope.groupHaveTemplate = config.groupHaveTemplate.length == 0 ? {} : config.groupHaveTemplate;
		$scope.groupNotHaveTemplate = config.groupNotHaveTemplate;
		//添加选择应用、小程序、模版时初始化选择的module
		$scope.selectedModules = [];
		$scope.allmodulesel = false;
		$scope.allwxappsel = false;
		$scope.alltemplatesel = false;
		$scope.allwebsel = false;
		$scope.allxzappsel = false;
		$scope.keyword = '';
		//对象过滤
		$scope.filterKeyword = function (keyword) {
			angular.forEach($scope.groupNotHaveModuleApp, function (item) {
				item.hide = false;
				if (keyword != '') {
					if (item.title.indexOf(keyword) == -1) {
						item.hide = true;
					}
				}

			});
		}

		$scope.addModule = function () {
			$('#add_module').modal('show');
		};
		$scope.addModuleWxapp = function () {
			$('#add_module_wxapp').modal('show');
		};

		$scope.adTemplate = function () {
			$('#add_template').modal('show');
		};
		$scope.addModuleWebapp = function() {
			$('#add_module_webapp').modal('show');
		};

		$scope.addModulePhoneapp = function() {
			$('#add_module_phoneapp').modal('show');
		};

		$scope.addModuleXzapp = function() {
			$('#add_module_xzapp').modal('show');
		};

		$scope.addModuleAliapp = function() {
			$('#add_module_aliapp').modal('show');
		};

		$scope.selectOrCancelModule = function (module, type) {
			module.selected = module.selected ? false : true;
			if (module.selected) {
				$scope.selectModule(module, type);
				return;
			}
			$scope.cancleModule(module, type);
		};

		function selecteAll(modules, selected, type) {
			$scope.selectedModules = [];
			if (!selected) {
				$scope.selectedModules = [];
				angular.forEach(modules, function (module) {
					module.selected = false;
				});
				return;
			}
			angular.forEach(modules, function (module) {
				module.selected = true;
				$scope.selectedModules.push(module);
				if (module.main_module && module.main_module != '' && modules[module.main_module] != undefined) {
					$scope.selectedModules.push(modules[module.main_module]);
				}
			});
		}

		$scope.selecteAllModule = function (selected) {
			selecteAll($scope.groupNotHaveModuleApp, selected);
		}

		$scope.selecteAllWxapp = function (selected) {
			selecteAll($scope.groupNotHaveModuleWxapp, selected);
		}

		$scope.selecteAllTemplate = function (selected) {
			selecteAll($scope.groupNotHaveTemplate, selected);
		}

		$scope.selecteAllWebapp = function(selected) {
			selecteAll($scope.groupNotHaveModuleWebapp, selected);
		};

		$scope.selecteAllXzapp = function(selected) {
			selecteAll($scope.groupNotHaveModuleXzapp, selected);
		};

		$scope.selecteAllAliapp = function(selected) {
			selecteAll($scope.groupNotHaveModuleAliapp, selected);
		};

		$scope.selecteAllPhoneapp = function(selected) {
			selecteAll($scope.groupNotHaveModulePhoneapp, selected);
		};

		$scope.selectModule = function (module, type) {
			$scope.selectedModules.push(module);

			if (type == 'module' && module.main_module != '' && $scope.groupNotHaveModuleApp[module.main_module] != undefined) {
				$scope.selectedModules.push($scope.groupNotHaveModuleApp[module.main_module]);
			}

			if (type == 'module') {
				if ($scope.selectedModules.length >= _.values($scope.groupNotHaveModuleApp).length) {//因模块应用 有主模块
					$scope.allmodulesel = true;
				}
			} else if (type == 'module_wxapp') {
				if ($scope.selectedModules.length == _.values($scope.groupNotHaveModuleWxapp).length) {
					$scope.allwxappsel = true;
				}
			} else if(type == 'module_webapp'){
				if ($scope.selectedModules.length == _.values($scope.groupNotHaveModuleWebapp).length) {
					$scope.allwebappsel = true;
				}
			} else if(type == 'module_phoneapp') {
				if ($scope.selectedModules.length == _.values($scope.groupNotHaveModulePhoneapp).length) {
					$scope.allphoneappsel = true;
				}
			} else if (type == 'module_xzapp') {
				if ($scope.selectedModules.length == _.values($scope.groupNotHaveModuleXzapp).length) {
					$scope.allxzappsel = true;
				}
			} else if (type == 'module_aliapp') {
				if ($scope.selectedModules.length == _.values($scope.groupNotHaveModuleAliapp).length) {
					$scope.allaliappsel = true;
				}
			} else {
				if ($scope.selectedModules.length == _.values($scope.groupNotHaveTemplate).length) {
					$scope.alltemplatesel = true;
				}
			}
		};
		$scope.cancleModule = function (module, type) {
			have_plugin = false;
			angular.forEach($scope.selectedModules, function (val) {
				if (val.main_module == module.name) {
					have_plugin = true;
				}
			});
			if (have_plugin == true) {
				return false;
			}

			var index = _.indexOf($scope.selectedModules, module);
			if (index > -1) {
				$scope.selectedModules = _.without($scope.selectedModules, $scope.selectedModules[index]);
			}
			if (type == 'module') {
				$scope.allmodulesel = false;
			} else if (type == 'module_wxapp') {
				$scope.allwxappsel = false;
			} else if (type == 'module_webapp') {
				$scope.allwebappsel = false;
			} else if (type == 'module_phoneapp') {
				$scope.allphoneappsel = false;
			} else if (type == 'module_xzapp') {
				$scope.allxzappsel = false;
			} else if (type == 'module_aliapp') {
				$scope.allaliappsel = false;
			} else {
				$scope.alltemplatesel = false;
			}
		};
		$scope.addHaveModule = function () {
			angular.forEach($scope.selectedModules, function (moduleVal, moduleKey) {
				delete $scope.groupNotHaveModuleApp[moduleVal.name];
				$scope.groupHaveModuleApp[moduleVal.name] = moduleVal;
			});
			$scope.selectedModules = [];
			$('#add_module').modal('hide');
			$scope.allmodulesel = false;
		};
		$scope.addHaveModuleWxapp = function () {
			angular.forEach($scope.selectedModules, function (moduleVal, moduleKey) {
				delete $scope.groupNotHaveModuleWxapp[moduleVal.name];
				$scope.groupHaveModuleWxapp[moduleVal.name] = moduleVal;
			});
			$scope.selectedModules = [];
			$('#add_module_wxapp').modal('hide');
			$scope.allwxappsel = false;
		}
		$scope.addHaveTemplate = function () {
			angular.forEach($scope.selectedModules, function (templateVal, templateKey) {
				delete $scope.groupNotHaveTemplate[templateVal.name];
				$scope.groupHaveTemplate[templateVal.name] = templateVal;
			});
			$scope.selectedModules = [];
			$('#add_template').modal('hide');
		};

		$scope.addHaveModuleWebapp = function () {
			angular.forEach($scope.selectedModules, function (moduleVal, moduleKey) {
				delete $scope.groupNotHaveModuleWebapp[moduleVal.name];
				$scope.groupHaveModuleWebapp[moduleVal.name] = moduleVal;
			});
			$scope.selectedModules = [];
			$('#add_module_webapp').modal('hide');
		};

		$scope.addHaveModuleXzapp = function() {
			angular.forEach($scope.selectedModules, function(moduleVal, moduleKey){
				delete $scope.groupNotHaveModuleXzapp[moduleVal.name];
				$scope.groupHaveModuleXzapp[moduleVal.name] = moduleVal;
			});
			$scope.selectedModules = [];
			$('#add_module_xzapp').modal('hide');
		};

		$scope.addHaveModuleAliapp = function() {
			angular.forEach($scope.selectedModules, function(moduleVal, moduleKey){
				delete $scope.groupNotHaveModuleAliapp[moduleVal.name];
				$scope.groupHaveModuleAliapp[moduleVal.name] = moduleVal;
			});
			$scope.selectedModules = [];
			$('#add_module_aliapp').modal('hide');
		};

		$scope.addHaveModulePhoneapp = function () {
			angular.forEach($scope.selectedModules, function (moduleVal, moduleKey) {
				delete $scope.groupNotHaveModulePhoneapp[moduleVal.name];
				$scope.groupHaveModulePhoneapp[moduleVal.name] = moduleVal;
			});
			$scope.selectedModules = [];
			$('#add_module_phoneapp').modal('hide');
		};

		$scope.delHaveModule = function (module) {
			module.selected = false;
			delete $scope.groupHaveModuleApp[module.name];
			$scope.groupNotHaveModuleApp[module.name] = module;
			if (module.plugin != '') {
				angular.forEach($scope.groupHaveModuleApp, function (val) {
					if (val.main_module == module.name) {
						delete $scope.groupHaveModuleApp[val.name];
						$scope.groupNotHaveModuleApp[val.name] = val;
					}
				});
			}
		};

		$scope.delHaveModuleWxapp = function (module) {
			module.selected = false;
			delete $scope.groupHaveModuleWxapp[module.name];
			$scope.groupNotHaveModuleWxapp[module.name] = module;
		};

		$scope.delHaveModuleWebapp = function (module) {
			module.selected = false;
			delete $scope.groupHaveModuleWebapp[module.name];
			$scope.groupNotHaveModuleWebapp[module.name] = module;
		};

		$scope.delHaveModulePhoneapp = function (module) {
			module.selected = false;
			delete $scope.groupHaveModulePhoneapp[module.name];
			$scope.groupNotHaveModulePhoneapp[module.name] = module;
		};

		$scope.delHaveModuleXzapp = function(module) {
			module.selected = false;
			delete $scope.groupHaveModuleXzapp[module.name];
			$scope.groupNotHaveModuleXzapp[module.name] = module;
		};

		$scope.delHaveModuleAliapp = function(module) {
			module.selected = false;
			delete $scope.groupHaveModuleAliapp[module.name];
			$scope.groupNotHaveModuleAliapp[module.name] = module;
		};

		$scope.delHaveTemplate = function (template) {
			template.selected = false;
			delete $scope.groupHaveTemplate[template.name];
			$scope.groupNotHaveTemplate[template.name] = template;
		};

		$scope.cancel = function(divid) {
			angular.forEach($scope.selectedModules, function (module) {
				module.selected = false;
			});
			$scope.selectedModules = [];
			$scope.allmodulesel = false;
			$scope.allwxappsel = false;
			$scope.alltemplatesel = false;
			$scope.allwebappsel = false;
			$scope.allphoneappsel = false;
			$scope.allxzappsel = false;
			$scope.allaliappsel = false;
			$('#'+divid).modal('hide');
		};

		$scope.saveGroup = function () {
			var modules = [];
			angular.forEach($scope.groupHaveModuleApp, function (val, key) {
				modules.push(val.name);
			});
			var wxapp = [];
			angular.forEach($scope.groupHaveModuleWxapp, function (val, key) {
				wxapp.push(val.name);
			});

			var param = {
				'id': $scope.moduleGroup.id,
				'name': $scope.moduleGroup.name,
				'modules': modules,
				'wxapp': wxapp,
				'templates': $scope.groupHaveTemplate,
				'webapp': $scope.groupHaveModuleWebapp,
				'phoneapp' : $scope.groupHaveModulePhoneapp,
				'xzapp' : $scope.groupHaveModuleXzapp,
				'aliapp' : $scope.groupHaveModuleAliapp,
			};

			if (param.name === '' || param.name === undefined) {
				util.message('请输入套餐名', '', 'info');
				return false;
			}
			$http({
				method: 'POST',
				url: $scope.config.url,
				data: param,
				beforeSend: function () {
					$('.loader').show();
				},
				complete: function () {
					$('.loader').hide();
				}
			}).success(function (data) {
				if (data.message.errno == 1) {
					util.message(data.message.message);
					return false;
				} else {
					util.message('提交成功', data.redirect, 'success');
				}
			});
		};
	}])
    .controller('installedCtrl', ['$scope', '$http', '$compile', 'config', '$sce', function ($scope, $http, $compile, config, $sce) {
		$scope.config = config;
		$scope.isFounder = config.isFounder;
		$scope.letters = letterindex;
		$scope.moduleList = {};
		$scope.moduleinfo = {};
		$scope.upgradeInfo = {};
		$scope.checkUpgradeSuccess = false;
		$scope.search = {moduleName : '', letter : '全部', newVersion : '', newBranch : ''};
		var pageindex = 1, pagesize = 15, moduleListTotal = 0;
		$scope.welcome_module = config.welcome_module;
		//模块列表数据源
		$scope.moduleListSource = angular.copy(config.moduleList);

		//获取模块列表总数量
		for (i in $scope.moduleListSource) {
			moduleListTotal++;
		}

		//根据页数塞入模块数据 
		$scope.addModuleList = function(pageindex) {
			var i = -1;
			var start = (pageindex - 1) * pagesize;
			var isSearch = false;
			for (modulename in $scope.moduleListSource) {
				if ($scope.search.letter != '全部' && $scope.moduleListSource[modulename]['title_initial'] != $scope.search.letter) {
                    isSearch = true;
					continue;
				}
				if ($scope.search.moduleName && $scope.moduleListSource[modulename]['title'].indexOf($scope.search.moduleName) <= -1) {
                    isSearch = true;
					continue;
				}
				if ($scope.search.newVersion && !$scope.moduleListSource[modulename]['new_version']) {
                    isSearch = true;
					continue;
				}
				if ($scope.search.newBranch && !$scope.moduleListSource[modulename]['new_branch']) {
                    isSearch = true;
					continue;
				}
				if (!isSearch) {
                    i++;
                    if (i < start) {
                        continue;
                    }
                    if (i >= start + pagesize) {
                        break;
                    }
				}
				$scope.moduleList[modulename] = $scope.moduleListSource[modulename]
			}
			return false;
		}

		$scope.addModuleList(1);
		
		//进入页面时检查更新数据写入modules_cloud表
		$http.post($scope.config.checkUpgradeUrl).success(function (data) {
			for (modulename in data['message']['message']) {
				if (!$scope.moduleListSource[modulename]) {
					continue;
				}
				if (data['message']['message'][modulename]['new_version']) {
					$scope.moduleListSource[modulename]['new_version'] = true;
				}
				if (data['message']['message'][modulename]['new_branch']) {
					$scope.moduleListSource[modulename]['new_branch'] = true;
				}
			}
			$scope.checkUpgradeSuccess = true;
		});

		$scope.change_welcome_module = function(name) {
			if (name == $scope.welcome_module) {
				name = '';
			}
			$http.post(config.set_site_welcome_url, {'name' : name})
				.success(function(data) {
					if (data.message.errno == 0) {
						$scope.welcome_module = name;
						util.message('设置成功', '', 'success');
					} else {
						util.message(data.message.message, '', 'error');
						return false;
					}
				})
		};
		//模块列表下拉加载
		$scope.loadMore = function(url, pageindex, obj) {
			if (Math.ceil(moduleListTotal / pagesize) < pageindex) {
				return false;
			}
			$scope.moduleList = {};
			$scope.addModuleList(pageindex);
            //重新生成页码
            var totalPage = Math.ceil(moduleListTotal / pagesize);
            pageindex = 1*pageindex;
            var side = 4;
            var start = Math.max(1, pageindex - side);
            var end = Math.min(totalPage, pageindex + side);
            if (end - start < 2 * side + 1) {
                end = Math.min(totalPage, start + side * 2);
                start = Math.max(1, end - side * 2);
            }
            var liHtml = '<li>' + $('.js-pager li:first').html() + '</li>';
            for (var i = start; i <= end; i++ ) {
                liHtml += '<li><a href="javascript:;" page="' + i + '" ng-click="loadMore(\'' + url + '\',' + i + ')">' + i + '</a></li>';
            }
            if (pageindex != totalPage) {
                liHtml += '<li><a href="javascript:;" page="' + totalPage + '" ng-click="loadMore(\'' + url + '\',' + totalPage + ')">尾页</a></li>';
            }
            $('.js-pager ul').html($compile(liHtml)($scope));
            //选中当前页码
			$('.js-pager li').attr('class', '');
			$(".js-pager a[page='"+pageindex+"']").parent().attr('class', 'active');
			$('.js-pager .pager-nav').parent().attr('class', '');
		};

		$scope.searchLetter = function (letter) {
			//按字母搜索后，变更数据源数据
			$scope.moduleList = {};
			$scope.search.letter = letter;
			$scope.search.moduleName = '';
			//重新载入数据
			pageindex = 1;
			$scope.addModuleList(pageindex);
		};

		$scope.searchModuleName = function(event) {
			if (typeof event != 'undefined') {
				var keycode = window.event ? event.keyCode : event.which;
				if(keycode != 13){
					return false;
				}
			}
			//按模块名称搜索后，变更数据源数据
			$scope.moduleList = {};
			pageindex = 1;
			$scope.addModuleList(pageindex);
		};

		$scope.filter = function (condition) {
			if (condition == 'new_version') {
				$scope.search.newVersion = true;
			}
			if (condition == 'new_version') {
				$scope.search.newVersion = true;
			}
			//按模块名称搜索后，变更数据源数据
			$scope.moduleList = {};
			pageindex = 1;
			$scope.addModuleList(pageindex);
		}
	}])
	.controller('notInstalledCtrl', ['$scope', 'config', function ($scope, config) {
		$scope.letters = letterindex;
		$scope.module_list = config.module_list;
		$scope.support = config.support;
		$scope.searchLetter = function (letter) {
			$(':hidden[name="letter"]').val(letter);
			$('#search').click();
		};
	}])
	.controller('detailCtrl', ['$scope', '$http', 'config', function ($scope, $http, config) {
		$scope.config = config;
		$scope.isFounder = config.isFounder;
		$scope.receive_ban = config.receive_ban;
		$scope.moduleinfo = config.moduleInfo;
		$scope.subscribe = 2;
		$scope.checkupgrade = 0;
		$scope.show = config.show;
		$scope.editType = '';

		$http.post($scope.config.checkReceiveUrl, { 'module_name': $scope.moduleinfo.name }).success(function (data) {
			if (data.message.errno == 0) {
				$scope.subscribe = 1;
			}
		});
		
		$http.post($scope.config.getUpgradeInfoUrl, {'name': $scope.moduleinfo.name}).success(function (data) {
			if (data.message.errno != 0) {
				util.message(data.message.message);
			}
			if (data.message.message.upgrade == true || data.message.message.new_branch == 1) {
				$scope.checkupgrade = 1;
				$scope.upgradeInfo = data.message.message;

				if (data.message.message.from == 'cloud') {
					var time = new Date().getTime();
					time = time.toString().substr(0, 10);
					if ($scope.upgradeInfo['service_expiretime'] > 0 && time > $scope.upgradeInfo['service_expiretime']) {
						$scope.upgradeInfo['service_expire'] = true;
					} else {
						$scope.upgradeInfo['service_expire'] = false;
					}
				}
			}
		});

		$scope.changeShow = function (type) {
			$scope.show = type;
		}

		$scope.changeSwitch = function () {
			$http.post($scope.config.receiveBanUrl, { 'modulename': $scope.moduleinfo.name }).success(function (data) {
				if (data.message.errno == 0) util.message('更新成功！');
				$scope.moduleinfo.is_receive_ban = !$scope.moduleinfo.is_receive_ban;
			});
		}

		$scope.editModule = function (type, val) {
			$scope.moduleOriginal = {};
			$scope.moduleOriginal[type] = val;
			$scope.editType = type;
			if (type == 'preview' || type == 'logo') {
				$scope.changePicture(type);
			} else {
				$('#module-info').modal('show');
			}
		}

		$scope.changePicture = function (type) {
			require(['fileUploader'], function (fileUploader) {
				fileUploader.init(function (imgs) {
					$scope.moduleOriginal[type] = imgs.url;
					$scope.moduleinfo[type] = imgs.url;
					$scope.$apply($scope.moduleOriginal);
					$scope.save();
				}, { type: 'image', direct: true, multiple: false });
			});
		};

		$scope.delPicture = function (type) {
			$scope.moduleOriginal[type] = '';
		};
		$scope.upgrade = function (price, module, branch) {
			window.open("http://s.we7.cc/module-" + branch + ".html");
		};

		$scope.notice = function (expire, id, name) {
			var text = expire ? '升级服务已到期，请到商城<a class="color-default" target="_blank" href="http://s.we7.cc/module-' + id + '.html">续费。' : '确认升级到本分支的最高版本吗';
			if (expire) {
				util.message(text, '', 'info', '去续费', 'http://s.we7.cc/module-' + id + '.html');
				return false;
			}
			if (confirm(text)) {
				location.href = './index.php?c=cloud&a=process&m=' + name + '&is_upgrade=1';
			} else {
				return false;
			}
		}

		$scope.save = function () {
			$http.post($scope.config.saveModuleUrl, { 'moduleinfo': $scope.moduleOriginal, 'modulename': $scope.moduleinfo.name }).success(function (data) {
				if (data.message.errno == 0) {
					util.message('修改成功', '', 'success');
					$scope.moduleinfo[$scope.editType] = $scope.moduleOriginal[$scope.editType];
					if ($scope.editType == 'logo') {
						$scope.moduleinfo.logo = $scope.moduleOriginal.logo + "?v=" + new Date().getTime();
					}
					if ($scope.editType == 'preview') {
						$scope.moduleinfo.preview = $scope.moduleOriginal.preview + "?v=" + new Date().getTime();
					}
					$scope.$apply($scope.moduleinfo);
				} else {
					util.message('修改失败', '', 'fail');
				}
			});
		}

		change = function (element) {
			branch = element.data('id');
			$('#version-detail-' + branch).toggle();
			clas = element.find('i').prop('class') == 'wi wi-angle-down' ? 'wi wi-angle-up' : 'wi wi-angle-down';
			text = clas == 'wi wi-angle-down' ? '查看详情' : '收起';
			element.html(text + '<i class="' + clas + '"></i>');
		}
	}])
	.controller('templateCtrl', ['$scope', '$http', 'config', function ($scope, $http, config) {
		$scope.config = config;
		$scope.templateList = config.templateList;
		$scope.upgradeInfo = {};

		$scope.checkUpgrade = function () {
			$http.post($scope.config.url, { 'template': $scope.templateList }).success(function (data) {
				if (data.message.errno == 0) {
					$scope.templateList = data.message.message;
				}
			});
		}

		$scope.checkUpgrade();
		$scope.setUpgradeInfo = function (name) {
			$http.post($scope.config.get_upgrade_info_url, { 'name': name }).success(function (data) {
				if (data.message.errno == 0) {
					$scope.upgradeInfo = data.message.message;
					$('#upgradeInfo').modal('show');
				} else if (data.message.errno == 1) {
					util.message(data.message.message);
				}
			});
		}

		$scope.upgrade = function (price) {
			return confirm('本次升级需要花费' + price + '个交易币。确认升级？');
		};
	}])
	.controller('userModuleDisplayCtrl', ['$scope', '$http', '$timeout', 'config', function ($scope, $http, $timeout, config) {
		var moduleArr = config.userModule ? Object.keys(config.userModule) : {};
		$scope.userModule = [];
		$scope.alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '全部'];
		$scope.activeLetter = config.activeLetter;
		$scope.searchKeyword = '';
		$scope.showAccounts = function (ev, name) {
			require(['underscore'], function () {
				var index = _.findIndex($scope.userModule, { 'name': name });
				$http.post(config.links.moduleAccounts, { 'module_name': name })
					.success(function (data) {
						$scope.userModule[index].accounts = data.message.message;
					})
				var cutSelect = $(ev.target).parents('.mask').next('.cut-select');
				if (cutSelect.css('display') == 'none') {
					cutSelect.css('display', 'block');
					cutSelect.parent('.module-list-item').siblings().find('.cut-select').css('display', 'none');
				} else {
					cutSelect.css('display', 'none');
				}
			});
		};

		$scope.hideSelect = function (ev) {
			$(ev.target).css('display', 'none');
		};

		$scope.searchKeywordModule = function () {
			if ($scope.searchKeyword) {
				$scope.keywordModule = [];
				angular.forEach(config.userModule, function (val, key) {
					if (val.title.match($scope.searchKeyword)) {
						$scope.keywordModule.push(val);
					}
				});
				$scope.userModule = $scope.keywordModule;
			} else {
				$scope.userModule = config.userModule;
			}
		};

		$scope.searchLetterModule = function (letter) {
			$scope.activeLetter = letter;
			if ($scope.activeLetter == '全部') {
				$scope.userModule = config.userModule;
			} else {
				$scope.letterModule = [];
				angular.forEach(config.userModule, function (val, key) {
					if (val.title_initial == $scope.activeLetter) {
						$scope.letterModule.push(val);
					}
				});
				$scope.userModule = $scope.letterModule;
			}
		};

		$scope.getall_last_switch = function () {
			$http.post(config.links.getall_last_switch)
				.success(function (data) {
					var last_switch = data.message.message;
					angular.forEach(config.userModule, function (val, key) {
						config.userModule[key].last_switch = last_switch[val.name];
					})
				})
		};

		$scope.addMoreModule = function (pagenum) {
			var pindex = Math.max(1, parseInt(pagenum));
			var psize = 15;
			var start = (pindex - 1) * psize;
			var index = 0;
			if (moduleArr.length < start) {
				return false;
			}
			angular.forEach(config.userModule, function (val, key) {
				if (index >= start && index < (start + psize)) {
					$scope.userModule.push(val);
				}
				index++;
			});
			return true;
		};

		$scope.currentPage = 1;
		$scope.loadMore = function () {
			$scope.addMoreModule($scope.currentPage);
			$scope.currentPage++;
		};
	}])
	.controller('subscribeCtrl', ['$scope', '$http', 'config', function ($scope, $http, config) {
		$scope.subscribe_module = config.subscribe_module;
		$scope.types = config.types;
		$scope.change_ban_url = config.change_ban_url;
		$scope.check_receive_url = config.check_receive_url;

		$scope.change_ban = function (modulename) {
			$http.post($scope.change_ban_url, { 'modulename': modulename }).success(function (data) {
				if (data.message.errno != 0) {
					util.message(data.message.message, '', 'error');
				} else {
					$scope.subscribe_module[modulename].receive_ban = $scope.subscribe_module[modulename].receive_ban == 1 ? 0 : 1;
				}
			});
		};

		angular.forEach($scope.subscribe_module, function (subscribe, module_name) {
			$http.post($scope.check_receive_url, { 'module_name': module_name }).success(function (data) {
				if (data.message.errno == 0) {
					$scope.subscribe_module[module_name].subscribe_success = 1;
				}
			});
		});
	}])
	;