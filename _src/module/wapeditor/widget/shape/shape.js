angular.module('wapeditorApp').controller('ShapeCtrl', ['$scope', '$http', function($scope, $http){
	$scope.page = {
		'currentPage' : 1,
		'numPages' : 1, /*总页数*/
		'toPage' : '',
		'totalItems' : 0,
		'pageSize' : 18
	};
	$scope.addItem = function() {
		$http({
			method : 'GET',
			url : window.sysinfo.siteroot + 'web/resource/images/app/shape/shape.json',
			cache : true,
		}).success(function(data){
			$scope.sysCategoryList = data.sysCategoryList;
			$scope.sysImageTag = data.sysImageTag;
			$scope.sysImageList = data.sysImageList;
			$scope.activeItem.params.catlistActive = 1;//默认active大分类ID
			$scope.activeItem.params.imgListActive = 4;//默认active小分类ID,控制小分类正确显示
			$scope.page.numPages = getNumPages();
			$scope.pages = getPagesList();
			changePageActive(1);
			$scope.currentImageList = getCurrentImageList($scope.activeItem.params.imgListActive, 1);
			$('#shapeModal').modal('show');
		});
		
	}
	$scope.getSysCatAndList = function(sysCategory) {
		var index = $.inArray(sysCategory, $scope.sysCategoryList);
		for(var i in $scope.sysCategoryList){
			if(i == index) {
				$scope.sysCategoryList[i].active = true;
				$scope.activeItem.params.catlistActive = $scope.sysCategoryList[i].id;
				var m = 1;
				for(var j in $scope.sysImageTag) {
					if(($scope.sysImageTag[j].parentid == $scope.sysCategoryList[i].id) && m == 1) {
						$scope.activeItem.params.imgListActive = $scope.sysImageTag[j].id;
						$scope.sysImageTag[j].active = true;
						$scope.page.numPages = getNumPages();
						$scope.pages = getPagesList();
						changePageActive(1);
						$scope.currentImageList = getCurrentImageList($scope.activeItem.params.imgListActive, 1);
						m++;
					}else{
						$scope.sysImageTag[j].active = false;
					}
				}
			}else{
				$scope.sysCategoryList[i].active = false;
			}
		}
	}
	$scope.getSysImgByTag = function(sysTag) {
		var index = $.inArray(sysTag, $scope.sysImageTag);
		for(var i in $scope.sysImageTag) {
			if(i == index) {
				$scope.sysImageTag[i].active = true;
				$scope.activeItem.params.imgListActive = $scope.sysImageTag[i].id;
				$scope.page.numPages = getNumPages();
				$scope.pages = getPagesList();
				changePageActive(1);
				$scope.currentImageList = getCurrentImageList($scope.activeItem.params.imgListActive, 1);
			}else{
				$scope.sysImageTag[i].active = false;
			}
		}
	}
	$scope.selectSvg = function($event,img) {
		var url = $event.target.dataset.url;
		url = url.split("../");
		$http({
			method : 'GET',
			url : window.sysinfo.siteroot + url[1],
		}).success(function(data){
			var newdata = $(data);
			var length = newdata.length;
			var svgtag;
			for(var i = 0; length > i; i++) {
				if("svg" == newdata[i].tagName) {
					svgtag = newdata[i];
					break;
				}
			}
			$scope.saveModulePosition();	// 先同步模块之前的位置
			// 根据形状比，初始化宽/高
			var w = parseFloat($(svgtag).attr("width"));
			var	h = parseFloat($(svgtag).attr("height"));
			if(w >= h){
				$scope.activeItem.params.positionStyle.height = $scope.activeItem.params.positionStyle.width * h / w;
			}else{
				$scope.activeItem.params.positionStyle.width = $scope.activeItem.params.positionStyle.height * w / h;
			}
			$scope.setModulePositionStyle($scope.activeItem.params.positionStyle);
			$scope.activeItem.params.svgValue = data;
			$('#shapeModal').modal('hide');
		});
	}
	$scope.selectPage = function(page) {
		var page = parseInt(page);
		if(page > 0 && page <= $scope.page.numPages){
			$scope.page.currentPage = page;
			$scope.pages = getPagesList();
			changePageActive(page);
			$scope.currentImageList = getCurrentImageList($scope.activeItem.params.imgListActive, page);			
		}
	}
	$scope.getImgByPage = function() {
		var page = parseInt($scope.page.toPage);
		if(page > 0 && page <= $scope.page.numPages){
			$scope.page.currentPage = page;
			$scope.pages = getPagesList();
			changePageActive(page);
			$scope.currentImageList = getCurrentImageList($scope.activeItem.params.imgListActive, page);			
		}
	}
	var getNumPages = function() {
		var sum = getTotalItems($scope.activeItem.params.imgListActive);
		var pages = Math.ceil(sum / $scope.page.pageSize);
		return pages; 
	}
	var changePageActive = function(page) {
		for(var i in $scope.pages) {
			if(page == $scope.pages[i].number) {
				$scope.pages[i].active = true;
			}else {
				$scope.pages[i].active = false;
			}
		}
	}
	var getPagesList = function() {
		var pagesList = [];
		if($scope.page.numPages <=5) {
			for( var i = 1; i <= $scope.page.numPages; i++) {
				if($scope.page.currentPage == i) {
					pagesList.push({'number' : i,'active' : true});
				}else {
					pagesList.push({'number' : i,'active' : false});
				}
			}
		}else {
			var start = $scope.page.currentPage - 2;
			var end = $scope.page.currentPage + 2;
			if(start > 0) {
				if(end <= $scope.page.numPages) {
					pagesList = [
							{'number' : start, 'active' : false},
							{'number' : $scope.page.currentPage - 1, 'active' : false},
							{'number' : $scope.page.currentPage, 'active' : true},
							{'number' : $scope.page.currentPage + 1, 'active' : false},
							{'number' : end, 'active' : false}
						];
				}else{
					var i = ($scope.page.numPages - 4);
					for(i; i <= $scope.page.numPages; i++) {
						if(i == $scope.page.currentPage) {
							pagesList.push({'number' : i, 'active' : true});
						}else {
							pagesList.push({'number' : i, 'active' : false});
						}
					}
				}
			}else {
				for(var i = 1;i <= 5; i++) {
					if($scope.page.currentPage == i) {
						pagesList.push({'number':i,'active':true});
					}else {
						pagesList.push({'number':i,'active':false});
					}
				}
			}
		}
		return pagesList;
	}
	var getTotalItems = function(parentid) {
		var sum = 0;
		for(var i in $scope.sysImageList) {
			if(parentid == $scope.sysImageList[i].parentid) sum++;
		}
		return sum;
	}
	var getCurrentImageList = function(id, curpage) {
		var list = [];
		var index = 0;
		var curpage = parseInt(curpage) > 0 ? parseInt(curpage) : 1;
		var start = (curpage-1) * $scope.page.pageSize;
		var end = curpage * $scope.page.pageSize;
		for(var i in $scope.sysImageList) {
			if(id == $scope.sysImageList[i].parentid) {
				if(index >= start && index < end) {
					list.push($scope.sysImageList[i]);
				}
				index++;
			}
		}
		return list;
	}
}]);