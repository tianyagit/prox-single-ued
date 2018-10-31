angular.module('ModuleSpecialApp').service('serviceCopy', [
  '$rootScope',
  function ($rootScope) {
    var serviceCopy = {};
    serviceCopy.copySuccess = function (id, obj) {
      var id = parseInt(id);
      var obj = obj;
      var enext = $('#copy-' + id).next().html();
      if (!enext || enext.indexOf('<span class="label label-success" style="position:absolute;z-index:10"><i class="fa fa-check-circle"></i> \u590d\u5236\u6210\u529f</span>') < 0) {
        $('#copy-' + id).after(obj);
      }
      setTimeout(function () {
        obj.remove();
      }, 2000);
    };
    return serviceCopy;
  }
]);