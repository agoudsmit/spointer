goog.provide('spo.ui.Attachment');

goog.require('pstj.ui.Upload');
goog.require('spo.gametemplate');

/**
 * @constructor
 * @extends {pstj.ui.Upload}
 */
spo.ui.Attachment = function() {
  goog.base(this, goog.global['UPLOAD_ATTACHMENT_LINK'], 'attachment[]');
};
goog.inherits(spo.ui.Attachment, pstj.ui.Upload);

goog.scope(function() {
  var p = spo.ui.Attachment.prototype;
  /** @inheritDoc */
  p.getTemplate = function() {
    return spo.gametemplate.Form({
      link: this.url_,
      name: this.name_,
      hash: ''
    });
  };
  /** @inheritDoc */
  p.decorateInternal = function(el) {
    goog.base(this, 'decorateInternal', el);
    this.hash = this.getEls(goog.getCssName('hash-value'));
  };
  /**
   * Sets new value on the hash in the form.
   * @param {!string} value The value to use as hash.
   */
  p.setHash = function(value) {
    this.hash.value = value;
  };
  /** @inheritDoc */
  p.trigger = function() {
    if (this.hash.value == '') throw Error('Cannot use form without hash');
    goog.base(this, 'trigger');
  };
});
