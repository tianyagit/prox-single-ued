angular.module('wesiteApp').service('serviceHomeMenuBase', [
  '$rootScope',
  function ($rootScope) {
    var serviceHomeMenuBase = {};
    serviceHomeMenuBase.initHomemenuInfo = function () {
      var info = {
          css: {
            icon: {
              width: '',
              color: '',
              icon: ''
            }
          },
          name: '',
          description: '',
          url: '',
          status: 1,
          displayorder: 0,
          icon: '',
          icontype: 1,
          section: 0
        };
      return info;
    };
    serviceHomeMenuBase.initSections = function () {
      var sections = [
          {
            num: 0,
            val: '\u4e0d\u8bbe\u7f6e\u4f4d\u7f6e'
          },
          {
            num: 1,
            val: '\u4f4d\u7f6e1'
          },
          {
            num: 2,
            val: '\u4f4d\u7f6e2'
          },
          {
            num: 3,
            val: '\u4f4d\u7f6e3'
          },
          {
            num: 4,
            val: '\u4f4d\u7f6e4'
          },
          {
            num: 5,
            val: '\u4f4d\u7f6e5'
          },
          {
            num: 6,
            val: '\u4f4d\u7f6e6'
          },
          {
            num: 7,
            val: '\u4f4d\u7f6e7'
          },
          {
            num: 8,
            val: '\u4f4d\u7f6e8'
          },
          {
            num: 9,
            val: '\u4f4d\u7f6e9'
          },
          {
            num: 10,
            val: '\u4f4d\u7f6e10'
          }
        ];
      return sections;
    };
    return serviceHomeMenuBase;
  }
]);