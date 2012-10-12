/**
 * @fileoverview  Provides the namespaces mathcing the source html to build
 * the page.
 */

goog.provide('setpass');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.ui.Component');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.CustomButton');
goog.require('goog.ui.LabelInput');
goog.require('pstj.ui.CoupledInput');
goog.require('spo.ui.ButtonRenderer');
goog.require('spo.widget.SystemClock');

/**
 * Namespace that hosts the init of the setpass page
 * @return {void} This function returns nothing. It IIP.
 */
setpass = function() {
  // Setup clock
  var clock = new spo.widget.SystemClock();
  var dt = goog.dom.getElementByClass(goog.getCssName('date-time'));
  if (goog.dom.isElement(dt)) {
    clock.decorate(dt);
  }

  var i1 = goog.dom.getElement('pass');
  var i2 = goog.dom.getElement('cpass');
  var button = goog.dom.getElementByClass('form-button');

  var submitButton = new goog.ui.CustomButton('',
    spo.ui.ButtonRenderer.getInstance());
  submitButton.decorate(button);
  goog.events.listen(submitButton, goog.ui.Component.EventType.ACTION,
    function(e) {
      e.stopPropagation();
      e.preventDefault();
      var form = goog.dom.getElementsByTagNameAndClass(
        goog.dom.TagName.FORM)[0];
      if (form) form.submit();
    });

  new pstj.ui.CoupledInput((/** @type {!Element} */ i1),
    (/** @type {!Element} */ i2));

};


/**
 * Auto instanciate the logic.
 */
window.onload = setpass;
