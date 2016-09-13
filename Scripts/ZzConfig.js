var Config={
 	UrlSocket: AppConfig.UrlSocket,
 	UrlSocketApp: AppConfig.UrlSocketApp,
 	cl:AppConfig.cl,
 	NextLogin:AppConfig.NextLogin,
 	id_perfil:AppConfig.id_perfil,
	id_perfil_admin:AppConfig.id_perfil_admin,
	socketGeoAdmin:'',
	socketDataAdmin:AppConfig.socketDataAdmin,
	format : new ol.format.GeoJSON(),
	breaks:''
};

Config.view=new ol.View({
	center:[-8230000,535000],zoom:6	,extent:[-10000000,0,-7000000,1200000]
	,minZoom:6,maxZoom:10,rotation: 0
});

Config.layer_vect= new ol.source.Vector({
  strategy: function() {
      return [ [-8576412.5, 371227.0, -7919054.0, 689816.5]];
  }
});

var getColor=function(d) {
		return d >= Config.breaks[7]  ? 'rgba(50,136,189,0.9)' :
	       d >= Config.breaks[6]  ? 'rgba(153,213,148,0.85)' :
	       d >= Config.breaks[5]  ? 'rgba(230,245,152,0.8)' :
	       d >= Config.breaks[4]  ? 'rgba(255,255,191,0.75)' :                   
	       d >= Config.breaks[3]   ? 'rgba(254,224,139,0.7)' :
	       d >= Config.breaks[2]   ? 'rgba(252,141,89,0.6)' :
	       d >= Config.breaks[1]  ? 'rgba(213,62,79,0.5)' :
	       d >= Config.breaks[0]  ? 'rgb(255,255,255)' :
	                   'rgb(255,255,255)';
};

  function stringDivider(str, width, spaceReplacer) {
    if (str.length > width) {
      var p = width;
      for (; p > 0 && (str[p] != ' ' && str[p] != '-'); p--) {
      }
      if (p > 0) {
        var left;
        if (str.substring(p, p + 1) == '-') {
          left = str.substring(0, p + 1);
        } else {
          left = str.substring(0, p);
        }
        var right = str.substring(p + 1);
        return left + spaceReplacer + stringDivider(right, width, spaceReplacer);
      }
    }
    return str;
  }

 var getText = function(feature, resolution) {
    var maxResolution = 1200;
    var text = feature.get('n');
  	text = stringDivider(text, 12, '\n');
	return text;
  };

Config.layerGestion = new ol.layer.Vector({
	source: Config.layer_vect,
   	style: function(feature, resolution) {
   		
	  	var texto = getText(feature, resolution);
	  	
		var fuente = "",width='';
		//console.log(resolution);

			if(resolution <= 160) {
				width=1;
			}else{
				width=0.4;
			}
			fuente = '';
			texto ='';
		
		var styleC = [new ol.style.Style({
	        fill: new ol.style.Fill({
	          color: getColor(parseFloat(feature.get('t')))
	          //color:'#FBFB55' 
	        }),
	        stroke: new ol.style.Stroke({
	          color: '#727220',
	          width: width
	        }),
	        text: new ol.style.Text({
	        	textAlign:'center',
	            textBaseline:'middle',
		        font: fuente,
		        text: texto,
		        fill: new ol.style.Fill({
		           color: '#000'
		        }),
		        stroke: new ol.style.Stroke({
		          color: '#fff',
		          width: 3
		        })
	        })
	    })]; //console.log("Prueba");
	    return styleC; 
  }
});

Config.CundinamarcaControl = function(opt_options) {

    var options = opt_options || {};

    var button = document.createElement('button');
    button.innerHTML = '<span class="glyphicon glyphicon-resize-small" aria-hidden="true"></span>';

    var this_ = this;
    var handleCundinamarca = function(e) {
    	var v=this_.getMap().getView();
	    v.setCenter([-8230000,535000]);
	    v.setZoom(9);
    };
	var handlehover = function(e) {
    	//Config.informacion.tooltip('hide');
    };
    button.addEventListener('click', handleCundinamarca, false);
    button.addEventListener('touchstart', handleCundinamarca, false);
    button.addEventListener('mouseenter', handlehover, false);

    var element = document.createElement('div');
    element.className = 'Zoom-Cund ol-unselectable ol-control';
    element.appendChild(button);

    ol.control.Control.call(this, {
      element: element,
      target: options.target
    });
};
ol.inherits(Config.CundinamarcaControl, ol.control.Control);

/*
 * Configuracion evento NodeJS
 */
Config.socketGeoAdmin = io.connect(Config.UrlSocketApp+'/GeoAdmin');
Config.socketDataAdmin = io.connect(Config.UrlSocketApp+'/DataAdmin');



Config.ReiniciarJSON=function(json){
	//console.log(json);
	for(i=0;i<json.features.length;i++){
		json.features[i].properties.t=0;
/*		json.features[i].properties.pob=0;
		json.features[i].properties.tp=0;*/
		
	}
};

function getDatosLugar(result,escala,dato) {
  return result.filter(
      function(result){return result[escala] == dato;}
  );
}

