var AppMap = {
    center: [-8230000, 535000],
    zoom: 8,
    view: new ol.View({
        maxZoom: 21
    }),
    map: '',
    DefineMap: function() {
        $(window).resize(function() {
            $('.map').css("height", $(window).height() - 50);
            $('.PanelStreetView').css("height", $(window).height() - 50);
            AppMap.map.updateSize();
            google.maps.event.trigger(gmaps.gmap, 'resize');
            var center = ol.proj.transform(AppMap.view.getCenter(), 'EPSG:3857', 'EPSG:4326');
            gmaps.gmap.setCenter(new google.maps.LatLng(center[1], center[0]));
        });
        document.addEventListener('DOMContentLoaded', function() {
            FastClick.attach(document.body);
        });
         $('#base_osm_calles').on('click', function(evt) {
	        AppMap.OffLyrBase();
	        Lyr.Base_MapQuest.setVisible(true);
	    });
	    if(gmaps.LoadGmap){
	    	gmaps.ActiveMapGoogle=false;
	    }
    },
    InitMap: function() {
        this_ = this;
        $('.map,.PanelStreetView').css("height", $(window).height() - 50);

        if (gmaps.LoadGmap) {
            var map = gmaps.initGmaps(this_.view);
        } else {
            $("#map").empty();
            var attribution = new ol.control.Attribution({
                collapsible: false
            });
            var map = new ol.Map({
                controls: ol.control.defaults({
                    attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                        collapsible: false
                    })
                }).extend([
                    new ol.control.ScaleLine()
                ]),
               	controls: ol.control.defaults({
                    attribution: false
                }).extend([attribution]),
                target: 'map',
                view: this_.view
            });
        }
        map.addLayer(Lyr.Base_MapQuest);
        Lyr.Base_MapQuest.setVisible(true);
        this_.view.setCenter(this.center);
        this_.view.setZoom(this.zoom);
        this.DefineMap();
        
        return map;
    },
    ZoomControl: function(opt_options) {
        var options = opt_options || {};
        var button = document.createElement('button');
        button.innerHTML = '<span class="glyphicon glyphicon-resize-small" aria-hidden="true"></span>';
        var this_ = this;
        var handle = function(e) {
            var v = this_.getMap().getView();
            v.setCenter([-8230000, 535000]);
            v.setZoom(8);
        };

        button.addEventListener('click', handle, false);
        button.addEventListener('touchstart', handle, false);


        var element = document.createElement('div');
        element.className = 'ZoomExt ol-unselectable ol-control';
        element.appendChild(button);

        ol.control.Control.call(this, {
            element: element,
            target: options.target
        });
    },
    ActiveStreetViewOL: false,
    StreetViewOL: function(opt_options) {
        var options = opt_options || {};
        var button = document.createElement('button');
        button.innerHTML = '<i class="fa fa-street-view" aria-hidden="true"></i>';
        var this_ = this;
        var handle = function(e) {
        	var AltoAncho="width";
        	var cssAlto='100%';
        	if($(window).width()<768){
        		AltoAncho="height";        		
        		$(".PanelStreetView").css('left','0');
        		$(".PanelStreetView").css('margin-top','50px');
        		$(".PanelStreetView").css('top','50%');        		
        		$(".PanelStreetView").css('width','100%'); 
        		$(".PanelStreetView").css('height','45%'); 
        		cssAlto= $(window).height() - 50;  
        	}
            if (AppMap.ActiveStreetViewOL == true) {
                button.innerHTML = '<i class="fa fa-street-view" aria-hidden="true"></i>';
                $('.map').css(AltoAncho, cssAlto);
                $('.PanelStreetView').css("display", 'none');
                AppMap.ActiveStreetViewOL = false;
                Lyr.StrVw_Source.clear();
                gmaps.panorama.setVisible(false);
            } else {
                button.innerHTML = '<i class="fa fa-street-view ActiveOl" aria-hidden="true"></i>';
                $('.map').css(AltoAncho, '50%');
                $('.PanelStreetView').css("display", 'initial');
                AppMap.ActiveStreetViewOL = true;
                gmaps.panorama.setVisible(false);
            }
            AppMap.map.updateSize();
            google.maps.event.trigger(gmaps.gmap, 'resize');
            var center = ol.proj.transform(AppMap.view.getCenter(), 'EPSG:3857', 'EPSG:4326');
            gmaps.gmap.setCenter(new google.maps.LatLng(center[1], center[0]));
        };

        button.addEventListener('click', handle, false);
        button.addEventListener('touchstart', handle, false);

        var element = document.createElement('div');
        element.className = 'StreetViewOL ol-unselectable ol-control';
        element.appendChild(button);

        ol.control.Control.call(this, {
            element: element,
            target: options.target
        });
    },
    addZoomControl: function(map) {
        this_ = this;
        ol.inherits(this_.ZoomControl, ol.control.Control);
        map.addControl(new this_.ZoomControl());
    },
    addStreetViewControl: function(map) {
        if (gmaps.LoadGmap) {
            this_ = this;
            ol.inherits(this_.StreetViewOL, ol.control.Control);
            map.addControl(new this_.StreetViewOL());
            Lyr.InitStrVw();
            map.addLayer(Lyr.StrVw_Vector);
        }
    },

    displayClickStreetView: function(evt) {
        var coordinate = evt.coordinate;
        var coord_4326 = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
        var position_vista = new google.maps.LatLng(coord_4326[1], coord_4326[0]);
        gmaps.panorama.setPosition(position_vista);
        gmaps.streetViewService.getPanoramaByLocation(position_vista, 40, function(streetViewPanoramaData, status) {
            if (status === google.maps.StreetViewStatus.OK) {
                gmaps.panorama.setVisible(true);
            } else {
                gmaps.panorama.setVisible(false);
            }
        });
        gmaps.ChangePosition(coordinate);

    },
    OffLyrBase:function(){
    	Lyr.Base_ESRI_Calles.setVisible(false);
    	Lyr.Base_MapQuest.setVisible(false);
    	gmaps.ActiveMapGoogle=false;
    },
    AddBaseEsriCalles:function(){
	    AppMap.map.addLayer(Lyr.Base_ESRI_Calles);
	    Lyr.Base_ESRI_Calles.setVisible(false);
	    $(".carousel-inner").append(
    		'<div class="item ">'+
	        '<div class="row-fluid">'+
	          '<div class="col-sm-12 col-md-12 BaseImg" id="base_esri_calles">'+
	          	'<a href="#" class="thumbnail"><img src="../../Images/Map/base_esri_calles.PNG"  >'+
	          		'<div class="carousel-caption captionBlue"><center><h6>ESRI Calles</h6></center></div>'+
	           	'</a>'+
	          '</div>'+
	        '</div>'+
	    '</div>');
	    $('#base_esri_calles').on('click', function(evt) {
	        AppMap.OffLyrBase();	        
	        Lyr.Base_ESRI_Calles.setVisible(true);
	    });	    
    }

};

