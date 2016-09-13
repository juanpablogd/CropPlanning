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
    AppMap.map=AppMap.InitMap();
	AppMap.AddBaseLayer(AppMap.map);
	AppMap.AddPunto(AppMap.center[0],AppMap.center[1]);
	AppMap.AddMenu();
	AppConfig.MostarTerminos();
	
});

