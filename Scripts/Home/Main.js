$( document ).ready(function() {
	
	AppConfig.MostarTerminos= function(){ 		console.log("Ini");
		BootstrapDialog.show({
		            title: 'Términos y Condiciones',
		            type: BootstrapDialog.TYPE_SUCCESS,
		            closable: false,
		            message: AppConfig.msj_terminos,
		            buttons: [{
		                label: 'Aceptar',
		                cssClass: 'btn-success',
		                action: function(dialog) {
		                    console.log('Aceptar');
		                    dialog.close();
		                }
		            }, {
		                label: 'Cerrar',
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
					   		'<i class="fa fa-th-list"></i><label for="">&nbsp;MAPA BASE</label>'+
					   		'<div class="radio">'+
							  '<label><input type="radio" name="optMapaB" checked="">Calles</label>'+
							'</div>'+
							'<div class="radio">'+
							  '<label><input type="radio" name="optMapaB">Topográfico</label>'+
							'</div>'+
							'<div class="radio">'+
							  '<label><input type="radio" name="optMapaB">Satélite</label>'+
							'</div>'+
						'</div>'+
						'<div class="h-divider">'+
					   	'<div class="form-group">'+
					   		'<i class="fa fa-language"></i><label for="">&nbsp;IDIOMA</label>'+
					   		'<div class="radio">'+
							  '<label><input type="radio" name="optIdioma" checked="">Español</label>'+
							'</div>'+
							'<div class="radio">'+
							  '<label><input type="radio" name="optIdioma">English</label>'+
							'</div>'+
						'</div>'
						);
		
        BootstrapDialog.show({
        	title: 'Opciones',
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
	
    AppMap.map=AppMap.InitMap();
	AppMap.AddBaseLayer(AppMap.map);
	AppMap.AddPunto(AppMap.center[0],AppMap.center[1]);
	//AppConfig.MostarTerminos();
	console.log("CORREGIR!!! - MOSTRAR MAPA");
	//$("#map").hide();
	
});

