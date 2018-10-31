angular.module('we7codeuploadApp').service('codeservice', [
  '$http',
  '$q',
  'config',
  function ($http, $q, config) {
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
          }, function () {
            var def = $q.defer();
            def.reject();
            return def.promise;
          });
        },
        codeuid: function (version_id, user_version) {
          var self = this;
          var def = $q.defer();
          this.ajax(config.UUIDURL + 'version_id=' + version_id + '&user_version=' + user_version).then(function (data) {
            if (data.errno == '0') {
              def.resolve(data.data.code_uuid);
              return;
            }
            var mes = '\u5c0f\u7a0b\u5e8f\u5e94\u7528\u6570\u636e\u5f02\u5e38\uff0c\u65e0\u6cd5\u83b7\u53d6\uff0c\u8bf7\u8054\u7cfb\u5f00\u53d1\u8005';
            if (data.message) {
              mes = data.message;
            }
            def.reject(mes);
          });
          return def.promise;
        },
        codegen: function (code_uuid) {
          var def = $q.defer();
          this.ajax(config.CODE_GEN_CHECK_URL + 'code_uuid=' + code_uuid).then(function (data) {
            if (data.errno == '0') {
              var is_gen = data.data.is_gen;
              def.resolve(code_uuid);
              return;
            }
            def.reject('no gen');
          }, function (error) {
            def.reject('no gen');
          });
          return def.promise;
        },
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
              });
            }, function () {
              return self.retrycodegen(code_uuid).then(function () {
                def.resolve();
              });
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
              def.resolve({
                errcode: errcode,
                last: last,
                code_token: data.data.code_token
              });
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
              def.reject('\u5df2\u53d6\u6d88\u626b\u7801');
              return;
            }
            if (errcode == 666) {
              def.reject('\u4e8c\u7ef4\u7801\u5df2\u8fc7\u671f');
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
              msg = '\u9884\u89c8\u5931\u8d25, \u786e\u4fdd\u5f53\u524d\u626b\u7801\u7528\u6237\u6709\u4e0a\u4f20\u5c0f\u7a0b\u5e8f\u7684\u6743\u9650';
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
              msg = '\u4e0a\u4f20\u4ee3\u7801\u5931\u8d25, \u786e\u4fdd\u5f53\u524d\u626b\u7801\u7528\u6237\u6709\u4e0a\u4f20\u5c0f\u7a0b\u5e8f\u7684\u6743\u9650';
            }
            def.reject(msg);
          });
          return def.promise;
        }
      };
    return codeupload;
  }
]);