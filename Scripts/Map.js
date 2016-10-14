var AppMap = {
	map: '',
	zoom:9,
	center: [4.8, -74],
	marker:'',
	LyrMpioDepto: '',
	LyrBase: '',
	sidebar:'',
	escalaExtend:0.05,
	tipoCapa: '',
	gmaps: {
		TERRAIN: new L.Google('TERRAIN'),
		ROADMAP: new L.Google('ROADMAP'),
		HYBRID: new L.Google('HYBRID'),		
	},
	InitMap: function(){ 		console.log("Ini");
		map=L.map('map').setView(this.center, this.zoom);
		map.zoomControl.setPosition('topright');
		return map;
	},
	onEachFeature:function(feature, layer){
		var popupContent = '<div class="panel panel-primary">' +
							'<div class="panel-heading">'+
	                        	"Producción Arroz"+
	                        '</div>' +
	                            '<div class="popupstyle">' +
	                            	'<b>' + feature.properties.id +'</b><br/>'+
									'<small>Mpio:</small> <b> ' +feature.properties.ton + '<br></b>' +
	                            '</div>' +
	                        '</div>' +
	                    '</div>';
	
			if (feature.properties && feature.properties.popupContent) {
				popupContent += feature.properties.popupContent;
			}
			layer.bindPopup(popupContent);
		
	},
	SetBaseLayer: function(tipo){ //console.log("Add Base");
		if(tipo == "TERRAIN")
		{
			this.LyrBase = this.gmaps.TERRAIN;
		}else if (tipo == "HYBRID") {
			this.LyrBase = this.gmaps.HYBRID;
		}else{
			this.LyrBase = this.gmaps.ROADMAP;
		}
		this.map.removeLayer(this.LyrBase);
		this.map.addLayer(this.LyrBase);		//console.log(this.LyrBase._type);
	},
	AddPunto: function(lat, lon){
		this.marker = L.marker([lat, lon]).addTo(this.map);
	},
	ActualizaPunto: function(lat, lon){
		this.marker.setLatLng([lat, lon]);
	},
	AddCapa: function(tipo,accion){ //console.log(geojsonFeature);
		if(accion=="desplegar"){
			if(this.map.hasLayer(this.LyrMpioDepto)){
				this.map.removeLayer(this.LyrMpioDepto);
				$("#btn_mpio").hide();
				$("#btn_depto").hide();
			}else{
				if(tipo=="Mpio"){
					this.LyrMpioDepto = L.geoJson(geojsonFeatureMpio,{
													onEachFeature: this.onEachFeature
				          				}).addTo(this.map);
				    AppMap.tipoCapa='Mpio';			
				}else{
					this.LyrMpioDepto = L.geoJson(geojsonFeatureDepto,{
													onEachFeature: this.onEachFeature
				          				}).addTo(this.map);
				   	AppMap.tipoCapa='Depto';			
				}
			    this.LyrMpioDepto.setZIndex(2);
			    $("#btn_mpio").show();
				$("#btn_depto").show();
			}
		} else if(accion=="capa"){
				if(tipo=="Mpio" && AppMap.tipoCapa != tipo){
					this.map.removeLayer(this.LyrMpioDepto);
					this.LyrMpioDepto = L.geoJson(geojsonFeatureMpio,{
													onEachFeature: this.onEachFeature
				          				}).addTo(this.map);
				    AppMap.tipoCapa='Mpio';
				    $("#btn_mpio").removeClass('btn-warning');
				    $("#btn_mpio").addClass('btn-success');
					$("#btn_depto").removeClass('btn-success');
				    $("#btn_depto").addClass('btn-warning');
				}else if(tipo=="Depto" && AppMap.tipoCapa != tipo){
					this.map.removeLayer(this.LyrMpioDepto);
					this.LyrMpioDepto = L.geoJson(geojsonFeatureDepto,{
													onEachFeature: this.onEachFeature
				          				}).addTo(this.map);
				   	AppMap.tipoCapa='Depto';
				    $("#btn_depto").removeClass('btn-warning');
				    $("#btn_depto").addClass('btn-success');
					$("#btn_mpio").removeClass('btn-success');
				    $("#btn_mpio").addClass('btn-warning');
				}
			    this.LyrMpioDepto.setZIndex(2);			
		}
	},
	SetExtend: function(latMin, latMax, lonMin, lonMax){ 	//console.log(latMin+' '+ latMax+' '+ lonMin+' '+ lonMax);
		var southWest = L.latLng(latMin, lonMin),
		northEast = L.latLng(latMax, lonMax),
		bounds = L.latLngBounds(southWest, northEast);
		this.map.fitBounds(bounds);
	},
	UbicacionEncontrada: function(pos){
		var lat = pos.coords.latitude;
		var lon = pos.coords.longitude;
	    AppMap.ActualizaPunto(lat,lon);
    	AppMap.SetExtend((lat-AppMap.escalaExtend),(numeral(lat)+AppMap.escalaExtend),(numeral(lon)+AppMap.escalaExtend),(lon-AppMap.escalaExtend));
	}
};