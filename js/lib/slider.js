define("slider", function(){

  function Slider(element) {

    this.el = element;
    this.active = false,
    this.contentEl = this.el.children[0],

    this.viewWidth = this.el.offsetWidth,
    this.viewHeight = this.el.offsetHeight,

    this.contentWidth = this.el.scrollWidth,
    this.contentHeight = this.el.scrollHeight,

    this.contentX = this.contentEl.offsetLeft,
    this.contentY = this.contentEl.offsetTop,

    this.deltaX,
    this.deltaY;
  }


  return Slider;
});
