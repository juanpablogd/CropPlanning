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
	tit_epoca_cultivo:"",
	tit_pronostico:"",
	tit_clima:"",
	msj_map_calle: "",
	msj_map_topo: "",
	msj_map_satelite: "",
	msj_latitud: "",
	msj_longitud: "",
	msj_norte: "",
	msj_sur: "",
	msjSiembra: "",
	msjCosecha: "",
	msjPrecipitacion: "",
	msjTemperatura: "",
	msjEpoca: "",
	msjMapa: "",
	msjProduccion: "",
	msjMax: "",
	msjMin: "",
	msjRiegoSuper: "",
	msjRiegoProd: "",
	msjRiegoRend: "",
	msjRiegoMin: "",
	msjRiegoMax: "",
	msjSecanoSuper: "",
	msjSecanoProd: "",
	msjSecanoRend: "",
	msjSecanoMin: "",
	msjSecanoMax: "",
	msjSinInfo: "",
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
		"tit_epoca_cultivo":"Época de cultivo",
		"tit_pronostico":"Pronóstico",
		"tit_clima":"Clima",
		"msj_map_calle":"Calles",
		"msj_map_topo":"Topográfico",
		"msj_map_satelite":"Satélite",
		"msj_latitud":"Latitud      p.e. 4.123456",
		"msj_longitud":"Longitud   p.e. -74.123456",
		"msj_norte":"Norte",
		"msj_sur":"Sur",
		"msjSiembra": "Siembra",
		"msjCosecha": "Cosecha",
		"msjPrecipitacion": "Precipitación",
		"msjTemperatura": "Temperatura",
		"msjEpoca": "Cultivo",
		"msjMapa": "Mapa",
		"msjProduccion": "Producción",
		"msjMax": "Máximo",
		"msjMin": "Mínimo",
		"msjRiegoSuper": "Riego Superficie",
		"msjRiegoProd": "Riego Producción",
		"msjRiegoRend": "Riego Rendimiento",
		"msjRiegoMin": "Riego Mínimo",
		"msjRiegoMax": "Riego Máximo",
		"msjSecanoSuper": "Secano Superficie",
		"msjSecanoProd": "Secano Producción",
		"msjSecanoRend": "Secano Rendimiento",
		"msjSecanoMin": "Secano Mínimo",
		"msjSecanoMax": "Secano Máximo",
		"msjSinInfo": "SIN INFORMACIÓN",
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
		"tit_epoca_cultivo":"Growing season",
		"tit_pronostico":"Forecast",
		"tit_clima":"Weather",
		"msj_map_calle":"Streets",
		"msj_map_topo":"Topographic",
		"msj_map_satelite":"Satellite",
		"msj_latitud":"Latitude   e.g.  4.123456",
		"msj_longitud":"Longitude   e.g. -74.123456",
		"msj_norte":"North",
		"msj_sur":"South",
		"msjSiembra": "Sowing",
		"msjCosecha": "Harvest",
		"msjPrecipitacion": "Precipitation",
		"msjTemperatura": "Temperature",
		"msjEpoca": "Season",
		"msjMapa": "Map",
		"msjProduccion": "Production",
		"msjMax": "Maximum",
		"msjMin": "Minimum",
		"msjRiegoSuper": "Irrigation Surface",
		"msjRiegoProd": "Irrigation Production",
		"msjRiegoRend": "Irrigation Performance",
		"msjRiegoMin": "Irrigation Minimum ",
		"msjRiegoMax": "Irrigation Maximum",
		"msjSecanoSuper": "Dry farming Surface",
		"msjSecanoProd": "Dry farming Production",
		"msjSecanoRend": "Dry farming Performance",
		"msjSecanoMin": "Dry farming Minimum",
		"msjSecanoMax": "Dry farming Maximum",
		"msjSinInfo": "NO DATA",
	}
};

function SetIdioma(leng){ console.log("Cambio de idioma:" +leng);
	txt.Idioma = leng;
	$.each( idiomas[leng], function( key, value ) {
		txt[key] = value;		//console.log ( key + ": " + value );
	});
	$("#lugares").attr("placeholder", txt.ph_buscasitio);
	$("#btn_opciones").find('button').html(txt.tit_opciones);
	$("#btn_epoca").find('button').html(txt.msjEpoca);
	$("#btn_mapa").find('button').html(txt.msjMapa);
	$("#btn_pronostico").find('button').html(txt.tit_pronostico);
	$("#btn_clima").find('button').html(txt.tit_clima);
	$("#btn_temperatura").find('button').html(txt.msjTemperatura);
	$(".tit_popup").html(txt.msjProduccion);
	$(".msjRiegoSuper").html(txt.msjRiegoSuper);
	$(".msjRiegoProd").html(txt.msjRiegoProd);
	$(".msjRiegoRend").html(txt.msjRiegoRend);
	$(".msjRiegoMin").html(txt.msjRiegoMin);
	$(".msjRiegoMax").html(txt.msjRiegoMax);
	$(".msjSecanoSuper").html(txt.msjSecanoSuper);
	$(".msjSecanoProd").html(txt.msjSecanoProd);
	$(".msjSecanoRend").html(txt.msjSecanoRend);
	$(".msjSecanoMin").html(txt.msjSecanoMin);
	$(".msjSecanoMax").html(txt.msjSecanoMax);
	$(".msjSinInfo").html(txt.msjSinInfo);
/*	$.each( txt, function( key, value ) {console.log ( key + ": " + value );});	*/	
};


