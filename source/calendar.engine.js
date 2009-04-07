/*!
 * JavaScript Calendar Engine
 * Copyright 2009, Marc Grabanski (m@marcgrabanski.com) http://marcgrabanski.com
 * Released under the MIT License
 * Co-Author: Mahdi Yousefi (mahdi@tini.ir)
 */

(function(){ // hide what's inside

var fixGetTime = function(date) {
	if (date == undefined) return null;
    var oldOffset = date.getTime();
    var firstYear = new Date();
    firstYear.setFullYear(1, 0, 1);
    firstYear.setHours(0, 0, 0, 0);
    var newOffset = firstYear.getTime();
    return (oldOffset + (Math.abs(newOffset)));
};
	
/*--------------  default (Gregorian) calendar object ---------------------*/
var CalendarObject = function(){
	return {
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
		    ldays: ["Sunday", "Monday", "Thuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		    sdays: ["Sun", "Mon", "Thu", "Wed", "Thur", "Fri", "Sat"],
		    years: ["مار", "اسب", "گوسفند", "میمون", "مرغ", "سگ", "خوک", "موش", "گاو", "پلنگ", "خرگوش", "نهنگ"],
		    dll: ["A.M", "P.M"],
		    dls: ["am", "pm"]
		},
		toDateTime: function(year, month, day, hour, min, sec, mili) {
		    var date = new Date(year, (month - 1), day, (hour || 0), (min || 0), (sec || 0), (mili || 0));
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
};

var CalendarEngine = function(){
	var Calendars = {
		default: new CalendarObject(),
		Gregorion: this.default
	};
	this.addCalendar = function(type, object){
		Calendars[type] = object;
	};
	this.extendCalendar = function(type, object){
		var newCalendar = {};
		for ( var p in Calendars.default)
			newCalendar[p] = Calendars.default[p];
		for ( var p in object)
			newCalendar[p] = object[p];
		Calendars[type] = newCalendar;
	};
	this.fixGetTime = fixGetTime; // expose fixGetTime function
	this.getCalendar = function(type) {
		return type ? Calendars[type] : Calendars.default;
	};
}; // calendar constructor

window.CalendarEngine = new CalendarEngine();

})(); // end anonymous function