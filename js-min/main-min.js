define("slider", [],function(){

  function Slider(element) {

  /*  this.el = element;
    this.active = false;
    this.contentEl = this.el.children[0];

    this.viewWidth = this.el.offsetWidth;
    this.viewHeight = this.el.offsetHeight;

    this.contentWidth = this.el.scrollWidth;
    this.contentHeight = this.el.scrollHeight;

    this.contentX = this.contentEl.offsetLeft;
    this.contentY = this.contentEl.offsetTop;*/
  }


  return Slider;
});

define("slider-drag", [],function(){

  function Drag(element) {

    this.el = element;
    this.active = false;
    this.contentEl = this.el.children[0];

    this.viewWidth = this.el.offsetWidth;
    this.viewHeight = this.el.offsetHeight;

    this.contentWidth = this.el.scrollWidth;
    this.contentHeight = this.el.scrollHeight;

    this.contentX = this.contentEl.offsetLeft;
    this.contentY = this.contentEl.offsetTop;

    this.init();
  }

  Drag.prototype.init = function(){
    this.addEvents();
  };

  Drag.prototype.addEvents = function(){

    this.el.addEventListener("mousedown",this);
    this.el.addEventListener("mousemove",this);
    this.el.addEventListener("mouseup",this);
  };

  // Method special handleEvent

  Drag.prototype.handleEvent = function(event){

    switch(event.type) {
      case "mousedown":
        this.start(event);
        break;
      case "mousemove":
        this.move(event);
        break;
      case "mouseup":
        this.end();
        break;
    }
  };

  Drag.prototype.start = function(event){

    this.active = true;

    this.deltaX = event.clientX - this.contentX;
    this.deltaY = event.clientY - this.contentY;
  };

  Drag.prototype.move = function(event){
    if(this.active){

      this.contentX = event.clientX - this.deltaX;
      this.contentY = event.clientY - this.deltaY;

    //  child.style.transform = "translateX("+ contentX +"px) translateY("+ contentY +"px) translateZ(0px)";

      this.contentEl.style.transform = "translate3d("+ this.contentX +"px, "+ this.contentY +"px, 0)";
    }
  };

  Drag.prototype.end = function(){
    this.active = false;
  };

  return Drag;
});

requirejs([
  "slider",
  "slider-drag"
],function(sliderDrag){


  var box = document.querySelector(".box");

  sliderDrag.prototype.teste = function(){
    console.log(this.el);
  };

  var slider = new sliderDrag(box);

  slider.teste();
});

define("slider-main", function(){});

