angular.module('wapeditorApp').service('serviceSubmit', [
  'serviceBase',
  'serviceCommon',
  function (serviceBase, serviceCommon) {
    var serviceSubmit = {};
    serviceSubmit.submit = function () {
      var html = '';
      var submit = {
          'params': {},
          'html': ''
        };
      var temp = $($('.modules').html());
      var activeModules = serviceBase.getBaseData('activeModules');
      temp.find('div.ng-scope[ng-controller$=\'Ctrl\']').each(function () {
        var i = _.findIndex(activeModules, { 'index': parseInt($(this).parent().parent().attr('index')) });
        // 通过animateTemp重新生成animate
        var appEle = $(this).find('div[class^=\'app-\']').get(0);
        var style = $(appEle).attr('style');
        activeModules[i]['params']['animate'] = activeModules[i]['params']['animateTemp'];
        style += 'animation:' + activeModules[i]['params']['animate'] + ';';
        $(appEle).attr('style', style);
        var widgetHtml = '';
        var widgetParams = angular.copy(activeModules[i]['params']);
        $(this).find('.js-default-content').remove();
        var type = $(this).parent().parent().attr('name').toLowerCase();
        if (type != 'UCheader' && type != 'cardBasic' && type != 'cardActivity' && type != 'cardNums' && type != 'cardTimes' && type != 'cardRecharge') {
          // 获取position属性，jquery-ui 中设置，无法捕获，我们在最终调整结束，手动设置 params 
          var curTop = $(this).css('top');
          var curLeft = $(this).css('left');
          var curWidth = $(this).css('width');
          var curHeight = $(this).css('height');
          var positionStyle = 'position:absolute;top:' + curTop + ';left:' + curLeft + ';width:' + curWidth + ';height:' + curHeight + ';';
          activeModules[i].params.positionStyle.top = parseInt(curTop);
          activeModules[i].params.positionStyle.left = parseInt(curLeft);
          activeModules[i].params.positionStyle.width = parseInt(curWidth);
          activeModules[i].params.positionStyle.height = parseInt(curHeight);
          activeModules[i]['positionStyle'] = positionStyle;
        }
        switch (type) {
        case 'link':
          var $this = this;
          angular.forEach(widgetParams.items, function (value, key) {
            if (value['selectCate']['pid'] || value['selectCate']['cid']) {
              $($this).find('.list-group').children().eq(key).replaceWith('<div>' + serviceCommon.buildDataTagBegin('link', value) + '<div class="list-group-item ng-scope"><a href="{$row[url]}" class="clearfix"><span class="app-nav-title"> {$row[title]}<i class="pull-right fa fa-angle-right"></i></span></a></div>' + serviceCommon.buildDataTagEnd() + '</div>');
            }
          });
          break;
        case 'richtext':
          if (activeModules[i]) {
            activeModules[i]['params']['content'] = '';
          }
          break;
        }
        widgetHtml = $(this).html();
        if (type != 'header') {
          var positionStyle = $(this).attr('style');
          html += '<div type="' + type + '" style="' + positionStyle + '">' + widgetHtml + '</div>';
        }
        i++;
      });
      var color = activeModules[0].params.bgColor;
      html = '<div class="js-design-page" style="background-color:' + color + '">' + html + '</div>';
      html = html.replace(/<\!\-\-([^-]*?)\-\->/g, '');
      html = html.replace(/ ng\-[a-zA-Z-]+=\"[^\"]*\"/g, '');
      html = html.replace(/ ng\-[a-zA-Z]+/g, '');
      submit.html = html;
      submit.params = angular.copy(activeModules);
      serviceCommon.stripHaskey(submit.params);
      return submit;
    };
    return serviceSubmit;
  }
]);