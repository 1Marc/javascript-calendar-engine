module("Calendar Engine");

test("Gregorian year/month tests", function() {
	var months = CalendarEngine.getCalendar("Gregorian").strings.lmonth;
	for (testYear in expectedDates.Gregorian) {
		for (i=1; i<=months.length; i++) {
			var monthName = months[i-1];
			var tests = expectedDates.Gregorian[testYear][monthName];
			
			var d = new DateEngine(testYear, i, 1);
			ok(d.getDayName(true) === tests.firstDay, "pass: " + d.getMonthName(true) + ", " + testYear + " starts on " + tests.firstDay);
			
			var daysInMonth = d.calendar().getDaysInMonth(d.getFullYear(), d.getMonth());
			ok(daysInMonth === tests.daysInMonth, "pass: " + tests.daysInMonth + " days in " + d.getMonthName(true) + ", " + testYear);
		}
	}
});

test("Persian year/month tests", function() {
	var months = CalendarEngine.getCalendar("Persian").strings.lmonth;
	for (testYear in expectedDates.Persian) {
		for (i=1; i<=months.length; i++) {
			var monthName = months[i-1];
			var tests = expectedDates.Persian[testYear][monthName];
			
			var d = new DateEngine(testYear, i, 1);
			ok(d.getDayName(true) === tests.firstDay, "pass: " + d.getMonthName(true) + ", " + testYear + " starts on " + tests.firstDay);
			
			var daysInMonth = d.calendar().getDaysInMonth(d.getFullYear(), d.getMonth());
			ok(daysInMonth === tests.daysInMonth, "pass: " + tests.daysInMonth + " days in " + d.getMonthName(true) + ", " + testYear);
		}
	}
});