angular.module('we7codeuploadApp').service('codeservice',
	['$http', '$q', 'config', function ($http, $q, config) {

		// var UUIDURL = config.UUIDURL;
		// var CODE_GEN_CHECK_URL = config.CODE_GEN_CHECK_URL;
		// var CODE_TOKEN_URL = config.CODE_TOKEN_URL;
		// var QRCODEURL = config.QRCODEURL;
		// var CHECKSANURL = config.CHECKSANURL;
		// var PREVIEWURL = config.PREVIEWURL;
		// var COMMITURL = config.COMMITURL;
		var codeupload = {
			ajax: function (url, data) {
				return $http.get(url).then(function (response) {
					var data = response.data;
					var def = $q.defer();
					def.resolve(data);
					return def.promise;
				},function(){
					var def = $q.defer();
					def.reject();
					return def.promise;
				});
			},
			//获取UUID
			codeuid: function (version_id, user_version) {
				var self = this;
				var def = $q.defer();
				this.ajax(config.UUIDURL + 'version_id=' + version_id + '&user_version=' + user_version).then(function (data) {
					if (data.errno == '0') {
						def.resolve(data.data.code_uuid);
						return;
					}
					var mes = '小程序应用数据异常，无法获取，请联系开发者';
					if(data.message) {
						mes = data.message;
					}
					def.reject(mes);
				});
				return def.promise;
			},

			// 检查小程序代码是否已生成
			codegen: function (code_uuid) {
				var def = $q.defer();

				this.ajax(config.CODE_GEN_CHECK_URL + 'code_uuid=' + code_uuid).then(function (data) {
					if (data.errno == '0') {
						var is_gen = data.data.is_gen;
						def.resolve(code_uuid);
						return;
					}
					def.reject('no gen')
				}, function (error) {
					def.reject('no gen');
				});
				return def.promise;
			},
			// 5秒检查一次
			retrycodegen: function (code_uuid) {
				var def = $q.defer();
				var self = this;
				setTimeout(function () {
					self.codegen(code_uuid).then(function (is_gen) {
						if (is_gen) {
							def.resolve(code_uuid);
							return;
						}
						return self.retrycodegen(code_uuid).then(function () {
							def.resolve();
						})
					}, function () {
						return self.retrycodegen(code_uuid).then(function () {
							def.resolve();
						})
					});
				}, 5000);
				return def.promise;
			},

			get_code_token: function () {
				var def = $q.defer();
				var self = this;
				this.ajax(config.CODE_TOKEN_URL).then(function (data) {
					if (data.errno == '0') {
						var code_token = data.data.code_token;
						def.resolve(code_token);
						return;
					}
					def.reject();
				});
				return def.promise;
			},
			//扫码检测
			checkscan: function (code_token, last) {
				var def = $q.defer();
				if (!last) {
					last = 408;
				}
				var url = config.CHECKSANURL + '&code_token=' + code_token + '&last=' + last;
				this.ajax(url).then(function (data) {
					if (data.errno > 0) {
						def.reject(code_token, last);
						return;
					}
					if (data.errno == 0) {
						var errcode = parseInt(data.data.errcode);
						
						def.resolve({errcode:errcode, last:last, code_token: data.data.code_token});
						return;
					}
				}, function (error) {
					
					def.reject(code_token, last);
				});
				return def.promise;
			},
			retrychecksan: function (code_token, last) {
				var def = $q.defer();
				var self = this;
				self.checkscan(code_token, last).then(function (data) {
					var errcode = data.errcode;
					var newlast = data.last;
					var new_code_token = data.code_token;
					if (errcode == 405) {

						def.resolve(new_code_token);
						return;
					}
					if (errcode == 403) {
						def.reject('已取消扫码');
						return;
					}
					if (errcode == 666) {
						def.reject('二维码已过期');
						return;
					}
					self.retrychecksan(code_token, errcode).then(function (f_code_token) {
						def.resolve(f_code_token);
					});
				}, function (code_token, last) {
					console.log('error');
					self.retrychecksan(code_token, last).then(function (f_code_token) {
						def.resolve(f_code_token);
					});
				});
				return def.promise;
			},

			preview: function (new_code_token, code_uuid) {
				var def = $q.defer();
				var previewurl = config.PREVIEWURL + 'code_token=' + new_code_token + '&code_uuid=' + code_uuid;
				this.ajax(previewurl).then(function (data) {
					if (data.errno == '0') {
						var qrcode_img = data.data.qrcode_img;
						def.resolve(qrcode_img);
					}
					var msg = data.message;
					if (msg == '') {
						msg = '预览失败, 确保当前扫码用户有上传小程序的权限';
					}
					def.reject(msg);
				});
				return def.promise;
			},

			commit: function (new_code_token, code_uuid, user_version, user_desc) {
				var def = $q.defer();
				var url = config.COMMITURL + 'code_token=' + new_code_token + '&user_version=' + user_version + '&user_desc=' + user_desc + '&code_uuid=' + code_uuid;
				this.ajax(url).then(function (data) {
					if (data.errno == '0') {
						def.resolve();
						return;
					}
					var msg = data.message;
					if (msg == '') {
						msg = '上传代码失败, 确保当前扫码用户有上传小程序的权限';
					}
					def.reject(msg);
				});
				return def.promise;
			}

		};

		return codeupload;


	}]);