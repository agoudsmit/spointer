goog.provide('spo.ui.Tags');
goog.require('pstj.ui.Templated');
goog.require('spo.gametemplate');
goog.require('goog.ui.CustomButton');
goog.require('spo.ui.ButtonRenderer');
goog.require('goog.dom');
/**
 * @constructor
 * @extends {pstj.ui.Templated}
 */
spo.ui.Tags = function() {
  goog.base(this);
  this.saveButton_ = new goog.ui.CustomButton('', spo.ui.ButtonRenderer.getInstance());
  this.addChild(this.saveButton_);
};
goog.inherits(spo.ui.Tags, pstj.ui.Templated);

goog.scope(function() {
  var p = spo.ui.Tags.prototype;
  /**
   * Pointer to the content element.
   * @type {!Element}
   * @private
   */
  p.contentElement_;
  /** @inheritDoc */
  p.getTemplate = function() {
    return spo.gametemplate.Tags({
      tags: (goog.isDef(this.getModel()['message_tags'])) ? this.getModel()['message_tags'] : ''
    });
  };
  /** @inheritDoc */
  p.decorateInternal = function(el) {
    goog.base(this, 'decorateInternal', el);
    this.saveButton_.decorate(goog.dom.getElementByClass(goog.getCssName('goog-button'), el));
    this.contentElement_ =/** @type {!Element} */ (goog.dom.getElementByClass(goog.getCssName('field-tags'), this.getElement()));
  };
  /** @inheritDoc */
  p.getContentElement = function() {
    return this.contentElement_;
  };
  /** @inheritDoc */
  p.disposeInternal = function() {
    delete this.contentElement_;
    goog.base(this, 'disposeInternal');
  };

});
