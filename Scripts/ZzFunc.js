
var Func={
	Decrypted : function (message) {
		try {
			var text=CryptoJS.AES.decrypt(message,AppConfig.cl).toString(CryptoJS.enc.Utf8);
		}
		catch(err) {
		    this.CerrarAPP();
			return false;
		}
		if(text==''){
			this.CerrarAPP();
			return false;
		}else{
			var decrypted =JSON.parse(CryptoJS.AES.decrypt(message,AppConfig.cl).toString(CryptoJS.enc.Utf8));
			return decrypted;	
		}
	},
	Ecrypted: function (json){
		var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(json), AppConfig.cl);
		return ciphertext.toString();
	},
	DataLogin: function (){
		var DatosUsuario=this.Decrypted(localStorage.dt);
		return	DatosUsuario;
	},
	GetNombre: function (){
		var data=this.DataLogin();
		return data[0].nombre;
	},
	GetIdPerfil: function (){	//jp 18
		var data=this.DataLogin();
		return data[0].id_perfil;
	},
	GetAdmin: function (){
		var data=this.DataLogin();
		if(data[0].id_perfil_admin==24){
	        return true;	
	    }else{
	    	return false;	
	    }
	},
	GetTipo: function (){ //jp 24
		var data=this.DataLogin();		//console.log(data);
		var id_perfil_admin = data[0].id_perfil_admin; 
		if(id_perfil_admin==24||id_perfil_admin==69){
	        return "A";	
	    }else if(id_perfil_admin==79||id_perfil_admin==87||id_perfil_admin==96){
	    	return "E";	
	    }else if(id_perfil_admin==70){
	    	return "C";	
	    }
	},
	GetCentrosG: function (){ //jp 24
		var data=this.DataLogin();	//console.log(data);
		data = data[0].centrog;		//console.log(data.length);
		var cg = [];
		for (s=0;s<data.length;s++) {
			cg.push(data[s].id); //console.log(data[s]);
		}
		return cg; 
	},
	GetHoraLogin: function (){
		var data=this.DataLogin();
		return data[0].hora;
	},
	GetCl: function (){
		var data=this.DataLogin();
		return data[0].contrasegna;
	},
	GetUsuario: function (){
		var data=this.DataLogin();
		return data[0].usuario;
	},
	CerrarAPP: function(){
		localStorage.clear();
	   window.location.assign("../Login/index.html");
	},
	ValidaUsuario: function(){
		if(!localStorage.dt){
			this.CerrarAPP();
	    }else{
	    	var id_perfil=this.GetIdPerfil();
	        if(AppConfig.id_perfil.indexOf(id_perfil)<0){
	        	this.CerrarAPP();	
	        }
	    }
	},
	IntevaloLogin:function(){
		var app=this;
		app.ValidaUsuario();
		setInterval(function(){
			console.log('Valido');
			app.ValidaUsuario();
		}, 1000*5);	
	},
	degToRad:function(deg) {
       return deg * Math.PI * 2 / 360;
  	},
  	SetIdGestion:function(IdGestion){	//console.log(this.Ecrypted(IdGestion));
  		localStorage.setItem("t", this.Ecrypted(IdGestion));
  	},
  	GetIdGestion:function(){	//console.log(this.Ecrypted(IdGestion));
  		var IdGestion = this.Decrypted(localStorage.t);
  		return IdGestion;
  	},
  	SetNomGestion:function(NomGestion){	//console.log(this.Ecrypted(IdGestion));
  		localStorage.setItem("n", this.Ecrypted(NomGestion));
  	},
  	GetNomGestion:function(){	//console.log(this.Ecrypted(IdGestion));
  		var NomGestion = this.Decrypted(localStorage.n); //console.log(NomGestion);
  		return NomGestion;
  	},
	MsjPeligro:function(msj){
		$.notify({
			// options
			icon: 'fa fa-exclamation-circle',
			message: msj 
		},{
			// settings
			type: 'danger',
			timer : 100,
			delay: 3000,
			animate: {
				enter: 'animated bounceInRight',
				exit: 'animated bounceOutRight'
			},
			placement: {
				from: "bottom",
				align: "right"
			}
		});
	},
	ComparaFechas:function(dateTimeA, dateTimeB){
	    var momentA = moment(dateTimeA,"YYYY-MM-DD");
	    var momentB = moment(dateTimeB,"YYYY-MM-DD");
	    if (momentA > momentB) return 1;
	    else if (momentA < momentB) return -1;
	    else return 0;
	},
	ValidaURL:function isUrlValid(userInput) {
	    var regexQuery = "^(https?://)?(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$";
	    var url = new RegExp(regexQuery,"i");
	    if (url.test(userInput)) {	//alert('valid url: ' + userInput);
	        return true;
	    }	//alert('invalid url: ' + userInput);
	    return false;
	},
	ValidaPorcentaje:function(str){
		var x = parseFloat(str);
		if (isNaN(x) || x < 0 || x > 100) {
			return false;
		} else return true; 
	}	
	
};

var FuncDecrypted=function(message){	//console.log("FuncDecrypted INI: "+AppConfig.cl);
	var decrypted = JSON.parse(CryptoJS.AES.decrypt(message,AppConfig.cl).toString(CryptoJS.enc.Utf8));	//console.log("FuncDecrypted INI"+CryptoJS.AES.decrypt(message,AppConfig.cl).toString(CryptoJS.enc.Utf8));
	return decrypted;
};
/*	FORMATO DE MILES PARA LA CLASE VALOR*/
$( ".valor" ).each(function( index ) {	//console.log( index + ": " + $( this ).text() );
  	new Cleave($( this ), {
	    numeral: true,
	    numeralThousandsGroupStyle: 'thousand'
	});
});