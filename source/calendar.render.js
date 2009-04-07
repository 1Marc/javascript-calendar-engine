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
			this.target.onclick = function(e){
				self.date.adjustDate('M', +1);
				self.refresh();
			}
			this.draw();
		},
		refresh: function(){
			this.draw();
		},
		draw: function(){
			var d = this.date;
			var c = d.calendar();
			var h = "";
			
			var daysInMonth = c.getDaysInMonth(d.getFullYear(), d.getMonth());
			var startDay = c.getDayOfWeek( c.toDateTime(d.getFullYear(), d.getMonth(), 1) )+1;
			var totalDays = daysInMonth+startDay;
			var nDays = c.strings.sdays.length;
			var nWeeks = Math.ceil(totalDays / nDays);
			
			var pDay = 1;
			h += "<p>Today: " + d.toString() + "</p>";
			h += "<table>";
			for (var week=0; week<nWeeks; week++) {
				h += "<tr>";
				for (var day=0;day<nDays;day++) {
					if (pDay>startDay && pDay<=totalDays)
						h += "<td>" + (pDay-startDay) + "</td>";
					else 
						h += "<td></td>"
					pDay++;
				}
				h += "</tr>";
			}
			h += "</table>";
			this.target.innerHTML = h;
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