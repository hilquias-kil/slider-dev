let transformProperty;

export default function cssTransform(el, x, y){
  let translate = `translate(${x}px, ${y}px)`;

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