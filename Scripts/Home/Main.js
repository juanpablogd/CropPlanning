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
		                    navigator.app.exitApp();
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
				$text.append('<div class="form-group">'+
								'<div class="row">'+
									'<div class="col-xs-4" >'+
										'<img src="../../Images/Home/wind.png" height="80%" width="80%"><br>'+
									'</div>'+
									'<div class="col-xs-8" style="font-size: 12px;text-align: center;">'+
										msj.depto+'-'+msj.mpio+'<br>'+
										'Estación '+msj.estacion+'<br>'+
										'Distancia '+msj.distancia+' Kms<br>'+
										msj.fechaHora+'<br>'+
									'</div>'+
								'</div>'+
								'<div class="row" style="margin-top: 0px;">'+
									'<br><button type="button" class="btn btn-success btn-block">Temperatura</button><br>'+
								'</div>'+
								'<div class="row">'+
									'<div class="col-xs-4" style="font-size: 20px;font-weight: 600;text-align: center;">'+
										msj.temp_c+' '+
									'</div>'+
									'<div class="col-xs-8" style="font-size: 9px;text-align: center;">'+
										txt.msjMax+": "+msj.temp_max + " °C " + msj.temp_max_hora+ '<br>'+
										txt.msjMin+": "+msj.temp_min + " °C " + msj.temp_min_hora+
									'</div>'+
								'</div>'+
								'<div class="row" style="margin-top: -15px;">'+
									'<br><button type="button" class="btn btn-success btn-block">Humedad Relativa</button><br>'+
								'</div>'+
								'<div class="row">'+
									'<div class="col-xs-12" style="font-size: 18px;text-align: center;">'+
										msj.humedad_rel+' '+
									'</div>'+
								'</div>'+
								'<div class="row" style="margin-top: -15px;">'+
									'<br><button type="button" class="btn btn-success btn-block">Precipitación Acumulada Diaria</button><br>'+
								'</div>'+
								'<div class="row">'+
									'<div class="col-xs-12" style="font-size: 18px;text-align: center;">'+
										msj.precip_dia+' '+
									'</div>'+
								'</div>'+
								'<div class="row" style="margin-top: -15px;">'+
									'<br><button type="button" class="btn btn-success btn-block">Radiación Acumulada Diaria</button><br>'+
								'</div>'+
								'<div class="row">'+
									'<div class="col-xs-12" style="font-size: 18px;text-align: center;">'+
										msj.rad_solar+' '+
									'</div>'+
								'</div>'+
							'</div>'
							);
			
	        BootstrapDialog.show({
	        	title: txt.tit_tiempoAtmosferico,
	        	type: BootstrapDialog.TYPE_SUCCESS,
	            message: $text
	        });
	  			
	  			
	  		};
	  }); 
	};
	AppConfig.sinUbicacion=function(){
		msj_peligro("Ubicación NO encontrada!");
		cordova.dialogGPS("Su GPS está apagado, Esta aplicación requiere que este activo para todas sus funciones.",//message
                    "Use GPS, con wifi o Red celular.",//description
                    function(buttonIndex){//callback
                      switch(buttonIndex) {
                        case 0: break;//cancel
                        case 1: break;//neutro option
                        case 2: break;//user go to configuration
                      }},
                      "Por favor encienda su GPS",//title
                      ["Cancelar","Luego","Ir"]);//buttons
	};

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
		navigator.geolocation.getCurrentPosition(AppMap.UbicacionEncontrada,AppConfig.sinUbicacion,AppConfig.gpsOptions);
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
	
	$("#btn_opcProduccion").click(function(){
		var $text = $('<div></div>');
			$text.append( '<div class="form-group">'+
					   		'<i class="fa fa-th-list"></i><label for="">&nbsp;'+txt.msjProduccion+'</label>'+
					   		'<div class="radio">'+
							  '<label><input type="radio" name="optProd" value="cultivo">'+txt.tit_epoca_cultivo+'</label>'+
							'</div>'+
						'</div>'+
						'<div class="form-group">'+
							'<label><input type="checkbox" id="opMapa" value="opMapa">&nbsp;'+txt.msjMapa+'</label>'+
					   		'<div class="radio">'+
							  '<label><input type="radio" name="optTipomapa" value="riego_h">'+txt.msjRiegoSuper+'</label>'+
							'</div>'+
					   		'<div class="radio">'+
							  '<label><input type="radio" name="optTipomapa" value="sec_h">'+txt.msjSecanoSuper+'</label>'+
							'</div>'+
						'</div>'
						);
		
        BootstrapDialog.show({
        	title: txt.msjProduccion,
        	type: BootstrapDialog.TYPE_SUCCESS,
            message: $text,
            onshown: function(dialogRef){
            	//Activa Check si el mapa esta activo
            	if(AppMap.map.hasLayer(AppMap.LyrMpioDepto) || AppMap.map.hasLayer(AppMap.LyrMpioDepto)){
            		$('#opMapa').prop('checked', true);
            	}
				//Activa opcion segun tipo de mapa
				$('input[name=optTipomapa][value='+AppMap.tipoMapa+']').attr("checked", "checked");
				
            	//Click Opcion Producción
		        $("input[name=optProd]").click(function() {
		        	var optProd = $("input[name=optProd]:checked").val();
		        	if(optProd == "cultivo") AppConfig.opcEpocaCultivo(); 
		        	dialogRef.close();
		        });
		        //Click opción Mapa
		        $('#opMapa').click(function(){
	        		AppMap.AddCapa("Depto","desplegar");
					$("#btn_mpio").hide();
					$("#btn_depto").hide();
					dialogRef.close();
		        });
            	//Click Opcion Producción Riego o Secanto
		        $("input[name=optTipomapa]").click(function() {
		        	AppMap.tipoMapa = $("input[name=optTipomapa]:checked").val();
	        		AppMap.AddCapa("Depto","desplegar");
					$("#btn_mpio").hide();
					$("#btn_depto").hide();
					if($("#opMapa").is(":checked"))	dialogRef.close();
		        });
            }
        });
	});
	
	$("#btn_opcClima").click(function(){
		var $text = $('<div></div>');
			$text.append( '<div class="form-group">'+
					   		'<i class="fa fa-th-list"></i><label for="">&nbsp;'+txt.tit_tiempo+'</label>'+
					   		'<div class="radio">'+
							  '<label><input type="radio" name="optClima" value="optTiempo">'+txt.tit_tiempo+'</label>'+
							'</div>'+
							'<div class="radio">'+
							  '<label><input type="radio" name="optClima" value="optPronostico">'+txt.tit_pronostico+'</label>'+
							'</div>'+
							'<div class="radio">'+
							  '<label><input type="radio" name="optClima" value="optClimogramaTemPre">'+txt.msjclimogramaTemPre+'</label>'+
							'</div>'+
							'<div class="radio">'+
							  '<label><input type="radio" name="optClima" value="optClimogramaHumeSola">'+txt.msjclimogramaHumSol+'</label>'+
							'</div>'+
						'</div>'
						);
		
        BootstrapDialog.show({
        	title: txt.tit_clima,
        	type: BootstrapDialog.TYPE_SUCCESS,
            message: $text,
            onshown: function(dialogRef){
            	//Evento Mapa Base
		        $("input[name=optClima]").click(function() {
		        	var optClima = $("input[name=optClima]:checked").val();
		        	if(optClima=="optTiempo"){
		        		navigator.geolocation.getCurrentPosition(AppConfig.Clima,AppConfig.sinUbicacion,AppConfig.gpsOptions);
		        	}else if(optClima=="optPronostico"){
		        		AppConfig.opcPronostico();
		        	}else if(optClima=="optClimogramaTemPre"){
						AppConfig.opcTemperatura();		        		
		        	}else if(optClima=="optClimogramaHumeSola"){
						AppConfig.opcHumeSola();		        		
		        	}
		        	dialogRef.close();
		        });

            }
        });
	});
	
	$("#btn_opcMicultivo").click(function(){
		AppConfig.listaMiCultivo();
	});
	AppConfig.listaMiCultivo=function(){
		var $text = $('<div></div>');
			$text.append( '<div class="form-group">'+
							  '<button type="button" class="btn btn-success" id="btnAddcultivo"><spam class="glyphicon glyphicon-plus"></spam>&nbsp;'+txt.msjAddcultivo+'</button>'+
                          '</div>'
						);
		
        BootstrapDialog.show({
        	title: txt.msjMicultivo,
        	type: BootstrapDialog.TYPE_SUCCESS,
            message: $text,
            onshown: function(dialogRef){
		        $("#btnAddcultivo").click(function() {
		        	dialogRef.close();
		        	AppConfig.addMiCultivo();
		        });

            }
        });
	};
	AppConfig.addMiCultivo=function(){
		var $text = $('<div></div>');
			$text.append( '<div class="form-group">'+
							  '<button type="button" class="btn btn-success" id="btnListacultivo"><spam class="glyphicon glyphicon-th-list"></spam>&nbsp;'+txt.msjMicultivo+'</button>'+
							'</div>'+
							'<div class="form-group">'+
							  '<label for="fnombre">Nombre</label><input type="text" class="form-control" id="fnombre">'+
							'</div>'+
							'<div class="form-group">'+
							  '<label for="ffecha">Nombre</label><input type="text" class="form-control" id="fecha">'+
							'</div>'+
							'<div class="form-group">'+
							  '<label for="fvariedad">Variedad</label><select class="form-control" id="fvariedad">'+
							  '<option value="">--Seleccione--</option>'+
							  '</select>'+
							'</div>'+
							'<div class="form-group">'+
							  '<label for="fsistema">Sistema</label><select class="form-control" id="fsistema">'+
							  '<option value="">--Seleccione--</option>'+
							  '</select>'+
							'</div>'+
							'<div class="form-group">'+
							  '<label for="fhas">Has Cultivadas</label><input type="text" class="form-control" id="fhas">'+
							'</div>'
						);
		
        BootstrapDialog.show({
        	title: txt.msjAddcultivo,
        	type: BootstrapDialog.TYPE_SUCCESS,
            message: $text,
            onshown: function(dialogRef){
		        $("#btnListacultivo").click(function() {
		        	dialogRef.close();
					AppConfig.listaMiCultivo();
		        });

            }
        });
	};
	AppConfig.opcEpocaCultivo=function(){
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
	};
	
	AppConfig.Temperatura=function(pos){
		var lat = pos.coords.latitude;
		var lon = pos.coords.longitude;
	    AppMap.ActualizaPunto(lat,lon);
    	AppMap.SetExtend((lat-AppMap.escalaExtend),(numeral(lat)+AppMap.escalaExtend),(numeral(lon)+AppMap.escalaExtend),(lon-AppMap.escalaExtend));
    	AppConfig.sk_sofy.emit('temperatura',{lat:lat, lon:lon}, function (msj){	console.log(msj);
			var rangesTem = [
				            ["Ene", msj.tepe[0].datos.min1, msj.tepe[0].datos.max1],
				            ["Feb", msj.tepe[0].datos.min2, msj.tepe[0].datos.max2],
				            ["Mar", msj.tepe[0].datos.min3, msj.tepe[0].datos.max3],
				            ["Abr", msj.tepe[0].datos.min4, msj.tepe[0].datos.max4],
				            ["May", msj.tepe[0].datos.min5, msj.tepe[0].datos.max5],
				            ["Jun", msj.tepe[0].datos.min6, msj.tepe[0].datos.max6],
				            ["Jul", msj.tepe[0].datos.min7, msj.tepe[0].datos.max7],
				            ["Ago", msj.tepe[0].datos.min8, msj.tepe[0].datos.max8],
				            ["Sep", msj.tepe[0].datos.min9, msj.tepe[0].datos.max9],
				            ["Oct", msj.tepe[0].datos.min10, msj.tepe[0].datos.max10],
				            ["Nov", msj.tepe[0].datos.min11, msj.tepe[0].datos.max11],
				            ["Dic", msj.tepe[0].datos.min12, msj.tepe[0].datos.max12]
				        ],
				        averagesTem = [
				            ["Ene", msj.tepe[0].datos.med1],
				            ["Feb", msj.tepe[0].datos.med2],
				            ["Mar", msj.tepe[0].datos.med3],
				            ["Abr", msj.tepe[0].datos.med4],
				            ["May", msj.tepe[0].datos.med5],
				            ["Jun", msj.tepe[0].datos.med6],
				            ["Jul", msj.tepe[0].datos.med7],
				            ["Ago", msj.tepe[0].datos.med8],
				            ["Sep", msj.tepe[0].datos.med9],
				            ["Oct", msj.tepe[0].datos.med10],
				            ["Nov", msj.tepe[0].datos.med11],
				            ["Dic", msj.tepe[0].datos.med12]
				        ],
				        averagesPre = [
				            ["Ene", msj.tepe[1].datos.med1],
				            ["Feb", msj.tepe[1].datos.med2],
				            ["Mar", msj.tepe[1].datos.med3],
				            ["Abr", msj.tepe[1].datos.med4],
				            ["May", msj.tepe[1].datos.med5],
				            ["Jun", msj.tepe[1].datos.med6],
				            ["Jul", msj.tepe[1].datos.med7],
				            ["Ago", msj.tepe[1].datos.med8],
				            ["Sep", msj.tepe[1].datos.med9],
				            ["Oct", msj.tepe[1].datos.med10],
				            ["Nov", msj.tepe[1].datos.med11],
				            ["Dic", msj.tepe[1].datos.med12]
				        ];   
            	
						chart1 = new Highcharts.Chart({
								chart: {
						            renderTo: 'container_temperatura',
						            zoomType: 'xy',
						            animation: true,
					         	},
					         	title: {
							   		text: 'Información mensual periodo (1980-2010) IDEAM',
							   		style: { "fontSize": "17px" },
							   		align: "center"
							 	},
					         	subtitle: {
							   		text: 'Estación '+msj.tepe[1].datos.municipio+' '+msj.tepe[1].datos.departamento +' a '+msj.tepe[1].datos.d+' Kms'
							 	}, 
					        	credits: {
					            	enabled: false
					        	},
					        	yAxis: [{ // Primary yAxis
										labels: {
											format: '{value}°C',
											style: {
												color: Highcharts.getOptions().colors[0],
												fontSize : "9px"
											},
											padding:0
										},
										title: {
											text: txt.msjTemperatura,
											style: {
												color: Highcharts.getOptions().colors[0],
												fontSize : "11px" 
											},
											padding:0
										},
										opposite: true
									},{ // Secondary yAxis
										gridLineWidth: 0,
										title: {
											text: txt.msjPrecipitacion,
											style: {
												color: Highcharts.getOptions().colors[1],
												fontSize : "11px"
											},
											padding:0
										},
										labels: {
											format: '{value} mm',
											style: {
												color: Highcharts.getOptions().colors[1],
												fontSize : "9px"
											},
											padding:0
										}
									}
								],
								xAxis: {
						            tickInterval: 1,
						            labels: {
						                enabled: true,
						                formatter: function() { return averagesTem[this.value][0];},
						            }
						        },
						        tooltip: {
						            crosshairs: true,
						            shared: true,
						            valueSuffix: '°C'
						        },
						        legend: {
									layout: 'vertical',
									align: 'left',
									x: 80,
									verticalAlign: 'top',
									y: 60,
									floating: true,
									backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
								},
					            plotOptions: {
					                arearange: {
					                    fillColor: {
					                        linearGradient: {
					                            x1: 0,
					                            y1: 0,
					                            x2: 0,
					                            y2: 0.3
					                        },
					                        stops: [
					                            [0, '#FF0000'],
					                            [1, Highcharts.getOptions().colors[0]]
					                        ]
					                    },

					                    lineWidth: 1,
					                    states: {
					                        hover: {
					                            lineWidth: 1
					                        }
					                    },
					                    threshold: null
					                }
					            },
							 	series: [{
						            name: txt.msjTemperatura,
						            data: averagesTem,
						            zIndex: 1,
									yAxis: 0,
						            marker: {
						                fillColor: 'white',
						                lineWidth: 2,
						                lineColor: Highcharts.getOptions().colors[0]
						            }
						        }, {
						            name: 'Rango',
						            data: rangesTem,
						            type: 'arearange',
						            lineWidth: 0,
						            linkedTo: ':previous',
						            color: Highcharts.getOptions().colors[0],
						            fillOpacity: 0.3,
						            zIndex: 0
						        },{
						            name: txt.msjPrecipitacion,
						            data: averagesPre,
						            tooltip: {
						                valueSuffix: ' mm'
						            },
						            zIndex: 1,
									yAxis: 1,
									type: 'spline',
						            marker: {
						                fillColor: 'white',
						                lineWidth: 2,
						                lineColor: Highcharts.getOptions().colors[0]
						            }
						        }
								]
					      });
    	});
	};
	
	AppConfig.HumedadSolar=function(pos){
		var lat = pos.coords.latitude;
		var lon = pos.coords.longitude;
	    AppMap.ActualizaPunto(lat,lon);
    	AppMap.SetExtend((lat-AppMap.escalaExtend),(numeral(lat)+AppMap.escalaExtend),(numeral(lon)+AppMap.escalaExtend),(lon-AppMap.escalaExtend));
    	AppConfig.sk_sofy.emit('HumedadSolar',{lat:lat, lon:lon}, function (msj){	console.log(msj);
			var averagesHum = [
				            ["Ene", msj.huso[0].datos.med1],
				            ["Feb", msj.huso[0].datos.med2],
				            ["Mar", msj.huso[0].datos.med3],
				            ["Abr", msj.huso[0].datos.med4],
				            ["May", msj.huso[0].datos.med5],
				            ["Jun", msj.huso[0].datos.med6],
				            ["Jul", msj.huso[0].datos.med7],
				            ["Ago", msj.huso[0].datos.med8],
				            ["Sep", msj.huso[0].datos.med9],
				            ["Oct", msj.huso[0].datos.med10],
				            ["Nov", msj.huso[0].datos.med11],
				            ["Dic", msj.huso[0].datos.med12]
				        ],
				        averagesPre = [
				            ["Ene", msj.huso[1].datos.med1],
				            ["Feb", msj.huso[1].datos.med2],
				            ["Mar", msj.huso[1].datos.med3],
				            ["Abr", msj.huso[1].datos.med4],
				            ["May", msj.huso[1].datos.med5],
				            ["Jun", msj.huso[1].datos.med6],
				            ["Jul", msj.huso[1].datos.med7],
				            ["Ago", msj.huso[1].datos.med8],
				            ["Sep", msj.huso[1].datos.med9],
				            ["Oct", msj.huso[1].datos.med10],
				            ["Nov", msj.huso[1].datos.med11],
				            ["Dic", msj.huso[1].datos.med12]
				        ];   
            	
						chart1 = new Highcharts.Chart({
								chart: {
						            renderTo: 'container_HumeSola',
						            zoomType: 'xy',
						            animation: true,
					         	},
					         	title: {
							   		text: txt.msjclimogramaHumSol,
							   		style: { "fontSize": "17px" },
							   		align: "center"
							 	},
					         	subtitle: {
							   		text: 'Estación '+msj.huso[1].datos.municipio+' '+msj.huso[1].datos.departamento +' a '+msj.huso[1].datos.d+' Kms'
							 	}, 
					        	credits: {
					            	enabled: false
					        	},
					        	yAxis: [{ // Primary yAxis
										labels: {
											format: '{value}%',
											style: {
												color: Highcharts.getOptions().colors[0],
												fontSize : "9px"
											},
											padding:0
										},
										title: {
											text: txt.msjclimogramaHumedadrelativa,
											style: {
												color: Highcharts.getOptions().colors[0],
												fontSize : "11px" 
											},
											padding:0
										},
										opposite: true
									},{ // Secondary yAxis
										gridLineWidth: 0,
										title: {
											text: txt.msjclimogramaBrillosolar,
											style: {
												color: Highcharts.getOptions().colors[1],
												fontSize : "11px"
											},
											padding:0
										},
										labels: {
											format: '{value} Cal/cm²',
											style: {
												color: Highcharts.getOptions().colors[1],
												fontSize : "9px"
											},
											padding:0
										}
									}
								],
								xAxis: {
						            tickInterval: 1,
						            labels: {
						                enabled: true,
						                formatter: function() { return averagesHum[this.value][0];},
						            }
						        },
						        tooltip: {
						            crosshairs: true,
						            shared: true,
						            valueSuffix: '%'
						        },
						        legend: {
									layout: 'vertical',
									align: 'left',
									x: 80,
									verticalAlign: 'top',
									y: 60,
									floating: true,
									backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
								},
							 	series: [{
						            name: txt.msjclimogramaHumedadrelativa,
						            data: averagesHum,
						            zIndex: 1,
									yAxis: 0,
						            marker: {
						                fillColor: 'white',
						                lineWidth: 2,
						                lineColor: Highcharts.getOptions().colors[0]
						            }
						        },{
						            name: txt.msjclimogramaBrillosolar,
						            data: averagesPre,
						            tooltip: {
						                valueSuffix: ' Cal/cm²'
						            },
						            zIndex: 1,
									yAxis: 1,
									type: 'spline',
						            marker: {
						                fillColor: 'white',
						                lineWidth: 2,
						                lineColor: Highcharts.getOptions().colors[0]
						            }
						        }
								]
					      });
    	});
	};
	
	AppConfig.opcTemperatura=function(){
		var chart1;
		var $text = $('<div id="container_temperatura" style="max-height: 510px;"></div>');
        BootstrapDialog.show({
        	title: txt.msjclimogramaTemPre,
        	type: BootstrapDialog.TYPE_SUCCESS,
            message: $text,
            onshown: function(dialogRef){
            	navigator.geolocation.getCurrentPosition(AppConfig.Temperatura,AppConfig.sinUbicacion,AppConfig.gpsOptions);
            }
        });		
	};
	AppConfig.opcHumeSola=function(){
		var chart1;
		var $text = $('<div id="container_HumeSola" style="max-height: 510px;"></div>');
        BootstrapDialog.show({
        	title: txt.msjclimogramaHumSol,
        	type: BootstrapDialog.TYPE_SUCCESS,
            message: $text,
            onshown: function(dialogRef){
            	navigator.geolocation.getCurrentPosition(AppConfig.HumedadSolar,AppConfig.sinUbicacion,AppConfig.gpsOptions);
            }
        });		
	};
	AppConfig.opcPronostico=function(){

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
	};
	
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
	console.log("CORREGIR!!! - MOSTRAR MAPA");		//$("#map").hide();
	
});

