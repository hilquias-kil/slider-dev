// Objects

function GetSwipeData(){
	var timeStart = 0,
		timeEnd = 0;

	this.startPosition = 0;
	this.endPosition = 0;

	this.setTimeStart = function () {
		timeStart = Date.now();
	};
	this.setTimeEnd = function () {
		timeEnd = Date.now();
	};
	this.getSwipeTime = function () {
		return timeEnd - timeStart;
	};
	this.getPath = function () {
		return Math.abs(this.startPosition - this.endPosition);
	};
	this.getSwipeDirection = function () {
		//console.log('start: ' + this.startPosition, 'end: ' + this.endPosition);
		if(this.startPosition > this.endPosition){
			return "next";
		} else if(this.startPosition < this.endPosition) {
			return "prev";
		} else {
			return false;
		}
	};
}
