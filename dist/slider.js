(function (root, factory) {
	'use strict';

	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.Slider = factory();
	}
}(this, function () {
	'use strict';

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

var utils = new Utils(),
	proto;

function OptionsDefault() {
	this.alignment = "center";
	this.initialSlide = 0;
	this.orientation = "horizontal";
	this.bounce = true;
	this.timeFunction = "cubic-bezier(0.1, 0.57, 0.1, 1)";
	this.speed = 300;
}

function Slider(element, config) {
	var options;

	this.el = this.validateElement(element);

	options = config || {};
	this.options = utils.extend(new OptionsDefault(), options);

	this.defineProperties();
	this.defineMutableProperties();
	this.setUp();
	this.setCss();
	this.init();

	// drag
	this.bind();

	// snap
	this.initSnap();
}

proto = Slider.prototype;

proto.validateElement = function (el) {
	if (typeof el === "string") {
		return document.querySelector(el);
	} else if(el.length) {
		return el[0];
	}
	return el;
};

proto.defineProperties = function() {
	this.holder = this.el.children[0];
	this.active = false;

	this.setCurrent();
};

proto.defineMutableProperties = function() {
	this.slides = this.holder.children;
	this.slidesQtd = this.slides.length;

	this.viewWidth = this.el.offsetWidth;
	this.viewHeight = this.el.offsetHeight;

	this.contentWidth = this.holder.scrollWidth;
	this.contentHeight = this.holder.scrollHeight;
};

proto.setCurrent = function(number) {
	var num = number || this.options.initialSlide;
	this.current = num;
};

proto.setUp = function() {

	var sum, size, vMeasure, initValue,
		direction, elMargin;

	this.dimensions = {
		sliderSize: [],
		sliderSum: []
	};
	this.positions = {
		start: [],
		center: [],
		end: []
	};

	direction = this.options.orientation == "vertical" ? "offsetHeight" : "offsetWidth";

	initValue = 0;

	for (var i = 0; i < this.slidesQtd; i++) {
		elMargin = utils.getMargin(this.slides[i], this.options.orientation);
		this.dimensions.sliderSize.push(this.slides[i][direction] + elMargin);
		initValue += this.slides[i][direction] + elMargin;
		this.dimensions.sliderSum.push(initValue);
	}

	sum = this.dimensions.sliderSum,
	size = this.dimensions.sliderSize,
	vMeasure = this.el[direction];

	for (var i = 0; i < this.slidesQtd; i++) {
		this.positions.start.push(sum[i] - size[i]);
		this.positions.center.push((sum[i] - vMeasure) + ((vMeasure - size[i]) / 2));
		this.positions.end.push(sum[i] - vMeasure);
	}
};

proto.setCss = function(){
	utils.cssTransition(this.holder, this.options.speed, this.options.timeFunction);
	this.holder.style.willChange = "transform";
};

proto.init = function() {
	this.goToSlide();
};

proto.next = function() {
	if (this.current < (this.slidesQtd - 1)) {
		this.current++;
	}
	this.goToSlide();
};

proto.prev = function() {
	if (this.current > 0) {
		this.current--;
	}
	this.goToSlide();
};

proto.goToSlide = function() {
	var pos = -this.positions[this.options.alignment][this.current];
	this.dislocateElement(pos, pos);
};

proto.update = function() {
	this.defineMutableProperties();
	this.setUp();
};

proto.reset = function() {
	this.update();
	this.setCurrent();
};

proto.dislocateElement = function(x, y) {
	var	axis = {
		x: x || 0,
		y: y || 0
	};

	var pos = this.positions[this.options.alignment];

	var start = pos[0];
	var start = -start;
	var end = pos[pos.length - 1];
	var end = -end;

	var orientation = this.options.orientation == "vertical" ? axis.y : axis.x;
	var num = orientation;

	if(this.options.bounce){

		if(orientation > start){
			num = ((orientation - start) /3) + start;
		} else if(orientation < end) {
			num = ((orientation - end) /3) + end;
		}

		this.checkDirection(num);

	} else {

		this.checkDirection(num);

	}

	this.contentX = axis.x;
	this.contentY = axis.y;
};

proto.checkDirection = function(number){
	if (this.options.orientation == "vertical") {
		utils.cssTransform(this.holder, 0, number);
	} else {
		utils.cssTransform(this.holder, number, 0);
	}
};

///////////////////////////////// Drag

proto.bind = function() {
	this.el.addEventListener(utils.events.start, utils.proxy(this.start, this));
	this.el.addEventListener(utils.events.move, utils.proxy(this.move, this));
	this.el.addEventListener(utils.events.end, utils.proxy(this.end, this));

	window.addEventListener(utils.events.resize, utils.proxy(this.resize, this));

	this.swipeData = new GetSwipeData();
};

proto.start = function(e) {
	this.active = true;

	this.deltaX = utils.clientAxis(e).x - this.contentX;
	this.deltaY = utils.clientAxis(e).y - this.contentY;

	utils.cssTransition(this.holder, 0, this.options.timeFunction);

	this.swipeData.setTimeStart();

	this.swipeData.startPosition = this.options.orientation == "vertical" ? this.contentY : this.contentX;

	this.temp = {
		x : this.contentX,
		y : this.contentY
	}
};

proto.move = function(e) {
	if (this.active) {

		this.contentX = utils.clientAxis(e).x - this.deltaX;
		this.contentY = utils.clientAxis(e).y - this.deltaY;

		if(this.validateMove()){
			this.dislocateElement(this.contentX, this.contentY);
		}

	}
};

proto.end = function(e) {
	this.active = false;

	utils.cssTransition(this.holder, this.options.speed, this.options.timeFunction);

	this.swipeData.setTimeEnd();

	this.swipeData.endPosition = this.options.orientation == "vertical" ? this.contentY : this.contentX;

	this.checkSwipe();
};

proto.validateMove = function(){

	var currentX = Math.abs(this.contentX - this.temp.x);
	var currentY = Math.abs(this.contentY - this.temp.y);

	this.temp.x  = this.contentX;
	this.temp.y  = this.contentY;

	if(this.options.orientation == "vertical"){
		if(currentX < currentY){
			return true;
		}
	} else {
		if(currentX > currentY){
			return true;
		}
	}

	return false;
}

proto.checkSwipe = function() {
	if (this.swipeData.getSwipeTime() > 300 || this.swipeData.getPath() < 100) {
		this.snap();
	} else {
		if (this.swipeData.getSwipeDirection() == "next"){
			this.next();
		} else if(this.swipeData.getSwipeDirection() == "prev") {
			this.prev();
		}
	}
};

proto.resize = function(){
	this.update();
};

////////////// snap

proto.initSnap = function() {
	var positions = this.positions;
	var dimensions = this.dimensions.sliderSize.map(function(v){ return (v/2); });
	var axis = {
		start: [],
		center: [],
		end: []
	};

	// start
	axis.start = positions.start.map(function(v, i){ return -(v + dimensions[i]); });
	axis.start.unshift(Infinity);
	axis.start[axis.start.length - 1] = -Infinity;

	// center
	axis.center = positions.center.map(function(v, i){ return -(v + dimensions[i]); });
	axis.center.unshift(Infinity);
	axis.center[axis.start.length - 1] = -Infinity;

	// end
	axis.end = positions.end.map(function(v, i){ return (-v) + dimensions[i]; });
	axis.end[0] = Infinity;
	axis.end.push(-Infinity);

	this.snapAxis = axis;
};

proto.snap = function() {
	var qtd = this.slidesQtd;
	var contentAxis = this.options.orientation == "vertical" ? this.contentY : this.contentX;
	var axis = this.snapAxis[this.options.alignment];

	for (var i = 0; i < qtd; i++) {

		if(contentAxis < axis[i] && contentAxis > axis[i+1]){
			this.current = i;
			this.goToSlide();
		}
	}
};

// Objects

function GetSwipeData(){
	var timeStart = 0,
		timeEnd = 0;

	this.startPosition = 0;
	this.endPosition = 0;

	this.setTimeStart = function () {
		timeStart = Date.now();
	};
	this.setTimeEnd = function () {
		timeEnd = Date.now();
	};
	this.getSwipeTime = function () {
		return timeEnd - timeStart;
	};
	this.getPath = function () {
		return Math.abs(this.startPosition - this.endPosition);
	};
	this.getSwipeDirection = function () {
		//console.log('start: ' + this.startPosition, 'end: ' + this.endPosition);
		if(this.startPosition > this.endPosition){
			return "next";
		} else if(this.startPosition < this.endPosition) {
			return "prev";
		} else {
			return false;
		}
	};
}

return Slider;

}));
