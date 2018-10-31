util.qqmap = function(val, callback) {
	require(['loadjs!qqmap'], function() {
		if(!val) {
			val = {};
		}
		console.dir(window.qq);
		if(!val.lng) {
			val.lng = 116.403851;
		}
		if(!val.lat) {
			val.lat = 39.915177;
		}
		
		var point = new qq.maps.LatLng(val.lat,val.lng)
		var geo = new qq.maps.Geocoder();

		var modalobj = $('#map-dialog');
		if(modalobj.length == 0) {
			var content =
				'<div class="form-group">' +
				'<div class="input-group">' +
				'<input type="text" class="form-control" placeholder="请输入地址来直接查找相关位置">' +
				'<div class="input-group-btn">' +
				'<button class="btn btn-default"><i class="icon-search"></i> 搜索</button>' +
				'</div>' +
				'</div>' +
				'</div>' +
				'<div id="map-container" style="height:400px;"></div>';
			var footer =
				'<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>' +
				'<button type="button" class="btn btn-primary">确认</button>';
			modalobj = util.dialog('请选择地点', content, footer, {containerName : 'map-dialog'});
			modalobj.find('.modal-dialog').css('width', '80%');
			modalobj.modal({'keyboard': false});
			modalobj.find('.input-group :text').keydown(function(e){
				if(e.keyCode == 13) {
					var kw = $(this).val();
					searchAddress(kw);
				}
			});
			modalobj.find('.input-group button').click(function(){
				var kw = $(this).parent().prev().val();
				searchAddress(kw);
			});
		}
		modalobj.off('shown.bs.modal');
		modalobj.on('shown.bs.modal', function(){
			
		});

		modalobj.find('button.btn-primary').off('click');
		modalobj.find('button.btn-primary').on('click', function(){
			if($.isFunction(callback)) {
				var point = util.qqmap.marker.getPosition();
				geo.getAddress(point);
				geo.setComplete(function(result){
					var val = {lng: point.lng, lat: point.lat, label: result.detail.address};
					callback(val);
				});
			}
			modalobj.modal('hide');
		});
		modalobj.modal('show');
		function searchAddress(address) {
			geo.getLocation(address);
			geo.setComplete(function(result){
				util.qqmap.instance.panTo(result.detail.location);

				util.qqmap.marker.setPosition(result.detail.location);
				util.qqmap.marker.setAnimation(qq.maps.MarkerAnimation.DOWN);

				setTimeout(function(){util.qqmap.marker.setAnimation(null)}, 3600);
			});
			geo.setError(function(result){
				alert('请输入详细的地址');
			});
		}

		var map = util.qqmap.instance = new qq.maps.Map($('#map-dialog #map-container')[0], {
			center: point,
			zoom: 13
		});
		var marker = util.qqmap.marker = new qq.maps.Marker({
			position: point,
			draggable: true,
			map: map
		});
	});
};

util.map = function(val, callback){
	require(['map'], function() {
		if(!val) {
			val = {};
		}
		if(!val.lng) {
			val.lng = 116.403851;
		}
		if(!val.lat) {
			val.lat = 39.915177;
		}
		var point = new BMap.Point(val.lng, val.lat);
		var geo = new BMap.Geocoder();

		var modalobj = $('#map-dialog');
		if(modalobj.length == 0) {
			var content =
				'<div class="form-group">' +
					'<div class="input-group">' +
						'<input type="text" class="form-control" placeholder="请输入地址来直接查找相关位置">' +
						'<div class="input-group-btn">' +
							'<button class="btn btn-default"><i class="icon-search"></i> 搜索</button>' +
						'</div>' +
					'</div>' +
				'</div>' +
				'<div id="map-container" style="height:400px;"></div>';
			var footer =
				'<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>' +
				'<button type="button" class="btn btn-primary">确认</button>';
			modalobj = util.dialog('请选择地点', content, footer, {containerName : 'map-dialog'});
			modalobj.find('.modal-dialog').css('width', '80%');
			modalobj.modal({'keyboard': false});
			
			map = util.map.instance = new BMap.Map('map-container');
			map.centerAndZoom(point, 12);
			map.enableScrollWheelZoom();
			map.enableDragging();
			map.enableContinuousZoom();
			map.addControl(new BMap.NavigationControl());
			map.addControl(new BMap.OverviewMapControl());
			marker = util.map.marker = new BMap.Marker(point);
			marker.setLabel(new BMap.Label('请您移动此标记，选择您的坐标！', {'offset': new BMap.Size(10,-20)}));
			map.addOverlay(marker);
			marker.enableDragging();
			marker.addEventListener('dragend', function(e){
				var point = marker.getPosition();
				geo.getLocation(point, function(address){
					modalobj.find('.input-group :text').val(address.address);
				});
			});
			function searchAddress(address) {
				geo.getPoint(address, function(point){
					map.panTo(point);
					marker.setPosition(point);
					marker.setAnimation(BMAP_ANIMATION_BOUNCE);
					setTimeout(function(){marker.setAnimation(null)}, 3600);
				});
			}
			modalobj.find('.input-group :text').keydown(function(e){
				if(e.keyCode == 13) {
					var kw = $(this).val();
					searchAddress(kw);
				}
			});
			modalobj.find('.input-group button').click(function(){
				var kw = $(this).parent().prev().val();
				searchAddress(kw);
			});
		}
		modalobj.off('shown.bs.modal');
		modalobj.on('shown.bs.modal', function(){
			marker.setPosition(point);
			map.panTo(marker.getPosition());
		});

		modalobj.find('button.btn-primary').off('click');
		modalobj.find('button.btn-primary').on('click', function(){
			if($.isFunction(callback)) {
				var point = util.map.marker.getPosition();
				geo.getLocation(point, function(address){
					var val = {lng: point.lng, lat: point.lat, label: address.address};
					callback(val);
				});
			}
			modalobj.modal('hide');
		});
		modalobj.modal('show');
	});
}; // end of map