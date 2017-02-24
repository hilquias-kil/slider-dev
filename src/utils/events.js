let is_touch_device = ('ontouchstart' in window);
let events = {
	start : is_touch_device ? 'touchstart' : 'mousedown',
	move : is_touch_device ? 'touchmove' : 'mousemove',
	end : is_touch_device ? 'touchend' : 'mouseup',
	resize : 'resize'
}

export default events;