goog.provide('spo.ui.GameDetails');

goog.require('goog.ui.Component');
goog.require('spo.ds.Game');
goog.require('spo.template');

/**
 * @constructor
 * @extends {goog.ui.Component}
 * @param {goog.dom.DomHelper=} odh Optional dom helper.
 */
spo.ui.GameDetails = function(odh) {
  goog.base(this, odh);
};
goog.inherits(spo.ui.GameDetails, goog.ui.Component);

goog.scope(function() {
  var proto = spo.ui.GameDetails.prototype;
  /**
   * @inheritDoc
   */
  proto.createDom = function() {
    this.decorateInternal(
      /** @type {Element} */ (goog.dom.htmlToDocumentFragment(
      spo.template.gameSettings({
        description: this.getModel().getProp(spo.ds.Game.Property.DESCRIPTION)
      }))));
  };

});
