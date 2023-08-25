'use strict';

const defaultOptions = {
    initialSlide: 0,
    orientation: true
};
function Slider(element, config) {
    const holder = element.children[0];
    const options = Object.assign(defaultOptions, config);
    options.initialSlide;
    let measure = options.orientation ? "offsetWidth" : "offsetHeight";
    let initial = 0;
    const slides = Array.prototype.map.call(holder.children, (el) => {
        initial += el[measure];
        return Item(el, initial, measure, options.orientation);
    });
    console.log(slides);
}
function Item(element, initial, measure, orientation) {
    var _a, _b;
    const size = measure === "offsetWidth" ? element.offsetWidth : element.offsetHeight;
    const view = (orientation ? (_a = element.parentElement) === null || _a === void 0 ? void 0 : _a.offsetWidth : (_b = element.parentElement) === null || _b === void 0 ? void 0 : _b.offsetHeight) || 0;
    return {
        element,
        size,
        start: -(initial - size),
        center: -(initial - view) + ((view - size) / 2),
        end: -(initial - view)
    };
}
window.Slider = Slider;
