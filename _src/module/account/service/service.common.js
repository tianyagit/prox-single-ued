angular.module('accountApp').service('AccountAppCommon', ['$rootScope', '$http', 'config', function($rootScope, $http, config) {
	var AccountAppCommon = {};
	AccountAppCommon.addPermission = function() {
		var moduleshtml = '',templatehtml = '';
		$('#jurisdiction-add #content-modules').find('.btn-primary').each(function(){
			moduleshtml += '<span class="label label-info" style="margin-right:3px;">'+$(this).attr('data-title')+'</span><input type="hidden" name="extra[modules][]" value="'+$(this).attr('data-name')+'" />';
		});
		$('#jurisdiction-add #content-templates').find('.btn-primary').each(function(){
			templatehtml += '<span class="label label-info" style="margin-right:3px;">'+$(this).attr('data-title')+'</span><input type="hidden" name="extra[templates][]" value="'+$(this).attr('data-name')+'" />';
		});
		if (moduleshtml || templatehtml) {
			$('.account-package-extra').show();
		} else {
			$('.account-package-extra').hide();
		}
		$('.account-package-extra .js-extra-modules').html(moduleshtml);
		$('.account-package-extra .js-extra-templates').html(templatehtml);
		$('#jurisdiction-add').modal('hide');
	};
	AccountAppCommon.update_package_list = function(package) {
		$('input[name="package[]"]').prop('checked', false);
		$('input[name="package[]"]').prop('disabled', false);
		for (i in package) {
			$('input[name="package[]"][value="'+package[i]+'"]').prop('checked', true);
			$('input[name="package[]"][value="'+package[i]+'"]').prop('disabled', true);
		}
	};
	AccountAppCommon.selectOwner = function(){
		var seletedUserIds = [];
		require(['biz'], function(biz){
			biz.user.browser(seletedUserIds, function(user){
				$http.post(config.links.userinfo, {uid: user})
					.success(function(data){
						if (data.message.errno) {
							util.message(data.message.message);
						}
						$('#manager').val(data.message.message.uid);
						$('#showname').val(data.message.message.username);
						$('#groupid').val(data.message.message.group.id);
						$('.account-package-extra').show();
						AccountAppCommon.update_package_list(data.message.message.package);
					});
			},{mode:'invisible', direct : true});
		});
	};
	AccountAppCommon.copySuccess = function(id, obj) {
		var id = parseInt(id);
		var obj = obj;
		var enext = $('#copy-'+id).next().html();
		if (!enext || enext.indexOf('<span class="label label-success" style="position:absolute;z-index:10"><i class="fa fa-check-circle"></i> 复制成功</span>')<0) {
			$('#copy-'+id).after(obj);
		}
		setTimeout(function(){
			obj.remove();
		}, 2000);
	};
	AccountAppCommon.tokenGen = function() {
		var letters = 'abcdefghijklmnopqrstuvwxyz0123456789';
		var token = '';
		for(var i = 0; i < 32; i++) {
			var j = parseInt(Math.random() * (31 + 1));
			token += letters[j];
		}
		return token;
	};
	AccountAppCommon.encodingAESKeyGen = function() {
		var letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		var token = '';
		for(var i = 0; i < 43; i++) {
			var j = parseInt(Math.random() * 61 + 1);
			token += letters[j];
		}
		return token;
	};
	return AccountAppCommon;
}]);