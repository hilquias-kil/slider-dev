(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Slider = factory());
}(this, (function () { 'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var defaultOptions = {
	initialSlide: 0,
	orientation: true
};

var _map = Array.prototype.map;
var Slider = function () {
	function Slider(element, config) {
		classCallCheck(this, Slider);

		this.el = validateElement(element);
		this.holder = this.el.children[0];
		this.options = Object.assign(defaultOptions, config);
		this.running = false;
		this.current = this.options.initialSlide;
		this.mutableProperties();
	}

	createClass(Slider, [{
		key: "mutableProperties",
		value: function mutableProperties() {
			var _this = this;

			this.slides = _map.call(this.holder.children, function (i) {
				return new Item(i, _this.options.orientation);
			});
			console.log(this.slides);
			this.slidesSize = this.slides.length;

			this.viewWidth = this.el.offsetWidth;
			this.viewHeight = this.el.offsetHeight;

			this.contentWidth = this.holder.scrollWidth;
			this.contentHeight = this.holder.scrollHeight;
		}
	}, {
		key: "setCurrent",
		value: function setCurrent(number) {
			this.current = number;
		}
	}]);
	return Slider;
}();

var Item = function Item(element, orientation, sum) {
	classCallCheck(this, Item);

	this.el = element;
	this.measure = orientation ? "offsetWidth" : "offsetHeight";
	this.size = this.el[this.measure];
	this.sum = sum;
};

function validateElement(el) {
	if (typeof el === "string") {
		return document.querySelector(el);
	} else if (el.length) {
		return el[0];
	}
	return el;
}

return Slider;

})));
