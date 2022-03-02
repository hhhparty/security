/**
 * Adds Fingerprint value as a cookie labeled 'fp',
 * if it doesn't already exist within the client browser.
 * 
 * Requires `js-cookie` and `fingerprintjs2` libraries.
 * `js-cookie` introduced because `jquery-cookie` is deprecated.
 * 
 */
var Xplore = (function(Xplore, Cookies, Fingerprint2, undefined) { 
	'use strict';

	var COOKIE_KEY = 'fp';

	function init() {
		var fpc = Cookies.get(COOKIE_KEY);

		if (!fpc) {
			new Fingerprint2().get(function(fp){
				Cookies.set(COOKIE_KEY, fp, { expires: 20*365 });
			});	
		}
	}

	Xplore.Fingerprint = {
		init: init
	};

	return Xplore;

})(Xplore || {}, Cookies, Fingerprint2);