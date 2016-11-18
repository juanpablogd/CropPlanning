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
	dataProdDepto:'',
	gmaps: {
		TERRAIN: new L.Google('TERRAIN'),
		ROADMAP: new L.Google('ROADMAP'),
		HYBRID: new L.Google('HYBRID'),		
	},
	loadDataDepto:function(){
		AppConfig.sk_sofy.emit('proDepto', null, function (msj){	//console.log(msj);
			AppMap.dataProdDepto = msj; 
		});
	},
	InitMap: function(){ 		console.log("Ini");
		AppMap.loadDataDepto();
		map=L.map('map').setView(this.center, this.zoom);
		map.zoomControl.setPosition('topright');
		return map;
	},
	onEachFeature:function(feature, layer){
		//console.log(feature.properties.id);//console.log(AppMap.dataProdDepto[feature.properties.id]);
		var texto;
		if(AppMap.dataProdDepto[feature.properties.id]===undefined){
			texto = '<div class="popupstyle">' +
							'<b> SIN INFORMACIÓN<br></b>' +
					'</div>';
		}else{
			texto = '<div class="popupstyle">' +
							'<small>Riego Superficie:</small> <b> ' +AppMap.dataProdDepto[feature.properties.id][0].riego_h+ ' Ha.<br></b>' +
							'<small>Riego Producción:</small> <b> ' +AppMap.dataProdDepto[feature.properties.id][0].riego_t+ ' Ton.<br></b>' +
							'<small>Riego Rendimiento:</small> <b> ' +AppMap.dataProdDepto[feature.properties.id][0].riego_t_h+ ' Ton/Ha.<br></b>' +
							'<small>Riego Mímino:</small> <b> ' +AppMap.dataProdDepto[feature.properties.id][0].riego_min_t+ ' Ton.<br></b>' +
							'<small>Riego Máximo:</small> <b> ' +AppMap.dataProdDepto[feature.properties.id][0].riego_max_t+ ' Ton.<br></b>' +
							'<small>Secano Superficie:</small> <b> ' +AppMap.dataProdDepto[feature.properties.id][0].sec_h+ ' Ha.<br></b>' +
							'<small>Secano Producción:</small> <b> ' +AppMap.dataProdDepto[feature.properties.id][0].sec_t+ ' Ton.<br></b>' +
							'<small>Secano Rendimiento:</small> <b> ' +AppMap.dataProdDepto[feature.properties.id][0].sec_t_h+ ' Ton/Ha.<br></b>' +
							'<small>Secano Mímino:</small> <b> ' +AppMap.dataProdDepto[feature.properties.id][0].sec_min_t+ ' Ton.<br></b>' +
							'<small>Secano Máximo:</small> <b> ' +AppMap.dataProdDepto[feature.properties.id][0].sec_max_t+ ' Ton.<br></b>' +
					'</div>';
		}
		
		var popupContent = '<div class="panel panel-primary">' +
							'<div class="panel-heading">'+
	                        	"Producción Arroz"+
	                        '</div>' +
	                            texto +
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
				$("#img3").css({'border':'', "border-radius": "0px", "margin":"0px"});
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
				AppConfig.ActivarBtn(AppMap.tipoCapa);
			    this.LyrMpioDepto.setZIndex(2);
			    $("#btn_mpio").show();
				$("#btn_depto").show();
				$("#img3").css({"border":"solid green 4px", "border-radius": "22px", "margin":"-4px"});
			}
		} else if(accion=="capa"){
				if(tipo=="Mpio" && AppMap.tipoCapa != tipo){	console.log("comienza carga");
				    waitingDialog.show("Cargando Municipios...", {progressType: 'success'});
					this.map.removeLayer(this.LyrMpioDepto);
					this.LyrMpioDepto = L.geoJson(geojsonFeatureMpio,{
													onEachFeature: this.onEachFeature
				          				}).addTo(this.map);
				    AppMap.tipoCapa='Mpio';						console.log("Finaliza carga");
				    waitingDialog.hide();
				}else if(tipo=="Depto" && AppMap.tipoCapa != tipo){
					this.map.removeLayer(this.LyrMpioDepto);
					this.LyrMpioDepto = L.geoJson(geojsonFeatureDepto,{
													onEachFeature: this.onEachFeature
				          				}).addTo(this.map);
				   	AppMap.tipoCapa='Depto';
				}
				AppConfig.ActivarBtn(AppMap.tipoCapa);
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