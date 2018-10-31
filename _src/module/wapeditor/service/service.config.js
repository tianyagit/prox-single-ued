angular.module('wapeditorApp')
.value('widget',[
	{
		'id' : 'header',
		'name' : '微页面标题',
		'issystem' : true,
		'params' : {
			'title' : '微页面标题',
			'description' : '',
			'pageHeight' : 568,
			'thumb' : '',
			'bgColor' : '',
			'bottom_menu' : false,
			'baseStyle' : {},
			'borderStyle' : {},
			'shadowStyle' : {},
			'positionStyle' : {},
			'animationStyle' : {}
		}
	},{
		'id' : 'UCheader',
		'name' : '会员主页',
		'issystem' : true,
		'params' : {
			'title' : '会员主页',
			'cover' : '',
			'bgImage' : ''
		}
	},{
		'id' : 'cardBasic',
		'name' : '会员卡基本设置',
		'issystem' : true,
		'params' : {
			'title' : '会员卡',
			'color' : {
				'title' : '#333',
				'rank' : '#333',
				'name' : '#333',
				'number' : '#333'
			},
			'card_level' : {
				'type' : 1,
			},
			'card_label' : {
				'type' : 1,
				'title' : '会员卡标题'
			},
			'description' : '1、本卡采取记名消费方式\n2、持卡人可享受会员专属优惠\n3、本卡不能与其他优惠活动同时使用\n4、持卡人可用卡内余额进行消费',
			'background' : {
				'type' : 'system',
				'image' : util.tomedia('images/global/card/6.png')
			},
			'logo' : util.tomedia('http://www.baidu.com/img/bdlogo.gif'),
			'format_type' : 1,
			'format' : 'WQ2015*****#####***',
			'fields' : [
				{
					'title' : '姓名',
					'require' : 1,
					'bind' : 'realname'
				},
				{
					'title' : '手机',
					'require' : 1,
					'bind' : 'mobile'
				}
			],
			'grant' : {
				'credit1' : 0,
				'credit2' : 0,
				'coupon' : [],
			},
			'grant_rate' : 0,
			'offset_rate' : 0,
			'offset_max' : 0
		}
	},{
		'id' : 'cardActivity',
		'name' : '消费优惠设置',
		'issystem' : true,
		'params' : {
			'discount_type' : 0,
			'discount_style' : 1,
			'discounts' : [],
			'content' : '',
			'bgColor' : ''
		}
	},{
		'id' : 'cardNums',
		'name' : '会员卡次数设置',
		'issystem' : true,
		'params' : {
			'nums_status' : 0,
			'nums_style' : 1,
			'nums_text' : '可用次数',
			'nums' : [
				{
					'recharge' : 100,
					'num' : 5
				},
				{
					'recharge' : 200,
					'num' : 10
				}
			]
		}
	},{
		'id' : 'cardTimes',
		'name' : '会员卡计时设置',
		'issystem' : true,
		'params' : {
			'times_status' : 0,
			'times_style' : 1,
			'times_text' : '截至日期',
			'times' : [
				{
					'recharge' : 100,
					'time' : 5
				},
				{
					'recharge' : 200,
					'time' : 10
				}
			]
		}
	},{
		'id' : 'cardRecharge',
		'name' : '充值优惠设置',
		'issystem' : true,
		'params' : {
			'recharge_type' : 0,
			'recharge_style' : 1,
			'grant_rate_switch' : 1,
			'recharges' : [
				{
					'condition' : '' ,
					'back' : '',
					'backtype' : '0',
					'backunit' : '元'
				},
				{
					'condition' : '',
					'back' : '',
					'backtype' : '0',
					'backunit' : '元'
				},
				{
					'condition' : '',
					'back' : '',
					'backtype' : '0',
					'backunit' : '元'
				},
				{
					'condition' : '',
					'back' : '',
					'backtype' : '0',
					'backunit' : '元'
				}
			],
			'content' : '',
			'bgColor' : ''
		}
	},{
		'id' : 'onlyText',
		'name' : '文字',
		'isbase' : true,
		'params' : {
			'title' : '请输入文字',
			'baseStyle' : {},
			'borderStyle' : {},
			'shadowStyle' : {},
			'animationStyle' : {},
			'positionStyle' : {
				'top' : 100,
				'left' : 60,
				'width' : 200,
				'height' : 30
			}
		}
	},{
		'id' : 'image',
		'name' : '图片',
		'isbase' : true,
		'params' : {
			'items' : {'id': '', 'imgurl' : ''},
			'baseStyle' : {},
			'borderStyle' : {},
			'shadowStyle' : {},
			'animationStyle' : {},
			'positionStyle' : {
				'top' : 169,
				'left' : 0,
				'width' : 100,
				'height' : 100
			}
		}
	},{
		'id' : 'shape',
		'name' : '形状',
		'isbase' : true,
		'params' : {
			'svgValue' : '',
			'baseStyle' : {},
			'borderStyle' : {},
			'shadowStyle' : {},
			'animationStyle' : {},
			'positionStyle' : {
				'top' : 64,
				'left' : 0,
				'width' : 100,
				'height' : 100
			}
		}
	},{
		'id' : 'pureLink',
		'name' : '链接',
		'isbase' : true,
		'params' : {
			'items' : [
				{'id': '1', 'type': 'text','title' : '点我购买','url' : '','color' : '#fff', 'editcolor' : 'danger', 'discolor' : '#d9534f', 'active' : 1},
				{'id': '2', 'type': 'text','title' : '点开链接','url' : '','color' : '#fff', 'editcolor' : 'warning', 'discolor' : '#ec971f', 'active' : 0},
				{'id': '3', 'type': 'text','title' : '马上购买','url' : '','color' : '#fff', 'editcolor' : 'success', 'discolor' : '#449d44', 'active' : 0},
				{'id': '4', 'type': 'text','title' : '关注我们','url' : '','color' : '#000', 'editcolor' : 'default', 'discolor' : '#fff', 'active' : 0},
				{'id': '5', 'type': 'img','title' : '自定义','url' : '', 'imgurl' : '', 'editcolor' : 'primary', 'discolor' : '', 'active' : 0}
			],
			'baseStyle' : {
				'backgroundColor' : '#d9534f',
				'color' : '#fff',
				'textAlign' : 'center',
				'fontSize' : '14',
				'lineHeight' : '33px'
			},
			'borderStyle' : {
				'borderWidth' : 1,
				'borderRadius' : 4,
				'borderStyle' : 'solid',
				'borderColor' : '#ADADAD'
			},
			'shadowStyle' : {},
			'animationStyle' : {},
			'positionStyle' : {
				'top' : 244,
				'left' : 0,
				'width' : 85,
				'height' : 35 
			}
		}
	},{
		'id' : 'dial',
		'name' : '拨号',
		'isbase' : true,
		'params' : {
			'items' : [
				{'id': '1', 'type': 'text','title' : '一键拨号','tel' : '','color' : '#fff', 'editcolor' : 'danger', 'discolor' : '#d9534f', 'active' : 1},
				{'id': '2', 'type': 'text','title' : '热线电话','tel' : '','color' : '#fff', 'editcolor' : 'warning', 'discolor' : '#ec971f', 'active' : 0},
				{'id': '3', 'type': 'text','title' : '拨打电话','tel' : '','color' : '#fff', 'editcolor' : 'success', 'discolor' : '#449d44', 'active' : 0},
				{'id': '4', 'type': 'text','title' : '销售专线','tel' : '','color' : '#000', 'editcolor' : 'default', 'discolor' : '#fff', 'active' : 0},
				{'id': '5', 'type': 'img','title' : '自定义','tel' : '', 'imgurl' : '', 'editcolor' : 'primary', 'discolor' : '', 'active' : 0}
			],
			'baseStyle' : {
				'backgroundColor' : '#d9534f',
				'color' : '#fff',
				'textAlign' : 'center',
				'fontSize' : '14',
				'lineHeight' : '33px'
			},
			'borderStyle' : {
				'borderWidth' : 1,
				'borderRadius' : 4,
				'borderStyle' : 'solid',
				'borderColor' : '#ADADAD'
			},
			'shadowStyle' : {},
			'animationStyle' : {},
			'positionStyle' : {
				'top' : 274,
				'left' : 100,
				'width' : 85,
				'height' : 35 
			}
		}
	},{
		'id' : 'good',
		'name' : '点赞',
		'isbase' : true,
		'params' : {
			'bgcolor' : '#d15d82',
			'color' : '#fff',
			'layoutstyle' : 1,/*1:左右;2:上下*/
			'layoutactive' : 'lr', /*lr:左右;ud:上下*/
			'baseStyle' : {
				'color' : '#fff',
				'backgroundColor' : '#d15d82',
				'fontSize' : '14px',
				'textAlign' : 'center',
				'lineHeight' : '48px'
			},
			'borderStyle' : {
				'borderWidth' : 1,
				'borderRadius' : 4,
				'borderStyle' : 'solid',
				'borderColor' : '#ADADAD'
			},
			'shadowStyle' : {},
			'animationStyle' : {},
			'positionStyle' : {
				'width' : 150,
				'height' : 50,
				'top' : 174,
				'left' : 70
			}
		}
	// },{
	// 	'id' : 'reward',
	// 	'name' : '打赏',
	// 	'isbase' : 'false',
	// 	'params' : {
	// 		'bgcolor' : '#d15d82',
	// 		'fonttype' : 'middle',
	// 		'font-size' : '26px',
	// 		'fontactive' : 'middle',
	// 		'color' : '#fff',
		// 'baseStyle' : {
		// 	'color' : '#fff',
		// 	'backgroundColor' : '#f0ad4e',
		// 	'fontSize' : '14px',
		// 	'textAlign' : 'center',
		// 	'lineHeight' : '48px'
		// },
		// 'borderStyle' : {
		// 	'borderWidth' : 1,
		// 	'borderRadius' : 4,
		// 	'borderStyle' : 'solid',
		// 	'borderColor' : '#ADADAD'
		// },
		// 'shadowStyle' : {},
		// 'animationStyle' : {},
		// 'positionStyle' : {
		// 	'width' : 150,
		// 	'height' : 50
		// }
	// 	}
	},{
		'id' : 'countDown',
		'name' : '倒计时',
		'isbase' : true,
		'params' : {
			'leftTimeText' : {
				'day': 0,
				'hour': 0,
				'min': 0,
				'sec': 0
			},
			'deadtime' : '',			
			'textalign' : 'center',
			'baseStyle' : {
				'fontSize' : '13px',
				'textAlign' : 'center',
				'lineHeight' : '48px',
			},
			'borderStyle' : {
				'borderWidth' : 1,
				'borderRadius' : 4,
				'borderStyle' : 'solid',
				'borderColor' : '#ccc'
			},
			'shadowStyle' : {},
			'animationStyle' : {},
			'positionStyle' : {
				'top' : 315,
				'left' : 50
			}
		}
	},{
		'id' : 'richText',
		'name' : '富文本',
		'params' : {
			'bgColor' : '',
			'content' : '',
			'isfull' : false,
			'baseStyle' : {},
			'borderStyle' : {},
			'shadowStyle' : {},
			'animationStyle' : {},
			'positionStyle' : {
				'left' : 0,
				'top' : 10,
				'width' : 320,
				'height' : 410
			}
		}
	},{
		'id' : 'adImg',
		'name' : '幻灯片',
		'params' : {
			'listStyle' : 1,
			'sizeType' : 1,
			'items' : [],
			'baseStyle' : {},
			'borderStyle' : {},
			'shadowStyle' : {},
			'animationStyle' : {},
			'positionStyle' : {
				'left' : 0,
				'width' : 320,
				'height' : 80
			}
		}
	},{
		'id' : 'cube',
		'name' : '图片魔方',
		'params' : {
			'layout' : {},
			'showIndex' : 0,
			'selection' : {}, /*弹出选择布局*/
			'currentPos' : {}, /*当前点击的格子坐标*/
			'currentLayout' :  {'isempty' : true}, /*当前选中的布局*/
			'baseStyle' : {},
			'borderStyle' : {},
			'shadowStyle' : {},
			'animationStyle' : {},
			'positionStyle' : {
				'left' : 0,
				'width' : 320,
				'height' : 30
			}
		}
	},{
		'id' : 'title',
		'name' : '标题',
		'params' : {
			'title' : '', // 标题名
			'template' : 1, // 标题模板: 1.传统样式, 2.模仿微信图文页样式
			'tradition' : {
				'subtitle' : '', // 副标题
				'align': 'left', // 显示: 1左,2中,3右
				'nav' : {
					'title':'',
					'url': '',
					'enable' : 0
				}
			},
			'news' : {
				'date' : '', // 日期
				'author' :'', // 作者
				'title' : '', // 链接标题
				'urlType' : 1,  // 链接类型
				'url' : ''
			},
			'baseStyle' : {},
			'borderStyle' : {},
			'shadowStyle' : {},
			'animationStyle' : {},
			'positionStyle' : {
				'left' : 0,
				'width' : 320,
				'height' : 96
			}
		}
	},{
		'id' : 'textNav',
		'name' : '文本导航',
		'params' : {
			'items' : [],
			'borderStyle' : {},
			'shadowStyle' : {},
			'animationStyle' : {},
			'positionStyle' : {
				'left' : 0,
				'width' : 320,
				'height' : 30
			}
		}
	},{
		'id' : 'navImg',
		'name' : '图片导航',
		'params' : {
			'items' : [
				{'imgurl': '', 'title': '', 'url' : ''},
				{'imgurl': '', 'title': '', 'url' : ''},
				{'imgurl': '', 'title': '', 'url' : ''},
				{'imgurl': '', 'title': '', 'url' : ''}
			],
			'borderStyle' : {},
			'shadowStyle' : {},
			'animationStyle' : {},
			'positionStyle' : {
				'left' : 0,
				'width' : 320,
				'height' : 100
			}
		}
	},{
		'id' : 'link',
		'name' : '关联链接',
		'params' : {
			'items' : [],
			'baseStyle' : {
				'lineHeight' : 'inherit'
			},
			'borderStyle' : {},
			'shadowStyle' : {},
			'animationStyle' : {},
			'positionStyle' : {
				'left' : 0,
				'width' : 320,
				'height' : 100
			}
		}
	},{
		'id' : 'line',
		'name' : '辅助线',
		'params' : {
			'baseStyle' : {},
			'borderStyle' : {},
			'shadowStyle' : {},
			'animationStyle' : {},
			'positionStyle' : {
				'height' : 30
			}
		}
	},{
		'id' : 'white',
		'name' : '辅助空白',
		'params' : {
			'baseStyle' : {},
			'borderStyle' : {},
			'shadowStyle' : {},
			'animationStyle' : {},
			'positionStyle' : {
				'left' : 0,
				'width' : 320,
				'height' : 20
			}
		}
	},{
		'id' : 'audio',
		'name' : '语音',
		'params' : {
			'style' : '1',
			'headimg' : '',
			'align' : 'left',
			'title' : '',
			'isloop' : false,
			'reload' : 'false',
			'audio' : {'id' : '', 'url' : ''},
			'baseStyle' : {},
			'borderStyle' : {},
			'shadowStyle' : {},
			'animationStyle' : {},
			'positionStyle' : {
				'left' : 0,
				'width' : 320,
				'height' : 60
			}
		}
	},{
		'id' : 'notice',
		'name' : '公告',
		'params' : {
			'notice' : '',
			'baseStyle' : {
				'backgroundColor' : '#ffc'
			},
			'borderStyle' : {},
			'shadowStyle' : {},
			'animationStyle' : {},
			'positionStyle' : {
				'left' : 0,
				'width' : 320,
				'height' : 40
			}
		}
	}
]);