angular.module('we7resource').service('serviceResource', [
  '$rootScope',
  '$http',
  '$q',
  function ($rootScope, $http, $q) {
    var serviceResource = {};
    /**
		获取资源
		@key 关键字
		pageNo 当前页
		islocal 本地还是远程
		queryparams  查询参数
	**/
    serviceResource.getResources = function (key, pageNo, islocal, queryParams) {
      var promiseResult = null;
      switch (key) {
      case 'keyword':
        promiseResult = getKeyWordResource(pageNo, queryParams);
        break;
      case 'module':
        promiseResult = getModuleResource(pageNo, queryParams);
        break;
      case 'video':
        promiseResult = getMaterialResource('video', pageNo, islocal);
        break;
      case 'news':
        promiseResult = getMaterialResource('news', pageNo, islocal, queryParams);
        break;
      case 'voice':
        promiseResult = getMaterialResource('voice', pageNo, islocal, queryParams);
        break;
      case 'image':
        promiseResult = getMaterialResource('image', pageNo, islocal, queryParams);
        break;
      }
      return promiseResult;
    };
    serviceResource.imageGroup = function (islocal, queryparams) {
      var deferred = $q.defer();
      var promise = deferred.promise;
      var local = islocal ? 'local' : 'wx';
      var url = './index.php?c=utility&a=file&do=group_list&local=' + local + createQuery(queryparams);
      $http.get(url).then(function (response) {
        if (response.status == 200) {
          var data = response.data.message;
          if (data.errno == '0') {
            deferred.resolve(data.message);
            return;
          }
          deferred.reject({
            state: false,
            message: data.message
          });
        }
      });
      return promise;
    };
    /**
		 * 添加分组
		 * @param {*} groupname 
		 */
    serviceResource.addGroup = function (groupname, islocal, queryparams) {
      var deferred = $q.defer();
      var promise = deferred.promise;
      var local = islocal ? 'local' : 'wx';
      var url = './index.php?c=utility&a=file&do=add_group&local=' + local + createQuery(queryparams);
      $http.post(url, { 'name': groupname }).then(function (response) {
        if (response.status == 200) {
          var data = response.data.message;
          if (data.errno == '0') {
            deferred.resolve(data.message);
            return;
          }
          deferred.reject({
            state: false,
            message: data.message
          });
        }
        deferred.reject({
          state: false,
          message: '\u6dfb\u52a0\u5931\u8d25'
        });
      }, function (error) {
        deferred.reject({
          state: false,
          message: '\u6dfb\u52a0\u5931\u8d25'
        });
      });
      return promise;
    };
    serviceResource.changeGroup = function (group, islocal, queryparams) {
      var deferred = $q.defer();
      var promise = deferred.promise;
      var local = islocal ? 'local' : 'wx';
      var url = './index.php?c=utility&a=file&do=change_group&local=' + local + createQuery(queryparams);
      $http.post(url, {
        'name': group.name,
        'id': group.id
      }).then(function (response) {
        if (response.status == 200) {
          var data = response.data.message;
          if (data.errno == '0') {
            deferred.resolve(data.message);
            return;
          }
          deferred.reject({
            state: false,
            message: data.message
          });
        }
        deferred.reject({
          state: false,
          message: '\u66f4\u65b0\u5931\u8d25'
        });
      }, function (error) {
        deferred.reject({
          state: false,
          message: '\u66f4\u65b0\u5931\u8d25'
        });
      });
      return promise;
    };
    serviceResource.delGroup = function (groupid, islocal, queryparams) {
      var deferred = $q.defer();
      var promise = deferred.promise;
      var local = islocal ? 'local' : 'wx';
      var url = './index.php?c=utility&a=file&do=del_group&local=' + local + createQuery(queryparams);
      $http.post(url, { 'id': groupid }).then(function (response) {
        if (response.status == 200) {
          var data = response.data.message;
          if (data.errno == '0') {
            deferred.resolve(data.message);
            return;
          }
          deferred.reject({
            state: false,
            message: data.message
          });
        }
        deferred.reject({
          state: false,
          message: '\u5220\u9664\u5931\u8d25'
        });
      }, function (error) {
        deferred.reject({
          state: false,
          message: '\u5220\u9664\u5931\u8d25'
        });
      });
      return promise;
    };
    /**
		 * 移动图片的指定分组
		 * @param {*} imageIds 
		 * @param {*} islocal 
		 */
    serviceResource.moveToGroup = function (keys, groupid, islocal, queryparams) {
      var deferred = $q.defer();
      var promise = deferred.promise;
      var local = islocal ? 'local' : 'wx';
      var url = './index.php?c=utility&a=file&do=move_to_group&local=' + local + createQuery(queryparams);
      $http.post(url, {
        'id': groupid,
        keys: keys
      }).then(function (response) {
        if (response.status == 200) {
          var data = response.data.message;
          if (data.errno == '0') {
            deferred.resolve(data.message);
            return;
          }
          deferred.reject({
            state: false,
            message: data.message
          });
        }
        deferred.reject({
          state: false,
          message: '\u79fb\u52a8\u6210\u529f'
        });
      }, function (error) {
        deferred.reject({
          state: false,
          message: '\u79fb\u52a8\u5931\u8d25'
        });
      });
      return promise;
    };
    /**
		 * 
		 * @param {*} keys 
		 */
    serviceResource.delMuti = function (keys, type, islocal, queryParams) {
      var deferred = $q.defer();
      var promise = deferred.promise;
      var local = islocal ? 'local' : 'wx';
      var url = './index.php?c=utility&a=file&do=delete&local=' + local + createQuery(queryParams);
      $http.post(url, {
        'id': keys,
        'type': type
      }).then(function (response) {
        if (response.status == 200) {
          var data = response.data.message;
          if (data.errno == '0') {
            deferred.resolve(true);
            return;
          }
          deferred.reject({
            state: false,
            message: data.message
          });
        }
        deferred.reject({
          state: false,
          message: '\u5220\u9664\u5931\u8d25'
        });
      }, function (error) {
        deferred.reject({
          state: false,
          message: '\u5220\u9664\u5931\u8d25'
        });
      });
      return promise;
    };
    // 获取关键字列表 
    function getKeyWordResource(pageNo, queryParams) {
      var promiseResult = getMaterialResource('keyword', pageNo, true, queryParams);
      return promiseResult;
    }
    function getModuleResource(pageNo, queryParams) {
      var promiseResult = getMaterialResource('module', pageNo, true, queryParams);
      return promiseResult;
    }
    function getMaterialResource(type, pageNo, islocal, queryParams) {
      var deferred = $q.defer();
      var promise = deferred.promise;
      var findmodel = islocal ? 'local' : 'wx';
      var url = './index.php?c=utility&a=file&do=' + type + '&page=' + pageNo + '&local=' + findmodel + createQuery(queryParams);
      $http.get(url).then(function (response) {
        if (response.status == 200) {
          var data = response.data.message;
          if (data.errno == '0') {
            var items = data.message.items;
            deferred.resolve({
              pager: data.message.pager,
              items: items
            });
          }
        }
        deferred.resolve([]);
      }, function (error) {
        deferred.reject(error);
      });
      return promise;
    }
    serviceResource.delItem = function (resourceId, type, islocal, uniacid) {
      var deferred = $q.defer();
      var promise = deferred.promise;
      var server = islocal ? 'local' : 'wechat';
      var url = './index.php?c=platform&a=material&do=delete&uniacid=' + uniacid;
      $http.post(url, {
        'material_id': resourceId,
        'type': type,
        'server': server
      }).then(function (response) {
        if (response.status == 200) {
          var data = response.data.message;
          if (data.errno == '0') {
            deferred.resolve(true);
            return;
          }
          deferred.reject({
            state: false,
            message: data.message
          });
        }
        deferred.reject({
          state: false,
          message: '\u5220\u9664\u5931\u8d25'
        });
      }, function (error) {
        deferred.reject({
          state: false,
          message: '\u5220\u9664\u5931\u8d25'
        });
      });
      return promise;
    };
    // 资源转换 本地转微信 微信转本地
    serviceResource.convert = function (resourceId, type, toLocal) {
      var deferred = $q.defer();
      var promise = deferred.promise;
      var convertType = toLocal ? 'tolocal' : 'towechat';
      var url = './index.php?c=utility&a=file&do=' + convertType + '&type=' + type + '&resource_id=' + resourceId;
      $http.get(url).then(function (response) {
        if (response.status == 200) {
          var data = response.data.message;
          if (data.errno == 0) {
            var item = data.message;
            deferred.resolve(item);
          }
          if (data.errno == 1) {
            deferred.reject(data.message);
          }
        }
        deferred.resolve(null);
      }, function (error) {
        deferred.reject(error);
      });
      return promise;
    };
    // 网络图片转化
    serviceResource.netWorkconvert = function (mediaUrl, toLocal, type) {
      var deferred = $q.defer();
      var promise = deferred.promise;
      var convertType = toLocal ? 'networktolocal' : 'networktowechat';
      var url = './index.php?c=utility&a=file&do=' + convertType + '&url=' + encodeURIComponent(mediaUrl) + '&type=' + type;
      $http.get(url).then(function (response) {
        if (response.status == 200) {
          var data = response.data.message;
          if (data.errno == 0) {
            var item = data.message;
            deferred.resolve(item);
          }
          if (data.errno == 1) {
            deferred.reject(data.message);
          }
        }
        deferred.resolve(null);
      }, function (error) {
        deferred.reject(error);
      });
      return promise;
    };
    function createQuery(queryparams) {
      var queryString = '';
      angular.forEach(queryparams, function (item, key) {
        queryString += '&' + key + '=' + item;
      });
      return queryString;
    }
    return serviceResource;
  }
]);