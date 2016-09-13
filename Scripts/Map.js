var AppMap = {
	map: '',
	zoom:9,
	center: [4.8, -74],
	marker:'',
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
	AddBaseLayer: function(map){ console.log("Add Base");
		map.addLayer(this.gmaps.calle);	
	},
	AddPunto: function(lat, lon){
		this.marker = L.marker([lat, lon]).addTo(this.map);
	},
	AddMenu: function(){
		this.sidebar = L.control.sidebar('sidebar').addTo(this.map);
	}
};