goog.provide('spo.ui.GameHeader');
goog.require('spo.ui.Header');
goog.require('goog.ui.CustomButton');
goog.require('spo.ui.ButtonRenderer');
goog.require('goog.dom.classes');
/**
 * @constructor
 * @extends {spo.ui.Header}
 */
spo.ui.GameHeader = function() {
  goog.base(this);
  this.newButton = new goog.ui.CustomButton('', spo.ui.ButtonRenderer.getInstance());

};
goog.inherits(spo.ui.GameHeader, spo.ui.Header);

goog.scope(function() {
  var p = spo.ui.GameHeader.prototype;
  /** @inheritDoc */
  p.decorateInternal = function(el) {
    goog.base(this, 'decorateInternal', el);
    this.addChild(this.newButton, true);
    var button = this.newButton.getElement();
    goog.dom.classes.add(button, goog.getCssName('new-button'), goog.getCssName('circle-button'));
  }
})

goog.addSingletonGetter(spo.ui.GameHeader);

