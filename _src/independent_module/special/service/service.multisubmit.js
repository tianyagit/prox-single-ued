angular.module('ModuleSpecialApp').service('serviceMultiSubmit', [
	'serviceCommon',
	'serviceMultiPage',
	'serviceSpecialBase',
	function(serviceCommon, serviceMultiPage, serviceSpecialBase){
	var serviceMultiSubmit = {};

	serviceMultiSubmit.submit = function (event) {
		serviceMultiPage.saveCurPage();
		var multipage = serviceSpecialBase.getBaseData('multipage');
		var allPages = serviceSpecialBase.getBaseData('allPages');
		var html = '';
		var arrowBottom = '<section class="u-arrow-bottom" style="bottom: 15%;"><div class="pre-wrap"><div class="pre-box1"><div class="pre1"></div></div><div class="pre-box2"><div class="pre2"></div></div></div></section></div>'
		$.each(multipage, function(i,n){
			if( (i+1) == multipage.length) {
				html += allPages.length == 1 ? '<div class="pane">'+n+'</div>' : '<div class="pane overflowhidden">'+n+'</div>';
			}else {
				html += allPages.length == 1 ? '<div class="pane">'+n+arrowBottom : '<div class="pane overflowhidden">'+n+arrowBottom;
			}
		});
		// 这个应该是在最后的时候，才销毁，要不每页切页保存，都会删除，下次回到该页面，原始的 originParams 已经没了
		for(var i in allPages){
			for(var j in allPages[i].property){
				delete allPages[i].property[j].originParams;
				delete allPages[i].property[j].marginTop;
			}
		}
		var submit = {};
		var height = $('.app-content').css('height');
		html = '<div style="height:'+height+'"><div class="panes">'+html+'</div></div>';
		submit.html = html;
		submit.params = angular.copy(allPages);
		submit.multipage = multipage;
		serviceCommon.stripHaskey(submit.params);
		return submit;
	};
	return serviceMultiSubmit;
}]);