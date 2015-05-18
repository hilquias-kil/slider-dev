requirejs([
  "slider"
  "slider-drag"
],function(sliderDrag){


  var box = document.querySelector(".box");

  sliderDrag.prototype.teste = function(){
    console.log(this.el)
  }

  var slider = new sliderDrag(box);

  slider.teste();
})
