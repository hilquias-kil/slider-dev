export default function clientAxis(event) {
	return {
		x: event.clientX || event.touches[0].pageX,
		y: event.clientY || event.touches[0].pageY
	}
}