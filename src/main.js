import cssTransform from "./utils/css-transform"
import clientAxis from "./utils/client-axis"
import events from "./utils/events"
import validateElement from "./utils/validate-element"

let defaultOptions = {
	initialSlide: 0,
	orientation: true
}

let _map = Array.prototype.map;
let _forEach = Array.prototype.forEach;

class Slider {
	constructor(element, config) {
		this.el = validateElement(element);
		this.holder = this.el.children[0];
		this.options = Object.assign(defaultOptions, config);
		this.running = false;
		this.current = this.options.initialSlide;
		this.measure = this.options.orientation ? "offsetWidth" : "offsetHeight";
		this.mutableProperties()
		this.go()
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
		var position = this.slides[this.current]['center'];
		cssTransform(this.holder, position, 0)
	}
}

class Item {
	constructor(element, sl, sum) {
		this.el = element;
		this.size = this.el[sl.measure];
		this.sum = sum;
		this.start = -(this.sum - this.size);
		this.center = (this.sum - sl.viewWidth) + ((sl.viewWidth - this.size) / 2);
		this.center = -(this.center);
		this.end = -(this.sum - sl.viewWidth);
	}
}

export default Slider;
