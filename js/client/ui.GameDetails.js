goog.provide('spo.ui.GameDetails');

goog.require('goog.ui.Component');
goog.require('spo.template');
goog.require('spo.ds.Game');

spo.ui.GameDetails = function(odh) {
  goog.base(this, odh);
};
goog.inherits(spo.ui.GameDetails, goog.ui.Component);

goog.scope(function() {
  var proto = spo.ui.GameDetails.prototype;

  proto.createDom = function() {
    this.decorateInternal(goog.dom.htmlToDocumentFragment(
      spo.template.gameSettings({
        description: this.getModel().getProp(spo.ds.Game.Property.DESCRIPTION)
      })))
  };

});
