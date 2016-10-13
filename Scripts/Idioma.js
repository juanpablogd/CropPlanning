var txt = {
	Idioma: "",
	tit_terminos: "",
	tit_buscapunto: "",
	msj_terminos: "",
	btn_aceptaterminos: "",
	btn_cancelar: "",
	ph_buscasitio: "",
	tit_opciones: "",
	tit_mapabase: "",
	tit_idioma: "",
	msj_map_calle: "",
	msj_map_topo: "",
	msj_map_satelite: "",
	msj_latitud: "",
	msj_longitud: "",
};

var idiomas = {
	"ES":{
		"tit_terminos": "Términos y Condiciones",
		"tit_buscapunto":"Buscar Punto",
		"msj_terminos": "Los siguientes términos y condiciones (los \"Términos y Condiciones\") rigen el uso que usted le dé a este sitio web y a cualquiera de los contenidos disponibles por o a través de este sitio web, incluyendo cualquier contenido derivado del mismo (el \"Sitio Web\"). Time Inc. (\"Time Inc.\" o \"nosotros\") ha puesto a su disposición el Sitio Web. Podemos cambiar los Términos y Condiciones de vez en cuando, en cualquier momento sin ninguna notificación, sólo publicando los cambios en el Sitio Web. AL USAR EL SITIO WEB, USTED ACEPTA Y ESTÉ DE ACUERDO CON ESTOS TÉRMINOS Y CONDICIONES EN LO QUE SE REFIERE A SU USO DEL SITIO WEB. Si usted no está de acuerdo con estos Términos y Condiciones, no puede tener acceso al mismo ni usar el Sitio Web de ninguna otra manera.",
		"btn_aceptaterminos":"Aceptar",
		"btn_cancelar":"Cancelar",
		"ph_buscasitio":"Buscar lugar...",
		"tit_opciones":"Opciones",
		"tit_mapabase":"MAPA BASE",
		"tit_idioma":"IDIOMA",
		"msj_map_calle":"Calles",
		"msj_map_topo":"Topográfico",
		"msj_map_satelite":"Satélite",
		"msj_latitud":"Latitud",
		"msj_longitud":"Longitud",
	},
	"EN":{
		"tit_terminos": "Terms and Conditions",
		"tit_buscapunto":"Search point",
		"msj_terminos": "The following terms and conditions (the \"Terms and Conditions \") govern the use you give to this website and any of the content available on or through this website, including any content derivative thereof (the \" Website\"). Time Inc. (\"Time Inc. \" or \"we \") has made available the Website. We may change the Terms and Conditions from time to time at any time without notice, only publishing the changes on the Website. BY USING THE WEB SITE, YOU ACCEPT AND AGREE TO THESE TERMS AND CONDITIONS WITH REGARD TO YOUR USE OF THE WEB SITE. If you do not agree to these Terms and Conditions, you may not have access to it or use the Website in any other way.",
		"btn_aceptaterminos":"I agree",
		"btn_cancelar":"Cancel",
		"ph_buscasitio":"Search place...",
		"tit_opciones":"Options",
		"tit_mapabase":"BASE MAPS",
		"tit_idioma":"LANGUAGE",
		"msj_map_calle":"Streets",
		"msj_map_topo":"Topographic",
		"msj_map_satelite":"Satellite",
		"msj_latitud":"Longitude",
		"msj_longitud":"Longitude",
	}
};

function SetIdioma(leng){ console.log("Cambio de idioma:" +leng);
	txt.Idioma = leng;
	$.each( idiomas[leng], function( key, value ) {
		txt[key] = value;		//console.log ( key + ": " + value );
	});
	$("#lugares").attr("placeholder", txt.ph_buscasitio);
/*	$.each( txt, function( key, value ) {
	  console.log ( key + ": " + value );
	});	*/	
};

