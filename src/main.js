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
		this.bind()
	}

	mutableProperties() {
		let initial = 0;

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
		transform(this.holder, this.position, this)
	}

	//Drag

	bind(){
		this.el.addEventListener(_events.start, this.start.bind(this))
		this.el.addEventListener(_events.move, this.move.bind(this))
		this.el.addEventListener(_events.end, this.end.bind(this))
	}

	start(event){
		this.dragging = true;
		this.delta = clientAxis(event, this) - this.position;
	}

	move(event){
		if(this.dragging){
			this.position = clientAxis(event, this) - this.delta;
			transform(this.holder, this.position, this)
		}
	}

	end(){
		this.dragging = false;
	}
}

const transform = (el, position, context) => {
	let x = context.options.orientation ? position : 0;
	let y = context.options.orientation ? 0 : position;
	console.log(x,y)
	_cssTransform(el, x, y)
}

const clientAxis = (event, context) => {
	if(context.options.orientation){
		return _clientAxis(event).x;
	}
	return _clientAxis(event).y;
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
