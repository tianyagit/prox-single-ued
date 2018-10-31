angular.module('fansApp', ['we7app']).value('config', {
  running: false,
  syncState: '',
  downloadState: ''
}).controller('DisplayCtrl', [
  '$scope',
  '$http',
  'config',
  '$q',
  function ($scope, $http, config, $q) {
    $scope.config = config;
    $scope.addTagUrl = config.addTagUrl;
    $scope.tag = '';
    $scope.searchMod = config.searchMod;
    $scope.closeValue = 0;
    $scope.registerUrl = config.registerUrl;
    $scope.register = [];
    $scope.sync_member = 0;
    $scope.switchSearchMod = function (type) {
      $scope.searchMod = type;
      $scope.$apply($scope.searchMod);
    };
    $scope.addTag = function () {
      $http.post($scope.addTagUrl, { 'tag': $scope.tag }).success(function (data) {
      });
    };
    $scope.registerMember = function (openid) {
      $scope.register.openid = openid;
      $scope.register.password = '';
      $scope.register.repassword = '';
    };
    $scope.register = function () {
      $('.modal').modal('hide');
      if ($scope.register.password == '') {
        util.message('\u65b0\u5bc6\u7801\u4e0d\u53ef\u4e3a\u7a7a\uff01');
        return false;
      }
      if ($scope.register.repassword == '') {
        util.message('\u786e\u8ba4\u65b0\u5bc6\u7801\u4e0d\u53ef\u4e3a\u7a7a\uff01');
        return false;
      }
      if ($scope.register.password != $scope.register.repassword) {
        util.message('\u4e24\u6b21\u5bc6\u7801\u4e0d\u4e00\u81f4\uff01');
        return false;
      }
      $http.post($scope.registerUrl, {
        'password': $scope.register.password,
        'repassword': $scope.register.repassword,
        'openid': $scope.register.openid
      }).success(function (data) {
        if (data.message.errno == 0) {
          util.message(data.message.message, data.redirect, 'ajax');
        } else {
          util.message(data.message.message);
        }
      });
    };
    $scope.syncMember = function () {
      $scope.sync_member = $scope.sync_member == 0 ? 1 : 0;
    };
    $scope.downloadFans = function (nextOpenid, count) {
      var arr, reg = new RegExp('(^| )we7:sync_fans_pindex:' + window.sysinfo.uniacid + '=([^;]*)(;|$)');
      if (arr = document.cookie.match(reg)) {
        $scope.sync('all', { 'pageindex': unescape(arr[2]) });
        return false;
      }
      if (!count) {
        count = 0;
      }
      if (nextOpenid == undefined) {
        nextOpenid = '';
        util.message('\u6b63\u5728\u4e0b\u8f7d\u7c89\u4e1d\u6570\u636e...');
      }
      $http.post(config.syncAllUrl, { 'next_openid': nextOpenid }).success(function (data) {
        if (data.message.errno != 0) {
          var notice = '';
          if (typeof data.message == 'string') {
            notice = data.message;
          } else if (typeof data.message.message == 'string') {
            notice = data.message.message;
          }
          util.message('\u7c89\u4e1d\u4e0b\u8f7d\u5931\u8d25\u3002\u5177\u4f53\u539f\u56e0\uff1a' + notice);
          return false;
        }
        count += parseInt(data.message.message.count);
        if (data.message.message.total <= count || !data.message.message.count && !data.message.message.next) {
          $scope.sync('all');
          return false;
        } else {
          $scope.downloadFans(data.message.message.next, count);
        }
      });
    };
    $scope.sync = function (type, param) {
      if (type == 'all') {
        if (!param) {
          param = {};
          param.pageindex = 0;
          param.total = 0;
          util.message('\u7c89\u4e1d\u6570\u636e\u4e0b\u8f7d\u5b8c\u6210\u3002\u5f00\u59cb\u66f4\u65b0\u7c89\u4e1d\u6570\u636e...', '', 'success');
        }
        param.type = 'all';
        param.sync_member = $scope.sync_member;
      } else {
        param = {
          'type': 'check',
          'openids': [],
          'sync_member': $scope.sync_member
        };
        $('.openid:checked').each(function () {
          param.openids.push(this.value);
        });
        if (param.openids.length == 0) {
          util.message('\u8bf7\u9009\u62e9\u7c89\u4e1d', '', 'info');
          return false;
        }
        util.message('\u6b63\u5728\u540c\u6b65\u7c89\u4e1d\u6570\u636e\u8bf7\u4e0d\u8981\u5173\u95ed\u6d4f\u89c8\u5668...');
      }
      if (param.pageindex > 0 && $scope.closeValue == 0) {
        $('#modal-message').modal('hide');
        var modalobj = util.dialog('\u66f4\u65b0\u8fdb\u5ea6', '<div class="progress"> ' + '<div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="' + param.pageindex / param.total * 100 + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + param.pageindex / param.total * 100 + '%">' + '<span class="sr-only"></span>' + '</div>' + '</div>', '', { containerName: 'link-container' });
        modalobj.modal('show');
      }
      //同步所有粉丝
      /*$http.post($scope.config.syncUrl, param).success(function(data) {
			if (data.message == undefined) {
				util.message('更新失败！可能是由于你当前网络不稳定，请稍后再试。', '', 'info');
				return false;
			} else {
				if (data.message.errno == 0) {
					if ((data.message.message == 'success') || (data.message.message.total == data.message.message.pageindex)) {
						util.message('同步粉丝数据成功', config.msgUrl, 'success');
						return false;
					} else {
						$scope.sync('all', {'pageindex' : data.message.message.pageindex, 'total' : data.message.message.total});
					}
				}  else {
					if (++param.pageindex > param) {
						util.message('同步粉丝数据成功', config.msgUrl, 'success');
						return false;
					} else {
						$scope.sync('all', {'pageindex' : ++param.pageindex, 'total' : param.total});
					}
				}
			}
		});*/
      $('.close').click(function () {
        $scope.closeValue = 1;
      });
      var deferred = $q.defer();
      var promise = deferred.promise;
      promise.then(function () {
        //同步所有粉丝
        $http.post($scope.config.syncUrl, param).success(function (data) {
          if (data.message == undefined) {
            util.message('\u66f4\u65b0\u5931\u8d25\uff01\u53ef\u80fd\u662f\u7531\u4e8e\u4f60\u5f53\u524d\u7f51\u7edc\u4e0d\u7a33\u5b9a\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5\u3002', '', 'info');
            return false;
          } else {
            if (data.message.errno == 0) {
              if (data.message.message == 'success' || data.message.message.total == data.message.message.pageindex) {
                util.message('\u540c\u6b65\u7c89\u4e1d\u6570\u636e\u6210\u529f', config.msgUrl, 'success');
                return false;
              } else {
                $scope.sync('all', {
                  'pageindex': data.message.message.pageindex,
                  'total': data.message.message.total
                });
              }
            } else {
              if (++param.pageindex > param) {
                util.message('\u540c\u6b65\u7c89\u4e1d\u6570\u636e\u6210\u529f', config.msgUrl, 'success');
                return false;
              } else {
                $scope.sync('all', {
                  'pageindex': ++param.pageindex,
                  'total': param.total
                });
              }
            }
          }
        });
      }, function (error) {
      });
      if ($scope.closeValue == 1) {
        $scope.closeValue = 0;  //deferred.reject("已关闭!");
      } else {
        deferred.resolve();
      }
    };
  }
]).controller('chatsCtrl', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    send = function () {
      types = [];
      types['text'] = $('[name="reply[reply_basic]"]').val();
      types['news'] = $('[name="reply[reply_news]"]').val();
      types['image'] = $('[name="reply[reply_image]"]').val();
      types['music'] = $('[name="reply[reply_music]"]').val();
      types['voice'] = $('[name="reply[reply_voice]"]').val();
      types['video'] = $('[name="reply[reply_video]"]').val();
      types['wxcard'] = $('[name="reply[reply_wxcard]"]').val();
      for (type in types) {
        if (types[type] != '') {
          msg_type = type;
          msg_content = types[type];
          break;
        }
      }
      $.post(config.sendurl, {
        'type': msg_type,
        'content': msg_content
      }, function (data) {
        data = $.parseJSON(data);
        if (data.message.errno == -1) {
          util.message(data.message.message, '', 'info');
        } else {
          $('.del-basic-media').remove();
          $scope.chatLogs.unshift({
            'flag': 1,
            'createtime': data.message.message.createtime,
            'content': data.message.message.content,
            'msgtype': data.message.message.msgtype
          });
          $scope.$apply();
        }
      });
    };
    $scope.chatLogs = config.chatLogs;
    window.onbeforeunload = function () {
      $.get(config.endurl, {}, function (data) {
      });
    };
  }
]);