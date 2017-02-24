import cssTransform from "./utils/css-transform"
import clientAxis from "./utils/client-axis"
import events from "./utils/events"

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
		this.mutableProperties()
	}

	mutableProperties() {
		this.slides = _map.call(this.holder.children, (i) => {
			return new Item(i, this.options.orientation)
		});
		console.log(this.slides)
		this.slidesSize = this.slides.length;

		this.viewWidth = this.el.offsetWidth;
		this.viewHeight = this.el.offsetHeight;

		this.contentWidth = this.holder.scrollWidth;
		this.contentHeight = this.holder.scrollHeight;
	}

	setCurrent(number) {
		this.current = number;
	}
}

class Item {
	constructor(element, orientation, sum) {
		this.el = element;
		this.measure = orientation ? "offsetWidth" : "offsetHeight";
		this.size = this.el[this.measure];
		this.sum = sum;
	}
}

function validateElement(el) {
	if (typeof el === "string") {
		return document.querySelector(el);
	} else if (el.length) {
		return el[0];
	}
	return el;
}

export default Slider;