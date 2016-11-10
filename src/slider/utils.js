var slice = Array.prototype.slice,
	is_touch_device = ('ontouchstart' in window);

function Utils (){}

Utils.prototype.proxy = function (fn, context) {
	var proxy, args;
	args = slice.call( arguments, 2 );
	proxy = function(e) {
		//e.preventDefault();
		return fn.apply(context || this, args.concat( slice.call( arguments ) ) );
	};
	return proxy;
};

Utils.prototype.extend = function (o, p) {
	for(var prop in p) {
		o[prop] = p[prop];
	}
	return o;
};

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
};

Utils.prototype.cssTransition = function (el, duration, timingFunction) {
	var transition;

	if (!this.transitionProperty) {
		if ('transition' in el.style) {
			this.transitionProperty = 'transition';
		} else if ('webkitTransition' in el.style) {
			this.transitionProperty = 'webkitTransition';
		}
	}

	transition = duration + "ms " + timingFunction;

	el.style[this.transitionProperty] = transition;
};

Utils.prototype.clientAxis = function (event) {
	var axis = {
		x: event.clientX || event.touches[0].pageX,
		y: event.clientY || event.touches[0].pageY
	};
	return axis;
};

Utils.prototype.events = {
	start : is_touch_device ? 'touchstart' : 'mousedown',
	move : is_touch_device ? 'touchmove' : 'mousemove',
	end : is_touch_device ? 'touchend' : 'mouseup',
	resize : 'resize'
};

Utils.prototype.getMargin = function (el, orientation) {
	var style = getComputedStyle(el),
		result;
	if(orientation === "horizontal"){
		result = parseInt(style.marginLeft) + parseInt(style.marginRight);
		return result;
	} else {
		result = parseInt(style.marginTop) + parseInt(style.marginBottom);
		return result;
	}
};
