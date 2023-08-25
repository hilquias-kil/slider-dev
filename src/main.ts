interface IConfig {
    initialSlide: number,
    orientation: boolean
}

const defaultOptions = {
    initialSlide: 0,
    orientation: true
}

function Slider(element:HTMLElement, config: IConfig){
    const holder = element.children[0];
    const options = Object.assign(defaultOptions, config);

    let running = false
    let current = options.initialSlide
    let measure = options.orientation ? "offsetWidth" : "offsetHeight";
    let dragging = false;

    let initial = 0;

	const slides = Array.prototype.map.call(holder.children, (el) =>{
       initial += el[measure];
       return Item(el, initial, measure, options.orientation)
    })

    console.log(slides)
}

function Item(element:HTMLElement, initial:number, measure: string, orientation: boolean ) {
    const size = measure === "offsetWidth" ? element.offsetWidth : element.offsetHeight;
    const view = (orientation ? element.parentElement?.offsetWidth : element.parentElement?.offsetHeight) || 0
    return {
        element,
        size,
        start: - (initial - size),
        center: - (initial - view) + ((view - size) / 2),
        end: - (initial - view)
    }
}

window.Slider = Slider