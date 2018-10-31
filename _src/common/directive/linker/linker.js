angular.module('we7app').directive('we7Linker', ['$http', '$templateCache', function($http, $templateCache){
	var html = '<inline src="editor.html" />';
	var templateCmsHeader = $templateCache.get('directive-linker-cms-header-inline.html');
	var templateCmsContent = $templateCache.get('directive-linker-cms-content-inline.html');
	var templateCmsArticleItem = $templateCache.get('directive-linker-cms-article-item-inline.html');
	var templateCmsCateItem = $templateCache.get('directive-linker-cms-cate-item-inline.html');
	var templateNewsContent = $templateCache.get('directive-linker-news-content-inline.html');
	var templateNewsItem = $templateCache.get('directive-linker-news-item-inline.html');
	var templatePageContent = $templateCache.get('directive-linker-page-content-inline.html');
	var templatePageItem = $templateCache.get('directive-linker-page-item-inline.html');
	var templateMapContent = $templateCache.get('directive-linker-map-content-inline.html');
	var templateTelContent = $templateCache.get('directive-linker-tel-content-inline.html');
	var directive = {
		'templateUrl' : 'directive-linker-linker.html',
		'scope' : {
			'url' : '=we7MyUrl',
			'title' : '=we7MyTitle'
		},
		'link' : function($scope, element, attr) {
			element.find('.input-group-btn').mouseover(function(event){
				clearTimeout($scope.timer);
				element.find('.dropdown-menu').show();
			}).mouseout(function(){
				$scope.timer = setTimeout(function(){
					element.find('.dropdown-menu').hide();
				}, 500);
			});
			element.find('.dropdown-menu').mouseover(function() {
				clearTimeout($scope.timer);
				element.find('.dropdown-menu').show();
			}).mouseout(function(){
				$scope.timer = setTimeout(function(){
					element.find('.dropdown-menu').hide();
				}, 500);
			});
			$scope.addLink = function(url, title) {
				$scope.url = url;
				if (title) {
					$scope.title = title;
				}
			};
			$scope.searchSystemLinker = function() {
				$scope.modalobj = util.dialog('请选择链接',['./index.php?c=utility&a=link&callback=selectLinkComplete'], '',{containerName:'link-search-system'});
				$scope.modalobj.modal({'keyboard': false});
				$scope.modalobj.find('.modal-body').css({'height':'680px','overflow-y':'auto' });
				$scope.modalobj.modal('show');
				window.selectLinkComplete = function(link, title){
					$scope.addLink(link, title);
					$scope.$apply('url', 'title');
					$scope.modalobj.modal('hide');
				};
			};
			$scope.searchCmsLinker = function(page) {
				var html = {};
				html['header'] = templateCmsHeader;
				html['content'] = templateCmsContent;
				html['footer'] = '';
				html['articleitem'] = templateCmsArticleItem;
				html['cateitem'] = templateCmsCateItem;
				if (!$('#link-search-cms')[0]) {
					$scope.modalobj = util.dialog(html['header'], html['content'], html['footer'] ,{'containerName' : 'link-search-cms'});
					$scope.modalobj.find('.modal-body').css({'height':'680px','overflow-y':'auto' });
					$scope.modalobj.modal('show');
					$scope.modalobj.on('hidden.bs.modal', function(){$scope.modalobj.remove();});
					$('#link-search-cms').data('modal', $scope.modalobj);
				} else {
					$scope.modalobj = $('#link-search-cms').data('modal');
				}
				page = page || 1;
				var articleKeyword = $('#articlelist .article-list-input').val();
				$http.get('./index.php?c=utility&a=link&do=articlelist' + '&page=' + page + '&keyword=' + articleKeyword).success(function(result, status, headers, config){
					var data = {'items' : []};
					result.message = result.message.message;
					if (result.message.list) {
						for (i in result.message.list) {
							data.items.push({
								'title' : result.message.list[i].title,
								'id' : result.message.list[i].id,
								'uniacid' : result.message.list[i].uniacid,
								'attachment' : result.message.list[i].thumb_url,
								'createtime' : result.message.list[i].createtime,
							});
						}
						$scope.modalobj.find('#articlelist tbody').html(_.template(html['articleitem'])(data));
						$scope.modalobj.find('#pager').html(result.message.pager);
						$scope.modalobj.find('#pager .pagination li[class!=\'active\'] a').click(function(){
							$scope.searchCmsLinker($(this).attr('page'));
							return false;
						});
						$scope.modalobj.find('#articlelist .input-group-btn').click(function(){
							$scope.searchCmsLinker();
							return false;
						});
						$scope.modalobj.find('.js-btn-select').click(function(){
							$scope.addLink($(this).attr('js-url'), $(this).attr('js-title'));
							$scope.$apply('url', 'title');
							$scope.modalobj.modal('hide');
						});
					}
				});
				var categoryKeyword = $('#category .category-list-input').val();
				$http.get('./index.php?c=utility&a=link&do=catelist' + '&page=' + page + '&keyword=' + categoryKeyword).success(function(result, status, headers, config){
					var data = {'items' : []};
					result.message = result.message.message;
					if (result.message) {
						for (i in result.message) {
							data.items.push({
								'id' : result.message[i].id,
								'uniacid' : result.message[i].uniacid,
								'name' : result.message[i].name,
								'children' : result.message[i].children,
							});
						}
						$scope.modalobj.find('#category tbody').html(_.template(html['cateitem'])(data));
						$scope.modalobj.find('#category .input-group-btn').click(function(){
							$scope.searchCmsLinker();
							return false;
						});
						$scope.modalobj.find('.js-btn-select').click(function(){
							$scope.addLink($(this).attr('js-url'), $(this).attr('js-title'));
							$scope.$apply('url', 'title');
							$scope.modalobj.modal('hide');
						});
					}
				});
			};
			$scope.searchNewsLinker = function(page) {
				var html = {};
				html['content'] = templateNewsContent;
				html['footer'] = '';
				html['newsitem'] = templateNewsItem;
				if (!$('#link-search-news')[0]) {
					$scope.modalobj = util.dialog(html['header'], html['content'], html['footer'] ,{'containerName' : 'link-search-news'});
					$scope.modalobj.find('.modal-body').css({'height':'680px','overflow-y':'auto' });
					$scope.modalobj.modal('show');
					$scope.modalobj.on('hidden.bs.modal', function(){$scope.modalobj.remove();});
					$('#link-search-news').data('modal', $scope.modalobj);
				} else {
					$scope.modalobj = $('#link-search-news').data('modal');
				}
				page = page || 1;
				var keyword = $('#newslist .news-list-input').val();
				$http.get('./index.php?c=utility&a=link&do=newslist' + '&page=' + page + '&keyword=' + keyword).success(function(result, status, headers, config){
					var data = {'items' : []};
					result.message = result.message.message;
					if (result.message.list) {
						for (i in result.message.list) {
							data.items.push({
								'title' : result.message.list[i].title,
								'id' : result.message.list[i].id,
								'uniacid' : window.sysinfo['uniacid'],
								'attachment' : result.message.list[i].thumb_url,
								'createtime' : result.message.list[i].createtime,
								'url' : result.message.list[i].url,
							});
						}
						$scope.modalobj.find('#newslist tbody').html(_.template(html['newsitem'])(data));
						$scope.modalobj.find('#pager').html(result.message.pager);
						$scope.modalobj.find('#pager .pagination li[class!=\'active\'] a').click(function(){
							$scope.searchNewsLinker($(this).attr('page'));
							return false;
						});
						$scope.modalobj.find('#newslist .input-group-btn').click(function(){
							$scope.searchNewsLinker();
							return false;
						});
						$scope.modalobj.find('.js-btn-select').click(function(){
							$scope.addLink($(this).attr('js-url'), $(this).attr('js-title'));
							$scope.$apply('url', 'title');
							$scope.modalobj.modal('hide');
						});
					}
				});
			};
			$scope.searchPageLinker = function(page) {
				var html = {};
				html['content'] = templatePageContent;
				html['footer'] = '';
				html['pageItem'] = templatePageItem;
				if (!$('#link-search-page')[0]) {
					$scope.modalobj = util.dialog(html['header'], html['content'], html['footer'] ,{'containerName' : 'link-search-page'});
					$scope.modalobj.find('.modal-body').css({'height':'680px','overflow-y':'auto' });
					$scope.modalobj.modal('show');
					$scope.modalobj.on('hidden.bs.modal', function(){$scope.modalobj.remove();});
					$('#link-search-page').data('modal', $scope.modalobj);
				} else {
					$scope.modalobj = $('#link-search-page').data('modal');
				}
				page = page || 1;
				var keyword = $('#pageList .page-list-input').val();
				$http.get('./index.php?c=utility&a=link&do=pagelist&' + '&page=' + page + '&keyword=' + keyword).success(function(result, status, headers, config){
					var data = {'items' : []};
					result.message = result.message.message;
					if (result.message.list) {
						for (i in result.message.list) {
							data.items.push({
								'title' : result.message.list[i].title,
								'id' : result.message.list[i].id,
								'uniacid' : window.sysinfo['uniacid'],
								'createtime' : result.message.list[i].createtime,
							});
						}
						$scope.modalobj.find('#pageList tbody').html(_.template(html['pageItem'])(data));
						$scope.modalobj.find('#pager').html(result.message.pager);
						$scope.modalobj.find('#pager .pagination li[class!=\'active\'] a').click(function(){
						$scope.searchPageLinker($(this).attr('page'));
							return false;
						});
						$scope.modalobj.find('#pageList .input-group-btn').click(function(){
							$scope.searchPageLinker();
							return false;
						});
						$scope.modalobj.find('.js-btn-select').click(function(){
							$scope.addLink($(this).attr('js-url'), $(this).attr('js-title'));
							$scope.$apply('url', 'title');
							$scope.modalobj.modal('hide');
						});
					}
				});
			};
			$scope.searchMapPosLinker = function() {
				var html = {};
				html['content'] = templateMapContent;
				$scope.modalobj = util.dialog(html['content']);
				$scope.modalobj.modal('show');
				$scope.modalobj.find('#getnav').click(function(){
					$scope.addLink('https://api.map.baidu.com/marker?location='+$('#navlat').val()+','+$('#navlng').val()+'&title='+$('#navtitle').val()+'&name='+$('#navtitle').val()+'&output=html&src=we7', $('#navtitle').val());
					$scope.$apply('url', 'title');
					$scope.modalobj.modal('hide');
				});
			};
			$scope.addTelLinker = function() {
				var html = {};
				html['content'] = templateTelContent;
				$scope.modalobj = util.dialog('一键拨号', html['content']);
				$scope.modalobj.modal('show');
				$scope.modalobj.find('.btn-primary').click(function(){
					$scope.addLink('tel:' + $scope.modalobj.find('#telphone').val(), '');
					$scope.$apply('url', 'title');
					$scope.modalobj.modal('hide');
				});
			};
		}
	};
	return directive;
}]);