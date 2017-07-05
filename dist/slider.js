(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Slider = factory());
}(this, (function () { 'use strict';

var transformProperty = void 0;

function cssTransform(el, x, y) {
	var translate = 'translate(' + x + 'px, ' + y + 'px)';

	if (!transformProperty) {
		if ('transform' in el.style) {
			transformProperty = 'transform';
		} else if ('webkitTransform' in el.style) {
			transformProperty = 'webkitTransform';
		} else if ('MozTransform' in el.style) {
			transformProperty = 'MozTransform';
		} else if ('msTransform' in el.style) {
			transformProperty = 'msTransform';
		}
	}

	el.style[transformProperty] = translate;
}

function validateElement(el) {
	if (typeof el === "string") {
		return document.querySelector(el);
	} else if (el.length) {
		return el[0];
	}
	return el;
}

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

var _map = Array.prototype.map;
var DefaultOptions = function DefaultOptions() {
	classCallCheck(this, DefaultOptions);

	this.initialSlide = 0;
	this.orientation = true;
};

var Slider = function () {
	function Slider(element, config) {
		classCallCheck(this, Slider);

		this.el = validateElement(element);
		this.holder = this.el.children[0];
		this.options = Object.assign(new DefaultOptions(), config);
		this.running = false;
		this.current = this.options.initialSlide;
		this.measure = this.options.orientation ? "offsetWidth" : "offsetHeight";
		this.dragging = false;

		this.mutableProperties();
		this.go();
		//this.bind()
	}

	createClass(Slider, [{
		key: "mutableProperties",
		value: function mutableProperties() {
			var _this = this;

			var initial = 0;

			this.viewWidth = this.el.offsetWidth;
			this.viewHeight = this.el.offsetHeight;

			this.contentWidth = this.holder.scrollWidth;
			this.contentHeight = this.holder.scrollHeight;

			this.slides = _map.call(this.holder.children, function (i) {
				initial += i[_this.measure];
				return new Item(i, _this, initial);
			});
			this.slidesSize = this.slides.length;
		}
	}, {
		key: "setCurrent",
		value: function setCurrent(number) {
			this.current = number;
		}
	}, {
		key: "next",
		value: function next() {
			if (this.current < this.slidesSize - 1) {
				this.current++;
			}
			this.go();
		}
	}, {
		key: "prev",
		value: function prev() {
			if (this.current > 0) {
				this.current--;
			}
			this.go();
		}
	}, {
		key: "go",
		value: function go() {
			this.position = this.slides[this.current]['center'];
			var x = this.options.orientation ? this.position : 0;
			var y = this.options.orientation ? 0 : this.position;
			cssTransform(this.holder, x, y);
		}
	}]);
	return Slider;
}();

var Item = function Item(element, sl, sum) {
	classCallCheck(this, Item);

	var view = sl.options.orientation ? sl.viewWidth : sl.viewHeight;
	this.el = element;
	this.size = this.el[sl.measure];
	this.sum = sum;
	this.start = -(this.sum - this.size);
	this.center = this.sum - view + (view - this.size) / 2;
	this.center = -this.center;
	this.end = -(this.sum - view);
};

return Slider;

})));
