angular.module('wapeditorApp').value('widget', [
  {
    'id': 'header',
    'name': '\u5fae\u9875\u9762\u6807\u9898',
    'issystem': true,
    'params': {
      'title': '\u5fae\u9875\u9762\u6807\u9898',
      'description': '',
      'pageHeight': 568,
      'thumb': '',
      'bgColor': '',
      'bottom_menu': false,
      'baseStyle': {},
      'borderStyle': {},
      'shadowStyle': {},
      'positionStyle': {},
      'animationStyle': {}
    }
  },
  {
    'id': 'UCheader',
    'name': '\u4f1a\u5458\u4e3b\u9875',
    'issystem': true,
    'params': {
      'title': '\u4f1a\u5458\u4e3b\u9875',
      'cover': '',
      'bgImage': ''
    }
  },
  {
    'id': 'cardBasic',
    'name': '\u4f1a\u5458\u5361\u57fa\u672c\u8bbe\u7f6e',
    'issystem': true,
    'params': {
      'title': '\u4f1a\u5458\u5361',
      'color': {
        'title': '#333',
        'rank': '#333',
        'name': '#333',
        'number': '#333'
      },
      'card_level': { 'type': 1 },
      'card_label': {
        'type': 1,
        'title': '\u4f1a\u5458\u5361\u6807\u9898'
      },
      'description': '1\u3001\u672c\u5361\u91c7\u53d6\u8bb0\u540d\u6d88\u8d39\u65b9\u5f0f\n2\u3001\u6301\u5361\u4eba\u53ef\u4eab\u53d7\u4f1a\u5458\u4e13\u5c5e\u4f18\u60e0\n3\u3001\u672c\u5361\u4e0d\u80fd\u4e0e\u5176\u4ed6\u4f18\u60e0\u6d3b\u52a8\u540c\u65f6\u4f7f\u7528\n4\u3001\u6301\u5361\u4eba\u53ef\u7528\u5361\u5185\u4f59\u989d\u8fdb\u884c\u6d88\u8d39',
      'background': {
        'type': 'system',
        'image': util.tomedia('images/global/card/6.png')
      },
      'logo': util.tomedia('http://www.baidu.com/img/bdlogo.gif'),
      'format_type': 1,
      'format': 'WQ2015*****#####***',
      'fields': [
        {
          'title': '\u59d3\u540d',
          'require': 1,
          'bind': 'realname'
        },
        {
          'title': '\u624b\u673a',
          'require': 1,
          'bind': 'mobile'
        }
      ],
      'grant': {
        'credit1': 0,
        'credit2': 0,
        'coupon': []
      },
      'grant_rate': 0,
      'offset_rate': 0,
      'offset_max': 0
    }
  },
  {
    'id': 'cardActivity',
    'name': '\u6d88\u8d39\u4f18\u60e0\u8bbe\u7f6e',
    'issystem': true,
    'params': {
      'discount_type': 0,
      'discount_style': 1,
      'discounts': [],
      'content': '',
      'bgColor': ''
    }
  },
  {
    'id': 'cardNums',
    'name': '\u4f1a\u5458\u5361\u6b21\u6570\u8bbe\u7f6e',
    'issystem': true,
    'params': {
      'nums_status': 0,
      'nums_style': 1,
      'nums_text': '\u53ef\u7528\u6b21\u6570',
      'nums': [
        {
          'recharge': 100,
          'num': 5
        },
        {
          'recharge': 200,
          'num': 10
        }
      ]
    }
  },
  {
    'id': 'cardTimes',
    'name': '\u4f1a\u5458\u5361\u8ba1\u65f6\u8bbe\u7f6e',
    'issystem': true,
    'params': {
      'times_status': 0,
      'times_style': 1,
      'times_text': '\u622a\u81f3\u65e5\u671f',
      'times': [
        {
          'recharge': 100,
          'time': 5
        },
        {
          'recharge': 200,
          'time': 10
        }
      ]
    }
  },
  {
    'id': 'cardRecharge',
    'name': '\u5145\u503c\u4f18\u60e0\u8bbe\u7f6e',
    'issystem': true,
    'params': {
      'recharge_type': 0,
      'recharge_style': 1,
      'grant_rate_switch': 1,
      'recharges': [
        {
          'condition': '',
          'back': '',
          'backtype': '0',
          'backunit': '\u5143'
        },
        {
          'condition': '',
          'back': '',
          'backtype': '0',
          'backunit': '\u5143'
        },
        {
          'condition': '',
          'back': '',
          'backtype': '0',
          'backunit': '\u5143'
        },
        {
          'condition': '',
          'back': '',
          'backtype': '0',
          'backunit': '\u5143'
        }
      ],
      'content': '',
      'bgColor': ''
    }
  },
  {
    'id': 'onlyText',
    'name': '\u6587\u5b57',
    'isbase': true,
    'params': {
      'title': '\u8bf7\u8f93\u5165\u6587\u5b57',
      'baseStyle': {},
      'borderStyle': {},
      'shadowStyle': {},
      'animationStyle': {},
      'positionStyle': {
        'top': 100,
        'left': 60,
        'width': 200,
        'height': 30
      }
    }
  },
  {
    'id': 'image',
    'name': '\u56fe\u7247',
    'isbase': true,
    'params': {
      'items': {
        'id': '',
        'imgurl': ''
      },
      'baseStyle': {},
      'borderStyle': {},
      'shadowStyle': {},
      'animationStyle': {},
      'positionStyle': {
        'top': 169,
        'left': 0,
        'width': 100,
        'height': 100
      }
    }
  },
  {
    'id': 'shape',
    'name': '\u5f62\u72b6',
    'isbase': true,
    'params': {
      'svgValue': '',
      'baseStyle': {},
      'borderStyle': {},
      'shadowStyle': {},
      'animationStyle': {},
      'positionStyle': {
        'top': 64,
        'left': 0,
        'width': 100,
        'height': 100
      }
    }
  },
  {
    'id': 'pureLink',
    'name': '\u94fe\u63a5',
    'isbase': true,
    'params': {
      'items': [
        {
          'id': '1',
          'type': 'text',
          'title': '\u70b9\u6211\u8d2d\u4e70',
          'url': '',
          'color': '#fff',
          'editcolor': 'danger',
          'discolor': '#d9534f',
          'active': 1
        },
        {
          'id': '2',
          'type': 'text',
          'title': '\u70b9\u5f00\u94fe\u63a5',
          'url': '',
          'color': '#fff',
          'editcolor': 'warning',
          'discolor': '#ec971f',
          'active': 0
        },
        {
          'id': '3',
          'type': 'text',
          'title': '\u9a6c\u4e0a\u8d2d\u4e70',
          'url': '',
          'color': '#fff',
          'editcolor': 'success',
          'discolor': '#449d44',
          'active': 0
        },
        {
          'id': '4',
          'type': 'text',
          'title': '\u5173\u6ce8\u6211\u4eec',
          'url': '',
          'color': '#000',
          'editcolor': 'default',
          'discolor': '#fff',
          'active': 0
        },
        {
          'id': '5',
          'type': 'img',
          'title': '\u81ea\u5b9a\u4e49',
          'url': '',
          'imgurl': '',
          'editcolor': 'primary',
          'discolor': '',
          'active': 0
        }
      ],
      'baseStyle': {
        'backgroundColor': '#d9534f',
        'color': '#fff',
        'textAlign': 'center',
        'fontSize': '14',
        'lineHeight': '33px'
      },
      'borderStyle': {
        'borderWidth': 1,
        'borderRadius': 4,
        'borderStyle': 'solid',
        'borderColor': '#ADADAD'
      },
      'shadowStyle': {},
      'animationStyle': {},
      'positionStyle': {
        'top': 244,
        'left': 0,
        'width': 85,
        'height': 35
      }
    }
  },
  {
    'id': 'dial',
    'name': '\u62e8\u53f7',
    'isbase': true,
    'params': {
      'items': [
        {
          'id': '1',
          'type': 'text',
          'title': '\u4e00\u952e\u62e8\u53f7',
          'tel': '',
          'color': '#fff',
          'editcolor': 'danger',
          'discolor': '#d9534f',
          'active': 1
        },
        {
          'id': '2',
          'type': 'text',
          'title': '\u70ed\u7ebf\u7535\u8bdd',
          'tel': '',
          'color': '#fff',
          'editcolor': 'warning',
          'discolor': '#ec971f',
          'active': 0
        },
        {
          'id': '3',
          'type': 'text',
          'title': '\u62e8\u6253\u7535\u8bdd',
          'tel': '',
          'color': '#fff',
          'editcolor': 'success',
          'discolor': '#449d44',
          'active': 0
        },
        {
          'id': '4',
          'type': 'text',
          'title': '\u9500\u552e\u4e13\u7ebf',
          'tel': '',
          'color': '#000',
          'editcolor': 'default',
          'discolor': '#fff',
          'active': 0
        },
        {
          'id': '5',
          'type': 'img',
          'title': '\u81ea\u5b9a\u4e49',
          'tel': '',
          'imgurl': '',
          'editcolor': 'primary',
          'discolor': '',
          'active': 0
        }
      ],
      'baseStyle': {
        'backgroundColor': '#d9534f',
        'color': '#fff',
        'textAlign': 'center',
        'fontSize': '14',
        'lineHeight': '33px'
      },
      'borderStyle': {
        'borderWidth': 1,
        'borderRadius': 4,
        'borderStyle': 'solid',
        'borderColor': '#ADADAD'
      },
      'shadowStyle': {},
      'animationStyle': {},
      'positionStyle': {
        'top': 274,
        'left': 100,
        'width': 85,
        'height': 35
      }
    }
  },
  {
    'id': 'good',
    'name': '\u70b9\u8d5e',
    'isbase': true,
    'params': {
      'bgcolor': '#d15d82',
      'color': '#fff',
      'layoutstyle': 1,
      'layoutactive': 'lr',
      'baseStyle': {
        'color': '#fff',
        'backgroundColor': '#d15d82',
        'fontSize': '14px',
        'textAlign': 'center',
        'lineHeight': '48px'
      },
      'borderStyle': {
        'borderWidth': 1,
        'borderRadius': 4,
        'borderStyle': 'solid',
        'borderColor': '#ADADAD'
      },
      'shadowStyle': {},
      'animationStyle': {},
      'positionStyle': {
        'width': 150,
        'height': 50,
        'top': 174,
        'left': 70
      }
    }
  },
  {
    'id': 'countDown',
    'name': '\u5012\u8ba1\u65f6',
    'isbase': true,
    'params': {
      'leftTimeText': {
        'day': 0,
        'hour': 0,
        'min': 0,
        'sec': 0
      },
      'deadtime': '',
      'textalign': 'center',
      'baseStyle': {
        'fontSize': '13px',
        'textAlign': 'center',
        'lineHeight': '48px'
      },
      'borderStyle': {
        'borderWidth': 1,
        'borderRadius': 4,
        'borderStyle': 'solid',
        'borderColor': '#ccc'
      },
      'shadowStyle': {},
      'animationStyle': {},
      'positionStyle': {
        'top': 315,
        'left': 50
      }
    }
  },
  {
    'id': 'richText',
    'name': '\u5bcc\u6587\u672c',
    'params': {
      'bgColor': '',
      'content': '',
      'isfull': false,
      'baseStyle': {},
      'borderStyle': {},
      'shadowStyle': {},
      'animationStyle': {},
      'positionStyle': {
        'left': 0,
        'top': 10,
        'width': 320,
        'height': 410
      }
    }
  },
  {
    'id': 'adImg',
    'name': '\u5e7b\u706f\u7247',
    'params': {
      'listStyle': 1,
      'sizeType': 1,
      'items': [],
      'baseStyle': {},
      'borderStyle': {},
      'shadowStyle': {},
      'animationStyle': {},
      'positionStyle': {
        'left': 0,
        'width': 320,
        'height': 80
      }
    }
  },
  {
    'id': 'cube',
    'name': '\u56fe\u7247\u9b54\u65b9',
    'params': {
      'layout': {},
      'showIndex': 0,
      'selection': {},
      'currentPos': {},
      'currentLayout': { 'isempty': true },
      'baseStyle': {},
      'borderStyle': {},
      'shadowStyle': {},
      'animationStyle': {},
      'positionStyle': {
        'left': 0,
        'width': 320,
        'height': 30
      }
    }
  },
  {
    'id': 'title',
    'name': '\u6807\u9898',
    'params': {
      'title': '',
      'template': 1,
      'tradition': {
        'subtitle': '',
        'align': 'left',
        'nav': {
          'title': '',
          'url': '',
          'enable': 0
        }
      },
      'news': {
        'date': '',
        'author': '',
        'title': '',
        'urlType': 1,
        'url': ''
      },
      'baseStyle': {},
      'borderStyle': {},
      'shadowStyle': {},
      'animationStyle': {},
      'positionStyle': {
        'left': 0,
        'width': 320,
        'height': 96
      }
    }
  },
  {
    'id': 'textNav',
    'name': '\u6587\u672c\u5bfc\u822a',
    'params': {
      'items': [],
      'borderStyle': {},
      'shadowStyle': {},
      'animationStyle': {},
      'positionStyle': {
        'left': 0,
        'width': 320,
        'height': 30
      }
    }
  },
  {
    'id': 'navImg',
    'name': '\u56fe\u7247\u5bfc\u822a',
    'params': {
      'items': [
        {
          'imgurl': '',
          'title': '',
          'url': ''
        },
        {
          'imgurl': '',
          'title': '',
          'url': ''
        },
        {
          'imgurl': '',
          'title': '',
          'url': ''
        },
        {
          'imgurl': '',
          'title': '',
          'url': ''
        }
      ],
      'borderStyle': {},
      'shadowStyle': {},
      'animationStyle': {},
      'positionStyle': {
        'left': 0,
        'width': 320,
        'height': 100
      }
    }
  },
  {
    'id': 'link',
    'name': '\u5173\u8054\u94fe\u63a5',
    'params': {
      'items': [],
      'baseStyle': { 'lineHeight': 'inherit' },
      'borderStyle': {},
      'shadowStyle': {},
      'animationStyle': {},
      'positionStyle': {
        'left': 0,
        'width': 320,
        'height': 100
      }
    }
  },
  {
    'id': 'line',
    'name': '\u8f85\u52a9\u7ebf',
    'params': {
      'baseStyle': {},
      'borderStyle': {},
      'shadowStyle': {},
      'animationStyle': {},
      'positionStyle': { 'height': 30 }
    }
  },
  {
    'id': 'white',
    'name': '\u8f85\u52a9\u7a7a\u767d',
    'params': {
      'baseStyle': {},
      'borderStyle': {},
      'shadowStyle': {},
      'animationStyle': {},
      'positionStyle': {
        'left': 0,
        'width': 320,
        'height': 20
      }
    }
  },
  {
    'id': 'audio',
    'name': '\u8bed\u97f3',
    'params': {
      'style': '1',
      'headimg': '',
      'align': 'left',
      'title': '',
      'isloop': false,
      'reload': 'false',
      'audio': {
        'id': '',
        'url': ''
      },
      'baseStyle': {},
      'borderStyle': {},
      'shadowStyle': {},
      'animationStyle': {},
      'positionStyle': {
        'left': 0,
        'width': 320,
        'height': 60
      }
    }
  },
  {
    'id': 'notice',
    'name': '\u516c\u544a',
    'params': {
      'notice': '',
      'baseStyle': { 'backgroundColor': '#ffc' },
      'borderStyle': {},
      'shadowStyle': {},
      'animationStyle': {},
      'positionStyle': {
        'left': 0,
        'width': 320,
        'height': 40
      }
    }
  }
]);