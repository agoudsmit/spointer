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
    var link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', goog.global['DOWNLOAD_SCENARIO_URL'] || '#');
    link.innerHTML = 'Download scenario';
    goog.dom.classes.add(link, 'scenario-link');
    this.getElement().appendChild(link);
  }
})

goog.addSingletonGetter(spo.ui.GameHeader);

