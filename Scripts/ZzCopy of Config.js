var glo={
	host :"http://saga.cundinamarca.gov.co",
	UrlSocket: 'http://saga.cundinamarca.gov.co:3321',
	geoserver:'http://saga.cundinamarca.gov.co:8080/geoserver',
	CartoDB :   new ol.layer.Tile({
      source: new ol.source.OSM({
	        attributions: [
	          new ol.Attribution({
	            html: 'Tiles &copy; <a href="http://www.opencyclemap.org/">' +
	                'OpenCycleMap</a>'
	          }),
	          ol.source.OSM.ATTRIBUTION
	        ],
	        url: 'http://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
	 })
  	}),
  	limiteDPTO:'', 
    view:'',
	map:'',
  	tablaCIE10:'',
  	listDiagTemp:[],
  	listDiagNomTemp:[],
  	listDiag:[],
  	listDiagNom:[],
  	Emit:{
		Escala:'cod_dpto',
		FechaAtencionMin:moment("01/01/2015","DD/MM/YYYY").format("DD/MM/YYYY HH:mm"),
		FechaAtencionMax:moment().add(1, 'days').format("DD/MM/YYYY ")+"00:00",
		Procedencia:'',
		sexo:'',
		GrupoEdad:'',	
		msEdad:'',
		msTipoRegimen:'',
		TablaGrupo:'d_cie10',
		Diagnostico:'',
		msEPS:'',
		msEtnia:'',
		msEstadoCivil:'',
		msTipoAtencion:'',
		msRedServicio:'',
		Tasas:1,
		Agrupacion: 1,
		Multi:100000,
		TipoZona:'',
		Mortalidad:false
	},
	Numerador:'Personas',
	socket:'',
	socketGeoAdmin:'',
	format : new ol.format.GeoJSON(),
	breaks:'',
	highlight:'',
	highlightStyleCache: {},
	pob:{
		Pais:0,
		Cund:0
	}
};
$("#titulodataconsolidada").hide();
Array.prototype.unique = function (a) {
    return function () { return this.filter(a); };
}(function (a, b, c) {
    return c.indexOf(a, b + 1) < 0;
});

jQuery.fn.DataTable.ext.type.search.string = function ( data ) {
    return ! data ?
        '' :
        typeof data === 'string' ?
            data
                .replace( /\n/g, ' ' )
                .replace( /[áâàä]/g, 'a' )
                .replace( /[éêèë]/g, 'e' )
                .replace( /[íîìï]/g, 'i' )
                .replace( /[óôòö]/g, 'o' )
                .replace( /[úûùü]/g, 'u' )
                .replace( /ç/g, 'c' ) :
            data;
};

function formatNum(a){
	str = a.replace(/,/g, "."); 
	return str;
}
function toggleCheckbox(element) {
		var id = element.split('-');
        var index = $.inArray(id[0], glo.listDiagTemp);
 
        if ( index === -1 ) {
            glo.listDiagTemp.push( id[0] );
            glo.listDiagNomTemp.push( id[1] );
        } else {
            glo.listDiagTemp.splice( index, 1 );
            glo.listDiagNomTemp.splice( index, 1 );
        }
};
glo.limiteDPTO=new ol.layer.Tile({
    source: new ol.source.TileWMS(/** @type {olx.source.TileWMSOptions} */ ({
      url: glo.geoserver+'/gwc/service/wms',
      params: {'LAYERS': 'administrativa:g_colombia_dpto', 'TILED': true,'STYLES':'g_colombia_dpto_azul','SRS':'EPSG%3A900913'},
      serverType: 'geoserver'
    }))
});

glo.view=new ol.View({
	center:[-8230000,535000],zoom:6	,extent:[-10000000,0,-7000000,1200000]
	,minZoom:6,maxZoom:10,rotation: 0
});

