/**
 * @fileoverview Provide custom renderer on top of the simple button
 * renderer. This renderer is used with 'div' tags to make buttons out of
 * them and make them behave like such, i.e. receive focus, receive aria roles
 * and receive outline.
 */

goog.provide('spo.ui.ButtonRenderer');

goog.require('goog.dom.a11y');
goog.require('goog.dom.classes');
goog.require('goog.ui.ButtonRenderer');

/**
 * @constructor
 * @extends {goog.ui.ButtonRenderer}
 */
spo.ui.ButtonRenderer = function() {
  goog.ui.ButtonRenderer.call(this);
};
goog.inherits(spo.ui.ButtonRenderer, goog.ui.ButtonRenderer);
goog.addSingletonGetter(spo.ui.ButtonRenderer);

/**
 * The class name to use when composing custom states for the button.
 * Because the button is actually a DIV element, the states are
 * composed as css class combinations: eg. baseclass-* where * is
 * the state (focused, hovered, active etc).
 * @type {string}
 */
spo.ui.ButtonRenderer.CSS_CLASS = goog.getCssName('form-button');

/**
 * Returns the Aria role of the button.
 * @return {goog.dom.a11y.Role.<string>|undefined} Basic button artia role.
 */
spo.ui.ButtonRenderer.prototype.getAriaRole = function() {
  return goog.dom.a11y.Role.BUTTON;
};

/**
 * Simply forvide this for now, if we need to change content this might
 * change as well
 * @param  {Element} element The element that is assigned to the component
 * i.e. component.getElement().
 * @return {Element} The element to consider as content element, i.e. if we
 * want to put content where should it go.
 */
spo.ui.ButtonRenderer.prototype.getContentElement = function(element) {
  return element;
};

/**
 * Called internally when decorateInternal is called on the button component.
 * @param  {goog.ui.Control} control The custom button component instance
 * to work with.
 * @param  {Element} element The HTML element that we want to make the root of
 * the component.
 * @return {Element} The decorated element. basically the same element.
 */
spo.ui.ButtonRenderer.prototype.decorate = function(control, element) {
  var button = /** @type {goog.ui.Button} */ (control);
  goog.dom.classes.add(element, this.getCssClass());
  return goog.base(this, 'decorate', button, element);
};

/**
 * Returns the basic css class for this component, see CSS_CLASS description.
 * @return {string} The related CSS class.
 */
spo.ui.ButtonRenderer.prototype.getCssClass = function() {
  return spo.ui.ButtonRenderer.CSS_CLASS;
};
