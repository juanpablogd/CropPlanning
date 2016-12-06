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
	tituloLeyenda: '',
	legend:L.control({ position: 'bottomright' }),
	limitesLeyenda:[0,2000,10000,20000],
	gmaps: {
		TERRAIN: new L.Google('TERRAIN'),
		ROADMAP: new L.Google('ROADMAP'),
		HYBRID: new L.Google('HYBRID'),		
	},
	getBreaks:function(Lyr,property,rango) {
	    var breaks;	//console.log(Lyr);
	    var lyrTemp = turf.remove(Lyr, property, 0);
	    var cuentaValores = lyrTemp.features.length;
	    
	    if (cuentaValores > rango) {
	        breaks = turf.jenks(Lyr, property, rango-1);
	    } else {
	        breaks = turf.jenks(Lyr, property, cuentaValores);
	    }
	    
	    breaks=breaks.unique();
	    if (breaks[0] != 0) {
	        breaks.unshift(1);
	        breaks.unshift(0);
	    } else {
	        breaks[0]=1;
	        breaks.unshift(0);
	    }
	    return breaks;
	},
	getColor:function(d){
	    return  d >= this.limitesLeyenda[4] ? '#FD8D3C' :
	            d >= this.limitesLeyenda[3] ? '#FEB24C' :
	            d >= this.limitesLeyenda[2] ? '#FED976' :
	            d >= this.limitesLeyenda[1] ? '#FFEDA0' :
	              'rgba(255,255,255,0.8)';
	},
	loadDataDepto:function(){
		AppConfig.sk_sofy.emit('proDepto', null, function (msj){	//console.log(msj);
			AppMap.dataProdDepto = msj;
			//Actualiza GeoJson 	var j=0;
			$.each(geojsonFeatureDepto.features, function (index, value) {//console.log(value);
				if(AppMap.dataProdDepto[value.properties.id] != undefined){
					value.properties.riego_h = AppMap.dataProdDepto[value.properties.id][0].riego_h;
				}	//j++;
			});		//console.log(j);
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
							'<b class="msjSinInfo">'+txt.msjSinInfo+'<br></b>' +
					'</div>';
		}else{
			texto = '<div class="popupstyle">' +
							'<b> ' +AppMap.dataProdDepto[feature.properties.id][0].depto+ ' <br></b>' +
							'<small class="msjRiegoSuper">'+txt.msjRiegoSuper+':</small> <b> ' +AppMap.dataProdDepto[feature.properties.id][0].riego_h+ ' Ha.<br></b>' +
							'<small class="msjRiegoProd">'+txt.msjRiegoProd+':</small> <b> ' +AppMap.dataProdDepto[feature.properties.id][0].riego_t+ ' Ton.<br></b>' +
							'<small class="msjRiegoRend">'+txt.msjRiegoRend+':</small> <b> ' +AppMap.dataProdDepto[feature.properties.id][0].riego_t_h+ ' Ton/Ha.<br></b>' +
							'<small class="msjRiegoMin">'+txt.msjRiegoMin+':</small> <b> ' +AppMap.dataProdDepto[feature.properties.id][0].riego_min_t+ ' Ton.<br></b>' +
							'<small class="msjRiegoMax">'+txt.msjRiegoMax+':</small> <b> ' +AppMap.dataProdDepto[feature.properties.id][0].riego_max_t+ ' Ton.<br></b>' +
							'<small class="msjSecanoSuper">'+txt.msjSecanoSuper+':</small> <b> ' +AppMap.dataProdDepto[feature.properties.id][0].sec_h+ ' Ha.<br></b>' +
							'<small class="msjSecanoProd">'+txt.msjSecanoProd+':</small> <b> ' +AppMap.dataProdDepto[feature.properties.id][0].sec_t+ ' Ton.<br></b>' +
							'<small class="msjSecanoRend">'+txt.msjSecanoRend+':</small> <b> ' +AppMap.dataProdDepto[feature.properties.id][0].sec_t_h+ ' Ton/Ha.<br></b>' +
							'<small class="msjSecanoMin">'+txt.msjSecanoMin+':</small> <b> ' +AppMap.dataProdDepto[feature.properties.id][0].sec_min_t+ ' Ton.<br></b>' +
							'<small class="msjSecanoMax">'+txt.msjSecanoMax+':</small> <b> ' +AppMap.dataProdDepto[feature.properties.id][0].sec_max_t+ ' Ton.<br></b>' +
					'</div>';
		}

		var popupContent = '<div class="panel panel-primary">' +
							'<div class="panel-heading tit_popup">'+
	                        	txt.msjProduccion+
	                        '</div>' +
	                            texto +
	                        '</div>' +
	                    '</div>';
			if (feature.properties && feature.properties.popupContent) {
				popupContent += feature.properties.popupContent;
			}
			layer.bindPopup(popupContent);
	},
	setStyle: function(feature){
			return {
				weight: 1,
				opacity: 1,
				color: 'white',
				dashArray: '3',
				fillOpacity: 0.7,
				fillColor: AppMap.getColor(feature.properties['riego_h'])
			};
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
		if(accion=="desplegar"){	//Apagar Capa
			if(this.map.hasLayer(this.LyrMpioDepto)){
				this.map.removeLayer(this.LyrMpioDepto);
				$("#btn_mpio").hide();
				$("#btn_depto").hide();
				$("#btn_mapa").find('button').removeClass("btn-warning").addClass("btn-success");
			}else{
				if(tipo=="Mpio"){	//Encender Capa
					this.LyrMpioDepto = L.geoJson(geojsonFeatureMpio,{
													onEachFeature: this.onEachFeature
				          				}).addTo(this.map);
				    AppMap.tipoCapa='Mpio';			
				}else{
					this.limitesLeyenda = this.getBreaks(geojsonFeatureDepto,'riego_h',4);	console.log(this.limitesLeyenda);
					this.LyrMpioDepto = L.geoJson(geojsonFeatureDepto,{ style: this.setStyle,
													onEachFeature: this.onEachFeature
				          				}).addTo(this.map);
				   	AppMap.tipoCapa='Depto';
				   	
				}
				AppConfig.ActivarBtn(AppMap.tipoCapa);
			    this.LyrMpioDepto.setZIndex(2);
			    $("#btn_mpio").show();
				$("#btn_depto").show();
				$("#btn_mapa").find('button').removeClass("btn-success").addClass("btn-warning");
				this.map.setZoom(6);
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
	AddLeyenda: function(map){
		 this.legend.onAdd = function (map) {
			  
			    var div = L.DomUtil.create('div', 'info legend'),
			       
			       labels = [];
			
			    // loop through our density intervals and generate a label with a colored square for each interval
			    div.innerHTML += '<b>Valor ' + this.tituloLeyenda + '</b> <br>En Pesos por Millon($M) <hr>';
			
			    for (var i = 0; i < limitesLeyenda.length; i++) {
			        if (i == 0) {
			            div.innerHTML +=
			            '<i style="background:rgba(255,255,255,0.8)"></i> ' +
			            numeral(limitesLeyenda[i] / 1000000).format('$0,0') + config.mill + '&ndash;' + '<br>';
			        } else if ((i+1) == limitesLeyenda.length) {
			            div.innerHTML +=
			            '<i style="background:' + getColor(limitesLeyenda[i] + 1) + '"></i> ' +  numeral(limitesLeyenda[i]/1000000).format('$0,0')+config.mill +  ' +  <br>';
			        } else {
			            div.innerHTML +=
			            '<i style="background:' + getColor(limitesLeyenda[i] + 1) + '"></i> ' +
			            numeral(limitesLeyenda[i]/1000000).format('$0,0') + config.mill + (numeral(limitesLeyenda[i + 1]).format('$0,0') ? '&ndash;' + numeral(limitesLeyenda[i + 1] / 1000000).format('$0,0') + config.mill + '<br>' : '+');
			        }
			    }
			    div.innerHTML += '<b>Convenciones </b><br>';
			
			    div.innerHTML += '<i ><img src="' + prefijo + 'images/leyend/municipioSelecionado.png"  height="17px"></i>Municipio Seleccionado<br>';
			    return div;
			};
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