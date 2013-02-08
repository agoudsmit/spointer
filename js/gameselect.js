goog.provide('gameselect');

goog.require('goog.dom');
goog.require('goog.dom.dataset');
goog.require('goog.events');
goog.require('goog.events.EventType');


gameselect = function() {
	function navigateTo(id) {
		window.location.href = goog.global['NAVIGATE_TO'] + id;
	}
	var container = goog.dom.getElementByClass('container');
	goog.events.listen(container, goog.events.EventType.CLICK, function(e) {
		var el = /** @type {Element} */(e.target);
		while (!goog.dom.dataset.has(el, 'game') && el != container) {
			el = el.parentElement;
		}
		if (goog.dom.dataset.has(el, 'game')) {
			navigateTo(goog.dom.dataset.get(el, 'game'));
		}
	});
};

gameselect();
