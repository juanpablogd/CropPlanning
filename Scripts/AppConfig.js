var AppConfig={
 	UrlSocket: 'http://www.sofytek.com.co:3224/planeatucultivo', 			//Socket Login			app.js
 	cl:'1erf2a5f1e87g1',
 	sk_sofy: '',
 	gpsOptions:{ maximumAge: 1000*60, timeout: 1000*5, enableHighAccuracy: true }
};

Array.prototype.unique = function (a) {
    return function () { return this.filter(a); };
}(function (a, b, c) {
    return c.indexOf(a, b + 1) < 0;
});