gmaps = {
    gmap: '',
    panorama: '',
    streetViewService: '',
    LoadGmap: false,
    ActiveMapGoogle:true,
    InitMapGoogle: function() {
        gmaps.LoadGmap = true;
    },
    integracion_google : function() {
         var center = ol.proj.transform(AppMap.view.getCenter(), 'EPSG:3857', 'EPSG:4326');
         this.gmap.setCenter(new google.maps.LatLng(center[1], center[0]));
		 this.gmap.setZoom(AppMap.view.getZoom());
    },
    ChangePosition: function(coordinate) {
        Lyr.StrVw_Source.clear();
        var feature = new ol.Feature({
            geometry: new ol.geom.Point(coordinate)
        });
        Lyr.StrVw_Source.addFeature(feature);
        Lyr.StrVw_Vector.setZIndex(1);        
        
    },
    InitBaseLayerHTMl:function() {
    	$(".carousel-inner").append(
    		'<div class="item ">'+
	        '<div class="row-fluid">'+
	          '<div class="col-sm-12 col-md-12 BaseImg" id="base_google_calles">'+
	          	'<a href="#" class="thumbnail"><img src="../../Images/Map/base_google_calles.PNG"  >'+
	          		'<div class="carousel-caption captionBlue"><center><h6>Google Calles</h6></center></div>'+
	           	'</a>'+
	          '</div>'+
	        '</div>'+
	    '</div>');
	    $(".carousel-inner").append(
    		'<div class="item ">'+
	        '<div class="row-fluid">'+
	          '<div class="col-sm-12 col-md-12 BaseImg" id="base_google_satelite">'+
	          	'<a href="#" class="thumbnail"><img src="../../Images/Map/base_google_satelite.png"  >'+
	          		'<div class="carousel-caption captionWhite"><center><h6>Google Satelite</h6></center></div>'+
	           	'</a>'+
	          '</div>'+
	        '</div>'+
	    '</div>');
	    $('#base_google_calles').on('click', function(evt) {
	        AppMap.OffLyrBase();
	        gmaps.ActiveMapGoogle=true;
	        gmaps.gmap.setOptions({
	            'mapTypeId': google.maps.MapTypeId.ROADMAP
	        });
	        gmaps.integracion_google();	        
		});
		$('#base_google_satelite').on('click', function(evt) {
	        AppMap.OffLyrBase();
	        gmaps.ActiveMapGoogle=true;
	        gmaps.gmap.setOptions({
	            'mapTypeId': google.maps.MapTypeId.HYBRID 
	        });	    
	        gmaps.integracion_google();    
		});
    },    
    ListenerStrVw:function(map,panorama){
    	google.maps.event.addListener(panorama, 'position_changed', function() {
            if (AppMap.ActiveStreetViewOL == true) {
                var coord = panorama.getPosition();
                var coord_3857 = ol.proj.transform([coord.lng(), coord.lat()], 'EPSG:4326', 'EPSG:3857');
                gmaps.ChangePosition(coord_3857);
            }
        });
        google.maps.event.addListener(panorama, 'pov_changed', function() {
            var headingCell = panorama.getPov().heading;
            headingCell = Func.degToRad(headingCell);
            var iconStyle = new ol.style.Style({
                image: new ol.style.Icon(({
                    anchor: [0.5, 120],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    src: '../../Images/Map/flecha.png',
                    scale: 0.15,
                    rotation: headingCell
                }))
            });
            Lyr.StrVw_Vector.setStyle(iconStyle);
        });
        
        
        map.on('click', function(evt) {
            if (AppMap.ActiveStreetViewOL == true) {
                AppMap.displayClickStreetView(evt);
            } else {
                Lyr.StrVw_Source.clear();
            }
        });
    	return map;
    },
    initGmaps: function(view) {
    	this.InitBaseLayerHTMl();
        var gmap = new google.maps.Map(document.getElementById('gmap'), {
            disableDefaultUI: true,
            keyboardShortcuts: false,
            draggable: false,
            disableDoubleClickZoom: true,
            scrollwheel: false,
            streetViewControl: false
        });

        view.on('change:center', function() {
        	if(gmaps.ActiveMapGoogle){
        		var center = ol.proj.transform(view.getCenter(), 'EPSG:3857', 'EPSG:4326');
            	gmap.setCenter(new google.maps.LatLng(center[1], center[0]));	
        	}
            
        });
        view.on('change:resolution', function() {
            if(gmaps.ActiveMapGoogle){
            	gmap.setZoom(AppMap.view.getZoom());
            }
        });
		
        var olMapDiv = document.getElementById('olmap');
        
        var map = new ol.Map({
        	
            controls: ol.control.defaults({
                attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                    collapsible: false
                })
            }).extend([
                new ol.control.ScaleLine()
            ]),
            interactions: ol.interaction.defaults({
                altShiftDragRotate: false,
                dragPan: false,
                rotate: false
            }).extend([new ol.interaction.DragPan({
                kinetic: null
            })]),
            target: olMapDiv,
            view: view
        });
		olMapDiv.parentNode.removeChild(olMapDiv);
        gmap.controls[google.maps.ControlPosition.TOP_LEFT].push(olMapDiv);
		
		
		//Inicializacion Panorama
		var panoramaOptions = {pov: { heading: 0, pitch: 10}};
        var panorama = new google.maps.StreetViewPanorama(document.getElementById('PanelStreetView'), panoramaOptions);
        gmap.setStreetView(panorama);
      	map=this.ListenerStrVw(map,panorama);
      	
      	//Define Variables de Interaccion
		this.panorama = panorama;
        this.streetViewService = new google.maps.StreetViewService();
        this.gmap = gmap;
        return map;
    }
};
Lyr = {
    StrVw_Source: '',
    StrVw_Vector: '',
    InitStrVw: function() {
        this_ = this;
        this_.StrVw_Source = new ol.source.Vector({});
        this_.StrVw_Vector = new ol.layer.Vector({
            source: this_.StrVw_Source,
            style: new ol.style.Style({
                image: new ol.style.Icon( /** @type {olx.style.IconOptions} */ ({
                    anchor: [0.5, 120],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    src: '../../Images/Map/flecha.png',
                    scale: 0.15
                }))
            })
        });
    },
    Base_MapQuest: new ol.layer.Tile({
   	  preload: Infinity,
      style: 'Road',
      source: new ol.source.OSM()
    }),
    Base_ESRI_Calles: new ol.layer.Tile({
    	preload: Infinity,
        source: new ol.source.XYZ({
          attributions: '',
          url: 'http://server.arcgisonline.com/ArcGIS/rest/services/' +
              'World_Street_Map/MapServer/tile/{z}/{y}/{x}'
        })
    })
};