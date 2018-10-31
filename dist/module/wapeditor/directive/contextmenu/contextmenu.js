angular.module('wapeditorApp').directive('we7ContextMenu', [
  'serviceBase',
  '$timeout',
  function (serviceBase, $timeout) {
    return {
      link: function (scope, element, attr) {
        var menuDOM = '<menu class="right-hand-menu"> <li class="menu-item menu-item-del"> <button type="button" class="menu-btn"> <i class="fa fa-folder-open"></i> <span class="menu-text">\u5220\u9664</span> </button> </li> <li class="menu-item menu-item-top"> <button type="button" class="menu-btn"> <i class="fa fa-folder-open"></i> <span class="menu-text">\u7f6e\u9876</span> </button> </li> <li class="menu-item menu-item-up"> <button type="button" class="menu-btn"> <i class="fa fa-folder-open"></i> <span class="menu-text">\u4e0a\u79fb\u4e00\u5c42</span> </button> </li> <li class="menu-item menu-item-down"> <button type="button" class="menu-btn"> <i class="fa fa-folder-open"></i> <span class="menu-text">\u4e0b\u79fb\u4e00\u5c42</span> </button> </li> <li class="menu-item menu-item-bottom"> <button type="button" class="menu-btn"> <i class="fa fa-folder-open"></i> <span class="menu-text">\u7f6e\u5e95</span> </button> </li> </menu>';
        // 首次追加dom，并绑定dom事件
        if (!$('.right-hand-menu').length) {
          $('body').append(menuDOM);
          $('.modules').on('contextmenu', function (e) {
            e.preventDefault();
          });
          $(document).on('mouseup', function () {
            $('.right-hand-menu').removeClass('show-menu');
          });
          // 右键菜单相关方法
          $('.right-hand-menu').on('click', '.menu-item-del', function () {
            var index = $('.right-hand-menu').data('item-index');
            serviceBase.deleteItem(index);
            $timeout(function () {
              scope.$apply();
            }, 100);
          }).on('click', '.menu-item-top', function () {
            scope.savePagePosition();
            var index = $('.right-hand-menu').data('item-index');
            var newActiveModules = [];
            var currentModule;
            for (var i in scope.activeModules) {
              if (scope.activeModules[i].index == index) {
                currentModule = angular.copy(scope.activeModules[i]);
              } else {
                newActiveModules.push(scope.activeModules[i]);
              }
            }
            newActiveModules.push(currentModule);
            serviceBase.setBaseData('activeModules', newActiveModules);
            $timeout(function () {
              scope.$apply();
            }, 100);
          }).on('click', '.menu-item-up', function () {
            scope.savePagePosition();
            var index = $('.right-hand-menu').data('item-index');
            var currentModule, nextModule;
            var ModuleLength = scope.activeModules.length;
            for (var i in scope.activeModules) {
              if (scope.activeModules[i].index == index) {
                if (parseInt(i) + 1 == ModuleLength)
                  break;
                currentModule = angular.copy(scope.activeModules[i]);
                nextModule = angular.copy(scope.activeModules[parseInt(i) + 1]);
                scope.activeModules[i] = nextModule;
                scope.activeModules[parseInt(i) + 1] = currentModule;
                serviceBase.setBaseData('activeModules', scope.activeModules);
                break;
              }
            }
            $timeout(function () {
              scope.$apply();
            }, 100);
          }).on('click', '.menu-item-down', function () {
            scope.savePagePosition();
            var index = $('.right-hand-menu').data('item-index');
            var currentModule, prevModule;
            for (var i in scope.activeModules) {
              if (scope.activeModules[i].index == index) {
                if (i <= 1)
                  break;
                currentModule = angular.copy(scope.activeModules[i]);
                prevModule = angular.copy(scope.activeModules[i - 1]);
                scope.activeModules[i] = prevModule;
                scope.activeModules[parseInt(i) - 1] = currentModule;
                serviceBase.setBaseData('activeModules', scope.activeModules);
                break;
              }
            }
            $timeout(function () {
              scope.$apply();
            }, 100);
          }).on('click', '.menu-item-bottom', function () {
            scope.savePagePosition();
            var index = $('.right-hand-menu').data('item-index');
            var newActiveModules = [];
            var currentModule;
            for (var i in scope.activeModules) {
              if (i != 0) {
                if (scope.activeModules[i].index == index) {
                  currentModule = angular.copy(scope.activeModules[i]);
                } else {
                  newActiveModules.push(scope.activeModules[i]);
                }
              }
            }
            newActiveModules.unshift(currentModule);
            newActiveModules.unshift(scope.activeModules[0]);
            serviceBase.setBaseData('activeModules', newActiveModules);
            $timeout(function () {
              scope.$apply();
            }, 100);
          });
        }
        ;
        element.on('contextmenu', function (e) {
          showMenu(e.pageX, e.pageY);
          var moduleId = element.parents('div[id^=\'module-\']').attr('index');
          $('.right-hand-menu').data('item-index', moduleId);  // 记录模块的index
        });
        function showMenu(x, y) {
          // 相对于 '右侧' div进行定位
          var menu = $('.right-hand-menu');
          var parentPos = menu.parent().position();
          x = x - parentPos.left;
          y = y - parentPos.top;
          menu.css({
            'left': x + 'px',
            'top': y + 'px'
          });
          menu.addClass('show-menu');
        }
        ;
        function hideMenu() {
          $('.right-hand-menu').removeClass('show-menu');
        }
        ;
      }
    };
  }
]);