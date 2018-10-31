angular.module('materialApp', ['we7app']);
angular.module('materialApp')
.directive('ngMyEditor', function(){
	var editor = {
		'scope' : {
			'value' : '=ngMyValue',
			'imguploadurl' : '@ngMyUpurl'
		},
		'template' : '<textarea id="editor" style="height:600px;width:100%;"></textarea>',
		'link' : function ($scope, element, attr) {
			if(!element.data('editor')) {
				util.editor('editor',{
					allow_upload_video : 0,
					callback : function(elm, editor) {
						element.data('editor', editor);
						editor.addListener('contentChange', function() {
							$scope.value = editor.getContent();
							$scope.$root.$$phase || $scope.$apply('value');
						});
						editor.addListener('ready', function(){
							if (editor && editor.getContent() != $scope.value) {
								editor.setContent($scope.value);
							}
							$scope.$watch('value', function (value) {
								if (editor && editor.getContent() != value) {
									editor.setContent(value ? value : '');
								}
							});
						});
						editor.setOpt('imageActionName', 'uploadimage');
						editor.setOpt('imageFieldName', 'file');
						editor.setOpt('imageUrlPrefix', '');
						UE.Editor.prototype._bkGetActionUrl = UE.Editor.prototype.getActionUrl;
						UE.Editor.prototype.getActionUrl = function(action) {
							if (action == 'uploadimage') {
								return $scope.imguploadurl;
							}  else {
								return this._bkGetActionUrl.call(this, action);
							} 
						}
					}
				}, true)
			}
		}
	};
	return editor;
})
.controller('materialDisplay', ['$scope', '$http', 'config', function($scope, $http, config) {
	$scope.materialList = config.materialList;
	$scope.groups = config.group;
	$scope.config = config;
	$scope.group ='';
	$scope.materialType = '';
	$scope.materialId = '';
	$scope.syncNews = config.syncNews;
	$scope.hidenbutton = 0;
	$scope.typeName = config.typeName;
	$scope.sync = function(type, pageindex, total, wechat_existid, original_newsid) {
		$(window).bind('beforeunload',function(){
			return '您输入的内容尚未保存，确定离开此页面吗？';
		});
		if (pageindex == undefined) {
			util.message('正在同步素材，请勿关闭浏览器...');
		} else {
			util.message('已同步'+(parseInt(((pageindex-1)/total)*100))+'%，请勿关闭浏览器...');
		}
		$http.post(config.sync_url, {'type' : type, 'pageindex' : pageindex, 'total' : total, 'wechat_existid' : wechat_existid, 'original_newsid' : original_newsid}).success(function(data) {
			if (data.message.errno == 0) {
				$(window).unbind('beforeunload');
				util.message('同步素材成功', './index.php?c=platform&a=material&type='+type, 'success');
			} else {
				sync_info = data.message.message;
				$scope.sync(sync_info.type, sync_info.pageindex, sync_info.total, sync_info.wechat_existid, sync_info.original_newsid);
			}
		});
	};

	if ($scope.syncNews == 1) {
		$scope.sync('news');
	}

	$scope.upload = function(type, multiple, isWechat) {
		require(['fileUploader'],function(fileUploader){
			fileUploader.init(function(){
				util.message('上传成功', location.href, 'success');
			}, {type: type, direct: true, multiple: multiple, isWechat: isWechat, typeName:$scope.typeName});
		});
	}

	$scope.del_material = function(type, material_id, server) {
		if (!confirm('删除不可恢复确认删除吗？')) {
			return false;
		}
		$http.post(config.del_url, {'material_id' : material_id, 'type' : type, 'server' : server}).success(function(data) {
			if (data.message.errno != 0) {
				util.message('删除失败,具体原因:'+data.message.message, '', 'info');
			} else {
				util.message('删除成功', './index.php?c=platform&a=material&type='+type+(server == 'local'? '&islocal=true' : ''), 'success');
			}
		});
	};

	$scope.checkGroup = function(type, id) {
		$('#check-group').modal('show');
		$scope.materialType = type;
		$scope.materialId = id;
		$scope.group = '';
	}

	$scope.transToWechat = function(type, material_id){
		util.message('素材转换将在后台运行，成功后后自动刷新页面，请勿关闭浏览器...');
		$http.post(config.trans_url, {'material_id' : material_id}).success(function(data) {
			if (data.message.errno != 0) {
				util.message('转换失败,具体原因:'+data.message.message, '', 'info');
			} else {
				$scope.sync(type);
			}
		});
	}

	$scope.newsToWechat = function(material_id){
		util.message('素材转换将在后台运行，成功后后自动刷新页面，请勿关闭浏览器...');
		$http.post($scope.config.postwechat_url, {'material_id' : material_id}).success(function(data) {
			if (data.message.errno == 0) {
				util.message('已保存', './index.php?c=platform&a=material', 'success');
			} else {
				alert('创建图文失败'+data.message.message);
			}
		});
	}

	$scope.sendMaterial = function() {
		$http.post($scope.config.send_url, {type : $scope.materialType, id : $scope.materialId, 'group' : $scope.group}).success(function(data) {
			if (data.message.errno == 1) {
				util.message(data.message.message, '', 'info');
			} else {
				util.message('群发成功', './index.php?c=platform&a=material&type='+$scope.materialType, 'success');
			}
		});
	}
	$scope.createNew = function(new_type){
		var url = $scope.config.create_new_url + "&new_type=" + new_type;
		window.location = url;
	}
	$scope.choiceSendType = function(url, type, media_id) {
		$(".web-mobile-choice-type a[class = 'we7-margin-bottom']").attr("data-url", url);
		$(".web-mobile-choice-type a[class = 'we7-mobile-material-preview']").attr("data-type", type);
		$(".web-mobile-choice-type a[class = 'we7-mobile-material-preview']").attr("data-media-id", media_id);
	}
	$scope.wabPreview = function() {
		$('#modalWechatView').modal('hide');
		window.open($(".web-mobile-choice-type a[class = 'we7-margin-bottom']").attr("data-url"), '_blank');
	}
	$scope.mobilePreview = function() {
		var media_id = $(".web-mobile-choice-type a[class = 'we7-mobile-material-preview']").attr("data-media-id");
		var type = $(".web-mobile-choice-type a[class = 'we7-mobile-material-preview']").attr("data-type");
		$('.material-wechat-view').addClass('hidden');
		$("#weixin-dialog").removeClass('hidden');
		$('#modalWechatView .btn-send').unbind().click(function(){
			var wxname = $.trim($('#modalWechatView #wxname').val());
			if(!wxname) {
				util.message('微信号不能为空', '', 'error');
				return false;
			}
			$("#weixin-dialog").addClass('hidden');
			$('.material-wechat-view').removeClass('hidden');
			$('#modalWechatView #wxname').val('');
			$('#modalWechatView').modal('hide');
			$http.post('./index.php?c=platform&a=mass&do=preview', {media_id: media_id, wxname: wxname, type: type})
				.success(function(data){
					if(data.message.errno != 0) {
						util.message(data.message.message);
					} else {
						util.message('发送成功', '', 'success');
					}
				});
			return false;
		});
	}
	$scope.previewBack = function() {
		$("#weixin-dialog").addClass('hidden');
		$('.material-wechat-view').removeClass('hidden');
	}
}])
.controller('materialAdd', ['$scope', 'material', '$http', '$timeout',  function($scope, material, $http, $timeout) {
	$scope.config = material;
	$scope.operate = material.operate;
	$scope.model = material.model;
	$scope.new_type = material.new_type;
	$scope.hidenbutton = material.new_type == 'reply' ? 0 : 1;
	$scope.typeName = material.typeName;
	//改变素材的选中状态
	$scope.changeClass = function() {
		angular.forEach($scope.materialList, function(value, key) {
			if (key == '0') {
				$scope.materialList[key]['class'] = $scope.activeIndex == key ?'cover-appmsg-item active' : 'cover-appmsg-item';
			} else {
				$scope.materialList[key]['class'] = $scope.activeIndex == key ?'appmsg-item active' : 'appmsg-item';
			}
		});
	}
	$scope.tomedia = function(url) {
		var tomedia = ''
		$.ajax({'url' : material.url, 'async' : false, 'data' : {'url' : url}, 'success' : function(data) {
			var data = $.parseJSON(data);
			tomedia = data.message.message;
		}});
		return tomedia;
	};
	$scope.changeOrder = function(order, index) {
		material = {};
		if (order == 'down') {
			material = $scope.materialList[index];
			$scope.materialList[index] = $scope.materialList[index+1];
			$scope.materialList[index+1] = material;
		} else {
			material = $scope.materialList[index];
			$scope.materialList[index] = $scope.materialList[index-1];
			$scope.materialList[index-1] = material;
		}
	};
	$scope.deleteMaterial = function(index) {
		if (confirm('确定要删除吗？')) {
			$scope.materialList.splice(index, 1);
			$scope.activeIndex = $scope.activeIndex - 1;
		}
	}
	//改变当前选中的素材
	$scope.changeIndex = function(index) {
		$scope.activeIndex = index;
		$scope.changeClass();
	}
	//添加素材
	$scope.addMaterial = function() {
		if ($scope.materialList ==  undefined) {
			$scope.materialList = [];
			$scope.activeIndex = 0;
		} else {
			$scope.activeIndex = $scope.materialList.length ;
		}
		$scope.materialList.push({
			id: '',
			title: '',
			author: '',
			thumb: '',
			media_id: '',
			displayorder: '0',
			digest: '',
			content: '',
			content_source_url: '',
			show_cover_pic: 0,
			class : ''
		});
		$scope.changeClass();
	};
	//进入图文编辑页先判断是新增还是编辑（编辑图文要把图文素材所包含所有图文列出来）
	if ($scope.operate == 'add' && $scope.config.type != 'reply') {
		$scope.addMaterial();
	} else {
		$scope.activeIndex = 0;
		$scope.materialList = [];
		angular.forEach(material.materialList, function(value, key) {
			value.thumb_url = $scope.tomedia(value.thumb_url);
			$scope.materialList[key] = {
				id: value.id,
				title: value.title,
				author: value.author,
				thumb: value.thumb_url,
				media_id: value.thumb_media_id,
				displayorder: key,
				digest: value.digest,
				content: value.content,
				content_source_url: value.content_source_url,
				url: value.url,
				show_cover_pic: isNaN(Number(value.show_cover_pic))? 0 : Number(value.show_cover_pic),
				class : ''
			};
		});
		$scope.changeClass();
	}
	//图文素材选取图片
	$scope.pickPicture = function (type) {
		isWechat = type == 'wechat' ? true : false;
		require(['fileUploader'],function(fileUploader){
			fileUploader.init(function(imgs){
				$scope.materialList[$scope.activeIndex].thumb = imgs.url;
				$scope.materialList[$scope.activeIndex].media_id = imgs.media_id;
				$scope.$apply();
			}, {type: 'image', direct: true, multiple: false, isWechat: isWechat,　typeName: $scope.typeName,
				image_limit: $scope.config.image_limit,
				voice_limit: $scope.config.voice_limit,
				video_limit: $scope.config.video_limit
			});
		});
	}
	//更新正文图片显示状态
	$scope.updateSelection = function () {
		$scope.materialList[$scope.activeIndex].show_cover_pic = isNaN(Number(!$scope.materialList[$scope.activeIndex].show_cover_pic))? 0 : Number(!$scope.materialList[$scope.activeIndex].show_cover_pic);
	}
	//编辑完成图文素材，保存上传图文素材
	$scope.saveNews = function(location) {
		news = [];
		var errorIndex = '';
		var errorMsg = '';
		angular.forEach($scope.materialList, function(material, key) {
			if (material.title == '') {
				errorIndex = key;
				errorMsg = '请输入标题后,再点击保存按钮';
			} else if (material.content == '' && (location == 'wechat' || $scope.new_type == 'reply')) {
				errorIndex = key;
				errorMsg = '请输入一段正文,再点击保存按钮';
			} else {
				if (material.content == '' && location == 'wechat') {
					errorIndex = key;
					errorMsg = '图文内容中图片上传失败，请重新上传';
				} else {
					material.displayorder = key+1;
					news[key] = material;
				}
			}
		});
		if (errorIndex !== '') {
			$scope.activeIndex = errorIndex;
			$scope.changeClass();
			alert(errorMsg);
			return false;
		}
		util.message('正在生成图文消息，请勿关闭浏览器...');
		var attach_id = $scope.config.operate == 'add' ? '' : $scope.config.materialList[0]['attach_id'];
		$http.post($scope.config.newsUpload_url, {'news' : news, 'operate' : $scope.operate, 'attach_id' : attach_id, 'type' : $scope.config.type, 'target' : location, 'news_rid' : $scope.config.news_rid}).success(function(data) {
			if (data.message.errno == 0) {
				util.message('已保存', $scope.config.msg_url, 'success');
			} else {
				alert('创建图文失败'+data.message.message);
			}
		});
	};

	//导入文章
	//当前编辑的回复项目的索引
	$scope.exportFromCms = function() {
		$scope.searchCms();
	}
	$scope.searchCms = function(page) {
		var html = {};
		html['header'] = '<ul role="tablist" class="nav nav-pills" style="font-size:14px; margin-top:-20px;">'+
			'	<li role="presentation" class="active" id="li_goodslist"><a data-toggle="tab" role="tab" aria-controls="articlelist" href="#articlelist">文章列表</a></li>'+
			'</ul>';
		html['content'] =
			'<div class="tab-content">'+
			'<div id="articlelist" class="tab-pane active" role="tabpanel">' +
			'	<table class="table table-hover">' +
			'		<thead class="navbar-inner">' +
			'			<tr>' +
			'				<th style="width:40%;">标题</th>' +
			'				<th style="width:30%">创建时间</th>' +
			'				<th style="width:30%; text-align:right">' +
			'					<div class="input-group input-group-sm hide">' +
			'						<input type="text" class="form-control">' +
			'						<span class="input-group-btn">' +
			'							<button class="btn btn-default" type="button"><i class="fa fa-search"></i></button>' +
			'						</span>' +
			'					</div>' +
			'				</th>' +
			'			</tr>' +
			'		</thead>' +
			'		<tbody></tbody>'+
			'	</table>'+
			'	<div id="pager" style="text-align:center;"></div>'+
			'</div>'+
			'</div>';
		html['footer'] = '';
		html['articleitem'] =
			'<%_.each(list, function(item) {%> \n' +
			'<tr>\n' +
			'	<td><a href="#" data-cover-attachment-url="<%=item.attachment%>" title="<%=item.title%>"><%=item.title%></a></td>\n' +
			'	<td><%=item.createtime%></td>\n' +
			'	<td class="text-right">\n' +
			'		<button class="btn btn-default js-btn-select" js-id="<%=item.id%>">选取</button>\n' +
			'	</td>\n' +
			'</tr>\n' +
			'<%});%>\n';
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
		$http.get('./index.php?c=utility&a=link&do=articlelist' + '&page=' + page).success(function(result, status, headers, config){
			if (result.message.message.list) {
				$scope.modalobj.find('#articlelist').data('articles', result.message.message.list);
				$scope.modalobj.find('#articlelist tbody').html(_.template(html['articleitem'])(result.message.message));
				$scope.modalobj.find('#pager').html(result.message.message.pager);
				$scope.modalobj.find('#pager .pagination li[class!=\'active\'] a').click(function(){
					$scope.searchCms($(this).attr('page'));
					return false;
				});
				$scope.modalobj.find('.js-btn-select').click(function(){
					$scope.addCms($(this).attr('js-id'));
					$scope.$apply();
					$scope.modalobj.modal('hide');
				});
			}
		});
	};
	$scope.addCms = function(id) {
		var article =$scope.modalobj.find('#articlelist').data('articles')[id];
		$scope.materialList[$scope.activeIndex].title = article.title;
		$scope.materialList[$scope.activeIndex].thumb = article.thumb_url;
		$scope.materialList[$scope.activeIndex].author = article.author;
		$scope.materialList[$scope.activeIndex].incontent = article.incontent == 1;
		$scope.materialList[$scope.activeIndex].description = article.description;
		$scope.materialList[$scope.activeIndex].content = article.content;
		$scope.materialList[$scope.activeIndex].content_source_url = article.linkurl;
		$scope.materialList[$scope.activeIndex].detail = article.content != '';
	};
}])