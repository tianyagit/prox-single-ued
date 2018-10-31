angular.module('wesiteApp').service('serviceQuickMenuSubmit', [
  'serviceQuickMenuBase',
  function (serviceQuickMenuBase) {
    var serviceQuickMenuSubmit = {};
    serviceQuickMenuSubmit.stripHaskey = function (obj) {
      for (var i in obj) {
        if (i == '$$hashKey') {
          delete obj[i];
        } else if (typeof obj[i] == 'object') {
          serviceQuickMenuSubmit.stripHaskey(obj[i]);
        }
      }
      return obj;
    };
    serviceQuickMenuSubmit.submit = function () {
      var submit = {
          'params': {},
          'html': ''
        };
      submit.params = serviceQuickMenuBase.getQuickMenuData();
      serviceQuickMenuSubmit.stripHaskey(submit.params);
      var html = $('.nav-menu').html();
      html = html.replace(/<\!\-\-([^-]*?)\-\->/g, '');
      html = html.replace(/ng\-[a-zA-Z-]+=\"[^\"]*\"/g, '');
      html = html.replace(/[\t\n\n\r]/g, '');
      submit.html = html;
      return submit;
    };
    return serviceQuickMenuSubmit;
  }
]);