var AppMap = {
	map: '',
	zoom:9,
	center: [4.8, -74],
	marker:'',
	LyrMunicipio: '',
	sidebar:'',
	gmaps: {
		hibrido: new L.Google('HYBRID'),
		calle: new L.Google('ROADMAP'),
		topo: new L.Google('TERRAIN'),		
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
	AddBaseLayer: function(map){ console.log("Add Base");
		map.addLayer(this.gmaps.calle);	
	},
	AddPunto: function(lat, lon){
		this.marker = L.marker([lat, lon]).addTo(this.map);
	},
	AddMpio: function(){ //console.log(geojsonFeature);
		this.LyrMunicipio = L.geoJson(geojsonFeature,{
										onEachFeature: this.onEachFeature
	          				}).addTo(this.map);
	    this.LyrMunicipio.setZIndex(2);      				
		//console.log(this.LyrMunicipio.getBounds());
		//console.log("Mpio Ok");
	},
	SetExtend: function(latMin, latMax, lonMin, lonMax){
		var southWest = L.latLng(latMin, lonMin),
		northEast = L.latLng(latMax, lonMax),
		bounds = L.latLngBounds(southWest, northEast);
		this.map.fitBounds(bounds);
		//this.marker = L.marker([lat, lon]).addTo(this.map);
	}
};