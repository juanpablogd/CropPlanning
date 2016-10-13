var AppMap = {
	map: '',
	zoom:9,
	center: [4.8, -74],
	marker:'',
	LyrMunicipio: '',
	LyrBase: '',
	sidebar:'',
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
	AddMpio: function(){ //console.log(geojsonFeature);
		this.LyrMunicipio = L.geoJson(geojsonFeature,{
										onEachFeature: this.onEachFeature
	          				}).addTo(this.map);
	    this.LyrMunicipio.setZIndex(2);      				
		//console.log(this.LyrMunicipio.getBounds());
		//console.log("Mpio Ok");
	},
	SetExtend: function(latMin, latMax, lonMin, lonMax){ 	//console.log(latMin+' '+ latMax+' '+ lonMin+' '+ lonMax);
		var southWest = L.latLng(latMin, lonMin),
		northEast = L.latLng(latMax, lonMax),
		bounds = L.latLngBounds(southWest, northEast);
		this.map.fitBounds(bounds);
	}
};