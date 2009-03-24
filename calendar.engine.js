/*!
 * JavaScript Calendar Engine
 * Copyright 2009, Marc Grabanski (m@marcgrabanski.com) http://marcgrabanski.com
 * Released under the MIT License
 * Co-Author: Mahdi Yousefi (mahdi@tini.ir)
 */

(function(){ // hide what's inside
	
// Calendars Object holds different types of calendars
var Calendars = {
/*--------------  default (Gregorian) definition ---------------------*/
	default: {
		info: { "name": "Gregorian", "version": "1.0" },
	    m365: [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365],
	    m366: [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366],
	    GetDatePart: function(ticks, part) {
	        var num1 = parseInt((ticks / 86400000));
	        var num2 = parseInt(num1 / 146097);
	        num1 = (num1 - (num2 * 146097));
	        var num3 = parseInt(num1 / 36524);
	        if (num3 == 4) {
	            num3 = 3
	        };
	        num1 = (num1 - (num3 * 36524));
	        var num4 = parseInt(num1 / 1461);
	        num1 = (num1 - (num4 * 1461));
	        var num5 = parseInt(num1 / 365);
	        if (num5 == 4) {
	            num5 = 3;
	        };
	        if (part == 0) {
	            return (((((num2 * 400) + (num3 * 100)) + (num4 * 4)) + num5) + 1);
	        };
	        num1 = (num1 - (num5 * 365));
	        if (part == 1) {
	            return (num1 + 1);
	        };
	        var numArray1 = (this.isLeapYear()) ? this.m366 : this.m365;
	        var num6 = parseInt(num1 >> 6);
	        while (num1 >= numArray1[num6]) {
	            num6 += 1;
	        };
	        if (part == 2) {
	            return num6
	        };
	        return ((num1 - numArray1[(num6 - 1)]) + 1);
	    },
		GetAbsoluteDate: function(year, month, day) {
	        if (((year >= 1) || (year <= 9999)) || ((month >= 1) || (month <= 12))) {
	            var numArray1 = (this.isLeapYear(year)) ? this.m366 : this.m365;
	            if ((day >= 1) && (day <= (numArray1[month] - numArray1[(month - 1)]))) {
	                var num1 = parseInt(year - 1);
	                var num2 = parseInt(((((((num1 * 365) + (num1 / 4)) - (num1 / 100)) + (num1 / 400)) + numArray1[(month - 1)]) + day) - 1);
	                return parseFloat(num2);
	            };
	        };
	    },
		DateToTicks: function(year, month, day) {
	        return (this.GetAbsoluteDate(year, month, day) * 864000000000)
	    },
		check_y: function(year) {
		    return (year >= 1) && (year <= 9999);
		},
		check_y_m: function(year, month) {
		    return (this.check_y(year) && (month >= 1) && (month <= 12));
		},
		check_y_m_d: function(year, month, day) {
		    var valid = this.check_y_m(year, month);
		    if (valid) {
		        var days = this.getDaysInMonth(year, month);
		        valid = ((day >= 1) && (day <= days));
		    };
		    return valid;
		},
		strings: {
		    lmonth: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		    smonth: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		    ldays: ["Sunday", "Monday", "Thuesday", "Wednesday", "Thursday", "Friyday", "Saturday"],
		    sdays: ["Sun", "Mon", "Thu", "Wed", "Thur", "Fri", "Sat"],
		    years: ["مار", "اسب", "گوسفند", "میمون", "مرغ", "سگ", "خوک", "موش", "گاو", "پلنگ", "خرگوش", "نهنگ"],
		    dll: ["A.M", "P.M"],
		    dls: ["am", "pm"]
		},
		toDateTime: function(year, month, day, hour, min, sec, mili) {
		    var date = new Date(year, (month - 1), day, hour, min, sec, mili);
		    return date;
		},
		isLeapYear: function(year) {
		    if ((year % 4) != 0) {
		        return false;
		    };
		    if ((year % 100) == 0) {
		        return ((year % 400) == 0);
		    };
		    return true;
		},
		isLeapMonth: function(year, month) {
		    return false;
		},
		isLeapDay: function(year, month, day) {
		    if (this.isLeapYear(year) && ((month == 2) && (day == 29))) {
		        return true;
		    };
		    return false;
		},
		getYear: function(datetime) {
		    return this.GetDatePart(fixGetTime(datetime), 0);
		},
		getMonthsInYear: function(year) {
		    return 12;
		},
		getMonth: function(datetime) {
		    return this.GetDatePart(fixGetTime(datetime), 2);
		},
		getDaysInYear: function(year) {
		    if (this.isLeapYear(year))
		        return 366;
		    else
		        return 365;
		},
		getDaysInMonth: function(year, month) {
		    var numArray1 = (this.isLeapYear(year)) ? this.m366 : this.m365;
		    return (numArray1[month] - numArray1[(month - 1)]);
		},
		getDayOfYear: function(datetime) {
		    return this.GetDatePart(fixGetTime(datetime), 1);
		},
		getDayOfWeek: function(datetime) {
		    return ((parseInt(fixGetTime(datetime) / 86400000) + 1) % 7);
		},
		getDayOfMonth: function(datetime) {
		    return this.GetDatePart(fixGetTime(datetime), 3);
		},
		getTicks: function(year, month, day, hour, min, sec, mili) {
		    var rMe = this.toDateTime(year, month, day, hour, min, sec, mili);
		    return rMe.getTime();
		},
		addMonths: function(datetime, months) {
		    if ((months < -120000) || (months > 120000)) {
		        alert("Invalid Month"); return null;
		    };
		    var num1 = parseInt(this.GetDatePart(fixGetTime(datetime), 0));
		    var num2 = parseInt(this.GetDatePart(fixGetTime(datetime), 2));
		    var num3 = parseInt(this.GetDatePart(fixGetTime(datetime), 3));
		    var num4 = parseInt(((num2 - 1) + months));
		    if (num4 >= 0) {
		        num2 = ((num4 % 12) + 1);
		        num1 = (num1 + (num4 / 12));
		    } else {
		        num2 = (12 + ((num4 + 1) % 12));
		        num1 = (num1 + ((num4 - 11) / 12));
		    };
		    var numArray1 = (this.isLeapYear(num1)) ? this.m366 : this.m365;
		    var num5 = parseInt(numArray1[num2] - numArray1[(num2 - 1)]);
		    if (num3 > num5) {
		        num3 = num5;
		    };
		    var num6 = parseFloat(this.DateToTicks(num1, num2, num3) + (fixGetTime(datetime) % 86400000));
		    var rValue = new Date();
		    rValue.setTime(num6);
		    return rValue;
		},
		addYears: function(datetime, year) {
		    return this.addMonths(datetime, (years * 12));
		}
	}
/*----------------------- End default (Gregorion) functions ---------------- */
};

Calendars.Gregorion = Calendars.default; // set an alias for Gregorion

var CalendarEngine = function(){
	this.Calendars = Calendars;
	this.addCalendar = function(type, object){
		this.Calendars[type] = object;
	};
	this.extendCalendar = function(type, object){
		var newCalendar = {};
		for ( var p in Calendars.default)
			newCalendar[p] = Calendars.default[p];
		for ( var p in object)
			newCalendar[p] = object[p];
		this.Calendars[type] = newCalendar;
	};
}; // calendar constructor

window.CalendarEngine = new CalendarEngine();

/*---------------  Calendar Engine Date Object  -------------------------- */
var date = {
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
	    this.vars.cal = Calendars[type];
		this.setDate(this.date)
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
    }
};

var DateEngine = function(year, month, day, hour, min, sec, calendar){ // date constructor
	var dt = new Date();
	var cal = calendar ? Calendars[calendar] : Calendars.default;
	var DE = date;
	DE.date = dt;
	DE.vars = {
		year: year || cal.getYear(dt),
		month: month || cal.getMonth(dt),
		day: day || cal.getDayOfMonth(dt),
		hour: hour || dt.getHours(),
		minute: min || dt.getMinutes(),
		second: sec || dt.getSeconds(),
		cal: cal || Calendars.default
	}
    DE.datetime = DE.vars.cal.toDateTime(DE.vars.year, DE.vars.month, DE.vars.day, DE.vars.hour, DE.vars.minute, DE.vars.second, 0);
    DE.f = ['y{4}', 'y{3}', 'y{2}', 'M{4}', 'M{3}', 'M{2}', 'M{1}', 'd{4}', 'd{2}', 'd{1}', 'H{2}', 'H{1}', 'h{2}', 'h{1}', 'm{2}', 'm{1}', 's{2}', 's{1}', 'g{2}'];
	return DE;
};

window.DateEngine = DateEngine;

})(); // end anonymous function

/* Global */

// Fix Gettime, It will getTime from 1/1/1 00:00:00 From gregorian date:
// Default getTime will return from 1970/1/1 00:00:00
function fixGetTime(date) {
	if (date == undefined) return null;
    var oldOffset = date.getTime();
    var firstYear = new Date();
    firstYear.setFullYear(1, 0, 1);
    firstYear.setHours(0, 0, 0, 0);
    var newOffset = firstYear.getTime();
    return (oldOffset + (Math.abs(newOffset)));
};