
  var msj_peligro=function(msj){
        $.growl({
                icon: 'glyphicon glyphicon-warning-sign',
                title: ' Alerta ',
                message: msj                
            },
            { 
            type: "danger", 
            timer : 100,
            delay: 3000,
            z_index: 1051,
            animate: {
                enter: 'animated bounceIn',
                exit: 'animated bounceOut'
            },
            placement: {
                from: "top",
                align: "center"
            }
        });
        
   };
   var msj_exito=function(msj){
        $.growl(msj, { 
            type: "success", 
            timer : 100,
            delay: 3000,
            animate: {
                enter: 'animated bounceIn',
                exit: 'animated bounceOut'
            },
            placement: {
                from: "top",
                align: "center"
            }
        });
    };
    var msj_info=function(msj){
        $.growl(msj, { 
            type: "info", 
            timer : 100,
            delay: 3000,
            animate: {
                enter: 'animated bounceIn',
                exit: 'animated bounceOut'
            },
            placement: {
                from: "top",
                align: "center"
            }
        });
        
    };