angular.module('materialApp', ['we7app']);
angular.module('materialApp').directive('ngMyEditor', function () {
  var editor = {
      'scope': {
        'value': '=ngMyValue',
        'imguploadurl': '@ngMyUpurl'
      },
      'template': '<textarea id="editor" style="height:600px;width:100%;"></textarea>',
      'link': function ($scope, element, attr) {
        if (!element.data('editor')) {
          util.editor('editor', {
            allow_upload_video: 0,
            callback: function (elm, editor) {
              element.data('editor', editor);
              editor.addListener('contentChange', function () {
                $scope.value = editor.getContent();
                $scope.$root.$$phase || $scope.$apply('value');
              });
              editor.addListener('ready', function () {
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
              UE.Editor.prototype.getActionUrl = function (action) {
                if (action == 'uploadimage') {
                  return $scope.imguploadurl;
                } else {
                  return this._bkGetActionUrl.call(this, action);
                }
              };
            }
          }, true);
        }
      }
    };
  return editor;
}).controller('materialDisplay', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.materialList = config.materialList;
    $scope.groups = config.group;
    $scope.config = config;
    $scope.group = '';
    $scope.materialType = '';
    $scope.materialId = '';
    $scope.syncNews = config.syncNews;
    $scope.hidenbutton = 0;
    $scope.typeName = config.typeName;
    $scope.sync = function (type, pageindex, total, wechat_existid, original_newsid) {
      $(window).bind('beforeunload', function () {
        return '\u60a8\u8f93\u5165\u7684\u5185\u5bb9\u5c1a\u672a\u4fdd\u5b58\uff0c\u786e\u5b9a\u79bb\u5f00\u6b64\u9875\u9762\u5417\uff1f';
      });
      if (pageindex == undefined) {
        util.message('\u6b63\u5728\u540c\u6b65\u7d20\u6750\uff0c\u8bf7\u52ff\u5173\u95ed\u6d4f\u89c8\u5668...');
      } else {
        util.message('\u5df2\u540c\u6b65' + parseInt((pageindex - 1) / total * 100) + '%\uff0c\u8bf7\u52ff\u5173\u95ed\u6d4f\u89c8\u5668...');
      }
      $http.post(config.sync_url, {
        'type': type,
        'pageindex': pageindex,
        'total': total,
        'wechat_existid': wechat_existid,
        'original_newsid': original_newsid
      }).success(function (data) {
        if (data.message.errno == 0) {
          $(window).unbind('beforeunload');
          util.message('\u540c\u6b65\u7d20\u6750\u6210\u529f', './index.php?c=platform&a=material&type=' + type, 'success');
        } else {
          sync_info = data.message.message;
          $scope.sync(sync_info.type, sync_info.pageindex, sync_info.total, sync_info.wechat_existid, sync_info.original_newsid);
        }
      });
    };
    if ($scope.syncNews == 1) {
      $scope.sync('news');
    }
    $scope.upload = function (type, multiple, isWechat) {
      require(['fileUploader'], function (fileUploader) {
        fileUploader.init(function () {
          util.message('\u4e0a\u4f20\u6210\u529f', location.href, 'success');
        }, {
          type: type,
          direct: true,
          multiple: multiple,
          isWechat: isWechat,
          typeName: $scope.typeName
        });
      });
    };
    $scope.del_material = function (type, material_id, server) {
      if (!confirm('\u5220\u9664\u4e0d\u53ef\u6062\u590d\u786e\u8ba4\u5220\u9664\u5417\uff1f')) {
        return false;
      }
      $http.post(config.del_url, {
        'material_id': material_id,
        'type': type,
        'server': server
      }).success(function (data) {
        if (data.message.errno != 0) {
          util.message('\u5220\u9664\u5931\u8d25,\u5177\u4f53\u539f\u56e0:' + data.message.message, '', 'info');
        } else {
          util.message('\u5220\u9664\u6210\u529f', './index.php?c=platform&a=material&type=' + type + (server == 'local' ? '&islocal=true' : ''), 'success');
        }
      });
    };
    $scope.checkGroup = function (type, id) {
      $('#check-group').modal('show');
      $scope.materialType = type;
      $scope.materialId = id;
      $scope.group = '';
    };
    $scope.transToWechat = function (type, material_id) {
      util.message('\u7d20\u6750\u8f6c\u6362\u5c06\u5728\u540e\u53f0\u8fd0\u884c\uff0c\u6210\u529f\u540e\u540e\u81ea\u52a8\u5237\u65b0\u9875\u9762\uff0c\u8bf7\u52ff\u5173\u95ed\u6d4f\u89c8\u5668...');
      $http.post(config.trans_url, { 'material_id': material_id }).success(function (data) {
        if (data.message.errno != 0) {
          util.message('\u8f6c\u6362\u5931\u8d25,\u5177\u4f53\u539f\u56e0:' + data.message.message, '', 'info');
        } else {
          $scope.sync(type);
        }
      });
    };
    $scope.newsToWechat = function (material_id) {
      util.message('\u7d20\u6750\u8f6c\u6362\u5c06\u5728\u540e\u53f0\u8fd0\u884c\uff0c\u6210\u529f\u540e\u540e\u81ea\u52a8\u5237\u65b0\u9875\u9762\uff0c\u8bf7\u52ff\u5173\u95ed\u6d4f\u89c8\u5668...');
      $http.post($scope.config.postwechat_url, { 'material_id': material_id }).success(function (data) {
        if (data.message.errno == 0) {
          util.message('\u5df2\u4fdd\u5b58', './index.php?c=platform&a=material', 'success');
        } else {
          alert('\u521b\u5efa\u56fe\u6587\u5931\u8d25' + data.message.message);
        }
      });
    };
    $scope.sendMaterial = function () {
      $http.post($scope.config.send_url, {
        type: $scope.materialType,
        id: $scope.materialId,
        'group': $scope.group
      }).success(function (data) {
        if (data.message.errno == 1) {
          util.message(data.message.message, '', 'info');
        } else {
          util.message('\u7fa4\u53d1\u6210\u529f', './index.php?c=platform&a=material&type=' + $scope.materialType, 'success');
        }
      });
    };
    $scope.createNew = function (new_type) {
      var url = $scope.config.create_new_url + '&new_type=' + new_type;
      window.location = url;
    };
    $scope.choiceSendType = function (url, type, media_id) {
      $('.web-mobile-choice-type a[class = \'we7-margin-bottom\']').attr('data-url', url);
      $('.web-mobile-choice-type a[class = \'we7-mobile-material-preview\']').attr('data-type', type);
      $('.web-mobile-choice-type a[class = \'we7-mobile-material-preview\']').attr('data-media-id', media_id);
    };
    $scope.wabPreview = function () {
      $('#modalWechatView').modal('hide');
      window.open($('.web-mobile-choice-type a[class = \'we7-margin-bottom\']').attr('data-url'), '_blank');
    };
    $scope.mobilePreview = function () {
      var media_id = $('.web-mobile-choice-type a[class = \'we7-mobile-material-preview\']').attr('data-media-id');
      var type = $('.web-mobile-choice-type a[class = \'we7-mobile-material-preview\']').attr('data-type');
      $('.material-wechat-view').addClass('hidden');
      $('#weixin-dialog').removeClass('hidden');
      $('#modalWechatView .btn-send').unbind().click(function () {
        var wxname = $.trim($('#modalWechatView #wxname').val());
        if (!wxname) {
          util.message('\u5fae\u4fe1\u53f7\u4e0d\u80fd\u4e3a\u7a7a', '', 'error');
          return false;
        }
        $('#weixin-dialog').addClass('hidden');
        $('.material-wechat-view').removeClass('hidden');
        $('#modalWechatView #wxname').val('');
        $('#modalWechatView').modal('hide');
        $http.post('./index.php?c=platform&a=mass&do=preview', {
          media_id: media_id,
          wxname: wxname,
          type: type
        }).success(function (data) {
          if (data.message.errno != 0) {
            util.message(data.message.message);
          } else {
            util.message('\u53d1\u9001\u6210\u529f', '', 'success');
          }
        });
        return false;
      });
    };
    $scope.previewBack = function () {
      $('#weixin-dialog').addClass('hidden');
      $('.material-wechat-view').removeClass('hidden');
    };
  }
]).controller('materialAdd', [
  '$scope',
  'material',
  '$http',
  '$timeout',
  function ($scope, material, $http, $timeout) {
    $scope.config = material;
    $scope.operate = material.operate;
    $scope.model = material.model;
    $scope.new_type = material.new_type;
    $scope.hidenbutton = material.new_type == 'reply' ? 0 : 1;
    $scope.typeName = material.typeName;
    //改变素材的选中状态
    $scope.changeClass = function () {
      angular.forEach($scope.materialList, function (value, key) {
        if (key == '0') {
          $scope.materialList[key]['class'] = $scope.activeIndex == key ? 'cover-appmsg-item active' : 'cover-appmsg-item';
        } else {
          $scope.materialList[key]['class'] = $scope.activeIndex == key ? 'appmsg-item active' : 'appmsg-item';
        }
      });
    };
    $scope.tomedia = function (url) {
      var tomedia = '';
      $.ajax({
        'url': material.url,
        'async': false,
        'data': { 'url': url },
        'success': function (data) {
          var data = $.parseJSON(data);
          tomedia = data.message.message;
        }
      });
      return tomedia;
    };
    $scope.changeOrder = function (order, index) {
      material = {};
      if (order == 'down') {
        material = $scope.materialList[index];
        $scope.materialList[index] = $scope.materialList[index + 1];
        $scope.materialList[index + 1] = material;
      } else {
        material = $scope.materialList[index];
        $scope.materialList[index] = $scope.materialList[index - 1];
        $scope.materialList[index - 1] = material;
      }
    };
    $scope.deleteMaterial = function (index) {
      if (confirm('\u786e\u5b9a\u8981\u5220\u9664\u5417\uff1f')) {
        $scope.materialList.splice(index, 1);
        $scope.activeIndex = $scope.activeIndex - 1;
      }
    };
    //改变当前选中的素材
    $scope.changeIndex = function (index) {
      $scope.activeIndex = index;
      $scope.changeClass();
    };
    //添加素材
    $scope.addMaterial = function () {
      if ($scope.materialList == undefined) {
        $scope.materialList = [];
        $scope.activeIndex = 0;
      } else {
        $scope.activeIndex = $scope.materialList.length;
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
        class: ''
      });
      $scope.changeClass();
    };
    //进入图文编辑页先判断是新增还是编辑（编辑图文要把图文素材所包含所有图文列出来）
    if ($scope.operate == 'add' && $scope.config.type != 'reply') {
      $scope.addMaterial();
    } else {
      $scope.activeIndex = 0;
      $scope.materialList = [];
      angular.forEach(material.materialList, function (value, key) {
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
          show_cover_pic: isNaN(Number(value.show_cover_pic)) ? 0 : Number(value.show_cover_pic),
          class: ''
        };
      });
      $scope.changeClass();
    }
    //图文素材选取图片
    $scope.pickPicture = function (type) {
      isWechat = type == 'wechat' ? true : false;
      require(['fileUploader'], function (fileUploader) {
        fileUploader.init(function (imgs) {
          $scope.materialList[$scope.activeIndex].thumb = imgs.url;
          $scope.materialList[$scope.activeIndex].media_id = imgs.media_id;
          $scope.$apply();
        }, {
          type: 'image',
          direct: true,
          multiple: false,
          isWechat: isWechat,
          typeName: $scope.typeName,
          image_limit: $scope.config.image_limit,
          voice_limit: $scope.config.voice_limit,
          video_limit: $scope.config.video_limit
        });
      });
    };
    //更新正文图片显示状态
    $scope.updateSelection = function () {
      $scope.materialList[$scope.activeIndex].show_cover_pic = isNaN(Number(!$scope.materialList[$scope.activeIndex].show_cover_pic)) ? 0 : Number(!$scope.materialList[$scope.activeIndex].show_cover_pic);
    };
    //编辑完成图文素材，保存上传图文素材
    $scope.saveNews = function (location) {
      news = [];
      var errorIndex = '';
      var errorMsg = '';
      angular.forEach($scope.materialList, function (material, key) {
        if (material.title == '') {
          errorIndex = key;
          errorMsg = '\u8bf7\u8f93\u5165\u6807\u9898\u540e,\u518d\u70b9\u51fb\u4fdd\u5b58\u6309\u94ae';
        } else if (material.content == '' && (location == 'wechat' || $scope.new_type == 'reply')) {
          errorIndex = key;
          errorMsg = '\u8bf7\u8f93\u5165\u4e00\u6bb5\u6b63\u6587,\u518d\u70b9\u51fb\u4fdd\u5b58\u6309\u94ae';
        } else {
          if (material.content == '' && location == 'wechat') {
            errorIndex = key;
            errorMsg = '\u56fe\u6587\u5185\u5bb9\u4e2d\u56fe\u7247\u4e0a\u4f20\u5931\u8d25\uff0c\u8bf7\u91cd\u65b0\u4e0a\u4f20';
          } else {
            material.displayorder = key + 1;
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
      util.message('\u6b63\u5728\u751f\u6210\u56fe\u6587\u6d88\u606f\uff0c\u8bf7\u52ff\u5173\u95ed\u6d4f\u89c8\u5668...');
      var attach_id = $scope.config.operate == 'add' ? '' : $scope.config.materialList[0]['attach_id'];
      $http.post($scope.config.newsUpload_url, {
        'news': news,
        'operate': $scope.operate,
        'attach_id': attach_id,
        'type': $scope.config.type,
        'target': location,
        'news_rid': $scope.config.news_rid
      }).success(function (data) {
        if (data.message.errno == 0) {
          util.message('\u5df2\u4fdd\u5b58', $scope.config.msg_url, 'success');
        } else {
          alert('\u521b\u5efa\u56fe\u6587\u5931\u8d25' + data.message.message);
        }
      });
    };
    //导入文章
    //当前编辑的回复项目的索引
    $scope.exportFromCms = function () {
      $scope.searchCms();
    };
    $scope.searchCms = function (page) {
      var html = {};
      html['header'] = '<ul role="tablist" class="nav nav-pills" style="font-size:14px; margin-top:-20px;">' + '\t<li role="presentation" class="active" id="li_goodslist"><a data-toggle="tab" role="tab" aria-controls="articlelist" href="#articlelist">\u6587\u7ae0\u5217\u8868</a></li>' + '</ul>';
      html['content'] = '<div class="tab-content">' + '<div id="articlelist" class="tab-pane active" role="tabpanel">' + '\t<table class="table table-hover">' + '\t\t<thead class="navbar-inner">' + '\t\t\t<tr>' + '\t\t\t\t<th style="width:40%;">\u6807\u9898</th>' + '\t\t\t\t<th style="width:30%">\u521b\u5efa\u65f6\u95f4</th>' + '\t\t\t\t<th style="width:30%; text-align:right">' + '\t\t\t\t\t<div class="input-group input-group-sm hide">' + '\t\t\t\t\t\t<input type="text" class="form-control">' + '\t\t\t\t\t\t<span class="input-group-btn">' + '\t\t\t\t\t\t\t<button class="btn btn-default" type="button"><i class="fa fa-search"></i></button>' + '\t\t\t\t\t\t</span>' + '\t\t\t\t\t</div>' + '\t\t\t\t</th>' + '\t\t\t</tr>' + '\t\t</thead>' + '\t\t<tbody></tbody>' + '\t</table>' + '\t<div id="pager" style="text-align:center;"></div>' + '</div>' + '</div>';
      html['footer'] = '';
      html['articleitem'] = '<%_.each(list, function(item) {%> \n' + '<tr>\n' + '\t<td><a href="#" data-cover-attachment-url="<%=item.attachment%>" title="<%=item.title%>"><%=item.title%></a></td>\n' + '\t<td><%=item.createtime%></td>\n' + '\t<td class="text-right">\n' + '\t\t<button class="btn btn-default js-btn-select" js-id="<%=item.id%>">\u9009\u53d6</button>\n' + '\t</td>\n' + '</tr>\n' + '<%});%>\n';
      if (!$('#link-search-cms')[0]) {
        $scope.modalobj = util.dialog(html['header'], html['content'], html['footer'], { 'containerName': 'link-search-cms' });
        $scope.modalobj.find('.modal-body').css({
          'height': '680px',
          'overflow-y': 'auto'
        });
        $scope.modalobj.modal('show');
        $scope.modalobj.on('hidden.bs.modal', function () {
          $scope.modalobj.remove();
        });
        $('#link-search-cms').data('modal', $scope.modalobj);
      } else {
        $scope.modalobj = $('#link-search-cms').data('modal');
      }
      page = page || 1;
      $http.get('./index.php?c=utility&a=link&do=articlelist' + '&page=' + page).success(function (result, status, headers, config) {
        if (result.message.message.list) {
          $scope.modalobj.find('#articlelist').data('articles', result.message.message.list);
          $scope.modalobj.find('#articlelist tbody').html(_.template(html['articleitem'])(result.message.message));
          $scope.modalobj.find('#pager').html(result.message.message.pager);
          $scope.modalobj.find('#pager .pagination li[class!=\'active\'] a').click(function () {
            $scope.searchCms($(this).attr('page'));
            return false;
          });
          $scope.modalobj.find('.js-btn-select').click(function () {
            $scope.addCms($(this).attr('js-id'));
            $scope.$apply();
            $scope.modalobj.modal('hide');
          });
        }
      });
    };
    $scope.addCms = function (id) {
      var article = $scope.modalobj.find('#articlelist').data('articles')[id];
      $scope.materialList[$scope.activeIndex].title = article.title;
      $scope.materialList[$scope.activeIndex].thumb = article.thumb_url;
      $scope.materialList[$scope.activeIndex].author = article.author;
      $scope.materialList[$scope.activeIndex].incontent = article.incontent == 1;
      $scope.materialList[$scope.activeIndex].description = article.description;
      $scope.materialList[$scope.activeIndex].content = article.content;
      $scope.materialList[$scope.activeIndex].content_source_url = article.linkurl;
      $scope.materialList[$scope.activeIndex].detail = article.content != '';
    };
  }
]);