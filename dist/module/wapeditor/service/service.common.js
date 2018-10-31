angular.module('wapeditorApp').service('serviceCommon', [
  '$window',
  function ($window) {
    var serviceCommon = {};
    serviceCommon.getCssname = function (name) {
      var cssName = '', i = 0, length = parseInt(name.length);
      for (; i < length; i++) {
        if (name[i].search(/[A-Z]/) != -1) {
          cssName += '-' + name[i].toLowerCase();
        } else {
          cssName += name[i];
        }
      }
      return cssName;
    };
    serviceCommon.getMaxScopeIndex = function (item) {
      var maxPageModules = item[item.length - 1].property;
      var maxId = 0;
      for (var i in maxPageModules) {
        maxId = maxId < maxPageModules[i].index ? parseInt(maxPageModules[i].index) : maxId;
      }
      return maxId;
    };
    serviceCommon.getHeaderIndex = function (activeModules) {
      var headerIndex = 0;
      angular.forEach(activeModules, function (module, index) {
        if (module.id == 'header') {
          headerIndex = index;
        }
      });
      return headerIndex;
    };
    serviceCommon.url = function (segment) {
      segment = segment.split('/');
      var url = './index.php?i=' + $window.sysinfo.uniacid + '&j=' + $window.sysinfo.acid + '&c=' + segment[0];
      if (segment[1]) {
        url += '&a=' + segment[1];
      }
      if (segment[2]) {
        url += '&do=' + segment[2];
      }
      return url;
    };
    serviceCommon.tomedia = function (url) {
      return $window.sysinfo.attachurl + url;
    };
    serviceCommon.buildDataTagBegin = function (type, params) {
      var paramsData = {
          'params': params,
          'uniacid': $window.sysinfo.uniacid,
          'acid': $window.sysinfo.acid
        };
      var html = '{data ' + ' func=\'site_widget_' + type + '\' module=\'widget\' widgetdata=' + encodeURIComponent(JSON.stringify(paramsData)) + ' }';
      return html;
    };
    serviceCommon.buildDataTagEnd = function () {
      var html = '{/data}';
      return html;
    };
    serviceCommon.stripHaskey = function (obj) {
      for (var i in obj) {
        if (i == '$$hashKey') {
          delete obj[i];
        } else if (typeof obj[i] == 'object') {
          serviceCommon.stripHaskey(obj[i]);
        }
      }
      return obj;
    };
    serviceCommon.copySuccess = function (id, obj) {
      var id = parseInt(id);
      var obj = obj;
      var enext = $('#copy-' + id).next().html();
      if (!enext || enext.indexOf('<span class="label label-success" style="position:absolute;z-index:10;width:90px;height:34px;line-height:28px;"><i class="fa fa-check-circle"></i> \u590d\u5236\u6210\u529f</span>') < 0) {
        $('#copy-' + id).after(obj);
      }
      setTimeout(function () {
        obj.remove();
      }, 2000);
    };
    return serviceCommon;
  }
]);