glo.layer_vect= new ol.source.Vector({
  strategy: function() {
      return [ [-8576412.5, 371227.0, -7919054.0, 689816.5]];
  }
});
var getColor=function(d) {
	if($("#sltRampa").val()==1){
		return d >= glo.breaks[7]  ? 'rgba(80,6,1,1)' :
		   d >= glo.breaks[6]  ? 'rgba(120,35,16,1)' :
	       d >= glo.breaks[5]  ? 'rgba(158,78,26,1)' :
	       d >= glo.breaks[4]  ? 'rgba(214,153,54,1)' :
	       d >= glo.breaks[3]  ? 'rgba(227,176,102,1)' :                   
	       d >= glo.breaks[2]   ? 'rgba(252,221,143,1)' :
	       d >= glo.breaks[1]   ? 'rgba(252,255,212,1)' :
	       d >= glo.breaks[0]  ? 'rgb(255,255,255)' :
	                   'rgb(255,255,255)';	
	}else if($("#sltRampa").val()==2){
		return d >= glo.breaks[7]  ? '#045a8d' :
	       d >= glo.breaks[6]  ? '#1d7bad' :
	       d >= glo.breaks[5]  ? '#4395c3' :
	       d >= glo.breaks[4]  ? '#74a9cf' :                   
	       d >= glo.breaks[3]   ? '#a4bedb' :
	       d >= glo.breaks[2]   ? '#ced5e8' :
	       d >= glo.breaks[1]  ? '#f1eef6' :
	       d >= glo.breaks[0]  ? 'rgb(255,255,255)' :
	                   'rgb(255,255,255)';	
	}else if($("#sltRampa").val()==3){
		return d >= glo.breaks[7]  ? '#006837' :
	       d >= glo.breaks[6]  ? '#208f4a' :
	       d >= glo.breaks[5]  ? '#48ae60' :
	       d >= glo.breaks[4]  ? '#78c679':                   
	       d >= glo.breaks[3]   ? '#a9db8e' :
	       d >= glo.breaks[2]   ? '#d6eeaa' :
	       d >= glo.breaks[1]  ? '#ffffcc' :
	       d >= glo.breaks[0]  ? 'rgb(255,255,255)' :
	                   'rgb(255,255,255)';	
	}else if($("#sltRampa").val()==4){
		return d >= glo.breaks[7]  ? 'rgba(213,62,79,1)' :
	       d >= glo.breaks[6]  ? 'rgba(252,141,89,0.9)' :
	       d >= glo.breaks[5]  ? 'rgba(254,224,139,0.8)' :
	       d >= glo.breaks[4]  ? 'rgba(255,255,191,0.7)' :                   
	       d >= glo.breaks[3]   ? 'rgba(230,245,152,0.4)' :
	       d >= glo.breaks[2]   ? 'rgba(153,213,148,0.3)' :
	       d >= glo.breaks[1]  ? 'rgba(50,136,189,0.2)' :
	       d >= glo.breaks[0]  ? 'rgb(255,255,255)' :
	                   'rgb(255,255,255)';	
	}else if($("#sltRampa").val()==5){

		return d >= glo.breaks[7]  ? 'rgba(215,48,39,1)' :
	       d >= glo.breaks[6]  ? 'rgba(252,141,89,0.9)' :
	       d >= glo.breaks[5]  ? 'rgba(254,224,139,0.8)' :
	       d >= glo.breaks[4]  ?  'rgba(255,255,191,0.7)' :                  
	       d >= glo.breaks[3]   ?'rgba(217,239,139,0.4)' :
	       d >= glo.breaks[2]   ?'rgba(145,207,96,0.3)' :
	       d >= glo.breaks[1]  ? 'rgba(26,152,80,0.4)' :
	       d >= glo.breaks[0]  ? 'rgb(255,255,255)' :
	                   'rgb(255,255,255)';	
	}



};
glo.ListaTotales=function(_vectorsource,col){
    var i;
    var features=_vectorsource.getFeatures();
    var SumaTotal=0,suma=0;
    if(features.length>0){
    	for(i=0;i<features.length;i++){
    		if(col=='tp'){
    			if(glo.Emit.Escala!='cod_dpto'){
    				
    				if(features[i].get('id').substring(0, 2)=='25'){
    					SumaTotal=SumaTotal+features[i].get(col);	
    				}						    			
	    		}else{
	    			SumaTotal=SumaTotal+features[i].get(col);
	    		}
	    	}else{
	    		SumaTotal=SumaTotal+features[i].get(col);
	    	}
    	}        
    }
    if(col=='tp'){
    	if(glo.Emit.Escala=='cod_dpto'){
    		suma=SumaTotal/glo.pob.Pais*glo.Emit.Multi;	
    		$("#TituloValor").empty().append('Tasa Nivel Pais <br><small><em>'+
				'x '+formatNum(numeral(glo.Emit.Multi).format('0,0.'))+'/Población DANE</em></small>');
    	}else{
    		suma=SumaTotal/glo.pob.Cund*glo.Emit.Multi;
    		$("#TituloValor").empty().append('Tasa Nivel Cundinamarca <br><small><em>'+
				'x '+formatNum(numeral(glo.Emit.Multi).format('0,0.'))+'/Población DANE</em></small>');
    	}
    }else{
    	suma=SumaTotal;
    }
    /*if(glo.Emit.Agrupacion!=1){
    	$("#TotalDiagnostico").empty().append(formatNum(numeral(suma).format('0,0.')) +" ");	
    }*/
    
};

 var getText = function(feature, resolution) {
    var maxResolution = 1200;
    var text = feature.get('n');
  	text = stringDivider(text, 12, '\n');
	return text;
  };
