goog.provide('spo.ui.Widget');

goog.require('goog.dom');
goog.require('goog.ui.Component');

/**
 * @constructor
 * @extends {goog.ui.Component}
 */
spo.ui.Widget = function() {
  goog.base(this);
};
goog.inherits(spo.ui.Widget, goog.ui.Component);


/** @inheritDoc */
spo.ui.Widget.prototype.createDom = function() {
  this.decorateInternal(this.getTemplateAsFragment());
};
/**
 * Returns the template as document fragment.
 *
 * @return {!Element} The document fragment created by the template.
 */
spo.ui.Widget.prototype.getTemplateAsFragment = function() {
  return /** @type {!Element} */ (goog.dom.htmlToDocumentFragment(this.getTemplate()));
};
/**
 * Returns the template for the widget as html string.
 *
 * @return {!string} The generated html string.
 */
spo.ui.Widget.prototype.getTemplate = function() {
  return '<div></div>';
};

