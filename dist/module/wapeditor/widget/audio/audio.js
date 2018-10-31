angular.module('wapeditorApp').controller('AudioCtrl', [
  '$scope',
  function ($scope) {
    $scope.addAudioItem = function () {
      require(['fileUploader'], function (uploader) {
        uploader.init(function (attachments) {
          if (attachments) {
            $scope.activeItem.params.audio.id = attachments.id;
            $scope.activeItem.params.audio.url = attachments.attachment;
            $scope.$apply();
            $('.audio-player-play').click(function () {
              var src = $scope.activeItem.params.audio.url;
              if (!src) {
                return;
              }
              $('#player').remove();
              var player = $('<div id="player"></div>');
              $(document.body).append(player);
              player.data('control', $(this));
              player.jPlayer({
                playing: function () {
                  $(this).data('control').find('i').removeClass('fa-play').addClass('fa-stop');
                },
                pause: function (event) {
                  $(this).data('control').find('i').removeClass('fa-stop').addClass('fa-play');
                },
                swfPath: 'resource/components/jplayer',
                supplied: 'mp3,wma,wav,amr',
                solution: 'html, flash'
              });
              player.jPlayer('setMedia', { mp3: src }).jPlayer('play');
              if ($(this).find('i').hasClass('fa-stop')) {
                player.jPlayer('stop');
              } else {
                player.jPlayer('setMedia', { mp3: src }).jPlayer('play');
              }
            }).show();
          }
        }, {
          'direct': true,
          'multiple': false,
          'type': 'audio'
        });
      });
    };
    $scope.addImgItem = function () {
      require(['fileUploader'], function (uploader) {
        uploader.init(function (imgs) {
          $scope.activeItem.params.headimg = imgs.url;
          $scope.$apply();
        }, {
          'direct': true,
          'multiple': false
        });
      });
    };
    $scope.changeInnerHeight = function () {
      // 动态改变audio高度
      $scope.changeInnerHeight();
    };
  }
]);