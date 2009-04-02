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
			var self = this;
			// testing adjustDate function
			this.target.onclick = function(e){
				self.date.adjustDate('M', +2);
				self.refresh();
			}
			this.draw();
		},
		refresh: function(){
			this.draw();
		},
		draw: function(){
			// testing stuff
			var daysInMonth = this.date.vars.cal.getDaysInMonth(this.date.getFullYear(), this.date.getMonth());
			var monthName = this.date.getMonthName();
			var year = this.date.getFullYear();1
			this.target.innerHTML = "<p>" + monthName + ", " + daysInMonth + ", " + year + "</p>";
		}
	};
};

var CalendarRender = function(target){
	this.renderer = new RenderObject();
	this.setDate = function(o){
		this.renderer.date = o;
		this.renderer.refresh();
	}
	this.renderer.target = target;
	this.renderer.init();
};

window.CalendarRender = CalendarRender; //expose the CalendarRender object
	
})(); // end anonymous function