$( document ).ready(function() {

	AppConfig.Inicial= function(){
    	$( "#lugares" ).autocomplete({
		      minLength: 0,
		      source:  function( request, response ) {	//console.log(request.term);
		        $.ajax( {
			          url: "http://nominatim.openstreetmap.org/?format=json",
			          data: {
			            q: request.term,
			            countrycodes: 'CO'
			          },
			          success: function(result){	//console.log(result);
				        response(result);
				      }
		        });
		      },
		      focus: function( event, ui ) {
		        $( "#lugares" ).val( ui.item.display_name );
		        return false;
		      },
		      select: function( event, ui ) {	//console.log(ui.item);
		      	AppMap.SetExtend(ui.item.boundingbox[0],ui.item.boundingbox[1],ui.item.boundingbox[2],ui.item.boundingbox[3]);
		      	AppMap.ActualizaPunto(ui.item.lat,ui.item.lon);
		        return false;
		      }
		    })
		    .autocomplete( "instance" )._renderItem = function( ul, item ) {	//console.log(item);
		      	return $( "<li>" )
					.append( "<div>" + item.display_name + "</div>" )
		        	.appendTo( ul );
		    };
	};
	AppConfig.ConectarSocket=function(){
	  AppConfig.sk_sofy = io.connect(AppConfig.UrlSocket);
	  AppConfig.sk_sofy.on('connect', function () {
	  	console.log("se conecta");
	  });
	};
	AppConfig.ActivarBtn=function(tipo){
		if(tipo=="Mpio"){
			$("#btn_mpio").removeClass('btn-warning');
			$("#btn_mpio").addClass('btn-success');
			$("#btn_depto").removeClass('btn-success');
			$("#btn_depto").addClass('btn-warning');
			$("#btn_mpio").css({"font-size":"14px"});
			$("#btn_depto").css({"font-size":"12px"});
		}else if(tipo=="Depto"){
			$("#btn_depto").removeClass('btn-warning');
			$("#btn_depto").addClass('btn-success');
			$("#btn_mpio").removeClass('btn-success');
			$("#btn_mpio").addClass('btn-warning');
			$("#btn_depto").css({"font-size":"14px"});
			$("#btn_mpio").css({"font-size":"12px"});
		}
	};
	AppConfig.CargaDataCultivo= function(){
		AppConfig['siembra'] = [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
		AppConfig['cultivo'] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0];
		for (i = 0; i < AppConfig['siembra'].length; i++) {
		    if(AppConfig['siembra'][i]){
				if(AppConfig['siembraIni']===undefined) {
					AppConfig['siembraIni'] = i;
				} else AppConfig['siembraFin'] = i;	
		    }
		}
		for (i = 0; i < AppConfig['cultivo'].length; i++) {
		    if(AppConfig['cultivo'][i]){
				if(AppConfig['cosechaIni']===undefined) {
					AppConfig['cosechaIni'] = i;
				} else AppConfig['cosechaFin'] = i;	
		    }
		}
	};
	
	AppConfig.MostarTerminos= function(){ 		console.log("Ini");
		BootstrapDialog.show({
		            title: txt.tit_terminos,
		            type: BootstrapDialog.TYPE_SUCCESS,
		            closable: false,
		            message: txt.msj_terminos,
		            buttons: [{
		                label: txt.btn_aceptaterminos,
		                cssClass: 'btn-success',
		                action: function(dialog) {
		                    console.log('Aceptar');
		                    dialog.close();
		                }
		            }, {
		                label: txt.btn_cancelar,
		                action: function(dialog) {
		                    console.log('Cerrar');
		                    dialog.close();
		                }
		            }]
		        });
		$("#terminos_condiciones").html(AppConfig.msj_terminos);
	};
	AppConfig.Clima=function(pos){
		var lat = pos.coords.latitude;
		var lon = pos.coords.longitude;
	    AppMap.ActualizaPunto(lat,lon);
    	AppMap.SetExtend((lat-AppMap.escalaExtend),(numeral(lat)+AppMap.escalaExtend),(numeral(lon)+AppMap.escalaExtend),(lon-AppMap.escalaExtend));
		AppConfig.sk_sofy.emit('clima',{lat:lat, lon:lon}, function (msj) {
	  		console.log(msj);
	  		if(msj=="0"){
	  			msj_peligro("Estación NO encontrada!");
	  		}else{
	  			
			var $text = $('<div></div>');
				$text.append( '<div class="form-group">'+
								'<div class="row">'+
									'<div class="col-xs-12" style="font-size: 60px;text-align: center;">'+
										msj.temp_c+
									' °C </div>'+
								'</div>'+
								'<div class="row" style="font-size: 22px;">'+
									'<div class="col-xs-4">'+
										"Máxima: "+
									'</div>'+
									'<div class="col-xs-8">'+
										msj.temp_max + " °C " + msj.temp_max_hora+
									'</div>'+
								'</div>'+
								'<div class="row"  style="font-size: 22px;">'+
									'<div class="col-xs-4">'+
										"Mínima: "+
									'</div>'+
									'<div class="col-xs-8">'+
										msj.temp_min + " °C " + msj.temp_min_hora+
									'</div>'+
								'</div>'+
							'</div>'
							);
			
	        BootstrapDialog.show({
	        	title: txt.tit_clima,
	        	type: BootstrapDialog.TYPE_SUCCESS,
	            message: $text
	        });
	  			
	  			
	  		};
	  	});
	};
	AppConfig.sinUbicacion=function(){
		msj_peligro("Ubicación NO encontrada!");
	};
	$("#btn_clima").click(function(){
		navigator.geolocation.getCurrentPosition(AppConfig.Clima,AppConfig.sinUbicacion);
	});	

	$("#btn_marker").click(function(){
		var $text = $('<div class="container"></div>');
			$text.append(
							'<div class="form-group">'+
								  '<label>'+txt.msj_latitud+'</label>'+
							'</div>'+
							'<div class="form-group">'+
								  	'<label class="radio-inline"><input type="radio" name="optlat" value="+" checked>'+txt.msj_norte+'</label>'+
									'<label class="radio-inline"><input type="radio" name="optlat" value="-">'+txt.msj_sur+'</label>'+
							'</div>'+				
							'<div class="form-group">'+
								  '<input type="text" id="lat" class="form-control lat" />'+
							'</div>'+
							'<div class="form-group">'+
								  '<label>'+txt.msj_longitud+'</label>'+
								  '<input type="text" id="lon" class="form-control lon" />'+	//placeholder="-74.083557"	placeholder="4.622196"
							'</div>'+
							'<div class="form-group">'+
								  '<button type="button" class="btn btn-success" id="btn_coordenada">Buscar</button>'+
							'</div>'
						);
		
        BootstrapDialog.show({
        	title: txt.tit_buscapunto,
        	type: BootstrapDialog.TYPE_SUCCESS,
            message: $text,
            onshown: function(dialogRef){
            	
            	var cleaveLat = new Cleave('.lat', {
				    numericOnly: true,
				    delimiter: '.',
				    blocks: [1, 6],
				});
            	var cleaveLon = new Cleave('.lon', {
				    numericOnly: true,
				    delimiter: '.',
				    blocks: [3, 6],
				    prefix: '-'
				});
            	
		        $("#btn_coordenada").click(function() {
		        	var lat = $("#lat").val().trim(); //console.log(lat);
		        	var lon = $("#lon").val().trim(); //console.log(lon);
		        	if(lat=="" || (lat>90 || lat<-90)){
		        		$("#lat").focus();
		        		return false;	
		        	}
		        	if(lon=="" || lon=="-" || lon<-99){
		        		$("#lon").focus();
		        		return false;
		        	}
		        	AppMap.ActualizaPunto(lat,lon);
		        	AppMap.SetExtend((lat-AppMap.escalaExtend),(numeral(lat)+AppMap.escalaExtend),(numeral(lon)+AppMap.escalaExtend),(lon-AppMap.escalaExtend));
		        	dialogRef.close();
		        });
	        
				$('input:radio[name=optlat]').click(function (){
					var coorN = $('input:radio[name=optlat]:checked').val();	//console.log(coorN);
					cleaveLat.destroy();
					if(coorN=="+"){
		            	cleaveLat = new Cleave('.lat', {
						    numericOnly: true,
						    delimiter: '.',
						    blocks: [1, 6]
						});
					}else {
		            	cleaveLat = new Cleave('.lat', {
						    numericOnly: true,
						    delimiter: '.',
						    blocks: [2, 6],
						    prefix: '-'
						});
					}
				});
				
            }
        });
	});
	$("#btn_miubicacion").click(function() {	console.log("Ubicar");
		navigator.geolocation.getCurrentPosition(AppMap.UbicacionEncontrada,AppConfig.sinUbicacion);
	});
	
	$("#btn_opciones").click(function(){
		var $text = $('<div></div>');
			$text.append( '<div class="form-group">'+
					   		'<i class="fa fa-th-list"></i><label for="">&nbsp;'+txt.tit_mapabase+'</label>'+
					   		'<div class="radio">'+
							  '<label><input type="radio" name="optMapaB" value="ROADMAP">'+txt.msj_map_calle+'</label>'+
							'</div>'+
							'<div class="radio">'+
							  '<label><input type="radio" name="optMapaB" value="TERRAIN">'+txt.msj_map_topo+'</label>'+
							'</div>'+
							'<div class="radio">'+
							  '<label><input type="radio" name="optMapaB" value="HYBRID">'+txt.msj_map_satelite+'</label>'+
							'</div>'+
						'</div>'+
						'<div class="h-divider">'+
					   	'<div class="form-group">'+
					   		'<i class="fa fa-language"></i><label for="">&nbsp;'+txt.tit_idioma+'</label>'+
					   		'<div class="radio">'+
							  '<label><input type="radio" name="optIdioma" value="ES">Español</label>'+
							'</div>'+
							'<div class="radio">'+
							  '<label><input type="radio" name="optIdioma" value="EN">English</label>'+
							'</div>'+
						'</div>'
						);
		
        BootstrapDialog.show({
        	title: txt.tit_opciones,
        	type: BootstrapDialog.TYPE_SUCCESS,
            message: $text,
            onshown: function(dialogRef){
				//verifica la capa Base Activada
				$("input[name=optMapaB][value="+AppMap.LyrBase._type+"]").attr("checked", "checked");
				
            	//verifica Idioma activado
            	$("input[name=optIdioma][value="+txt.Idioma+"]").attr("checked", "checked");
            	
            	//Evento Mapa Base
		        $("input[name=optMapaB]").click(function() {
		        	var tipom = $("input[name=optMapaB]:checked").val();
		        	AppMap.SetBaseLayer(tipom);
		        	dialogRef.close();
		        });
            	//Evento Idioma
		        $("input[name=optIdioma]").click(function() {
		        	var lenguaje = $("input[name=optIdioma]:checked").val();
		        	SetIdioma(lenguaje);
		        	dialogRef.close();
		        });
            }
        });
	});
	
	$("#btn_epoca").click(function(){
		var chart1;
		var $text = $('<div id="container" style="max-height: 510px;"></div>');
		
        BootstrapDialog.show({
        	title: txt.tit_epoca_cultivo,
        	type: BootstrapDialog.TYPE_SUCCESS,
            message: $text,
            onshown: function(dialogRef){
					chart1 = new Highcharts.Chart({
								chart: {
						            renderTo: 'container',
						            type: 'area',
						            height: 300
					         	},
					         	title: {
							   		text: ''
							 	},
					        	credits: {
					            	enabled: false
					        	},
					        	yAxis: {
							   		title: {
								   		text: ''
									},
									labels:
									{
								  		enabled: false
									}
								},
								xAxis: {
							    	categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
								},
						        tooltip: {
            								formatter: function() {
	                							var texto;
	                							var siembra=false;
	                							var cosecha=false;
	                							var IndexSel;
	            								$.each(this.points, function(i, point) {	//console.log(point);	console.log(i);
	            									IndexSel = point.point.index;
	            									if(point.series.name=="Siembra"){
	            										if (point.y) {
	            											siembra = true;
	            										}
	            									}else{
	            										if (point.y){
	            											cosecha = true;
	            										}
	            									}
	                							});		//console.log(siembra + " " + cosecha + " " + IndexSel);
	                							if(siembra && AppConfig['siembraIni'] == IndexSel){
													texto = '<span style="color:#8A4B08;font-weight:bold;">Inicio Siembra'+' : 20 de Marzo<span>';
	                							} else if(siembra && AppConfig['siembraFin'] == IndexSel){
													texto = '<span style="color:#8A4B08;font-weight:bold;">Finalización Siembra'+' : 04 de Mayo<span>';
	                							} else if(cosecha && AppConfig['cosechaIni'] == IndexSel){
													texto = '<span style="color:#088A08;font-weight:bold;">Inicio Cosecha'+' : 20 de Agosto<span>';
	                							} else if(cosecha && AppConfig['cosechaFin'] == IndexSel){
													texto = '<span style="color:#088A08;font-weight:bold;">Finalización Cosecha'+' : 04 de Julio<span>';
	                							}else{
	                								texto = '<span style="color:red;font-weight:bold;">Fecha no favorable para Siembra y cosecha<span>';
	                							} 
	            								return texto;
            								},
        									shared: true
								},
							 	series: [{
						            name: txt.msjSiembra,
						            color: '#8A4B08',
						            data: AppConfig['siembra']
						
						        }, {
						            name: txt.msjCosecha,
						            color: '#088A08',
						            data: AppConfig['cultivo']
						        }]
					      });
			$text.append( '<div class="form-group">'+
					   		'<label for="" class="label-titulo siembra">&nbsp;Época favorable para sembrar:</label><br>'+
					   		'<label for="" class="label-texto siembra">&nbsp;Inicia: 20 de Marzo</label><br>'+
					   		'<label for="" class="label-texto siembra">&nbsp;Finaliza: 04 de Mayo</label>'+
							'</div>'+
							'<div class="form-group">'+
					   		'<label for="" class="label-titulo cosecha">&nbsp;Época favorable para Cosecha:</label><br>'+
					   		'<label for="" class="label-texto cosecha">&nbsp;Inicia: 20 de Marzo</label><br>'+
					   		'<label for="" class="label-texto cosecha">&nbsp;Finaliza: 04 de Mayo</label>'+
							'</div>'
						);
            }
        });
	});
	
	AppConfig.Temperatura=function(pos){
		var lat = pos.coords.latitude;
		var lon = pos.coords.longitude;
	    AppMap.ActualizaPunto(lat,lon);
    	AppMap.SetExtend((lat-AppMap.escalaExtend),(numeral(lat)+AppMap.escalaExtend),(numeral(lon)+AppMap.escalaExtend),(lon-AppMap.escalaExtend));
    	AppConfig.sk_sofy.emit('temperatura',{lat:lat, lon:lon}, function (msj){	console.log(msj);
			var ranges = [
				            ["Ene", msj.datos[0].min1, msj.datos[0].max1],
				            ["Feb", msj.datos[0].min2, msj.datos[0].max2],
				            ["Mar", msj.datos[0].min3, msj.datos[0].max3],
				            ["Abr", msj.datos[0].min4, msj.datos[0].max4],
				            ["May", msj.datos[0].min5, msj.datos[0].max5],
				            ["Jun", msj.datos[0].min6, msj.datos[0].max6],
				            ["Jul", msj.datos[0].min7, msj.datos[0].max7],
				            ["Ago", msj.datos[0].min8, msj.datos[0].max8],
				            ["Sep", msj.datos[0].min9, msj.datos[0].max9],
				            ["Oct", msj.datos[0].min10, msj.datos[0].max10],
				            ["Nov", msj.datos[0].min11, msj.datos[0].max11],
				            ["Dic", msj.datos[0].min12, msj.datos[0].max12]
				        ],
				        averages = [
				            ["Ene", msj.datos[0].med1],
				            ["Feb", msj.datos[0].med1],
				            ["Mar", msj.datos[0].med1],
				            ["Abr", msj.datos[0].med1],
				            ["May", msj.datos[0].med1],
				            ["Jun", msj.datos[0].med1],
				            ["Jul", msj.datos[0].med1],
				            ["Ago", msj.datos[0].med1],
				            ["Sep", msj.datos[0].med1],
				            ["Oct", msj.datos[0].med1],
				            ["Nov", msj.datos[0].med1],
				            ["Dic", msj.datos[0].med1]
				        ];
            	
					chart1 = new Highcharts.Chart({
								chart: {
						            renderTo: 'container_temperatura',
						            zoomType: 'xy',
						            height: 300
					         	},
					         	title: {
							   		text: ''
							 	},
					        	credits: {
					            	enabled: false
					        	},
					        	yAxis: {
						            title: {
						                text: null
						            }
						        },
								xAxis: {
						            tickInterval: 1,
						            labels: {
						                enabled: true,
						                formatter: function() { return averages[this.value][0];},
						            }
						        },
						        tooltip: {
						            crosshairs: true,
						            shared: true,
						            valueSuffix: '°C'
						        },
						        legend: {},
							 	series: [{
						            name: 'Temperatura',
						            data: averages,
						            zIndex: 1,
						            marker: {
						                fillColor: 'white',
						                lineWidth: 2,
						                lineColor: Highcharts.getOptions().colors[0]
						            }
						        }, {
						            name: 'Rango',
						            data: ranges,
						            type: 'arearange',
						            lineWidth: 0,
						            linkedTo: ':previous',
						            color: Highcharts.getOptions().colors[0],
						            fillOpacity: 0.3,
						            zIndex: 0
						        }]
					      });
    		
    	});
	};
	
	$("#btn_temperatura").click(function(){
		var chart1;
		var $text = $('<div id="container_temperatura" style="max-height: 510px;"></div>');
        BootstrapDialog.show({
        	title: txt.tit_pronostico + " Temperatura",
        	type: BootstrapDialog.TYPE_SUCCESS,
            message: $text,
            onshown: function(dialogRef){
            	navigator.geolocation.getCurrentPosition(AppConfig.Temperatura,AppConfig.sinUbicacion);
            }
        });
	});
	
	$("#btn_pronostico").click(function(){
		var chart1;
		var $text = $('<div id="container_pronostico" style="max-height: 510px;"></div>');
		
        BootstrapDialog.show({
        	title: txt.tit_pronostico,
        	type: BootstrapDialog.TYPE_SUCCESS,
            message: $text,
            onshown: function(dialogRef){
					chart1 = new Highcharts.Chart({
								chart: {
						            renderTo: 'container_pronostico',
						            zoomType: 'xy',
						            height: 300
					         	},
					         	title: {
							   		text: ''
							 	},
					        	credits: {
					            	enabled: false
					        	},
					        	yAxis: [{ // Primary yAxis
							            labels: {
							                format: '{value}°C',
							                style: {
							                    color: Highcharts.getOptions().colors[1]
							                }
							            },
							            title: {
							                text: txt.msjTemperatura,
							                style: {
							                    color: Highcharts.getOptions().colors[1]
							                }
							            }
							        }, { // Secondary yAxis
							            title: {
							                text: txt.msjPrecipitacion,
							                style: {
							                    color: Highcharts.getOptions().colors[0]
							                }
							            },
							            labels: {
							                format: '{value} l/m2',
							                style: {
							                    color: Highcharts.getOptions().colors[0]
							                }
							            },
							            opposite: true
							        }],
								xAxis: {
							    	categories: ['Oct', 'Nov', 'Dic'],
            						crosshair: true
								},
						        tooltip: {
						            shared: true
						        },
						        legend: {
						            layout: 'vertical',
						            align: 'left',
						            x: 120,
						            verticalAlign: 'top',
						            y: 100,
						            floating: true,
						            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
						        },
							 	series: [{
						            name: txt.msjPrecipitacion,
						            type: 'column',
						            yAxis: 1,
						            data: [ 194.1, 95.6, 54.4],
						            tooltip: {
						                valueSuffix: ' l/m2'
						            }
						
						        }, {
						            name: txt.msjTemperatura,
						            type: 'spline',
						            data: [18.3, 13.9, 19.6],
						            tooltip: {
						                valueSuffix: '°C'
						            }
						        }]
					      });
            }
        });
	});

	$("#btn_mapa").click(function(){
		AppMap.AddCapa("Depto","desplegar");
		$("#btn_mpio").hide();
	});
	$("#btn_mpio").click(function(){
		AppMap.AddCapa("Mpio","capa");
	});
	$("#btn_depto").click(function(){
		AppMap.AddCapa("Depto","capa");
	});
	
	AppConfig.ConectarSocket();	
	SetIdioma("ES");
    AppMap.map=AppMap.InitMap();
	AppMap.SetBaseLayer("calle");
	AppMap.AddPunto(AppMap.center[0],AppMap.center[1]);
	AppConfig.CargaDataCultivo();
	AppConfig.MostarTerminos();		
	AppConfig.Inicial();
	console.log("CORREGIR!!! - MOSTRAR MAPA");	//$("#map").hide();
	
});

