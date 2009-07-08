/*!
 * JavaScript CalendarEngine Datepicker
 * Copyright 2009, Marc Grabanski (m@marcgrabanski.com) http://marcgrabanski.com
 * Released under the MIT License
 * Dependancies: DateEngine, CalendarEngine
 */

(function(){ // hide what's inside

var DatePickerObject = function(input, render){
	var o = {
		init: function(){
			render.onclick = function(e, render){
			};
			input.onclick = function(){
				console.log('input click fired');
				setPos(input, render.target);
				render.target.style.display = 'block';
			}
			
			window.onclick = (function (e) {
	            var preserve = window.onclick;
	            return function (e) {
	                if (preserve != null && !preserve()) {
	                    return false;
	                }
	                console.log('body click fired');
					var obj = e.target;
					while (obj = obj.parentNode) {
						if (obj.id == 'datepicker-render') return false;
					}
					render.target.style.display = 'none';
	                return true;
	            }
	        })();
		}
	};
	return o.init();
}

var DatePicker = function(target){
	if (!document.getElementById('datepicker-render')) {
		var calendar = document.createElement('div');
		calendar.id = 'datepicker-render';
		calendar.style.display = 'none';
		document.body.appendChild(calendar);
	} else {
		var calendar = document.getElementById('datepicker-render');
	}
	var render = new RenderObject(calendar);
	return new DatePickerObject(target, render);
};

window.DatePicker = DatePicker; //expose the CalendarRender object
	
/* Position Functions */
function setPos(targetObj,moveObj) {
    var coors = findPos(targetObj);
    moveObj.style.position = 'absolute';
    moveObj.style.top = coors[1]+18 + 'px';
    moveObj.style.left = coors[0] + 'px';
}

function findPos(obj) {
    var curleft = curtop = 0;
    if (obj.offsetParent) {
        curleft = obj.offsetLeft
        curtop = obj.offsetTop
        while (obj = obj.offsetParent) {
            curleft += obj.offsetLeft
            curtop += obj.offsetTop
        }
    }
    return [curleft,curtop];
}
	
})(); // end anonymous function