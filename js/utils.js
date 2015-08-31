( function( window ){
	'use strict';

	var slice = Array.prototype.slice;

	function Utils (){}

	Utils.prototype.proxy = function (fn, context) {
		var proxy, args;
		args = slice.call( arguments, 2 );
		proxy = function(e) {
			e.preventDefault();
			return fn.apply(context || this, args.concat( slice.call( arguments ) ) );
		}
		return proxy;
	}

	Utils.prototype.extend = function (o, p) {
		for(var prop in p) {
			o[prop] = p[prop];
		}
		return o;
	}

	Utils.prototype.cssTransform = function (el, x, y) {
		var translate;

		if (!this.transformProperty) {
			if ('transform' in el.style) {
				this.transformProperty = 'transform';
			} else if ('webkitTransform' in el.style) {
				this.transformProperty = 'webkitTransform';
			} else if ('MozTransform' in el.style) {
				this.transformProperty = 'MozTransform';
			} else if ('msTransform' in el.style) {
				this.transformProperty = 'msTransform';
			}
		}

		translate = "translateX(" + x + "px)";
		translate += "translateY(" + y + "px)";
		translate += "translateZ(0px)";

		el.style[this.transformProperty] = translate;
	}

	Utils.prototype.clientAxis = function (event) {
		var axis = {
			x: event.clientX || event.touches[0].pageX,
			y: event.clientY || event.touches[0].pageY
		};
		return axis;
	}

	window.utils = new Utils();

}( window ));
