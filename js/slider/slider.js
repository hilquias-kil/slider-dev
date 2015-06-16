( function( window, document ) {
	'use strict';

	var utils = window.utils,
		events = {},
		is_touch_device = ('ontouchstart' in window);

	// events
	events.start = is_touch_device ? 'touchstart' : 'mousedown';
	events.move = is_touch_device ? 'touchmove' : 'mousemove';
	events.end = is_touch_device ? 'touchend' : 'mouseup';
	events.resize = is_touch_device ? 'orientationchange' : 'resize';

	function Slider (element) {
		// el = wrapper
		if ( typeof element == 'string' ) {
			this.el = document.querySelector( element );
		} else {
			this.el = element;
		}
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

		this.init();
	}

	Slider.prototype = {

		next: function () {
			if( this.current < ( this.slidesQtd - 1 )) {
				this.current++;
				this.goToSlide();
			}
		},

		prev: function () {
			if( this.current > 0 ) {
				this.current--;
				this.goToSlide();
			}
		},

		goToSlide: function () {
			//this.holder.style.transform = "translateX(" + this.positions.center[ this.current ] +"px) translateY(0px) translateZ(0px)";
		}
	}

	window.Slider = Slider;

}( window, document ));
