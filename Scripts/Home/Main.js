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
		        return false;
		      }
		    })
		    .autocomplete( "instance" )._renderItem = function( ul, item ) {	//console.log(item);
		      return $( "<li>" )
		        .append( "<div>" + item.display_name + "</div>" )
		        .appendTo( ul );
		    };
		    

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
/*		console.log(AppConfig['siembraIni'] + " " + AppConfig['siembraFin']);
		console.log(AppConfig['cosechaIni'] + " " + AppConfig['cosechaFin']);	*/
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
	
	$("#btn_opciones").click(function(){
		
		var $text = $('<div></div>');
			$text.append( '<div class="form-group">'+
					   		'<i class="fa fa-th-list"></i><label for="">&nbsp;'+txt.tit_mapabase+'</label>'+
					   		'<div class="radio">'+
							  '<label><input type="radio" name="optMapaB" checked="">'+txt.msj_map_calle+'</label>'+
							'</div>'+
							'<div class="radio">'+
							  '<label><input type="radio" name="optMapaB">'+txt.msj_map_topo+'</label>'+
							'</div>'+
							'<div class="radio">'+
							  '<label><input type="radio" name="optMapaB">'+txt.msj_map_satelite+'</label>'+
							'</div>'+
						'</div>'+
						'<div class="h-divider">'+
					   	'<div class="form-group">'+
					   		'<i class="fa fa-language"></i><label for="">&nbsp;'+txt.tit_idioma+'</label>'+
					   		'<div class="radio">'+
							  '<label><input type="radio" name="optIdioma" checked="">Español</label>'+
							'</div>'+
							'<div class="radio">'+
							  '<label><input type="radio" name="optIdioma">English</label>'+
							'</div>'+
						'</div>'
						);
		
        BootstrapDialog.show({
        	title: txt.tit_opciones,
        	type: BootstrapDialog.TYPE_SUCCESS,
            message: $text /*,
            buttons: [{
                label: 'Cerrar',
                action: function(dialogRef){
                    dialogRef.close();
                }
            }] */
        });
		
	});
	
	$("#btn_epoca").click(function(){
		var chart1;
		var $text = $('<div id="container" style="max-height: 510px;"></div>');
		
        BootstrapDialog.show({
        	title: 'Época de Cultivo',
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
						            name: 'Siembra',
						            color: '#8A4B08',
						            data: AppConfig['siembra']
						
						        }, {
						            name: 'Cosecha',
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
             /*,
            buttons: [{
                label: 'Cerrar',
                action: function(dialogRef){
                    dialogRef.close();
                }
            }] */
        });
        
        
		
	});

	SetIdioma("EN");
    AppMap.map=AppMap.InitMap();
	AppMap.AddBaseLayer(AppMap.map);
	AppMap.AddPunto(AppMap.center[0],AppMap.center[1]);
	AppConfig.CargaDataCultivo();
	AppMap.AddMpio();
	AppConfig.MostarTerminos();		
	AppConfig.Inicial();
	console.log("CORREGIR!!! - MOSTRAR MAPA");	//$("#map").hide();
	
});