glo.layerSIUS = new ol.layer.Vector({
	source: glo.layer_vect,
   	style: function(feature, resolution) {
   		
	  	var texto = getText(feature, resolution);
	  	
		var fuente = "",width='';
		//console.log(resolution);
		if(feature.get('t')!=0){
			if(resolution <= 160) {
				width=1;
				fuente = '11px Calibri,sans-serif';
			}else if(resolution <= 320) {
				width=0.4;
				fuente = '8px Calibri,sans-serif';
			}else{
				width=0.4;
				if(glo.Emit.Escala=='cod_dpto'){
					fuente = '9px Calibri,sans-serif';	
				}else{
					fuente = '';
					texto ='';
				}
			}	
		}else{
			if(resolution <= 160) {
				width=1;
			}else{
				width=0.4;
			}
			fuente = '';
			texto ='';
		}
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
	    })];
	    return styleC;
  }
});
glo.CundinamarcaControl = function(opt_options) {

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
    	glo.informacion.tooltip('hide');
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
ol.inherits(glo.CundinamarcaControl, ol.control.Control);

glo.PaisControl = function(opt_options) {

    var options = opt_options || {};

    var button = document.createElement('button');
    button.innerHTML = '<span class="glyphicon glyphicon-fullscreen" aria-hidden="true"></span>';

    var this_ = this;
    var handlePais = function(e) {
    	var v=this_.getMap().getView();
	    v.setCenter([-8230000,535000]);
	    v.setZoom(6);
    };
    var handlehoverPais = function(e) {
    	
    	glo.informacion.tooltip('hide');
    };

    button.addEventListener('click', handlePais, false);
    button.addEventListener('touchstart', handlePais, false);
    button.addEventListener('mouseenter', handlehoverPais, false);

    var element = document.createElement('div');
    element.className = 'Zoom-Pais ol-unselectable ol-control';
    element.appendChild(button);

    ol.control.Control.call(this, {
      element: element,
      target: options.target
    });
};
ol.inherits(glo.PaisControl, ol.control.Control);
glo.map=new ol.Map({
	controls:ol.control.defaults().extend([new ol.control.ScaleLine({
		units:'metric'
	})]).extend([
          new glo.CundinamarcaControl(),
          new glo.PaisControl()
        ]),
	layers:[
		glo.CartoDB,
		glo.layerSIUS,
		glo.limiteDPTO
	],
	target:'map',
	view:glo.view
});


/*
 * Configuracion evento NodeJS
 */
glo.socket = io.connect(glo.UrlSocket+'/sius');
glo.socketGeoAdmin = io.connect(glo.UrlSocket+'/GeoAdmin');

var FuncDecrypted=function(message){
	var decrypted =JSON.parse(CryptoJS.AES.decrypt(message,'1erf2a5f1e87g1').toString(CryptoJS.enc.Utf8));
	return decrypted; 
};

glo.socketGeoAdmin.emit('GetMunicipio', '', function(message){
	console.log(moment().format('h:mm:ss:SSSS')+" Mun");
	var decrypted =FuncDecrypted(message);
	var geojson=topojson.feature(decrypted, decrypted.objects.collection);
  	glo["cod_mpio"]=geojson; console.log(glo["cod_mpio"]);
  	console.log(moment().format('h:mm:ss:SSSS')+" Mun2");
});	

glo.socketGeoAdmin.emit('GetProvincia', '', function(message){
	console.log(moment().format('h:mm:ss:SSSS')+" prov");
	var decrypted =FuncDecrypted(message);
	var geojson=topojson.feature(decrypted, decrypted.objects.collection);
	glo["cod_prov"]=geojson;  	
});
glo.socketGeoAdmin.emit('GetDepartamento', '', function(message){
	console.log(moment().format('h:mm:ss:SSSS')+" Dpto");
	var decrypted =FuncDecrypted(message);
	var geojson=topojson.feature(decrypted, decrypted.objects.collection);
	glo["cod_dpto"]=geojson;
	$("#LblFechaMin").empty().append(glo.Emit.FechaAtencionMin);
	$("#LblFechaMax").empty().append(glo.Emit.FechaAtencionMax);
	
});

glo.ReiniciarJSON=function(json){
	//console.log(json);
	for(i=0;i<json.features.length;i++){
		json.features[i].properties.t=0;
		json.features[i].properties.pob=0;
		json.features[i].properties.tp=0;
		
	}
};
function getDatosLugar(result,escala,dato) {
  return result.filter(
      function(result){return result[escala] == dato;}
  );
}
glo.asigGeometria=function(result,escala){
	var i=0,tempjson,array=[],Sitio;
	glo.ReiniciarJSON(glo[escala]);
	for(i=0;i<glo[escala].features.length;i++){		
		dato=getDatosLugar(result,escala,glo[escala].features[i].properties.id);
		if(dato.length!=0){
			glo[escala].features[i].properties.t=parseInt(dato[0].t);
			if(dato[0].pob!=undefined){
				glo[escala].features[i].properties.pob=parseInt(dato[0].pob);
				glo[escala].features[i].properties.tp=parseInt(dato[0].tp);
			}	
		}
	}
	//console.log(glo[escala]);
	return glo[escala];
};
glo.getbreakunique=function(fcFilter){
	var array=[];
	$.each(fcFilter.features, function( index, value ) {
	 array.push(value.properties.t); 
	});
	array=array.unique();
	return array.length;
};	
	
	
glo.getbreaks=function(fc){	
	var val_mostrar='t',breaks='HI';
	var fcFilter=turf.remove(fc, val_mostrar, 0);
	var longitud=glo.getbreakunique(fcFilter);
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

glo.AutoDisplayLeyend=function(){
		$("#items").empty();
		var leyend=document.getElementById('items');
		var labels=[];
		
		for(var i=0;i<glo.breaks.length-1;i++){
			labels.push('<i  style=" background:'+getColor(glo.breaks[i])+';"></i> '+formatNum(numeral(glo.breaks[i]).format('0,0.'))+' - '+formatNum(numeral(glo.breaks[i+1]-1).format('0,0.')));
		}
		console.log(labels);	
		labels.push('<i  style=" background:'+getColor(glo.breaks[glo.breaks.length-1])+';"></i> '+formatNum(numeral(glo.breaks[glo.breaks.length-1]).format('0,0.'))+' +');		
		leyend.style.display='block';
		leyend.innerHTML=labels.join('<br>');
};

waitingDialog.show();

glo.AddDiagnoticosPanel=function(){
	$("#ListDiagnosticoPanel").empty();
	for(var i=0;i<glo.listDiagNom.length;i++){
		$("#ListDiagnosticoPanel").append(glo.listDiagNom[i]+'<br>');
		$("#ListDiagnosticoPanel").append('<hr class="hrdiv" width=70% align="left">');
	}	
};
glo.socket.emit('GetPobCun','', function(message){
		var decrypted =FuncDecrypted(message);
		glo.pob.Cund=decrypted[0].sum;
		//console.log('glo.pob.Cund');
		//console.log(glo.pob.Cund);
});	
glo.socket.emit('GetPobPais','', function(message){
	var decrypted =FuncDecrypted(message);
	glo.pob.Pais=decrypted[0].sum;
	//console.log('glo.pob.Pais');
	//console.log(glo.pob.Pais);
});	
function GetGeojson(){
	console.log(moment().format('h:mm:ss:SSSS')+" IniSIUS");
	glo.socket.emit('PeticionGeo', glo.Emit, function(message){
		console.log(moment().format('h:mm:ss:SSSS')+" FinSIUS");
		var decrypted =FuncDecrypted(message);
		if(glo.Emit.Agrupacion==2){
			var splitdata=decrypted[decrypted.length-1].count.split(",");
			console.log(splitdata);
			$("#TotalDiagnostico").empty().append(formatNum(numeral(splitdata[3]).format('0,0.'))+"</h3><h5>");
			$("#TotalDiagnostico").append('<small><p class="text-primary">Ambulatoria:<span class="pull-right" style="margin-right:30px">'+formatNum(numeral(splitdata[0]).format('0,0.'))+'</span></p></small>');
			$("#TotalDiagnostico").append('<small><p class="text-primary">Hospitalario: <span class="pull-right" style="margin-right:30px">'+formatNum(numeral(splitdata[1]).format('0,0.'))+'</span></p></small>');
			$("#TotalDiagnostico").append('<small><p class="text-primary">Urgencia: <span class="pull-right" style="margin-right:30px">'+formatNum(numeral(splitdata[2]).format('0,0.'))+'</span></p></small>');
			$("#TotalDiagnostico").append('<hr class="hrdiv" width="80%" align="center"><small><p class="text-primary">Total Dias: <span class="pull-right" style="margin-right:30px">'+formatNum(numeral(splitdata[4]).format('0,0.'))+'</span></p></small>');
			$("#TotalDiagnostico").append('<small><p class="text-primary">Atención Promedio: <span class="pull-right" style="margin-right:30px">'+formatNum(numeral(splitdata[5]).format('0,0.'))+'</span></p></small></h5><h3>');
    	}else{
    		$("#TotalDiagnostico").empty().append(formatNum(numeral(decrypted[decrypted.length-1].count).format('0,0.')) +" ");
    	}
    
	
		decrypted.pop();
		//console.log(decrypted);
		var geo=glo.asigGeometria(decrypted,glo.Emit.Escala);
		glo.breaks=glo.getbreaks(geo);
		glo.layer_vect.clear();		
		glo.layer_vect.addFeatures(glo.format.readFeatures(geo));
		
		glo.Emit.Tasas==1?glo.ListaTotales(glo.layer_vect,'t'):
		glo.Emit.Tasas==2?glo.ListaTotales(glo.layer_vect,'tp'):
						$('#hrContador').hide();
			
		glo.map.getView().fit(glo.layer_vect.getExtent(), glo.map.getSize());
      	console.log(moment().format('h:mm:ss:SSSS')+" termina");
      	glo.AutoDisplayLeyend();
      	glo.AddDiagnoticosPanel();
      	waitingDialog.hide();
	});	
	glo.socket.on('FechaData', function(message){
		$("#titulodataconsolidada").show();
		var decryptedfecha =FuncDecrypted(message);
		//console.log(decryptedfecha[0].fecha);
		var fechaData=moment(decryptedfecha[0].fecha).format("DD MMMM YYYY HH:mm");//
		$("#fechadatos").empty().append(fechaData);
	});	
	
	
}
GetGeojson();
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
/*
 * Carga y evento Jquery 
 */
$(document).ready(function() {
	
	BootstrapDialog.show({
				//cssClass: 'login-dialog',
				//size: BootstrapDialog.SIZE_WIDE,
				closable: false,
	            closeByBackdrop: false,
	            closeByKeyboard: false,
	            title: 'Mensaje aclaratorio',
	            message: 
	            ' Es preciso aclarar que información presentada en el mapa y los indicadores '+  
	            ' sólo corresponde a los registros de la red pública de prestadores'+
	            ' de servicios en salud la cual puede se comparada contra bases de datos de oficiales.',
				buttons: [{
	                label: 'Acepto',
	                cssClass: 'btn-primary',
	                action: function(dialogRef){
	                 dialogRef.close();
	               }
	            }]
	        });
  	/*
	 * Configuracion de Fechas
	 */
	$('#datetimepicker_ini').datetimepicker({
	    language: 'es',
	    viewMode: 'months',
	    defaultDate: moment("01/01/2015","DD/MM/YYYY").format("DD/MM/YYYY"),
	    pickTime: true
	});
	$('#datetimepicker_fin').datetimepicker({
	    language: 'es',
	    viewMode: 'months',
	    defaultDate: moment().add(1, 'days').format("DD/MM/YYYY"),
	    pickTime: true
	});
	
	$('#datetimepicker_fin').data("DateTimePicker").setMinDate($('#datetimepicker_ini').data("DateTimePicker").getDate());
	$('#datetimepicker_ini').data("DateTimePicker").setMaxDate($('#datetimepicker_fin').data("DateTimePicker").getDate());
	$("#datetimepicker_ini").on("dp.change",function (e) {
	   $('#datetimepicker_fin').data("DateTimePicker").setMinDate(e.date);                     
	});
	$("#datetimepicker_fin").on("dp.change",function (e) {
	   $('#datetimepicker_ini').data("DateTimePicker").setMaxDate(e.date);
	});
	
	/*
	 * Configuracion de TABS
	 */
	$(function () {
	  $('[data-toggle="tooltip"]').tooltip();
	  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		    var idnewtab = ($(e.target).attr('href'));
		    $(idnewtab + "Color").addClass("text-primary");
		    
		    var idoldtab = ($(e.relatedTarget).attr('href'));
		    $(idoldtab + "Color").removeClass("text-primary");
		    
		});
	});
	/*
	 * Agrega datos a campos de opcion multiple.
	 */
	 $('#msEtnia,#msTipoRegimen,#msEPS,#msEdad,#msTipoAtencion,#msEstadoCivil,#msDiagLoad,#msRedServicio').multiselect({
		includeSelectAllOption: true,
		enableFiltering: true,
		selectAllText:'Todos',
		enableCaseInsensitiveFiltering: true,
		buttonWidth: '140px',
	    dropRight: true,
	    maxHeight: 250,
	    disableIfEmpty: true,
	    filterPlaceholder:'Buscar...',
	    buttonText: function(options, select) {
	            if (options.length === 0) {
	                return 'No hay Selección';
	            }
	            else if (options.length > 3) {
	                return 'Mas de 3 Selecciónados';
	            }
	             else {
	                 var labels = [];
	                 options.each(function() {
	                     if ($(this).attr('label') !== undefined) {
	                         labels.push($(this).attr('label'));
	                     }
	                     else {
	                         labels.push($(this).html());
	                     }
	                 });
	                 return labels.join(', ') + '';
	             }
	        }
	    
	});
	
	$.getJSON( "./services/GetEtnia.php", function( options ) {
		$('#msEtnia').multiselect('dataprovider', options); 
	});	
	
	$.getJSON( "./services/GetTipoRegimen.php", function( options ) {
		$('#msTipoRegimen').multiselect('dataprovider', options); 
	});	
	$.getJSON( "./services/GetEPS.php", function( options ) {
		$('#msEPS').multiselect('dataprovider', options); 
	});	
	$.getJSON( "./services/GetRedServicio.php", function( options ) {
		$('#msRedServicio').multiselect('dataprovider', options); 
	});	
	$('#msEdad').multiselect('dataprovider', [{}]);
	
	
	$.getJSON( "./services/GetTipoAtencion.php", function( options ) {
		$('#msTipoAtencion').multiselect('dataprovider', options); 
	});	
	$.getJSON( "./services/GetEstadoCivil.php", function( options ) {
		$('#msEstadoCivil').multiselect('dataprovider', options); 
	});	
	
	$("#TodosCasos").click(function() {
		$("#CodDiagnostico").empty();
		$("#InpClave").val("");
		$("#Diagnostico").empty();
		seleccion_diagnostico="";
		filtrar();
	});
	
	var url = document.location.href;
	var posicion = url.lastIndexOf('this_map');
	if(posicion!=-1){
		$("#Comparativos").hide();	
	}
	$("#Comparativos").click(function() {
		var url = document.location.href;
		var posicion = url.lastIndexOf('this_map');
		if(posicion==-1){
			window.location.replace('http://saga.cundinamarca.gov.co/apps/comparativeSaludV2/');
		}
	});
	function setDiagTable(cod,nom){
		var check='<div id="classck'+cod+'"><div class="checkbox">'+
				          '<label>'+
				            '<input type="checkbox" id="ck'+cod+'" value="" checked>'+
				            '<span class="cr"><i class="cr-icon  glyphicon glyphicon-remove"></i></span>'+
				            '<span class="small2">'+nom+'</span>'+
				          '</label>'+
				        '</div>';
			$('#listCheck').prepend(check);
			glo.listDiagNom.push(nom);
			glo.listDiag.push(cod);
			$("#ck"+cod).change(function() {
				$("#classck"+cod).remove();
				var index = glo.listDiag.indexOf(cod);
				if (index > -1) {
				    glo.listDiag.splice(index, 1);
				    glo.listDiagNom.splice(index, 1);
				}
				$("#InpClave").val("").focus();
			});
			$("#InpClave").val("").focus();
	}
	
 	$("#InpClave").autocomplete({
	    source: function (request, response) {
	    	$.ajax({
          		  url: "./services/GetDiagnosticos.php",
          		  data:{
          		  	clave:request.term.toUpperCase(),
          		  	tabla:$('#TablaGrupo').val()
          		  },
		          dataType: "jsonp",
		          jsonpCallback:'getDiagnostico',
		          success: function(data) {
		          	if(data){
		          		response($.map(data, function (el) {
		          			var index = glo.listDiag.indexOf(el.f1.replace(".", ""));
							if (index<0) {
			                	return {
				                    label: el.f2,
				                    value: el.f2,
				                    codigo:el.f1.replace(".", ""),
				                    nombre:el.f2		                
			                    };
			                }
		            	}));
		    }}});
	    },
	    minLength: 3,
	    select: function (event, ui) {
	    	setDiagTable(ui.item.codigo,ui.item.nombre);
	    },
	    open: function () {
	        $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
	        $(this).addClass("list-group");
	    },
	    close: function () {
	        $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
	    }
	}).keypress(function (e) {
	    if (e.keyCode === 13) {
	        e.preventDefault();
	        return false;
	    }
	}).autocomplete("instance")._renderItem = function (ul, item) {
	    ul.addClass("list-group");
	    ul.addClass("Ancho");
	    return $( '<li class="list-group-item" style="max-width:200px;max-height: 250px;">' )
	        .append('<h6 class="small2">' + item.label + '</h6>' +
	                '</li>').appendTo(ul);     
	};
	
	
	$('#BorrarDiag').click(function(){
		$("#InpClave").val("").focus();
	});
	$('#panelBusquedas,#leyenda,#panelDiagnostico,#BtnMostrarInfo,#BtnMostrarLeyenda,#BtnMostrarBusquedas')
		   .mouseenter(function() {
			glo.informacion.tooltip('hide');
		  });
	
	$('#AdicionarDiag').click(function(){
		waitingDialog.show();
		glo.socket.emit('GetListDiag',$('#TablaGrupo').val(), function(message){
			var decrypted =FuncDecrypted(message);
			glo.informacion.tooltip('hide');
			var html='',dataSet=[];
			for(i=0;i<decrypted.length;i++){
				var index = glo.listDiag.indexOf(decrypted[i].cod.replace(".", ""));
				if (index<0) {
					dataSet.push([decrypted[i].cod,decrypted[i].nom,'<div class="checkbox"><label><input type="checkbox"  onchange="toggleCheckbox(\''+
					decrypted[i].cod.replace(".", "")+'-'+decrypted[i].nom
					+'\')" ><span class="cr"><i class="cr-icon glyphicon glyphicon-ok"></i></span></label>']);
			    }			
			}
			BootstrapDialog.show({
				//cssClass: 'login-dialog',
				size: BootstrapDialog.SIZE_WIDE,
				closable: true,
	            closeByBackdrop: false,
	            closeByKeyboard: false,
	            title: 'Lista de Diagnosticos',
	            message: '<table id="TablaSelecDiag" class="table table-striped table-bordered" cellspacing="0" width="100%">'+
				'</table>',
				onshown: function (dialogRef) {
					waitingDialog.hide();
					$('#TablaSelecDiag').DataTable({
				    	"aLengthMenu": [[10, 15 ], [10, 15]],
						"iDisplayLength": 10,
						"iDisplayStart": 0,
						"oLanguage": {
								"sProcessing":     "Procesando...",
								"sLengthMenu":     "Mostrar _MENU_ registros",
								"sZeroRecords":    "No se encontraron resultados",
								"sEmptyTable":     "Ningún dato disponible en esta tabla",
								"sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros<br>",
								"sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
								"sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
								"sInfoPostFix":    "",
								"sSearch":         "Buscar:",
								"sUrl":            "",
								"sInfoThousands":  ",",
								"sLoadingRecords": "Cargando...",
								"oPaginate": {
									"sFirst":    "Primero",
									"sLast":     "Último",
									"sNext":     "Siguiente",
									"sPrevious": "Anterior"
								},
								"oAria": {
									"sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
									"sSortDescending": ": Activar para ordenar la columna de manera descendente"
								}
						},
				    	data: dataSet,
				        columns: [
				            { title: "Codigo" },
				            { title: "Descripcion" },
				            { title: "Add" }
				       	],
					   "deferRender": true
					});
				},
	            buttons: [{
	                label: 'Seleccionar',
	                cssClass: 'btn-primary',
	                action: function(dialogRef){
	                 for(var i=0;i<glo.listDiagTemp.length;i++){
	                 	setDiagTable(glo.listDiagTemp[i],glo.listDiagNomTemp[i]);
	                 }
	                 glo.listDiagTemp=[];
	                 glo.listDiagNomTemp=[];
	                 dialogRef.close();
	               }
	            }, {
	                label: 'Cancelar',
	                action: function(dialogRef){
	                    dialogRef.close();
	                }
	            }]
	        });
			
		});
		
	});
	$("#TablaGrupo").change(function(){
		glo.listDiag=[];
		glo.listDiagNom=[];
		$("#InpClave").val("").focus();
		$('#listCheck').empty();
		
	});
	$("#msEdad").multiselect('disable');
	$("#TablaGrupoEdad").change(function(){
		if($('#TablaGrupoEdad').val()==0){
			$('#msEdad').multiselect('dataprovider', [{}]);
			$("#msEdad").multiselect('disable');
		}else{
			$.ajax({
          		  url: "./services/GetEdad.php",
          		  data:{
          		  	tabla:$('#TablaGrupoEdad').val()
          		  },
		          dataType: "json",
		          success: function(data) {
			          	if(data){
			          		$('#msEdad').multiselect('dataprovider', data);
			          		$("#msEdad").focus();
			          	}
		          }
		    });
		  }
	});
	
	if($( "#map" ).width()>900){
		$("#MostrarBusquedas").hide();	
			
	}else{
		$("#panelBusquedas").hide();
		$("#title").hide();
	}
	
  	$("#OcultarBusqueda").click(function(){
		$("#panelBusquedas").hide( 200, function() {
				$("#MostrarBusquedas").show(200);
		});
	});
	
	$("#MostrarBusquedas").click(function(){
		$("#MostrarBusquedas").hide( 200, function() {
				$("#panelBusquedas").show(200);
		});
	});
	
	if($( "#map" ).width()>900){
		$("#MostrarLeyenda").hide();	
	}else{
		$("#leyenda").hide();
	}
	
  	$("#OcultarLayenda").click(function(){
		$("#leyenda").hide( 200, function() {
				$("#MostrarLeyenda").show(200);
		});
	});
	
	$("#MostrarLeyenda").click(function(){
		$("#MostrarLeyenda").hide( 200, function() {
				$("#leyenda").show(200);
		});
	});
	
	if($( "#map" ).width()>900){
		$("#BtnMostrarInfo").hide();	
	}else{
		$("#panelDiagnostico").hide();
	}
	
  	$("#OcultarResultado").click(function(){
		$("#panelDiagnostico").hide( 200, function() {
				$("#BtnMostrarInfo").show(200);
		});
	});
	
	$("#BtnMostrarInfo").click(function(){
		$("#BtnMostrarInfo").hide( 200, function() {
				$("#panelDiagnostico").show(200);
		});
	});
	$('#sltMulti').prop('disabled', 'disabled');
	$('#MultiGrupo').hide();
	
	$("#sltTasas").change(function(){
		if ($("#sltTasas").val()==2||$("#sltTasas").val()==3) {
        	$('#sltMulti').prop('disabled', false);
        	$('#MultiGrupo').show();
        }
	    else {
	        $('#sltMulti').prop('disabled', 'disabled');
	        $('#MultiGrupo').hide();
	    }
	});
	/*
	 Carga de parametros de perticion al mapa
	 * */
	function getMultiSelect(id){
		var brands = $('#'+id+' option:selected');
	    var selection = [];
	    $(brands).each(function(index, brand){
	           selection.push((brand.value));
	    });
	    return selection;
	}
	function getParamentros(){
		waitingDialog.show();
		glo.featureOverlay.getSource().clear();  
		glo.Emit.Escala=$("#layers").val();
		glo.Emit.FechaAtencionMin=$('#datetimepicker_ini').data("DateTimePicker").getDate().format('YYYY-MM-DD HH:mm');
		glo.Emit.FechaAtencionMax=$('#datetimepicker_fin').data("DateTimePicker").getDate().format('YYYY-MM-DD HH:mm');
		$("#LblFechaMin").empty().append(glo.Emit.FechaAtencionMin);
		$("#LblFechaMax").empty().append(glo.Emit.FechaAtencionMax);
		
		if($('#TablaGrupo').val()=='1'){
			glo.Emit.TablaGrupo='d_cie10';	
		}else if($('#TablaGrupo').val()=='2'){
			glo.Emit.TablaGrupo='d_grupo_cie10';	
		}else if($('#TablaGrupo').val()=='3'){
			glo.Emit.TablaGrupo='d_ops';	
		}else if($('#TablaGrupo').val()=='4'){
			glo.Emit.TablaGrupo='d_dane';	
		}else if($('#TablaGrupo').val()=='5'){
			glo.Emit.TablaGrupo='d_taucher';	
		}else if($('#TablaGrupo').val()=='6'){
			glo.Emit.TablaGrupo='d_taucher_subgrupos';	
		}else if($('#TablaGrupo').val()=='7'){
			glo.Emit.TablaGrupo='d_taucher_grupos';	
		}else if($('#TablaGrupo').val()=='8'){
			glo.Emit.TablaGrupo='d_ops_grupos';	
		}
		
		if(glo.listDiag.length!=0){
			glo.Emit.Diagnostico=glo.listDiag.join().replace(/,/g, "','");	
		}else{
			glo.Emit.Diagnostico='';
		}
		
		if($('#sexo').val()=='3'){
			glo.Emit.sexo='';	
		}else{
			glo.Emit.sexo=$('#sexo').val();
		}
		
		if($('#TablaGrupoEdad').val()=='0'){
			glo.Emit.GrupoEdad='';	
		}else if($('#TablaGrupoEdad').val()=='1'){
			glo.Emit.GrupoEdad='e_etario';	
		}else if($('#TablaGrupoEdad').val()=='2'){
			glo.Emit.GrupoEdad='e_quinquenal';	
		}else if($('#TablaGrupoEdad').val()=='3'){
			glo.Emit.GrupoEdad='e_tresgrupos';	
		}
					
		var msEdad=getMultiSelect('msEdad');
		if(msEdad.length==0){
	  		glo.Emit.msEdad='';
	  	}else{
	  		glo.Emit.msEdad=msEdad.join();
	  	}
	  	var msTipoRegimen=getMultiSelect('msTipoRegimen');
	  	if(msTipoRegimen.length==0){
	  		glo.Emit.msTipoRegimen='';
	  	}else{
	  		glo.Emit.msTipoRegimen=msTipoRegimen.join();
	  	}
	  	var msEPS=getMultiSelect('msEPS');
	  	if(msEPS.length==0){
	  		glo.Emit.msEPS='';
	  	}else{
	  		glo.Emit.msEPS=msEPS.join().replace(/,/g, "','");
	  	}
	  	
	  	var msEtnia=getMultiSelect('msEtnia');
	  	
	  	if(msEtnia.length==0){
	  		glo.Emit.msEtnia='';
	  	}else{
	  		glo.Emit.msEtnia=msEtnia.join();
	  	}
	  	var msEstadoCivil=getMultiSelect('msEstadoCivil');
	  	
	  	if(msEstadoCivil.length==0){
	  		glo.Emit.msEstadoCivil='';
	  	}else{
	  		glo.Emit.msEstadoCivil=msEstadoCivil.join();
	  	}
	  	var msTipoAtencion=getMultiSelect('msTipoAtencion');
	  	if(msTipoAtencion.length==0){
	  		glo.Emit.msTipoAtencion='';
	  	}else{
	  		glo.Emit.msTipoAtencion=msTipoAtencion.join();
	  	}
	  	
	  	var msRedServicio=getMultiSelect('msRedServicio');
		if(msRedServicio.length==0){
	  		glo.Emit.msRedServicio='';
	  	}else{
	  		glo.Emit.msRedServicio=msRedServicio.join();
	  	}
	  	
	  	$("#TituloAtenProc").empty().append('Mapa de '+$('#msProcedencia').val());
	  	if($('#msProcedencia').val()=='atencion'){
			glo.Emit.Procedencia='_aten';
		}else{
			glo.Emit.Procedencia='';
		}
		
		glo.Emit.Agrupacion=$('#sltAgrupacion').val();
		glo.Emit.Tasas=$('#sltTasas').val();
		glo.Emit.Mortalidad =$("#chkMortalidad").is(':checked');
		
		 
		if(glo.Emit.Agrupacion==1){
			glo.Numerador='Personas';
			glo.Numerador=glo.Emit.Mortalidad==true?glo.Numerador+' Fallecidas':glo.Numerador;	
		}else if(glo.Emit.Agrupacion==2){
			glo.Numerador='Atenciones  DIA';
			glo.Numerador=glo.Emit.Mortalidad==true?glo.Numerador+' Fallecidos':glo.Numerador;	
		}else if(glo.Emit.Agrupacion==3){
			glo.Numerador='Atenciones';
			glo.Numerador=glo.Emit.Mortalidad==true?glo.Numerador+' Fallecidos':glo.Numerador;
		}
		glo.Emit.Multi=$('#sltMulti').val();
		glo.Emit.TipoZona=$('#SltTipoZona').val();
		
		if(glo.Emit.Tasas==2||glo.Emit.Tasas==3){
			$("#LeyendaTasa").empty()
				.append('Tasa poblacional <br>')
				.append('<small>'+glo.Numerador+'  x '+formatNum(numeral(glo.Emit.Multi).format('0,0.00'))+'</small>');
			$("#TituloTasa").empty().prepend('Tasa poblacional <br>');
			$("#TituloTasa").append('<small  class="text-muted"> '+glo.Numerador+' x '+formatNum(numeral(glo.Emit.Multi).format('0,0.'))+'</small>');
			glo.Emit.Tasas==3?$("#LeyendaTasa,#TituloTasa").append('<br><small class="text-muted">/ Diagnóstico </small>'):
			glo.Emit.Tasas==2?$("#LeyendaTasa,#TituloTasa").append('<br><small class="text-muted">/ Población DANE </small>'):'';
			$("#TituloValor").empty().append('Número De '+glo.Numerador);
					
		}else if(glo.Emit.Tasas==1){
			$("#TituloTasa").empty().prepend('Valores Absolutos');
			$("#TituloValor").empty().append('Número De '+glo.Numerador);
			$("#MultiLeyenda").empty();
			$("#LeyendaTasa").empty().append('Cantidad De '+glo.Numerador);
		}
		$('#hrContador').show();
		
		glo.informacion.tooltip('hide');
		console.log('inicia Peticion');
		GetGeojson();
	}
	
	$("#filtrarMapa").click(function(){
		getParamentros();
	});
	
 });  
