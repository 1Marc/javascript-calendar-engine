/*!
 * JavaScript Calendar Renderer
 * Copyright 2009, Marc Grabanski (m@marcgrabanski.com) http://marcgrabanski.com
 * Released under the MIT License
 * Dependancies: DateEngine, CalendarEngine
 */

(function(){ // hide what's inside

var RenderObject = function(){
	return {
		date: new DateEngine(),
		init: function(){
			this.target.innerHTML = "<p>" + this.date.vars.cal.getDaysInMonth(this.date.getFullYear(), this.date.getMonth()) + "</p>";
			this.target.innerHTML = "<p>" + this.date.vars.cal.getDaysInMonth(this.date.getFullYear(), this.date.getMonth()) + "</p>";
		},
		refresh: function(){
			this.init();
		}
	};
};

var CalendarRender = function(target){
	var renderer = new RenderObject();
	this.setDate = function(o){
		renderer.date = o;
		renderer.refresh();
	}
	renderer.target = target;
	renderer.init();
};

window.CalendarRender = CalendarRender; //expose the CalendarRender object
	
})(); // end anonymous function