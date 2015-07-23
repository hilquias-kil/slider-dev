(function(window, document) {
	'use strict';

	var utils = window.utils,
		optionsDefault,
		proto,
		is_touch_device,
		events;

	function optionsDefault() {
		this.alignment = "start";
		this.initialSlide = 0;
		this.orientation = "horizontal";
	}

	function Slider(element, config) {
		var options;

		this.el = this.validateElement(element);

		options = config || {};
		this.options = utils.extend(new optionsDefault(), options);

		this.defineProperties();
		this.defineMutableProperties();
		this.setUp();
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
	}

	proto.defineProperties = function() {
		this.holder = this.el.children[0];

		this.contentX = this.holder.offsetLeft;
		this.contentY = this.holder.offsetTop;

		this.active = false;

		this.setCurrent();
	}

	proto.defineMutableProperties = function() {
		this.slides = this.holder.children;
		this.slidesQtd = this.slides.length;

		this.viewWidth = this.el.offsetWidth;
		this.viewHeight = this.el.offsetHeight;

		this.contentWidth = this.holder.scrollWidth;
		this.contentHeight = this.holder.scrollHeight;
	}

	proto.setCurrent = function(num) {
		var num = num || this.options.initialSlide;
		this.current = num;
	}

	proto.setUp = function() {

		var sum, size, vMeasure, initValue,
			direction;

		this.dimensions = {
			sliderSize: [],
			sliderSum: []
		}
		this.positions = {
			start: [],
			center: [],
			end: []
		}

		direction = "offsetWidth";

		if(this.options.orientation == "vertical"){
			direction = "offsetHeight";
		}

		initValue = 0;

		for (var i = 0; i < this.slidesQtd; i++) {
			this.dimensions.sliderSize.push(this.slides[i][direction]);
			initValue += this.slides[i][direction];
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
	}

	proto.init = function() {
		this.goToSlide();
	}

	proto.next = function() {
		if (this.current < (this.slidesQtd - 1)) {
			this.current++;
			this.goToSlide();
		}
	}

	proto.prev = function() {
		if (this.current > 0) {
			this.current--;
			this.goToSlide();
		}
	}

	proto.goToSlide = function() {
		var pos = -this.positions[this.options.alignment][this.current];
		if(this.options.orientation == "vertical"){
			this.dislocateElement(0, pos);
		} else {
			this.dislocateElement(pos);
		}
	}

	proto.update = function() {
		this.defineMutableProperties();
		this.setUp();
	}

	proto.reset = function() {
		this.update();
		this.setCurrent();
	}

	proto.dislocateElement = function(x, y) {
		var	axis = "translateX(" + (x || 0) + "px)";
		axis += " translateY(" + (y || 0) + "px)";
		axis += " translateZ(0px)";

		this.holder.style.transform = axis;
		this.contentX = x;
		this.contentY = y;

		// teste
		this.el.setAttribute("data-pos", x);
	}

///////////////////////////////// Drag

	is_touch_device = ('ontouchstart' in window),

	events = {
		start : is_touch_device ? 'touchstart' : 'mousedown',
		move : is_touch_device ? 'touchmove' : 'mousemove',
		end : is_touch_device ? 'touchend' : 'mouseup',
		resize : is_touch_device ? 'orientationchange' : 'resize',
	}

	proto.bind = function() {
		this.el.addEventListener(events.start, utils.proxy(this.start, this));
		this.el.addEventListener(events.move, utils.proxy(this.move, this));
		this.el.addEventListener(events.end, utils.proxy(this.end, this));

		this.swipeTime = new GetTimeSwipe();
	}

	proto.start = function(e) {
		this.active = true;

		this.deltaX = e.clientX - this.contentX;
		this.deltaY = e.clientY - this.contentY;

		this.holder.style.transitionDuration = "0ms";

		this.swipeTime.setTimeStart();
	}

	proto.move = function(e) {
		if (this.active) {
			this.contentX = e.clientX - this.deltaX;
			this.contentY = e.clientY - this.deltaY;

			if(this.options.orientation == "vertical"){
				this.dislocateElement(0, this.contentY);
			} else {
				this.dislocateElement(this.contentX);
			}
		}
	}

	proto.end = function(e) {
		this.active = false;
		this.holder.style.transitionDuration = "300ms";


		this.swipeTime.setTimeEnd();
		this.checkSwipe();
	}

	proto.checkSwipe = function() {
		if (this.swipeTime.getSwipeTime() > 300) {
			this.snap();
		} else {
			this.snap(true);
		}
	}

	////////////// snap

	proto.initSnap = function() {
		var positions = this.positions;
		var dimensions = this.dimensions.sliderSize.map(function(v){ return (v/2) });
		var axis = {
			start: [],
			center: [],
			end: []
		};

		// start
		axis.start = positions.start.map(function(v, i){ return -(v + dimensions[i]) })
		axis.start.unshift(Infinity);
		axis.start[axis.start.length - 1] = -Infinity;

		// center
		axis.center = positions.center.map(function(v, i){ return -(v + dimensions[i]) });
		axis.center.unshift(Infinity);
		axis.center[axis.start.length - 1] = -Infinity;

		// end
		axis.end = positions.end.map(function(v, i){ return (-v) + dimensions[i] })
		axis.end[0] = Infinity;
		axis.end.push(-Infinity);

		this.snapAxis = axis;
	}

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
	}

	// Objects

	function GetTimeSwipe(){
		var timeStart = 0,
			timeEnd = 0;

		this.setTimeStart = function () {
			timeStart = Date.now();
		}
		this.setTimeEnd = function () {
			timeEnd = Date.now();
		}
		this.getSwipeTime = function () {
			return timeEnd - timeStart;
		}
	}

	window.Slider = Slider;

}(window, document));
