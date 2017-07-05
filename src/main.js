import _cssTransform from "./utils/css-transform"
import _clientAxis from "./utils/client-axis"
import _events from "./utils/events"
import _validateElement from "./utils/validate-element"

let _map = Array.prototype.map;
let _forEach = Array.prototype.forEach;

class DefaultOptions {
	constructor(){
		this.initialSlide = 0;
		this.orientation = true;
	}
}

class Slider {
	constructor(element, config) {
		this.el = _validateElement(element);
		this.holder = this.el.children[0];
		this.options = Object.assign(new DefaultOptions(), config);
		this.running = false;
		this.current = this.options.initialSlide;
		this.measure = this.options.orientation ? "offsetWidth" : "offsetHeight";
		this.dragging = false;

		this.mutableProperties()
		this.go()
		//this.bind()
	}

	mutableProperties() {
		var initial = 0;

		this.viewWidth = this.el.offsetWidth;
		this.viewHeight = this.el.offsetHeight;

		this.contentWidth = this.holder.scrollWidth;
		this.contentHeight = this.holder.scrollHeight;

		this.slides = _map.call(this.holder.children, (i) => {
			initial += i[this.measure];
			return new Item(i, this, initial)
		});
		this.slidesSize = this.slides.length;
	}

	setCurrent(number) {
		this.current = number;
	}

	next(){
		if (this.current < (this.slidesSize - 1)) {
			this.current++;
		}
		this.go()
	}

	prev(){
		if (this.current > 0) {
			this.current--;
		}
		this.go()
	}

	go(){
		this.position = this.slides[this.current]['center'];
		var x = this.options.orientation ? this.position : 0;
		var y = this.options.orientation ? 0 : this.position;
		_cssTransform(this.holder, x, y)
	}
}

class Item {
	constructor(element, sl, sum) {
		let view = sl.options.orientation ? sl.viewWidth : sl.viewHeight;
		this.el = element;
		this.size = this.el[sl.measure];
		this.sum = sum;
		this.start = -(this.sum - this.size);
		this.center = (this.sum - view) + ((view - this.size) / 2);
		this.center = -(this.center);
		this.end = -(this.sum - view);
	}
}

export default Slider;
