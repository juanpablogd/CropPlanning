$( document ).ready(function() {
	//AppConfig['imei']=23423423;
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

			AppConfig.sk_sofy.emit('variedad',null, function (msj) {
		  		AppConfig['variedad']=msj.datos;
		  		console.log(AppConfig['variedad']);
		  	});
			AppConfig.sk_sofy.emit('sistema',null, function (msj) {
				AppConfig['sistema']=msj.datos;
		  		console.log(AppConfig['sistema']);
		  	});
	};
	AppConfig.ConectarSocket=function(){
		AppConfig.sk_sofy = io.connect(AppConfig.UrlSocket, { 'connect timeout': 5000 });
	  //Evento Conexión
		AppConfig.sk_sofy.on('connect', function () {
			console.log("se conecta");
			if(AppConfig.ini == false){
				AppConfig.sk_sofy.emit('parametros',null, function (msj) {	//console.log(msj);
					var res = msj.split("|||");
					txt.msj_terminos = res[1]; 
					AppMap.SetBaseLayer(res[0]);
					AppConfig.MostarTerminos();
				});
				AppConfig.ini = true;	
			}
		});
	  //Evento Falla Conexión
		AppConfig.sk_sofy.on('connect_error', function(){
		    console.log('Falla Conexión');
		    if(AppConfig.ini == false){
		    	AppMap.SetBaseLayer("calle");
			    AppConfig.MostarTerminos();
			    AppConfig.ini = true;		    	
		    }
		});
	  // Evento Desconectado
	   AppConfig.sk_sofy.on('disconnect',function() {
	      console.log('Desconectado!');
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
		                    //Buscar posición geográfica
		                    $("#localizando").show();
							navigator.geolocation.getCurrentPosition(AppMap.UbicacionEncontrada,AppConfig.sinUbicacion,AppConfig.gpsOptions);
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
	AppConfig.Clima=function(lat,lon){
		//var lat = pos.coords.latitude;var lon = pos.coords.longitude;
	    AppMap.ActualizaPunto(lat,lon);
    	AppMap.SetExtend((lat-AppMap.escalaExtend),(numeral(lat)+AppMap.escalaExtend),(numeral(lon)+AppMap.escalaExtend),(lon-AppMap.escalaExtend));
		AppConfig.sk_sofy.emit('clima',{lat:lat, lon:lon, lenguaje: txt.Idioma}, function (msj) {
	  		//console.log(msj);
	  		if(msj=="0"){
	  			msj_peligro(txt.msjSinestacion);
	  		}else{
				var $text = $('<div></div>');
				$text.append('<div class="form-group">'+
								'<div class="row">'+
									'<div class="col-xs-4" >'+
										'<img src="../../Images/Home/wind.png" height="66px" width="66px"><br>'+
									'</div>'+
									'<div class="col-xs-8" style="font-size: 12px;text-align: center;">'+
										msj.depto+'-'+msj.mpio+'<br>'+
										txt.msjEstacion+' '+msj.estacion+'<br>'+
										txt.msjDistancia+' '+msj.distancia+' Kms<br>'+
										msj.fechaHora+'<br>'+
									'</div>'+
								'</div>'+
								'<div class="row" style="margin-top: 0px;">'+
									'<br><button type="button" class="btn btn-success btn-block">'+txt.msjTemperatura+'</button><br>'+
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
									'<br><button type="button" class="btn btn-success btn-block">'+txt.msjclimogramaHumedadrelativa+'</button><br>'+
								'</div>'+
								'<div class="row">'+
									'<div class="col-xs-12" style="font-size: 18px;text-align: center;">'+
										msj.humedad_rel+' '+
									'</div>'+
								'</div>'+
								'<div class="row" style="margin-top: -15px;">'+
									'<br><button type="button" class="btn btn-success btn-block">'+txt.msjPrecipitacionacumdiaria+'</button><br>'+
								'</div>'+
								'<div class="row">'+
									'<div class="col-xs-12" style="font-size: 18px;text-align: center;">'+
										msj.precip_dia+' '+
									'</div>'+
								'</div>'+
								'<div class="row" style="margin-top: -15px;">'+
									'<br><button type="button" class="btn btn-success btn-block">'+txt.msjRadiacionacumdiaria+'</button><br>'+
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
		$("#localizando").hide();
		msj_peligro(txt.msjNogps);
		cordova.dialogGPS(txt.dialogGPSMensaje,//message
                    txt.dialogGPSDescripcion,//description
                    function(buttonIndex){//callback
                      switch(buttonIndex) {
                        case 0: break;//cancel
                        case 1: break;//neutro option
                        case 2: break;//user go to configuration
                      }},
                      txt.dialogGPSTitulo,//title
                      [txt.msjNo,"",txt.msjSi]);//buttons
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
								  '<button type="button" class="btn btn-success" id="btn_coordenada">'+txt.msjIr+'</button>'+
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
		$("#localizando").show();
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
			$text.append( 
/*						'<div class="form-group">'+
					   		'<i class="fa fa-th-list"></i><label for="">&nbsp;'+txt.msjProduccion+'</label>'+
					   		'<div class="radio">'+
							  '<label><input type="radio" name="optProd" value="cultivo">'+txt.tit_epoca_cultivo+'</label>'+
							'</div>'+
						'</div>'+	*/
						'<div class="form-group">'+
							'<label><input type="checkbox" id="opMapa" value="opMapa">&nbsp;'+txt.msjMapa+' - '+txt.msjProduccion+'</label>'+
					   		'<div class="radio" id="radmapRiego">'+
							  '<label><input type="radio" name="optTipomapa" value="riego_t">'+txt.msjRiegoSuper+'</label>'+
							'</div>'+
					   		'<div class="radio" id="radmapSecano">'+
							  '<label><input type="radio" name="optTipomapa" value="sec_t">'+txt.msjSecanoSuper+'</label>'+
							'</div>'+
						'</div>'
						);
		
        BootstrapDialog.show({
        	title: txt.msjProduccion,
        	type: BootstrapDialog.TYPE_SUCCESS,
            message: $text,
            onshown: function(dialogRef){
            	//Activa Check si el mapa esta activo
            	if(AppMap.map.hasLayer(AppMap.LyrMpioDepto)){
            		$('#opMapa').prop('checked', true);
					$("#radmapRiego").show();
					$("#radmapSecano").show();
					//Activa opcion segun tipo de mapa
					$('input[name=optTipomapa][value='+AppMap.tipoMapa+']').attr("checked", "checked");
            	}else{
            		$('#opMapa').prop('checked', false);
					$("#radmapRiego").hide();
					$("#radmapSecano").hide();
            	}
				
            	//Click Opcion Producción
		        $("input[name=optProd]").click(function() {
		        	var optProd = $("input[name=optProd]:checked").val();
		        	if(optProd == "cultivo") AppConfig.opcEpocaCultivo(); 
		        	dialogRef.close();
		        });
		        //Click opción Mapa
		        $('#opMapa').click(function(){
					$("#btn_mpio").hide();
					$("#btn_depto").hide();
					if ($('#opMapa').is(':checked')) {
						$("#radmapRiego").show();
						$("#radmapSecano").show();
					}else {
						$("#radmapRiego").hide();
						$("#radmapSecano").hide();
						AppMap.removeCapa();
						dialogRef.close();
					}
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
		        		AppConfig.Clima(AppMap.lat,AppMap.lon);
		        	}else if(optClima=="optPronostico"){
		        		AppConfig.opcPronostico(AppMap.lat,AppMap.lon);
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
	AppConfig.detalleMiCultivo=function(){
		var fase = (AppConfig['tmp_fase']=="null") ? txt.msjSinInfo : AppConfig['tmp_fase'];
		var txtGrafica = "";
		if (fase.toUpperCase() == "FASE REPRODUCTIVA"){
			txtGrafica = "texto_reproductiva.png";
		}else{
			txtGrafica = "texto_vegetativa.png";
		}
		var $text = $('<div></div>');
			$text.append( '<div class="form-group">'+
							  '<button type="button" class="btn btn-success" id="btnListacultivo"><spam class="glyphicon glyphicon-th-list"></spam>&nbsp;'+txt.msjMicultivo+'</button>'+
                          '</div>'+
                          '<table class="table" style="font-size:12px"><thead>'+
						      '<tr>'+
						        '<th colspan="2"><img src="../../Images/Home/fases_arroz.jpg" style="width:96%";></th>'+
						      '</tr>'+
						      '<tr>'+
						        '<th colspan="2"><img src="../../Images/Home/'+txtGrafica+'" style="width:96%";></th>'+
						      '</tr>'+
						    '</thead>'+
						    '<tbody id="detalleCultivo">'+
						    	'<tr>'+
						    		'<td>'+txt.msjSistema+'</td>'+
						    		'<td>'+AppConfig['tmp_sistema']+'</td>'+
						    	'</tr>'+
						    	'<tr>'+
						    		'<td>'+txt.msjVariedad+'</td>'+
						    		'<td>'+AppConfig['tmp_variedad']+'</td>'+
						    	'</tr>'+
						    	'<tr>'+
						    		'<td>'+txt.msjHectareacultivadas+'</td>'+
						    		'<td>'+AppConfig['tmp_has']+'</td>'+
						    	'</tr>'+
						    	'<tr>'+
						    		'<td>'+txt.msjFechasiembra+'</td>'+
						    		'<td>'+AppConfig['tmp_fecha']+'</td>'+
						    	'</tr>'+
						    	'<tr>'+
						    		'<td>'+txt.msjFase+'</td>'+
						    		'<td>'+fase+'</td>'+
						    	'</tr>'+
						    '</tbody>'
						);
		
        BootstrapDialog.show({
        	title: AppConfig['tmp_nombre'],
        	type: BootstrapDialog.TYPE_SUCCESS,
            message: $text,
            onshown: function(dialogRef){
		        $("#btnListacultivo").click(function() {
		        	dialogRef.close();
					AppConfig.listaMiCultivo();
		        });
				AppConfig.sk_sofy.emit('getRecomendaciones',{id:AppConfig['tmp_id_cultivo'],lat:AppConfig['tmp_lat'],lon:AppConfig['tmp_lon']}, function (msj) {
					console.log(msj);
					console.log(msj.datos.length);
					for(r=0;r<msj.datos.length;r++){
						$("#detalleCultivo").append('<tr>'+
						    		'<td><b>'+txt.msjRecomendacion+': </b></td>'+
						    		'<td><b>'+msj.datos[r].recomendacion+'</b></td>'+
						    	'</tr>');
					}
			  	});
            }
        });
	};
	AppConfig.listaMiCultivo=function(){
		var $text = $('<div></div>');
			$text.append( '<div class="form-group">'+
							  '<button type="button" class="btn btn-success" id="btnAddcultivo"><spam class="glyphicon glyphicon-plus"></spam>&nbsp;'+txt.msjAddcultivo+'</button>'+
                          '</div>'+
                          '<table class="table"><thead>'+
						      '<tr>'+
						        '<th>'+txt.msjNombre+'</th>'+
						        '<th>'+txt.msjDetalle+'</th>'+
						        '<th>'+txt.msjIr+'</th>'+
						        '<th>Temp.</th>'+
						        '<th>'+txt.msjEliminar+'</th>'+
						      '</tr>'+
						    '</thead>'+
						    '<tbody id="listaCultivos"></tbody>'
						);
		
        BootstrapDialog.show({
        	title: txt.msjMicultivo,
        	type: BootstrapDialog.TYPE_SUCCESS,
            message: $text,
            onshown: function(dialogRef){
				AppConfig.getImei();
		        $("#btnAddcultivo").click(function() {
		        	dialogRef.close();
		        	AppConfig.addMiCultivo();
		        });
		        //var imei = AppConfig.getImei();
				AppConfig.sk_sofy.emit('getMiscultivos',{imei:AppConfig['imei']}, function (msj) {
					console.log(msj.datos);
					$.each( msj.datos, function( key, value ) {	//console.log( key + ": " + value.id );
						$("#listaCultivos").append('<tr id="f'+value.id+'">'+
        						'<td>'+value.nombre+'</td>'+
        						'<td class="btn_detalle" d="'+value.id+'" n="'+value.nombre+'" v="'+value.variedad+'" s="'+value.sistema+'" h="'+value.ha_cultivadas+'" f="'+value.fecha_siembra+'" nf="'+value.nombre_fase+'" lat="'+value.latitud+'" lon="'+value.longitud+'"><spam class="glyphicon glyphicon-tasks"></spam></td>'+
        						'<td class="btn_ir" lat="'+value.latitud+'" lon="'+value.longitud+'"><spam class="glyphicon glyphicon-map-marker"></spam></td>'+
                				'<td class="btn_grafica" lat="'+value.latitud+'" lon="'+value.longitud+'" d="'+value.id+'" f="'+value.fecha_siembra+'" align="right"><spam class="glyphicon glyphicon-object-align-bottom"></spam></td>'+
                				'<td class="btn_eliminar" align="right" n="'+value.nombre+'" d="'+value.id+'"><spam class="glyphicon glyphicon-erase"></spam></td>'+
							'</tr>');
					});
					
					$(".btn_detalle").click(function(){	console.log("Click btn_detalle");
						AppConfig['tmp_nombre'] = $(this).attr('n');
						AppConfig['tmp_variedad'] = $(this).attr('v');
						AppConfig['tmp_sistema'] = $(this).attr('s');
						AppConfig['tmp_has'] = $(this).attr('h');
						AppConfig['tmp_fecha'] = $(this).attr('f');
						AppConfig['tmp_fase'] = $(this).attr('nf');
						AppConfig['tmp_lat'] = $(this).attr('lat');
						AppConfig['tmp_lon'] = $(this).attr('lon');
						AppConfig['tmp_id_cultivo'] = $(this).attr('d');
						
			        	dialogRef.close();
			        	AppConfig.detalleMiCultivo();
					});

					$(".btn_ir").click(function(){	console.log("Click btn_ir");
						var lat = $(this).attr('lat');
						var lon = $(this).attr('lon');	
						AppMap.ActualizaPunto(lat,lon);
    					AppMap.SetExtend((lat-AppMap.escalaExtend),(numeral(lat)+AppMap.escalaExtend),(numeral(lon)+AppMap.escalaExtend),(lon-AppMap.escalaExtend));
    	
					});
					
					$(".btn_grafica").click(function(){	console.log("Click btn_grafica");
						var lat = $(this).attr('lat');
						var lon = $(this).attr('lon');
						var fecha = $(this).attr('f');
						AppMap.ActualizaPunto(lat,lon);
    					AppMap.SetExtend((lat-AppMap.escalaExtend),(numeral(lat)+AppMap.escalaExtend),(numeral(lon)+AppMap.escalaExtend),(lon-AppMap.escalaExtend));	
    					AppConfig.opcDecadal(fecha);
					});
					
					$(".btn_eliminar").click(function(){	console.log("Click btn_eliminar");
						AppConfig['tmp_nombre'] = $(this).attr('n');
						AppConfig['tmp_id'] = $(this).attr('d');
						AppConfig.eliminaCultivo();
						dialogRef.close();
					});

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
							  '<label for="fnombre">'+txt.msjNombre+'</label><input type="text" class="form-control" id="fnombre">'+
							'</div>'+
							'<label for="ffecha">'+txt.msjFechasiembra+'</label>'+
							'<input type="text" data-provide="datepicker" data-date-format="dd/mm/yyyy" data-date-language="es" data-date-autoclose="true" data-date-clearBtn="true"  id="ffecha" class="form-control" >'+
							'<div class="form-group">'+
							  '<label for="fvariedad">'+txt.msjVariedad+'</label><select class="form-control" id="fvariedad">'+
							  '<option value="">--Seleccione--</option>'+
							  '</select>'+
							'</div>'+
							'<div class="form-group">'+
							  '<label for="fsistema">'+txt.msjSistema+'</label><select class="form-control" id="fsistema">'+
							  '<option value="">--Seleccione--</option>'+
							  '</select>'+
							'</div>'+
							'<div class="form-group">'+
							  '<label for="fhas">'+txt.msjHectareacultivadas+'</label><input type="text" class="form-control decimal" id="fhas">'+
							'</div>'+
							'<h6>'+txt.msjUbicacionmapa+': <span id="txtLon" class="label label-info"></span>  <span id="txtLat" class="label label-info"></span></h6>'+
							'<div class="form-group">'+
							  '<button type="button" class="btn btn-success btn-block"  id="btnGuardarCultivo">'+txt.msjGuardar+'</button>'+
							'</div>'
						);
		
        BootstrapDialog.show({
        	title: txt.msjAddcultivo,
        	type: BootstrapDialog.TYPE_SUCCESS,
            message: $text,
            onshown: function(dialogRef){
            	$("#btnGuardarCultivo").hide();
            	var ubicaOk = function (Latitude,Longitude){	//var Latitude = position.coords.latitude;var Longitude = position.coords.longitude;
					$('#txtLat').html(Latitude);
					$('#txtLon').html(Longitude);
					$("#btnGuardarCultivo").show();
            	};

            	ubicaOk(AppMap.lat,AppMap.lon);
            	
		        $("#btnListacultivo").click(function() {
		        	dialogRef.close();
					AppConfig.listaMiCultivo();
		        });
		        console.log("Poner Fecha");
		        $('.datepicker').datepicker();
				$.each( AppConfig['variedad'], function( key, value ) {	//console.log( key + ": " + value.id );
					$("#fvariedad").append("<option value='"+value.id+"'>"+value.nombre+"</option>");
				});
				$.each( AppConfig['sistema'], function( key, value ) {	//console.log( key + ": " + value );
					$("#fsistema").append("<option value='"+value.id+"'>"+value.nombre+"</option>");
				});
			    $(".decimal").keydown(function (e) {
			        // Allow: backspace, delete, tab, escape, enter and .
			        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
			             // Allow: Ctrl+A, Command+A
			            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) || 
			             // Allow: home, end, left, right, down, up
			            (e.keyCode >= 35 && e.keyCode <= 40)) {
			                 // let it happen, don't do anything
			                 return;
			        }
			        // Ensure that it is a number and stop the keypress
			        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
			            e.preventDefault();
			        }
			    });
		        $("#btnGuardarCultivo").click(function() {
		        	var nombre = $('#fnombre').val();
		        	var fecha_siembra= $('#ffecha').val();	var pattern =/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
		        	var id_variedad= $('#fvariedad').val();
		        	var id_sistema= $('#fsistema').val();
		        	var ha_cultivadas= $('#fhas').val();
			  		if(nombre == ""){
			  			msj_peligro(txt.msjNombre + txt.msjRequerido);
			  			setTimeout(function() { $('#fnombre').focus();}, 500);
			  			return;
			  		}else if(pattern.test(fecha_siembra) == false){
			  			msj_peligro(txt.msjFechasiembra + txt.msjRequerido);
			  			setTimeout(function() { $('#ffecha').focus();}, 500);
			  			return;
			  		}else if(id_variedad==""){
			  			msj_peligro(txt.msjVariedad  + txt.msjRequerido);
			  			setTimeout(function() { $('#fvariedad').focus();}, 500);
			  			return;
			  		}else if(id_sistema==""){
			  			msj_peligro(txt.msjSistema  + txt.msjRequerido);
			  			setTimeout(function() { $('#fsistema').focus();}, 500);
			  			return;
			  		}else if(ha_cultivadas==""){
			  			msj_peligro(txt.msjHectareacultivadas  + txt.msjRequerido);
			  			setTimeout(function() { $('#fhas').focus();}, 500);
			  			return;
			  		};	//var imei = AppConfig.getImei();	
					var lat = $('#txtLat').text();	console.log(AppConfig['imei']);//console.log(lat);
					var lon = $('#txtLon').text();	//console.log(lon);
			  		console.log("FORMULARIO OK!!!!!!!!!!!!!");
			  		AppConfig.sk_sofy.emit('setCultivo',{lon:lon,lat:lat,imei:AppConfig['imei'],nombre:nombre,fecha_siembra:fecha_siembra,id_variedad:id_variedad,id_sistema:id_sistema,ha_cultivadas:ha_cultivadas}, function (msj){	console.log(msj);
					 		if($.isNumeric(msj)){
				 				dialogRef.close();
								AppConfig.listaMiCultivo();
					 		}else{
					 			msj_peligro("No se pudo Guardar el registro");
					 		}
					});
		        });
            }
        });
	};
	AppConfig.decadal=function(fecha,dialogRef){

		};
	AppConfig.eliminaCultivo=function(){
			BootstrapDialog.show({
				title: txt.msjEliminar,
				type: BootstrapDialog.TYPE_SUCCESS,
	            message: txt.msjEliminacultivo+' '+AppConfig['tmp_nombre'] + '"',
	            buttons: [{
	                icon: 'glyphicon glyphicon-erase',
	                label: txt.msjEliminar,
	                title: txt.msjEliminar,
	                cssClass: 'btn-danger',
	                action: function(dialogItself){
						AppConfig.sk_sofy.emit('deleteMicultivo',{id:AppConfig['tmp_id']}, function (msj) {
							if(msj=="1"){
								msj_exito(txt.msjEliminadocorrectamente);
								dialogItself.close();
								AppConfig.listaMiCultivo();
								return true;	
							}else{
								msj_peligro("No se puede Eliminar el Cultivo");
							}
							console.log(msj);
						});
	                }
	            },{
	                icon: 'glyphicon glyphicon-th-list',
	                label: txt.msjMicultivo,
	                title: txt.msjMicultivo,
	                cssClass: 'btn-info',
	                action: function(dialogItself){
	                    dialogItself.close();
						AppConfig.listaMiCultivo();
	                }
	            }, {
	                label: txt.btn_cancelar,
	                action: function(dialogItself){
	                    dialogItself.close();
	                }
	            }]
	        });
		};
		
	AppConfig.getImei=function(){
		try {
			var permissions = cordova.plugins.permissions;
			permissions.hasPermission(permissions.READ_PHONE_STATE, checkPermissionCallback, null);
		}
		catch(err) {
		    console.log(err.message);
		}
		function checkPermissionCallback(status) {
		  if(!status.hasPermission) {
			var errorCallback = function() {
			  console.warn('No tiene permisos de Leer el IMEI!');
			};

			permissions.requestPermission(
			  permissions.READ_PHONE_STATE,
			  function(status) {
				if(!status.hasPermission) errorCallback();
			  },
			  errorCallback);
		  }else{
			var deviceInfo = cordova.require("cordova/plugin/DeviceInformation");
				deviceInfo.get(function(result) { //alert(result);
							   //Obtiene el Número de SIM
							   var res = result.split("simNo");
							   res = res[1].split('"');	//alert (res[2]);
							   serial = res[2]; //alert("SIM / Serial: "+serial);
							   //Obtiene el IMEI
							   res = result.split("deviceID");
							   res = res[1].split('"');
							   imei = res[2]; console.log("Imei: "+imei);
							   //Obtiene el IMEI
							   AppConfig['imei'] = imei;
							   ;
							   }, function(error) {
									console.log("Error: " + error);
									msj_peligro("Habilite los permisos en su aplicación");
							   });
		  }
		  
		}
		

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
							    	categories: [txt.msjEne, txt.msjFeb, txt.msjMar, txt.msjAbr, txt.msjMay, txt.msjJun, txt.msjJul, txt.msjAgo, txt.msjSep, txt.msjOct, txt.msjNov, txt.msjDic]
								},
						        tooltip: {
            								formatter: function() {
	                							var texto;
	                							var siembra=false;
	                							var cosecha=false;
	                							var IndexSel;
	            								$.each(this.points, function(i, point) {	console.log(point);	console.log(i);
	            									IndexSel = point.point.index;		console.log(point.series.name);
	            									if(point.series.name==txt.msjSiembra){
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
													texto = '<span style="color:#8A4B08;font-weight:bold;">'+txt.msjInicio+txt.msjSiembra+' : 20-'+txt.msjMar+'<span>';
	                							} else if(siembra && AppConfig['siembraFin'] == IndexSel){
													texto = '<span style="color:#8A4B08;font-weight:bold;">'+txt.msjFin+txt.msjSiembra+' : 04-'+txt.msjMay+'<span>';
	                							} else if(cosecha && AppConfig['cosechaIni'] == IndexSel){
													texto = '<span style="color:#088A08;font-weight:bold;">'+txt.msjInicio+txt.msjCosecha+' : 20-'+txt.msjAgo+'<span>';
	                							} else if(cosecha && AppConfig['cosechaFin'] == IndexSel){
													texto = '<span style="color:#088A08;font-weight:bold;">'+txt.msjFin+txt.msjCosecha+' : 04-'+txt.msjOct+'<span>';
	                							}else{
	                								texto = '<span style="color:red;font-weight:bold;">'+txt.msjEpocaNoFavorable+' '+txt.msjSiembra+'/'+txt.msjCosecha+'<span>';
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
					   		'<label for="" class="label-titulo siembra">&nbsp;'+txt.msjEpocaFavorable+txt.msjSiembra+':</label><br>'+
					   		'<label for="" class="label-texto siembra">&nbsp;'+txt.msjInicio+txt.msjSiembra+' : 20-'+txt.msjMar+'</label><br>'+
					   		'<label for="" class="label-texto siembra">&nbsp;'+txt.msjInicio+txt.msjSiembra+' : 04-'+txt.msjMay+'</label>'+
							'</div>'+
							'<div class="form-group">'+
					   		'<label for="" class="label-titulo cosecha">&nbsp;'+txt.msjEpocaFavorable+txt.msjCosecha+':</label><br>'+
					   		'<label for="" class="label-texto cosecha">&nbsp;'+txt.msjFin+txt.msjCosecha+' : 20-'+txt.msjAgo+'</label><br>'+
					   		'<label for="" class="label-texto cosecha">&nbsp;'+txt.msjFin+txt.msjCosecha+' : 04-'+txt.msjOct+'</label>'+
							'</div>'
						);
            }
        });
	};
	
	AppConfig.Temperatura=function(lat,lon){
		//var lat = pos.coords.latitude;var lon = pos.coords.longitude;
	    AppMap.ActualizaPunto(lat,lon);
    	AppMap.SetExtend((lat-AppMap.escalaExtend),(numeral(lat)+AppMap.escalaExtend),(numeral(lon)+AppMap.escalaExtend),(lon-AppMap.escalaExtend));
    	AppConfig.sk_sofy.emit('temperatura',{lat:lat, lon:lon}, function (msj){	console.log(msj);
			var rangesTem = [
				            [txt.msjEne, msj.tepe[0].datos.min1, msj.tepe[0].datos.max1],
				            [txt.msjFeb, msj.tepe[0].datos.min2, msj.tepe[0].datos.max2],
				            [txt.msjMar, msj.tepe[0].datos.min3, msj.tepe[0].datos.max3],
				            [txt.msjAbr, msj.tepe[0].datos.min4, msj.tepe[0].datos.max4],
				            [txt.msjMay, msj.tepe[0].datos.min5, msj.tepe[0].datos.max5],
				            [txt.msjJun, msj.tepe[0].datos.min6, msj.tepe[0].datos.max6],
				            [txt.msjJul, msj.tepe[0].datos.min7, msj.tepe[0].datos.max7],
				            [txt.msjAgo, msj.tepe[0].datos.min8, msj.tepe[0].datos.max8],
				            [txt.msjSep, msj.tepe[0].datos.min9, msj.tepe[0].datos.max9],
				            [txt.msjOct, msj.tepe[0].datos.min10, msj.tepe[0].datos.max10],
				            [txt.msjNov, msj.tepe[0].datos.min11, msj.tepe[0].datos.max11],
				            [txt.msjDic, msj.tepe[0].datos.min12, msj.tepe[0].datos.max12]
				        ],
				        averagesTem = [
				            [txt.msjEne, msj.tepe[0].datos.med1],
				            [txt.msjFeb, msj.tepe[0].datos.med2],
				            [txt.msjMar, msj.tepe[0].datos.med3],
				            [txt.msjAbr, msj.tepe[0].datos.med4],
				            [txt.msjMay, msj.tepe[0].datos.med5],
				            [txt.msjJun, msj.tepe[0].datos.med6],
				            [txt.msjJul, msj.tepe[0].datos.med7],
				            [txt.msjAgo, msj.tepe[0].datos.med8],
				            [txt.msjSep, msj.tepe[0].datos.med9],
				            [txt.msjOct, msj.tepe[0].datos.med10],
				            [txt.msjNov, msj.tepe[0].datos.med11],
				            [txt.msjDic, msj.tepe[0].datos.med12]
				        ],
				        averagesPre = [
				            [txt.msjEne, msj.tepe[1].datos.med1],
				            [txt.msjFeb, msj.tepe[1].datos.med2],
				            [txt.msjMar, msj.tepe[1].datos.med3],
				            [txt.msjAbr, msj.tepe[1].datos.med4],
				            [txt.msjMay, msj.tepe[1].datos.med5],
				            [txt.msjJun, msj.tepe[1].datos.med6],
				            [txt.msjJul, msj.tepe[1].datos.med7],
				            [txt.msjAgo, msj.tepe[1].datos.med8],
				            [txt.msjSep, msj.tepe[1].datos.med9],
				            [txt.msjOct, msj.tepe[1].datos.med10],
				            [txt.msjNov, msj.tepe[1].datos.med11],
				            [txt.msjDic, msj.tepe[1].datos.med12]
				        ];   
            	
						chart1 = new Highcharts.Chart({
								chart: {
						            renderTo: 'container_temperatura',
						            zoomType: 'xy',
						            animation: true,
					         	},
					         	title: {
							   		text: txt.msjInfmensualperiodo + ' (1980-2010) IDEAM',
							   		style: { "fontSize": "15px" },
							   		align: "center"
							 	},
					         	subtitle: {
							   		text: txt.msjEstacion + ' '+msj.tepe[1].datos.municipio+' '+msj.tepe[1].datos.departamento +' '+txt.msjA+' '+msj.tepe[1].datos.d+' Kms'
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
									y: 65,
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
						            name: txt.msjRango,
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
	
	AppConfig.HumedadSolar=function(lat,lon){
		//var lat = pos.coords.latitude;var lon = pos.coords.longitude;
	    AppMap.ActualizaPunto(lat,lon);
    	AppMap.SetExtend((lat-AppMap.escalaExtend),(numeral(lat)+AppMap.escalaExtend),(numeral(lon)+AppMap.escalaExtend),(lon-AppMap.escalaExtend));
    	AppConfig.sk_sofy.emit('HumedadSolar',{lat:lat, lon:lon}, function (msj){	console.log(msj);
			var averagesHum = [
				            [txt.msjEne, msj.huso[0].datos.med1],
				            [txt.msjFeb, msj.huso[0].datos.med2],
				            [txt.msjMar, msj.huso[0].datos.med3],
				            [txt.msjAbr, msj.huso[0].datos.med4],
				            [txt.msjMay, msj.huso[0].datos.med5],
				            [txt.msjJun, msj.huso[0].datos.med6],
				            [txt.msjJul, msj.huso[0].datos.med7],
				            [txt.msjAgo, msj.huso[0].datos.med8],
				            [txt.msjSep, msj.huso[0].datos.med9],
				            [txt.msjOct, msj.huso[0].datos.med10],
				            [txt.msjNov, msj.huso[0].datos.med11],
				            [txt.msjDic, msj.huso[0].datos.med12]
				        ],
				        averagesPre = [
				            [txt.msjEne, msj.huso[1].datos.med1],
				            [txt.msjFeb, msj.huso[1].datos.med2],
				            [txt.msjMar, msj.huso[1].datos.med3],
				            [txt.msjAbr, msj.huso[1].datos.med4],
				            [txt.msjMay, msj.huso[1].datos.med5],
				            [txt.msjJun, msj.huso[1].datos.med6],
				            [txt.msjJul, msj.huso[1].datos.med7],
				            [txt.msjAgo, msj.huso[1].datos.med8],
				            [txt.msjSep, msj.huso[1].datos.med9],
				            [txt.msjOct, msj.huso[1].datos.med10],
				            [txt.msjNov, msj.huso[1].datos.med11],
				            [txt.msjDic, msj.huso[1].datos.med12]
				        ];   
            	
						chart1 = new Highcharts.Chart({
								chart: {
						            renderTo: 'container_HumeSola',
						            zoomType: 'xy',
						            animation: true,
					         	},
					         	title: {
							   		text: txt.msjInfmensualperiodo + ' (1980-2010) IDEAM',
							   		style: { "fontSize": "15px" },
							   		align: "center"
							 	},
					         	subtitle: {
							   		text:  txt.msjEstacion + ' '+msj.huso[1].datos.municipio+' '+msj.huso[1].datos.departamento +' '+txt.msjA+' '+msj.huso[1].datos.d+' Kms'
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
									y: 70,
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
            	AppConfig.Temperatura(AppMap.lat,AppMap.lon);
            }
        });		
	};
	AppConfig.opcDecadal=function(fecha){	//var lat = pos.coords.latitude;var lon = pos.coords.longitude;	AppMap.lat,AppMap.lon
    	AppConfig.sk_sofy.emit('decadal',{lat:AppMap.lat, lon:AppMap.lon,fecha:fecha, lenguaje: txt.Idioma}, function (msj){	console.log(msj);
			if($.isNumeric(msj)){
				msj_peligro(txt.msjSinInfo);
				return false;
			}
			var chart1;
			var $text = $('<div id="container_decadal" style="max-height: 510px;"></div>');
	        BootstrapDialog.show({
	        	title: txt.msjDecadal,
	        	type: BootstrapDialog.TYPE_SUCCESS,
	            message: $text,
	            onshown: function(dialogRef){
	            	chart1 = new Highcharts.Chart({
								chart: {
						            renderTo: 'container_decadal',
						            zoomType: 'xy',
						            animation: true,
					         	},
					         	title: {
							   		text: txt.msjEstacion+' '+msj.est,
							   		style: { "fontSize": "15px" },
							   		align: "center"
							 	},
					         	subtitle: {
							   		text: txt.msjDistancia+' '+msj.dis+' Kms'
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
									}
								],
								xAxis: {
						            categories: msj.cat
						        },
						        tooltip: {
						            crosshairs: true,
						            shared: true,
						            //valueSuffix: '°C'
						        },
						        legend: {
									layout: 'vertical',
									align: 'left',
									x: 80,
									verticalAlign: 'top',
									y: 65,
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
							        type: 'column',
							        name: txt.msjMax,
							        data: msj.max
							    }, {
							        type: 'column',
							        name: txt.msjMin,
							        data: msj.min
							    }, {
							        type: 'spline',
							        name: txt.msjPromedio,
							        data: msj.prom,
							        marker: {
							            lineWidth: 2,
							            lineColor: Highcharts.getOptions().colors[3],
							            fillColor: 'white'
							        }
							    }]
					      });
	            }
	        });
						
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
            	AppConfig.HumedadSolar(AppMap.lat,AppMap.lon);
            }
        });		
	};
	AppConfig.opcPronostico=function(lat,lon){

		var chart1;
		var $text = $('<div id="container_pronostico" style="max-height: 510px;"></div>');
		
        BootstrapDialog.show({
        	title: txt.tit_pronostico,
        	type: BootstrapDialog.TYPE_SUCCESS,
            message: $text,
            onshown: function(dialogRef){
            	AppConfig.sk_sofy.emit('prediccion',{lat:lat, lon:lon, lenguaje: txt.Idioma}, function (msj){ //console.log(msj);	console.log(msj[0]);
            		var aniomes = [];
            		var bajo = [];
            		var normal = [];
            		var sobre = [];
            		var est,kms;
            		for(j=0;j<msj[0].length; j++){	//console.log(msj[0][j]);
            			aniomes.push(msj[0][j].anio + '-' + msj[0][j].mes);
            			bajo.push(parseFloat(msj[0][j].bajo));
            			normal.push(parseFloat(msj[0][j].normal));
            			sobre.push(parseFloat(msj[0][j].sobre));
            			est = msj[0][j].est;
            			kms = msj[0][j].d;
            		}	console.log(msj);	//console.log(bajo);	console.log(normal);	console.log(sobre);
            		if(msj !="0"){
						chart1 = new Highcharts.Chart({
									chart: {
							            renderTo: 'container_pronostico',
							            zoomType: 'xy',
							            height: 300,
							            type: 'column'
						         	},
						         	title: {
								   		text: txt.msjEstacion + ' "' + est + '" '+txt.msjA+' ' + kms + ' Kms'
								 	},
						        	credits: {
						            	enabled: false
						        	},
						        	yAxis: {
							            min: 0,
							            title: {
							                text: txt.msjPrecipitacion + ' (mm)'
							            }
							        },
									xAxis: {
								    	categories: aniomes,
	            						crosshair: true
									},
							        tooltip: {
							            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
							            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
							                '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
							            footerFormat: '</table>',
							            shared: true,
							            useHTML: true
							        },
							        legend: {
							            layout: 'vertical',
							            align: 'left',
							            x: 50,
							            verticalAlign: 'top',
							            y: 50,
							            floating: true,
							            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
							        },
								 	series: [{
							            name: txt.msjBajo,
							            data: bajo
							
							        }, {
							            name: txt.msjNormal,
							            data: normal
							
							        }, {
							            name: txt.msjSobre,
							            data: sobre
							        }]
						      });
					      }else{
					      	msj_peligro(txt.msjSinestacion);
					      	dialogRef.close();
					      }
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
	AppMap.AddPunto(AppMap.center[0],AppMap.center[1]);
	AppConfig.CargaDataCultivo();
	AppConfig.Inicial();
	console.log("CORREGIR!!! - MOSTRAR MAPA");		//$("#map").hide();
	
});