angular.module('wapeditorApp').controller('CubeCtrl', ['$scope', function($scope) {
	if ($scope.activeItem.params && $scope.activeItem.params.layout && _.isEmpty($scope.activeItem.params.layout)) {
		for (row = 0; row < 4; row++) {
			$scope.activeItem.params.layout[row] = {};
			for (col = 0; col < 4; col++) {
				$scope.activeItem.params.layout[row][col] = {'cols' : 1, 'rows' : 1, 'isempty' : true, 'imgurl' : '', 'classname' : ''}
			}
		}
	}
	$('.layout-table').bind('mouseover', function(event){
		if (event.target.tagName == 'LI') {
			$('.layout-table li').removeClass('selected');
			var row = $(event.target).attr("data-rows");
			var col = $(event.target).attr("data-cols");
			$('.layout-table li').filter(function(index, element) {
				return $(element).attr("data-rows") <= row && $(element).attr("data-cols") <= col
			}).addClass("selected");
		}
	});
	$scope.activeItem.params.currentLayout = {};
	$scope.showSelection = function(row, col){
		$scope.activeItem.params.currentPos = {'row' : row, 'col' : col};
		//构造布局选择数组
		//如果点击右下方小格，则直接图片占位
		//否则计算以当前坐标左方和下方没有被占用的格子
		$scope.activeItem.params.selection = {};
		var colhas = -1;
		var x = 1;
		for (i = row; i < 4; i++) {
			y = 1;
			$scope.activeItem.params.selection[x] = {};
			for (j = col; j < 4; j++ ) {
				//console.log(' ----- row:'+i+' - col:'+j);
				if (colhas >= 0 && colhas < j) {
					continue;
				}
				if (_.isUndefined($scope.activeItem.params.layout[i][j]) || !$scope.activeItem.params.layout[i][j].isempty) {
					colhas = j - 1;
					continue;
				}
				//console.log(' ====== row:'+i+' - col:'+j);
				$scope.activeItem.params.selection[x][y] = {'rows' : x, 'cols' : y};
				y++;
			}
			x++;
		}
		$('.layout-table li').removeClass('selected');
		$scope.modalobj = $('#modal-cube-layout').modal({'show' : true});
		return true;
	};
	$scope.selectLayout = function(x, y, rowspan, colspan) {
		if (_.isUndefined(rowspan)) {
			rowspan = 0;
		}
		if (_.isUndefined(colspan)) {
			colspan = 0;
		}
		$scope.activeItem.params.layout[x][y] = {
			'cols' : colspan,
			'rows' : rowspan,
			'isempty' : false,
			'imgurl' : '',
			'classname' :
			'index-' + $scope.activeItem.params.showIndex
		};
		//插入当前节点数据后，需要把占用其它节点的数据删除
		for (i = x; i < parseInt(x) + parseInt(rowspan); i++) {
			for (j = y; j < parseInt(y) + parseInt(colspan); j++) {
				//console.log('x:'+x+' - y:'+y + ' ----- row:'+i+' - col:'+j+ ' ----- rowspan:'+rowspan+' - colspan:'+colspan);
				if (x != i || y != j) {
					delete $scope.activeItem.params.layout[i][j]
				}

			}
		}
		$scope.activeItem.params.showIndex++;
		$scope.modalobj.modal('hide');
		/*激活给布局上传图片的框*/
		$scope.changeItem(x, y);
		return true;
	};
	$scope.addItem = function(row, col) {
		require(['fileUploader'], function(uploader){
			uploader.show(function(img){
				$scope.activeItem.params.currentLayout.id = img.id;
				$scope.activeItem.params.currentLayout.imgurl = img.url;
				$scope.$apply();
				// 动态改变cube高度
				$scope.changeInnerHeight();
			}, {'direct' : true, 'multiple' : false});
		});
	};
	$scope.changeItem = function(row, col) {
		$('#cube-editor td').removeClass('current').filter(function(index, element) {
			return $(element).attr("x") == row && $(element).attr("y") == col
		}).addClass("current");
		$('#thumb').attr('src', '');
		$scope.activeItem.params.currentLayout = $scope.activeItem.params.layout[row][col];
	}
	$scope.removeItem = function() {
		for(var i = 0; i < 4; i++) {
			for( var j = 0; j < 4; j++) {
				if(!_.isEmpty($scope.activeItem.params.layout[i][j]) && $scope.activeItem.params.currentLayout.classname == $scope.activeItem.params.layout[i][j].classname) {
					if($scope.activeItem.params.currentLayout.rows > 1) {
						for(var row = 0; row < $scope.activeItem.params.currentLayout.rows; row++) {
							var new_i = i+row;
							$scope.activeItem.params.layout[new_i][j] = {'cols' : 1, 'rows' : 1, 'isempty' : true, 'imgurl' : '', 'classname' : ''};
							if($scope.activeItem.params.currentLayout.cols > 1) {
								for(var col = 0; col < $scope.activeItem.params.currentLayout.cols; col++) {
									var new_j = j+col;
									$scope.activeItem.params.layout[new_i][new_j] = {'cols' : 1, 'rows' : 1, 'isempty' : true, 'imgurl' : '', 'classname' : ''};
								}
							}
						}
					}else {
						$scope.activeItem.params.layout[i][j] = {'cols' : 1, 'rows' : 1, 'isempty' : true, 'imgurl' : '', 'classname' : ''};
						if($scope.activeItem.params.currentLayout.cols > 1) {
								for(var col = 0; col < $scope.activeItem.params.currentLayout.cols; col++) {
									var new_j = j+col;
									$scope.activeItem.params.layout[i][new_j] = {'cols' : 1, 'rows' : 1, 'isempty' : true, 'imgurl' : '', 'classname' : ''};
								}
							}
					}
					$scope.activeItem.params.currentLayout = {};
				}
			}
		}
	}
}]);