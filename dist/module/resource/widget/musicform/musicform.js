function we7ResourceMusicFormController($scope) {
  var ctrl = this;
  ctrl.music = {
    title: '',
    HQUrl: '',
    url: '',
    description: ''
  };
  ctrl.$onInit = function () {
    ctrl.music.url = ctrl.musicurl;  //多选设置成false
  };
  // 音乐 url 改变后处理
  ctrl.$onChanges = function (props) {
    ctrl.music.url = props.musicurl.currentValue;  //设置新的url
  };
  ctrl.selectVoice = function () {
    ctrl.doselect();
  };
  // 填写音乐
  ctrl.ok = function () {
    if (ctrl.music.title == '') {
      util.message('\u6807\u9898\u4e0d\u80fd\u4e3a\u7a7a');
      return;
    }
    if (ctrl.music.url == '') {
      util.message('\u8bf7\u9009\u62e9\u5a92\u4f53\u6587\u4ef6');
      return;
    }
    $scope.$emit('add_music', ctrl.music);
  };
}
we7ResourceMusicFormController['$inject'] = ['$scope'];
angular.module('we7resource').component('we7ResourceMusicform', {
  templateUrl: 'widget-musicform-musicform.html',
  bindToController: true,
  controller: we7ResourceMusicFormController,
  bindings: {
    doselect: '&',
    musicurl: '<'
  }
});