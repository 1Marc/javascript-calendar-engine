/*!
 * JavaScript Date Engine
 * Copyright 2009, Marc Grabanski (m@marcgrabanski.com) http://marcgrabanski.com
 * Released under the MIT License
 * Co-Author: Mahdi Yousefi (mahdi@tini.ir)
 * Dependancies: CalendarEngine
 */

(function(){ // hide what's inside

/*---------------  Calendar Engine Date Object  -------------------------- */
var DateObject = function(){
	return {
		date: new Date(),
		vars: { year: 0, month: 0, day: 0, hour: 0, minute: 0, second: 0, cal: "default" },
		setDate: function(date) {
		    this.vars.year = this.calendar().getYear(date);
		    this.vars.month = this.calendar().getMonth(date);
		    this.vars.day = this.calendar().getDayOfMonth(date);
		    this.vars.hour = date.getHours();
		    this.vars.minute = date.getMinutes();
		    this.vars.second = date.getSeconds();
		    this.date = date;
		},
		getYear: function() { return this.vars.year; },
		getMonth: function() { return this.vars.month; },
		getDate: function() { return this.vars.day; },
	 	getHours: function() { return this.vars.hour; },
		getMinutes: function() { return this.vars.minute; },
		getSeconds: function() { return this.vars.second; },
		getFullYear: function() { return this.getYear(); },
		isLeapYear: function() { return this.calendar().isLeapYear(this.getYear()); },
		getTwoDigitYear: function() {
		    var iYear = this.getYear();
		    iYear = iYear + "";
		    return iYear.substring((iYear.length - 2), iYear.length);
		},
		getDay: function() { return this.calendar().getDayOfWeek(this.date); },
		getDayName: function(LongFormat) {
		    var index = this.getDay();
		    return (LongFormat) ? this.calendar().strings.ldays[index] : this.calendar().strings.sdays[index];
		},
		getYearName: function() {
		    return this.calendar().strings.years[(this.getYear() % 12)];
		},
		getMonthName: function(LongFormat) {
		    var index = this.getMonth() - 1;
		    return (LongFormat) ? this.calendar().strings.lmonth[index] : this.calendar().strings.smonth[index];
		},
		getMonthLength: function() {
		    return this.calendar().getDaysInMonth(this.getYear(), this.getMonth());
		},
		getTime: function() {
		    return this.calendar().getTicks(this.getYear(), this.getMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds(), 0);
		},
		valueOf: function() { return this.getTime(); },
		getDayOfYear: function() { return this.calendar().getDayOfYear(this.date); },
		toString: function(format) {
		    if (format) {
		        var strValues = [
				this.getYear(), this.getYearName(), this.getTwoDigitYear(),
				this.getMonthName(true), this.getMonthName(false), this.twodigit(this.getMonth()), this.getMonth(),
				this.getDayName(true), this.twodigit(this.getDate()), this.getDate(),
				this.twodigit(this.getHours()), this.getHours(), this.twodigit(this.hour12()), this.hour12(),
				this.twodigit(this.getMinutes()), this.getMinutes(),
				this.twodigit(this.getSeconds()), this.getSeconds(),
				this.daylight()
				];
		        var re = new RegExp();
		        var returnMe = new String();
		        returnMe = format;
		        for (i = 0; i < this.f.length; i++) {
		            re.compile("%" + this.f[i], 'g');
		            returnMe = returnMe.replace(re, strValues[i]);
		        };
		        return returnMe;
		    } else {
		        return (this.getDayName(true) + ' ' + this.getDate() + ' ' + this.getMonthName(true) + ' ' + this.getYear());
		    };
		},
		setFullYear: function(year, month, day) {
		    var args = {
		        y: year || this.vars.year,
		        m: month || this.vars.month,
		        d: day || this.vars.day
		    };
		    var date = this.calendar().toDateTime(args.y, args.m, args.d, this.getHours(), this.getMinutes(), this.getSeconds(), 0);
		    this.setDate(date);
		},
		adjustDate: function(period, offset){
			switch(period){
				case 'Y': 
					this.setFullYear(this.getFullYear()+offset); break;
				case 'M':
					this.setFullYear(this.getFullYear(), this.getMonth()+offset); break;
				case 'D':
					this.setFullYear(this.getFullYear(), this.getMonth(), this.getDate()+offset); break;
			}
		},
		calendar: function() { return CalendarEngine.getCalendar(this.vars.cal); },
		setCalendar: function(type) {
			this.vars.cal = type;
			this.setDate(this.date);
		},
		twodigit: function(iNumber) {
	        if (iNumber.toString().length < 2) {
	            return '0' + iNumber.toString();
	        } else {
	            return iNumber.toString();
	        };
	    },
		daylight: function(longf) {
	        if (this.vars.hour < 12) {
	            return (longf) ? this.calendar().strings.dll[0] : this.calendar().strings.dls[0];
	        } else {
	            return (longf) ? this.calendar().strings.dll[1] : this.calendar().strings.dls[1];
	        };
	    },
		hour12: function() {
	        if (this.vars.hour == 0) {
	            return 12;
	        };
	        if (this.vars.hour > 12) {
	            return this.vars.hour - 12;
	        } else {
	            return this.vars.hour;
	        };
	    },
		checkTime: function(part, mode) {
	        switch (mode) {
	            case 'h':
	                return (part >= 0 && part <= 23);
	                break;
	            case 'ms':
	                return (part >= 0 && part <= 59);
	                break;
	        };
	    } // end methods
	} // end date object
};

var DateEngine = function(year, month, day, hour, min, sec, calendarType){ // date constructor
	var type = calendarType ? calendarType : "default";
	var cal = CalendarEngine.getCalendar(type);
	var o = new DateObject();
	o.vars = {
		year: year || cal.getYear(o.date),
		month: month || cal.getMonth(o.date),
		day: day || cal.getDayOfMonth(o.date),
		hour: hour || o.date.getHours(),
		minute: min || o.date.getMinutes(),
		second: sec || o.date.getSeconds(),
		cal: type
	}
    o.datetime = cal.toDateTime(o.vars.year, o.vars.month, o.vars.day, o.vars.hour, o.vars.minute, o.vars.second, 0);
    o.f = ['y{4}', 'y{3}', 'y{2}', 'M{4}', 'M{3}', 'M{2}', 'M{1}', 'd{4}', 'd{2}', 'd{1}', 'H{2}', 'H{1}', 'h{2}', 'h{1}', 'm{2}', 'm{1}', 's{2}', 's{1}', 'g{2}'];
	return o;
};

window.DateEngine = DateEngine;

})(); // end anonymous function