init: function() {
    this.bind();
},

bind: function() {
    this.el.addEventListener(events.start, utils.proxy(this.start, this));
    this.el.addEventListener(events.move, utils.proxy(this.move, this));
    this.el.addEventListener(events.end, utils.proxy(this.end, this));
},

start: function(e) {
    this.active = true;
    console.log("start");
},

move: function(e) {
    if (this.active) {
        console.log("move");
    }
},

end: function(e) {
    this.active = false;
    console.log("end");
}
