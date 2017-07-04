export default function validateElement(el) {
	if (typeof el === "string") {
		return document.querySelector(el);
	} else if (el.length) {
		return el[0];
	}
	return el;
}
