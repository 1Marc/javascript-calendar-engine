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
		vars: { year: 0, month: 0, day: 0, hour: 0, minute: 0, second: 0, cal: "" },
		setDate: function(date) {
		    this.vars.year = this.vars.cal.getYear(date);
		    this.vars.month = this.vars.cal.getMonth(date);
		    this.vars.day = this.vars.cal.getDayOfMonth(date);
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
		isLeapYear: function() { return this.vars.cal.isLeapYear(this.getYear()); },
		getTwoDigitYear: function() {
		    var iYear = this.getYear();
		    iYear = iYear + "";
		    return iYear.substring((iYear.length - 2), iYear.length);
		},
		getDay: function() { return this.vars.cal.getDayOfWeek(this.date); },
		getDayName: function(LongFormat) {
		    var index = this.getDay();
		    return (LongFormat) ? this.vars.cal.strings.ldays[index] : this.vars.cal.strings.sdays[index];
		},
		getYearName: function() {
		    return this.vars.cal.strings.years[(this.getYear() % 12)];
		},
		getMonthName: function(LongFormat) {
		    var index = this.getMonth() - 1;
		    return (LongFormat) ? this.vars.cal.strings.lmonth[index] : this.vars.cal.strings.smonth[index];
		},
		getMonthLength: function() {
		    return this.vars.cal.getDaysInMonth(this.getYear(), this.getMonth());
		},
		getTime: function() {
		    return this.vars.cal.getTicks(this.getYear(), this.getMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds(), 0);
		},
		valueOf: function() { return this.getTime(); },
		getDayOfYear: function() { return this.vars.cal.getDayOfYear(this.date); },
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
		    this.validate();
		    var date = this.vars.cal.toDateTime(args.y, args.m, args.d, this.getHours(), this.getMinutes(), this.getSeconds(), 0);
		    this.setDate(date);
		},
		calendar: function() { return this.vars.cal; },
		changeCalendar: function(type) {
		    this.vars.cal = CalendarEngine.getCalendar(type);
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
	            return (longf) ? this.vars.cal.strings.dll[0] : this.vars.cal.strings.dls[0];
	        } else {
	            return (longf) ? this.vars.cal.strings.dll[1] : this.vars.cal.strings.dls[1];
	        };
	    },
		hour12: function() {
	        if (this.vars.hour == 0) {
	            return 12;
	        };
	        if (this.vars.hour > 12) {
	            return DE.vars.hour - 12;
	        } else {
	            return DE.vars.hour;
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

var DateEngine = function(year, month, day, hour, min, sec, calendar){ // date constructor
	var dt = new Date();
	var cal = calendar ? CalendarEngine.getCalendar(calendar) : CalendarEngine.getCalendar();
	var o = new DateObject();
	o.date = dt;
	o.vars = {
		year: year || cal.getYear(dt),
		month: month || cal.getMonth(dt),
		day: day || cal.getDayOfMonth(dt),
		hour: hour || dt.getHours(),
		minute: min || dt.getMinutes(),
		second: sec || dt.getSeconds(),
		cal: cal || Calendars.default
	}
    o.datetime = o.vars.cal.toDateTime(o.vars.year, o.vars.month, o.vars.day, o.vars.hour, o.vars.minute, o.vars.second, 0);
    o.f = ['y{4}', 'y{3}', 'y{2}', 'M{4}', 'M{3}', 'M{2}', 'M{1}', 'd{4}', 'd{2}', 'd{1}', 'H{2}', 'H{1}', 'h{2}', 'h{1}', 'm{2}', 'm{1}', 's{2}', 's{1}', 'g{2}'];
	return o;
};

window.DateEngine = DateEngine;

})(); // end anonymous function