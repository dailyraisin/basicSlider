/*
	Author Daily Raisin LLC
	Copyright October 2012
*/

(function (window, document) {
	'use strict';
	window.basicSlider = window.basicSlider || function (el) {
		var getStyle = function (el, property) {
			if (window.getComputedStyle) {
				return window.getComputedStyle(el).getPropertyValue(property);
			}
			else { // IE 7, maybe others
				var re = /(\-([a-z]){1})/g;
				//if (property === 'float') { //unused here because we're only getting width and border-style-width
				//	property = 'styleFloat';
				//}
				if (re.test(property)) {
					property = property.replace(re, function () {
						return arguments[2].toUpperCase();
					});
				}
				return el.currentStyle[property] ? el.currentStyle[property] : null;
			}
		};

		//http://www.quirksmode.org/js/events_properties.html#position
		var correctXY = function (e) {
			e = e || window.event;
			var posx = 0;
			var posy = 0;
			if (e.pageX || e.pageY) { // FF, safari, chrome
				posx = e.pageX;
				posy = e.pageY;
			}
			else if (e.clientX || e.clientY) { //IE 7 and maybe some others
				posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
				posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
			}
			e.posx = posx;
			e.posy = posy;
		};

		var init = function () {
			//the ruler behind it that visually shows max bounds
			var rule = document.createElement('div');
			//rule.setAttribute('class', 'rule'); //IE7 bug where these divs have no style associated with them even though the class is set, must use .className =
			rule.className = 'rule';
			el.appendChild(rule);

			//the position area
			var position = document.createElement('div');
			position.className = 'position';
			position.innerHTML = '0%';
			el.appendChild(position);

			//the handle to click on and drag
			var handle = document.createElement('div');
			handle.className = 'handle';
			handle.onmousedown = (function () {

				//this is an example of a closure where I want access to the parent element and a peer element of the handle when the onmousedown event takes place

				/* without this closure, I would have had to use

					var handle = this;
					var el = handle.parentNode;

					which is relatively simple, but finding the positionDiv would have taken much more code
				*/
				var positionDiv = el.lastChild; //because I just added the <div class="position"> I can access it via the lastChild

				return function (event) {
					event = event || window.event;

					var oldMouseMoveFunction = document.onmousemove;

					document.onmousemove = function (event) {
						event = event || window.event;

						correctXY(event);

						var maxRight = parseInt(getStyle(el, 'width').replace(/px$/, ''), 10);
						var handleBorderWidth = parseInt(getStyle(handle, 'border-left-width').replace(/px$/, ''), 10) + parseInt(getStyle(handle, 'border-right-width').replace(/px$/, ''), 10); //account for handle's CSS border in its width
						var handleWidth = parseInt(getStyle(handle, 'width').replace(/px$/, ''), 10) + handleBorderWidth;
						var effectiveX = event.posx - Math.round(handleWidth / 2) - el.offsetLeft;

						if (effectiveX < 0) {
							effectiveX = 0; //snap to the left most bound
						}
						else if (effectiveX > (maxRight - handleWidth)) {
							effectiveX = maxRight - handleWidth; //right most bound for handle
						}

						if (!isNaN(effectiveX)) {
							handle.style.left = effectiveX + 'px';
							//handle.setAttribute('style', "left:" + effectiveX + "px"); //alternate way of setting style
						}

						positionDiv.innerHTML = Math.round((effectiveX / (maxRight - handleWidth)) * 100) + '%, left = ' + effectiveX + ', right = ' + (effectiveX + handleWidth) + ', max px = ' + maxRight;
					};

					document.onmouseup = handle.onmouseup = function () {
						document.onmousemove = oldMouseMoveFunction; //don't get greedy and wipe it out!  replace it like a nice guy
					};
				};
			})();


			document.onselectstart = function () { return false; }; //so the dragging doesn't select text and the like
			handle.ondragstart = function () { return false; }; //prevents some browsers' abilities to use the drag event, not universal, so we'll use this one for simplicity
			el.appendChild(handle);
		};

		init();
	};

}(window, document));
