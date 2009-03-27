/*!
 * JavaScript Calendar Engine
 * Copyright 2009, Marc Grabanski (m@marcgrabanski.com) http://marcgrabanski.com
 * Co-Author: Mahdi Yousefi (mahdi@tini.ir)
 */

/*---------------------- Persian Calendar (solar) or (Hijri shamsi) -----------------------*/
CalendarEngine.extendCalendar("Persian", // inherit defaults from Gregorion calendar constructor
{ // extend with new methods and properties
	info: { "name":"Persian", "version":"1.0" },
	strings: {
	    lmonth: ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"],
	    smonth: ["حمل", "ثور", "جوزا", "سرطان", "اسد", "سنبله", "میران", "عقرب", "قوس", "جدی", "دلو", "حوت"],
	    ldays: ["یکشنبه", "دوشنبه", "سه شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"],
	    sdays: ["ی", "د", "س", "چ", "پ", "ج", "ش"],
	    years: ["مار", "اسب", "گوسفند", "میمون", "مرغ", "سگ", "خوک", "موش", "گاو", "پلنگ", "خرگوش", "نهنگ"],
	    dll: ["صبح", "عصر"],
	    dls: ["ق.ظ", "ب.ظ"]
	},
	DaysToMonth: [0, 31, 62, 93, 124, 155, 186, 216, 246, 276, 306, 336],
	leapYears33: [0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
	isLeapYear: function(year) {
	    return (this.leapYears33[(year % 33)] == 1);
	},
	check_y: function(year) {
	    return ((year >= 1) && (year <= 9378));
	},
	check_y_m: function(year, month) {
	    var valid = this.check_y(year);
	    if (valid) {
	        if ((year == 9378) && (month > 10)) {
	            valid = false;
	        };
	        if (valid) {
	            valid = (month >= 1 && month <= 12);
	        };
	    };
	    return valid;
	},
	getDaysInMonth: function(year, month) {
	    if ((month == 10) && (year == 9378)) {
	        return 10;
	    };
	    if (month == 12) {
	        if (!this.isLeapYear(year)) {
	            return 29;
	        }
	        return 30;
	    };
	    if (month <= 6) {
	        return 31;
	    };
	    return 30;
	},
	DaysUpToPersianYear: function(pyear) {
	    var num2 = parseInt((pyear - 1) / 33);
	    var num3 = parseInt((pyear - 1) % 33);
	    var num1 = parseFloat((num2 * 12053) + 226894);
	    while (num3 > 0) {
	        num1 = (num1 + 365);
	        if (this.isLeapYear(num3)) {
	            num1 += 1;
	        };
	        num3 -= 1;
	    };
	    return num1;
	},
	GetAbsoluteDatePersian: function(year, month, day) {
	    return (((this.DaysUpToPersianYear(year) + this.DaysToMonth[(month - 1)]) + day) - 1);
	},
	getDaysInYear: function(year) {
	    if (year == 9378) {
	        return (this.DaysToMonth[9] + 10);
	    };
	    if (!this.isLeapYear(year)) {
	        return 365;
	    };
	    return 366;
	},
	TimeToTicks: function(Hour, Minute, Second, Mili) {
	    return (Mili + (Second * 1000) + (Minute * 60 * 1000) + (Hour * 60 * 60 * 1000));
	},
	ToTime: function(year, month, day, hour, minute, second, millisecond) {
	    var daysInCalendar = this.GetAbsoluteDatePersian(year, month, day);
	    var totalTime = (daysInCalendar * 86400000) + this.TimeToTicks(hour, minute, second, millisecond);
	    return totalTime;
	},
	GetDatePart: function(ticks, part) {
	    var num4 = parseFloat((ticks / 86400000) + 1);
	    var num1 = parseInt(parseInt((((num4 - 226894) * 33) / parseFloat(12053))) + 1);
	    var num5 = parseFloat(this.DaysUpToPersianYear(num1));
	    var num6 = parseFloat(this.getDaysInYear(num1));
	    if (num4 < num5) {
	        num5 = (num5 - num6);
	        num1 -= 1;
	    } else if (num4 == num5) {
	        num1 -= 1;
	        num5 = (num5 - this.getDaysInYear(num1));
	    } else if (num4 > (num5 + num6)) {
	        num5 = (num5 + num6);
	        num1 += 1;
	    };
	    if (part != 0) {
	        num4 = (num4 - num5);
	        if (part != 1) {
	            var num2 = 0;
	            while ((num2 < 12) && (num4 > this.DaysToMonth[num2])) {
	                num2 += 1;
	            };
	            if (part != 2) {
	                var num3 = parseInt(parseInt(num4) - this.DaysToMonth[(num2 - 1)]);
	                return num3;
	            };
	            return num2;
	        };
	        return parseInt(num4);
	    };
	    return num1;
	},
	addMonths: function(DateTime, months) {
	    if ((months < -120000) || (months > 120000)) {
	        alert("Invalid month"); return null;
	    };
	    var num1 = parseInt(this.GetDatePart(CalendarEngine.fixGetTime(datetime), 0));
	    var num2 = parseInt(this.GetDatePart(CalendarEngine.fixGetTime(datetime), 2));
	    var num3 = parseInt(this.GetDatePart(CalendarEngine.fixGetTime(datetime), 3));
	    var num4 = parseInt(((num2 - 1) + months));
	    if (num4 >= 0) {
	        num2 = ((num4 % 12) + 1);
	        num1 = (num1 + (num4 / 12));
	    } else {
	        num2 = (12 + ((num4 + 1) % 12));
	        num1 = (num1 + ((num4 - 11) / 12));
	    }
	    var num5 = parseInt(this.getDaysInMonth(num1, num2));
	    if (num3 > num5) {
	        num3 = num5;
	    }
	    var num6 = parseFloat((this.GetAbsoluteDatePersian(num1, num2, num3) * 86400000) + (CalendarEngine.fixGetTime(datetime) % 86400000));
	    var rValue = new Date();
	    rValue.setTime(num6);
	    return rValue;
	},
	toDateTime: function(year, month, day, hour, minute, second, millisecond) {
	    var returnMe = new Date();
	    var num1 = this.getDaysInMonth(year, month);
	    var num2 = this.GetAbsoluteDatePersian(year, month, day);
	    var totalTicks = (num2 * 86400000) + this.TimeToTicks(hour, minute, second, millisecond);
	    var bTicks = new Date();
	    bTicks.setFullYear(1, 0, 1);
	    bTicks.setHours(0, 0, 0, 0);
	    totalTicks -= Math.abs(bTicks.getTime());
	    returnMe.setTime(totalTicks);
	    return returnMe;
	},
	isLeapMonth: function(year, month) {
	    if (this.isLeapYear(year) && (month == 12)) {
	        return true;
	    };
	    return false;
	},
	isLeapDay: function(year, month, day) {
	    if (this.isLeapYear(year) && (month == 12)) {
	        return (day == 30);
	    };
	    return false;
	},
	getMonthsInYear: function(year) {
	    if (year == 9378) {
	        return 10;
	    };
	    return 12;
	},
	getTicks: function(year, month, day, hour, minute, second, millisecond) {
	    var totalTime = this.ToTime(year, month, day, hour, minute, second, millisecond);
	    var negativeTime = new Date();
	    negativeTime.setFullYear(1, 0, 1);
	    negativeTime.setHours(0, 0, 0, 0);
	    totalTime -= Math.abs(negativeTime.getTime());
	    return totalTime;
	}
});