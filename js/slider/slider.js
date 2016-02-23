(function(window, document) {
	'use strict';

	var utils = window.utils,
		proto,
		is_touch_device,
		events;

	function OptionsDefault() {
		this.alignment = "start";
		this.initialSlide = 0;
		this.orientation = "horizontal";
	}

	function Slider(element, config) {
		var options;

		this.el = this.validateElement(element);

		options = config || {};
		this.options = utils.extend(new OptionsDefault(), options);

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

		if(this.options.orientation == "vertical"){
			direction = "offsetHeight";
		} else {
			direction = "offsetWidth";
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
		}
		this.goToSlide();
	}

	proto.prev = function() {
		if (this.current > 0) {
			this.current--;
		}
		this.goToSlide();
	}

	proto.goToSlide = function() {
		var pos = -this.positions[this.options.alignment][this.current];
		this.dislocateElement(pos, pos);
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
		var	axis = {
			x: x || 0,
			y: y || 0
		}


		var start = this.positions.start[0];
		var end = this.positions.end[this.positions.end.length - 1];
			end = -end;

		var orientation = this.options.orientation == "vertical" ? axis.y : axis.x;
		var num = orientation;

		if(orientation > start){
			num = (orientation / 3);
		} else if(orientation < end){
			num = ((orientation - end) /3) + end;
		} else {
			num = orientation;
		}

		if (this.options.orientation == "vertical") {
			utils.cssTransform(this.holder, 0, num);
		} else {
			utils.cssTransform(this.holder, num, 0);
		}



		//console.log(x, x/3);

		this.contentX = axis.x;
		this.contentY = axis.y;

		// teste
		this.el.setAttribute("data-pos", x || 0);
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

		this.swipeData = new GetSwipeData();
	}

	proto.start = function(e) {
		this.active = true;

		this.deltaX = utils.clientAxis(e).x - this.contentX;
		this.deltaY = utils.clientAxis(e).y - this.contentY;

		this.holder.style.transitionDuration = "0ms";

		this.swipeData.setTimeStart();

		if (this.options.orientation == "vertical") {
			this.swipeData.startPosition = this.contentY;
		} else {
			this.swipeData.startPosition = this.contentX;
		}
		//console.log("%cstart: " + this.contentX, "color:orange;")
	}

	proto.move = function(e) {
		if (this.active) {

			this.contentX = utils.clientAxis(e).x - this.deltaX;
			this.contentY = utils.clientAxis(e).y - this.deltaY;

			//console.log("move: " + this.contentX)

			this.dislocateElement(this.contentX, this.contentY);
		}
	}

	proto.end = function(e) {
		this.active = false;
		this.holder.style.transitionDuration = "300ms";


		this.swipeData.setTimeEnd();
		if (this.options.orientation == "vertical") {
			this.swipeData.endPosition = this.contentY;
		} else {
			this.swipeData.endPosition = this.contentX;
		}
		//console.log("%cend: " + this.contentX, "color:red;")
		this.checkSwipe();
	}

	proto.checkSwipe = function() {
		if (this.swipeData.getSwipeTime() > 300) {
			this.snap();
		} else {

			if(this.swipeData.getSwipeDirection() == "next"){
				this.next();
			} else if(this.swipeData.getSwipeDirection() == "prev") {
				this.prev();
			} else {
				//this.goToSlide();
			}
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

	function GetSwipeData(){
		var timeStart = 0,
			timeEnd = 0;

		this.startPosition = 0;
		this.endPosition = 0;

		this.setTimeStart = function () {
			timeStart = Date.now();
		}
		this.setTimeEnd = function () {
			timeEnd = Date.now();
		}
		this.getSwipeTime = function () {
			return timeEnd - timeStart;
		}
		this.getSwipeDirection = function () {
			if(this.startPosition > this.endPosition){
				return "next";
			} else if(this.startPosition < this.endPosition) {
				return "prev";
			} else {
				return false;
			}
		}
	}

	window.Slider = Slider;

}(window, document));
