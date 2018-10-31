angular.module('massApp', ['we7app']);
//群发记录
angular.module(['massApp']).controller('MassSend', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.showLog = function (id) {
      var tid = parseInt(id);
      var obj = $('#' + tid);
      $http.post(config.logUrl, {
        tid: tid,
        type: 'mass',
        module: 'task'
      }).success(function (data) {
        data = angular.toJson(data);
        var html = '';
        if (!data.message || data.message.items.length == 0) {
          html = '<tr><td class="text-center"><i class="fa fa-info-circle"></i> \u6682\u65e0\u6570\u636e</td></tr>';
        } else {
          $.each(data.message.items, function (k, v) {
            html += '<tr><td>' + v.createtime + ' ' + v.note + '</td></tr>';
          });
        }
        obj.popover({
          'html': true,
          'placement': 'left',
          'trigger': 'manual',
          'title': '\u89e6\u53d1\u65e5\u5fd7',
          'content': '<table class="table-cron table">' + html + '</table>'
        });
        obj.popover('toggle');
      });
    };
    $scope.hideLog = function (id) {
      var tid = parseInt(id);
      var obj = $('#' + tid);
      obj.popover('toggle');
    };
  }
]);
//定时群发编辑
angular.module('massApp').controller('MassPost', [
  '$scope',
  'config',
  function ($scope, config) {
    $scope.groups = config.groups;
    $scope.massdata = config.massdata;
    $scope.clock = config.massdata ? config.massdata.clock : '08:00';
    if ($.isFunction(window.initReplyController)) {
      window.initReplyController($scope);
    }
    ;
    if ($scope.massdata.type == 1) {
      $('.sendtime').show();
    } else {
      $('.sendtime').hide();
    }
    $('.mass-type').change(function () {
      if ($('select[name=\'type\']').val() == 1) {
        $('.sendtime').show();
      } else {
        $('.sendtime').hide();
      }
    });
    $scope.checkSubmit = function (e) {
      var selectedGroup = $('.mass-group').val();
      if (selectedGroup == '') {
        e.preventDefault();
        util.message('\u8bf7\u9009\u62e9\u7fa4\u53d1\u5bf9\u8c61');
        return false;
      } else {
        if (selectedGroup == -1) {
          var group_fans_all = {
              'id': -1,
              'name': '\u5168\u90e8\u7c89\u4e1d',
              'count': 0
            };
          $(':hidden[name="group"]').val(angular.toJson(group_fans_all));
        } else {
          angular.forEach($scope.groups, function (group_v, group_k) {
            if (group_v.id == selectedGroup) {
              $(':hidden[name="group"]').val(angular.toJson(group_v));
            }
          });
        }
      }
      ;
      if ($scope.clock == '') {
        e.preventDefault();
        util.message('\u8bf7\u9009\u62e9\u7fa4\u53d1\u5177\u4f53\u65f6\u95f4');
        return false;
      } else {
        if (config.day == '0') {
          var selectedTime = $scope.clock.split(':');
          var d = new Date();
          var hours = d.getHours();
          var minutes = d.getMinutes();
          if (selectedTime[0] < hours || selectedTime[0] == hours && selectedTime[1] < minutes) {
            e.preventDefault();
            util.message('\u53d1\u9001\u65f6\u95f4\u4e0d\u80fd\u5c0f\u4e8e\u5f53\u524d\u65f6\u95f4');
            return false;
          }
        }
      }
      ;
      var reply_news = $(':hidden[name="reply[reply_news]"]').val();
      var reply_image = $(':hidden[name="reply[reply_image]"]').val();
      var reply_music = $(':hidden[name="reply[reply_music]"]').val();
      var reply_voice = $(':hidden[name="reply[reply_voice]"]').val();
      var reply_video = $(':hidden[name="reply[reply_video]"]').val();
      var reply_basic = $(':hidden[name="reply[reply_basic]"]').val();
      if (reply_news == '' && reply_image == '' && reply_music == '' && reply_voice == '' && reply_video == '' && reply_basic == '') {
        e.preventDefault();
        util.message('\u8bf7\u9009\u62e9\u7fa4\u53d1\u7d20\u6750');
        return false;
      }
      ;
      if (reply_news != '') {
        reply_news = eval('(' + reply_news + ')');
        if (reply_news.model != 'perm') {
          e.preventDefault();
          util.message('\u7fa4\u53d1\u4e0d\u652f\u6301\u672c\u5730/\u670d\u52a1\u5668\u7d20\u6750\uff0c\u8bf7\u9009\u62e9\u5fae\u4fe1\u7d20\u6750');
          return false;
        }
        $(':hidden[name="reply[reply_news]"]').val(reply_news.mediaid);
      }
      if (reply_image != '') {
        reply_image = eval('(' + reply_image + ')');
        $(':hidden[name="reply[reply_image]"]').val(reply_image);
      }
      if (reply_music != '') {
        reply_music = eval('(' + reply_music + ')');
        $(':hidden[name="reply[reply_music]"]').val(reply_music);
      }
      if (reply_voice != '') {
        reply_voice = eval('(' + reply_voice + ')');
        $(':hidden[name="reply[reply_voice]"]').val(reply_voice);
      }
      if (reply_video != '') {
        reply_video = eval('(' + reply_video + ')');
        $(':hidden[name="reply[reply_video]"]').val(reply_video.mediaid);
      }
    };
    $('.clockpicker').clockpicker({ autoclose: true });
  }
]);
//定时群发列表
angular.module('massApp').controller('MassDisplay', [
  '$scope',
  '$http',
  'config',
  function ($scope, $http, config) {
    $scope.days = config.days;
    $scope.delMass = function (id, index) {
      var id = parseInt(id);
      var index = parseInt(index);
      if (!confirm('\u786e\u8ba4\u6e05\u7a7a\u8fd9\u6761\u7fa4\u53d1\u5417?')) {
        return false;
      }
      $http.post('./index.php?c=platform&a=mass&do=del', { id: id }).success(function (data, status) {
        if (!data.message.errno) {
          $scope.days[index].info = '';
        } else {
          util.message('\u6e05\u7a7a\u7fa4\u53d1\u5931\u8d25:<br>' + data.message.message, '', 'error');
        }
      });
      return false;
    };
    $scope.toEdit = function (index) {
      var index = parseInt(index);
      window.location.href = './index.php?c=platform&a=mass&do=post&day=' + index;
    };
    $scope.preview = function (index) {
      var index = parseInt(index);
      if ($scope.days[index].info) {
        var media_id = $scope.days[index].info.media_id;
        var type = $scope.days[index].info.msgtype;
        $('#modal-view').modal('show');
        $('#modal-view .btn-view').unbind().click(function () {
          var wxname = $.trim($('#modal-view #wxname').val());
          if (!wxname) {
            util.message('\u5fae\u4fe1\u53f7\u4e0d\u80fd\u4e3a\u7a7a', '', 'error');
            return false;
          }
          $('#modal-view').modal('hide');
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
      } else {
        util.message('\u7fa4\u53d1\u5185\u5bb9\u9519\u8bef\uff01');
        return false;
      }
    };
  }
]);