Config.asigGeometria=function(result,escala){
	var i=0,tempjson,array=[],Sitio;
	Config.ReiniciarJSON(Config[escala]);			//console.log(Config[escala].features.length);
	for(i=0;i<Config[escala].features.length;i++){		
		dato=getDatosLugar(result.datos,escala,Config[escala].features[i].properties.id);	//console.log("dato Filtrado:"+dato.length);	console.log("dato Filtrado:"+dato[0].n);
		if(dato.length!=0){ console.log("Asignado");
			Config[escala].features[i].properties.t=parseInt(dato[0].n); 
		}
	}
	//console.log(Config[escala]);
	return Config[escala];
};

Array.prototype.unique = function (a) {
    return function () { return this.filter(a); };
}(function (a, b, c) {
    return c.indexOf(a, b + 1) < 0;
});

Config.getbreakunique=function(fcFilter){
	var array=[];
	$.each(fcFilter.features, function( index, value ) {	//console.log(index + '=' + value.properties.t);
		array.push(value.properties.t); 
	});
	array=array.unique();
	return array.length;
};

Config.getbreaks=function(fc){	
	var val_mostrar='t',breaks='HI';
	var fcFilter=turf.remove(fc, val_mostrar, 0);	console.log(fcFilter);
	var longitud=Config.getbreakunique(fcFilter); console.log("longitud:> "+longitud);
	if(longitud>6){
		 breaks=turf.jenks(fcFilter, val_mostrar, 6);
	}else{
		console.log('ingresa'+breaks);
		 breaks=turf.jenks(fcFilter, val_mostrar, longitud);
	}
	breaks=breaks.unique();
	if(breaks[0]!=0){
		breaks.unshift(0);		
	}
	return breaks;    
};

function formatNum(a){
	str = a.replace(/,/g, "."); 
	return str;
}

Config.AutoDisplayLeyend=function(){
		$("#items").empty();
		var leyend=document.getElementById('items');
		var labels=[]; //console.log(Config.breaks.length);
		for(var i=0;i<Config.breaks.length-1;i++){
			labels.push('<i  style=" background:'+getColor(Config.breaks[i])+';"></i> '+formatNum(numeral(Config.breaks[i]).format('0,0.'))+' - '+formatNum(numeral(Config.breaks[i+1]-1).format('0,0.')));
			//console.log("test");
		} //console.log(labels);
		labels.push('<i  style=" background:'+getColor(Config.breaks[Config.breaks.length-1])+';"></i> '+formatNum(numeral(Config.breaks[Config.breaks.length-1]).format('0,0.'))+' +');		
		leyend.style.display='block';
		leyend.innerHTML=labels.join('<br>');
};

Config.socketGeoAdmin.emit('GetMunicipio', '', function(message){			//console.log("message Mun:" + message.length);
	console.log(moment().format('h:mm:ss:SSSS')+" Mun Ini");
	var decrypted =FuncDecrypted(message);									//console.log("decrypted Mun:" + decrypted.type);		
	var geojson=topojson.feature(decrypted, decrypted.objects.collection);
  	Config["cod_mpio"]=geojson;												//console.log(Config["cod_mpio"].features[1].properties.id); //console.log("geojson Mun:" + Config["cod_mpio"].features.length);
  	console.log(moment().format('h:mm:ss:SSSS')+" Mun FIN");
  	
  	Config.socketDataAdmin.emit('GetMunicipioNumGes', '', function(message){			//console.log("message Mun DATA: " + message.length); //console.log("message Mun:" + message);
		console.log(moment().format('h:mm:ss:SSSS')+" Mun Gestiones Ini");					//console.log("message Mun:" + FuncDecrypted(message));
		var decrypted = FuncDecrypted(message);									
/*		$.each(decrypted, function () {
		   $.each(this, function (name1, value1) {	//console.log(name1 + '=' + value1);
		      $.each(value1, function (name, value) {
		      	console.log(name + '=' + value);
		      }); 
		   });
		});	*/
		Config["MunicipioNumGes"]=decrypted;									//console.log("geojson Mun:" + Config["cod_mpio"].features.length);
		//console.log(Config["MunicipioNumGes"]);
		//CRUZA DATOS CON GEOMETRÍA
		var geo=Config.asigGeometria(decrypted,"cod_mpio"); console.log(geo);
		Config.breaks=Config.getbreaks(geo);				console.log(Config.breaks);	
		Config.layer_vect.clear();			
		Config.layer_vect.addFeatures(Config.format.readFeatures(geo));		
		AppMap.map.addLayer(Config.layerGestion);								
		//Config.map.getView().fit(Config.layer_vect.getExtent(), Config.map.getSize());	console.log("test");
		Config.AutoDisplayLeyend();
	  	console.log(moment().format('h:mm:ss:SSSS')+" Mun Gestiones FIN");
	});	
  	
});	

Config.socketGeoAdmin.emit('GetProvincia', '', function(message){
	//console.log(moment().format('h:mm:ss:SSSS')+" prov Ini");
	var decrypted =FuncDecrypted(message);
	var geojson=topojson.feature(decrypted, decrypted.objects.collection);
	Config["cod_prov"]=geojson;
	//console.log(moment().format('h:mm:ss:SSSS')+" prov FIN");											
});
Config.socketGeoAdmin.emit('GetDepartamento', '', function(message){
	//console.log(moment().format('h:mm:ss:SSSS')+" Dpto Ini");
	var decrypted =FuncDecrypted(message);
	var geojson=topojson.feature(decrypted, decrypted.objects.collection);
	Config["cod_dpto"]=geojson;
	//console.log(moment().format('h:mm:ss:SSSS')+" Dpto FIN");
});