glo.informacion=$('#info2');
glo.informacion.tooltip({
	animation:false,trigger:'manual',html:true
});

glo.featureOverlay= new ol.layer.Vector({
  		source: new ol.source.Vector(),
  		map: glo.map,
		style:function(feature,resolution){
			var text=resolution<5000?feature.get('n'):'';
			if(!glo.highlightStyleCache[text]){
				glo.highlightStyleCache[text]=[new ol.style.Style({
					stroke:new ol.style.Stroke({
						color:'#00FFFF',width:3
					}),
					fill:new ol.style.Fill({
						color:'rgba(235,0,0,0)'
					})
				})];
			}
			return glo.highlightStyleCache[text];
		}
});

glo.remove_features_over=function(feature){
    if (feature !== glo.highlight) {
        if (glo.highlight) {
          glo.featureOverlay.getSource().clear();  
        }
        if (feature) {
          glo.featureOverlay.getSource().addFeature(feature);
          
        }
        glo.highlight = feature;
     }
};



glo.displayFeatureValue=function(pixel){
	glo.informacion.css({
		left:pixel[0]+'px',top:(pixel[1]+35)+'px'
	});
	var feature=glo.map.forEachFeatureAtPixel(pixel,function(feature,layer){
			return feature;
	});
	if(feature){
		if(feature.get('tp')!=0){
			
			var field_show='<h5><b>'+feature.get('n')+'</b><br><b>Tasa '+
				formatNum(numeral(feature.get('t')).format('0,0.'))+'</b><br><small><em>'+
				'x '+formatNum(numeral(glo.Emit.Multi).format('0,0.'))+'</em></small></h5>'+
				'<hr class="hrdiv" width="70%" align="center">'+
				'<small><em><div>'+glo.Numerador+': '+
				formatNum(numeral(feature.get('tp')).format('0,0.'))+'</div><div>Poblacion: '+
				formatNum(numeral(feature.get('pob')).format('0,0.'))+'</div></em></small>';	
		}else{
			var field_show=feature.get('n')+' <br> <b>'+formatNum(numeral(feature.get('t')).format('0,0.'))+'</b> '+glo.Numerador;
		}
		
		glo.informacion.attr('data-original-title',field_show).tooltip('hide').tooltip('fixTitle').tooltip('show');
		glo.remove_features_over(feature);
	}
	else{
		glo.informacion.tooltip('hide');
	}
};
	
$(glo.map.getViewport()).on('mousemove',function(evt){
	var pixel=glo.map.getEventPixel(evt.originalEvent);
	glo.displayFeatureValue(pixel)
});


glo.map.on('pointermove', function(evt) {
    if (evt.dragging) {
      glo.informacion.tooltip('hide');
      return;
    }
    glo.displayFeatureValue(glo.map.getEventPixel(evt.originalEvent));
});
