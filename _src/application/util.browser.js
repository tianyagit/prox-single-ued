util.iconBrowser = function(callback){
	require(['fileUploader'], function(fileUploader){
		fileUploader.init(function(icon){
			if($.isFunction(callback)){
				callback('fa '+icon.name);
				return;
			}
		},{type:'icon'});	
	});
}; // end of icon dialog

util.emojiBrowser = function(callback){
	require(['emoji'], function(){
		var footer = '<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>';
		var modalobj = util.dialog('请选择表情', window.util.templates['emoji-content-emoji.tpl'], footer, {containerName:'icon-container'});
		modalobj.modal({'keyboard': false});
		modalobj.find('.modal-dialog').css({'width':'70%'});
		modalobj.find('.modal-body').css({'height':'70%','overflow-y':'scroll'});
		modalobj.modal('show');

		window.selectEmojiComplete = function(emoji){
			if($.isFunction(callback)){
				callback(emoji);
				modalobj.modal('hide');
			}
		};
	});
}; // end of emoji dialog

util.qqEmojiBrowser = function(elm, target, callback) {
	require(['emoji'],function(){
		var emotions_html = window.util.templates['emoji-content-qq.tpl'];
		$(elm).popover({
			html: true,
			content: emotions_html,
			placement:"bottom"
		});
		$(elm).one('shown.bs.popover', function(){
			$(elm).next().mouseleave(function(){
				$(elm).popover('hide');
			});
			$(elm).next().delegate(".eItem", "mouseover", function(){
				var emo_img = '<img src="'+$(this).attr("data-gifurl")+'" alt="mo-'+$(this).attr("data-title")+'" />';
				var emo_txt = '/'+$(this).attr("data-code");
				$(elm).next().find(".emotionsGif").html(emo_img);
			});
			$(elm).next().delegate(".eItem", "click", function(){
				var emo_txt = '/'+$(this).attr("data-code");
				$(elm).popover('hide');
				if($.isFunction(callback)) {
					callback(emo_txt, elm, target);
				}
			});
		});
	});
};

// target dom 对象
util.emotion = function(elm, target, callback) {
	util.qqEmojiBrowser(elm, target, callback);
};

util.linkBrowser = function(callback){
	var footer = '<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>';
	var modalobj = util.dialog('请选择链接',['./index.php?c=utility&a=link&callback=selectLinkComplete'],footer,{containerName:'link-container'});
	modalobj.modal({'keyboard': false});
	modalobj.find('.modal-body').css({'height':'300px','overflow-y':'auto' });
	modalobj.modal('show');

	window.selectLinkComplete = function(link){
		if($.isFunction(callback)){
			callback(link);
			modalobj.modal('hide');
		}
	};
}; // end of icon dialo
util.pageBrowser = function(callback, page){
	var footer = '';
	var modalobj = util.dialog('',['./index.php?c=utility&a=link&do=page&callback=pageLinkComplete&page='+ page],footer,{containerName:'link-container'});
	modalobj.modal({'keyboard': false});
	modalobj.find('.modal-body').css({'height':'700px','overflow-y':'auto' });
	modalobj.modal('show');

	window.pageLinkComplete = function(link, page){
		if($.isFunction(callback)){
			callback(link, page);
			if (page == '' || page == undefined) {
				modalobj.modal('hide');
			}
		}
	};
};
util.newsBrowser = function(callback, page){
	var footer = '';
	var modalobj = util.dialog('',['./index.php?c=utility&a=link&do=news&callback=newsLinkComplete&page='+ page],footer,{containerName:'link-container'});
	modalobj.modal({'keyboard': false});
	modalobj.find('.modal-body').css({'height':'700px','overflow-y':'auto' });
	modalobj.modal('show');

	window.newsLinkComplete = function(link, page){
		if($.isFunction(callback)){
			callback(link, page);
			if (page == '' || page == undefined) {
				modalobj.modal('hide');
			}
		}
	};
};
util.articleBrowser = function(callback, page){
	var footer = '';
	var modalobj = util.dialog('',['./index.php?c=utility&a=link&do=article&callback=articleLinkComplete&page='+ page],footer,{containerName:'link-container'});
	modalobj.modal({'keyboard': false});
	modalobj.find('.modal-body').css({'height':'700px','overflow-y':'auto' });
	modalobj.modal('show');

	window.articleLinkComplete = function(link, page){
		if($.isFunction(callback)){
			callback(link, page);
			if (page == '' || page == undefined) {
				modalobj.modal('hide');
			}
		}
	};
};

util.phoneBrowser = function(callback, page){
	var footer = '';
	var modalobj = util.dialog('一键拨号',['./index.php?c=utility&a=link&do=phone&callback=phoneLinkComplete&page='+ page],footer,{containerName:'link-container'});
	modalobj.modal({'keyboard': false});
	modalobj.find('.modal-body').css({'height':'700px','overflow-y':'auto' });
	modalobj.modal('show');

	window.phoneLinkComplete = function(link, page){
		if($.isFunction(callback)){
			callback(link, page);
			if (page == '' || page == undefined) {
				modalobj.modal('hide');
			}
		}
	};
};

util.showModuleLink = function(callback){
	var footer = '';
	var modalobj = util.dialog('模块链接选择',['./index.php?c=utility&a=link&do=modulelink&callback=moduleLinkComplete'], '');
	modalobj.modal({'keyboard': false});
	modalobj.find('.modal-body').css({'height':'700px','overflow-y':'auto' });
	modalobj.modal('show');

	window.moduleLinkComplete = function(link, permission){
		if($.isFunction(callback)){
			callback(link, permission);
			modalobj.modal('hide');
		}
	};

};