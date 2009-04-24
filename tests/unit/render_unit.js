module("Calendar Render");

test("Gregorian date render", function() {
	// render default calendar
	var calendarDiv = document.getElementById('calendar'); // get calendar div
	var calendar = new CalendarRender(calendarDiv); // CalendarRender's target is calendarDiv
});

test("Persian date render", function() {
	// render Persian calendar
	var date = new DateEngine(); // use date engine instead of date object
	date.setCalendar("Persian"); // set date object to use our Persion calendar extension
	var calendarDiv = document.getElementById('calendar'); // get calendar div
	var calendar = new CalendarRender(calendarDiv); // CalendarRender's target is calendarDiv
	calendar.setDate(date); // use our DateEngine object
});