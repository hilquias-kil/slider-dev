( function( window ){
	'use strict';

	var slice = Array.prototype.slice;

	function Utils (){
	}

	Utils.prototype.proxy = function (fn, context) {
		var proxy, args;
		args = slice.call( arguments, 2 );
		proxy = function(e) {
			e.preventDefault();
			return fn.apply(context || this, args.concat( slice.call( arguments ) ) );
		}
		return proxy;
	}

	window.utils = new Utils();

}( window ));
