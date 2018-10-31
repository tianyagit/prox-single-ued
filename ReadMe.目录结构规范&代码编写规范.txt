
	声明：本规范为：
					--目录结构规范；
					--编写angular代码及各代码引用规范！
					--其他说明：ReadMe文件夹为各种说明文档

1、	|————_src/
	|	|————app.js
	|	|————config.js
	|	|————require.js
	|	|————common/
	|	|		|————directive/
	|	|		|		|————colorpicker
	|	|		|		|————datepicker
	|	|		|		|————editor
	|	|		|		|————iconer
	|	|		|		|————linker
	|	|		|————service/
	|	|		|————controller/
	|	|————library/
	|	|		|————angular.js
	|	|		|————angular-hotkeys.js
	|	|		|————angular-sanitize.js
	|	|————module/
	|	|		|————fans/
	|	|		|		|————app.js
	|	|		|		|————template
	|	|		|————quickmenu/
	|	|		|		|————app.js
	|	|		|		|————directive/
	|	|		|		|————filter/
	|	|		|		|————service/
	|	|		|		|————widget/
	|	|		|————special/
	|	|		|		|————app.js
	|	|		|		|————directive/
	|	|		|		|————filter/
	|	|		|		|————service/
	|	|		|		|————widget/
	|	|		|————usercard/
	|	|		|		|————app.js
	|	|		|		|————directive/
	|	|		|		|————filter/
	|	|		|		|————service/
	|	|		|		|————widget/
	|	|		|————usercenter/
	|	|		|		|————app.js
	|	|		|		|————directive/
	|	|		|		|————filter/
	|	|		|		|————service/
	|	|		|		|————widget/
	|	|		|————wapeditor/
	|	|		|		|————app.js
	|	|		|		|————directive/
	|	|		|		|————filter/
	|	|		|		|————service/
	|	|		|		|————widget/

2、为你的指令添加自定义前缀：“we7”，如：.directive('we7Drag', function(){});



3、各个Angular元素的命名约定

	元素			命名风格					实例			用途
	Modules			lowerCamelCase				angularApp		
	Controllers		Functionality + 'Ctrl'		AdminCtrl		
	Directives		lowerCamelCase				userInfo		
	Filters			lowerCamelCase				userFilter		
	Services		UpperCamelCase				User			constructor
	Services		lowerCamelCase				dataFactory		others

4、使用：
		$timeout	替代	setTimeout
		$interval	替代	setInterval
		$window		替代	window
		$document	替代	document
		$http		替代	$.ajax
		$location	替代	location

5、	尽可能的精简控制器。将通用函数抽象为独立的服务;
	不要再控制器中写业务逻辑。把业务逻辑交给模型层的服务;
	需要进行跨控制器通讯时，通过方法引用(通常是子控制器到父控制器的通讯)或者 $emit, $broadcast 及 $on 方法。发送或广播的消息应该限定在最小的作用域;


6、在_src/app.js中默认引入的依赖：
								ngAnimate（动画支持）
								ngSanitize（$sce service支持、过滤html）
								ui.Bootstrap{
												包含jQuery or Bootstrap's JavaScript，无需再引入；
												依赖：	angular
														angular-animate
														angular-touch
														Bootstrap CSS
											}
								angular-clipboard（点击复制功能）