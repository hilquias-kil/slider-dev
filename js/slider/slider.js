(function(window, document) {
	'use strict';

	var utils = window.utils,
		optionsDefault;

	optionsDefault = {
		alignment : "start",
		initialSlide : 0,
		orientation: "horizontal"
	}

	function Slider(element, config) {

		var options;

		this.validateElement(element);

		options = config || {};
		this.options = utils.extend(optionsDefault, options);

		this.defineProperties();
		this.defineMutableProperties();
		this.setUp();
		this.init();
	}

	Slider.prototype.validateElement = function (el) {
		if (typeof el === "string") {
			document.querySelectorAll(el);
		}
	}

	Slider.prototype.defineProperties = function() {
		this.holder = this.el.children[0];

		this.contentX = this.holder.offsetLeft;
		this.contentY = this.holder.offsetTop;

		this.setCurrent();
	}

	Slider.prototype.defineMutableProperties = function() {
		this.slides = this.holder.children;
		this.slidesQtd = this.slides.length;

		this.viewWidth = this.el.offsetWidth;
		this.viewHeight = this.el.offsetHeight;

		this.contentWidth = this.holder.scrollWidth;
		this.contentHeight = this.holder.scrollHeight;
	}

	Slider.prototype.setCurrent = function(num) {
		var num = num || this.options.initialSlide;
		this.current = num;
	}

	Slider.prototype.setUp = function() {

		var sum, size, vWidth, initValue;

		this.dimensions = {
			sliderSize: [],
			sliderSum: []
		}
		this.positions = {
			start: [],
			center: [],
			end: []
		}

		initValue = 0;

		for (var i = 0; i < this.slidesQtd; i++) {
			this.dimensions.sliderSize.push(this.slides[i].offsetWidth);
			initValue += this.slides[i].offsetWidth;
			this.dimensions.sliderSum.push(initValue);
		}

		sum = this.dimensions.sliderSum,
			size = this.dimensions.sliderSize,
			vWidth = this.viewWidth;

		for (var i = 0; i < this.slidesQtd; i++) {
			this.positions.start.push(sum[i] - size[i]);
			this.positions.center.push((sum[i] - vWidth) + ((vWidth - size[i]) / 2));
			this.positions.end.push(sum[i] - vWidth);
		}
	}

	Slider.prototype.init = function() {
		this.goToSlide();
	}

	Slider.prototype.next = function() {
		if (this.current < (this.slidesQtd - 1)) {
			this.current++;
			this.goToSlide();
		}
	}

	Slider.prototype.prev = function() {
		if (this.current > 0) {
			this.current--;
			this.goToSlide();
		}
	}

	Slider.prototype.goToSlide = function() {
		var pos = -this.positions.end[this.current];
		this.holder.style.transform = "translateX(" + pos + "px) translateY(0px) translateZ(0px)";
	}

	Slider.prototype.update = function() {
		this.defineMutableProperties();
		this.setUp();
	}

	Slider.prototype.reset = function() {
		this.update();
		this.setCurrent();
	}

	window.Slider = Slider;

}(window, document));
