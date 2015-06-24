( function( window, document ) {
	'use strict';

	var utils = window.utils,
		events = {},
		is_touch_device = ('ontouchstart' in window),
		optionsDefault;

	// events
	events.start = is_touch_device ? 'touchstart' : 'mousedown';
	events.move = is_touch_device ? 'touchmove' : 'mousemove';
	events.end = is_touch_device ? 'touchend' : 'mouseup';
	events.resize = is_touch_device ? 'orientationchange' : 'resize';

	function Slider (element, options) {
		// el = wrapper
		if ( typeof element == 'string' ) {
			this.el = document.querySelector( element );
		} else {
			this.el = element;
		}
		this.options = options;
		this.init();
	}

	optionsDefault  = {

	}



	Slider.prototype.init = function () {
		this.holder = this.el.children[0];
		this.slides = this.holder.children;
		this.slidesQtd = this.slides.length;

		this.viewWidth = this.el.offsetWidth;
		this.viewHeight = this.el.offsetHeight;

		this.contentWidth = this.holder.scrollWidth;
		this.contentHeight = this.holder.scrollHeight;

		this.contentX = this.holder.offsetLeft;
		this.contentY = this.holder.offsetTop;

		this.current = 0;

		this.setUp();
	}

	Slider.prototype.setUp = function () {
		this.dimensions = {
			sliderSize : [],
			sliderSum : []
		}
		var initValue = 0;
		for (var i = 0; i < this.slidesQtd; i++) {
			this.dimensions.sliderSize.push(this.slides[i].offsetWidth);
			initValue += this.slides[i].offsetWidth;
			this.dimensions.sliderSum.push(initValue);
		}

		this.positions = {
			start : [],
			center : [],
			end : []
		}
		for (var i = 0; i < this.slidesQtd; i++) {
			this.positions.start.push( this.dimensions.sliderSum[i] - this.dimensions.sliderSize[i] );
			var a = (this.viewWidth - this.dimensions.sliderSize[i]) / 2;
			console.log(a);
			this.positions.center.push( (this.dimensions.sliderSum[i] - this.viewWidth) + a );
			this.positions.end.push(this.dimensions.sliderSum[i] - this.viewWidth);
		}
		console.log(this.positions);
	}

	Slider.prototype.next = function () {
		if( this.current < ( this.slidesQtd - 1 )) {
			this.current++;
			this.goToSlide();
		}
	}

	Slider.prototype.prev = function () {
		if( this.current > 0 ) {
			this.current--;
			this.goToSlide();
		}
	}

	Slider.prototype.goToSlide = function () {
		var pos =  -this.positions.start[ this.current ];
		this.holder.style.transform = "translateX(" + pos +"px) translateY(0px) translateZ(0px)";
	}


	window.Slider = Slider;

}( window, document ));
