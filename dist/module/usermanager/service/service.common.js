angular.module('userManageApp').service('UserManageCommon', [
  '$rootScope',
  '$http',
  'config',
  function ($rootScope, $http, $config) {
    var UserManageCommon = {};
    UserManageCommon.addPermission = function () {
      var moduleshtml = '', templatehtml = '';
      $('#jurisdiction-add #content-modules').find('.btn-primary').each(function () {
        moduleshtml += '<span class="label label-info" style="margin-right:3px;">' + $(this).attr('data-title') + '</span><input type="hidden" name="extra[modules][]" value="' + $(this).attr('data-name') + '" />';
      });
      $('#jurisdiction-add #content-templates').find('.btn-primary').each(function () {
        templatehtml += '<span class="label label-info" style="margin-right:3px;">' + $(this).attr('data-title') + '</span><input type="hidden" name="extra[templates][]" value="' + $(this).attr('data-name') + '" />';
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
    return UserManageCommon;
  }
]);