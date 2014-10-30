/*
	Author Daily Raisin LLC
	Copyright October 2012
*/
(function(){

	//Note: something like this might be in place before I use the slider, I want to cognizant of that
	//There is a test for this!
	//document.onmousemove = function(e) {
	//	console.log(e.clientX);
	//}

	el = document.getElementById('sliderOne');
	basicSlider(el);

	el2 = document.getElementById('sliderTwo');
	basicSlider(el2);

	el3 = document.getElementById('sliderThree');
	basicSlider(el3);
})();
