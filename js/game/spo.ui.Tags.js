goog.provide('spo.ui.Tags');
goog.require('pstj.ui.Templated');
goog.require('spo.gametemplate');
goog.require('goog.ui.CustomButton');
goog.require('spo.ui.ButtonRenderer');
goog.require('goog.dom');
goog.require('goog.events.KeyHandler');
goog.require('goog.async.Delay');

/**
 * @constructor
 * @extends {pstj.ui.Templated}
 */
spo.ui.Tags = function() {
  goog.base(this);
  this.saveButton_ = new goog.ui.CustomButton('', spo.ui.ButtonRenderer.getInstance());
  this.saveButton_.setEnabled(false);
  this.addChild(this.saveButton_);
  this.keyHandler_ = new goog.events.KeyHandler();
  this.delay_ = new goog.async.Delay(this.checkTags_, 500, this);
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
    this.contentElement_ =/** @type {!Element} */ (goog.dom.getElementByClass(
      goog.getCssName('field-tags'), this.getElement()));
  };

  /** @inheritDoc */
  p.setModel = function(model) {
    goog.base(this, 'setModel', model);
    this.delay_.start();
  };

  p.onUpdate = function() {
    this.getModel()['message_tags'] = this.contentElement_.value;
    this.delay_.start();
  };

  /** @inheritDoc */
  p.enterDocument = function() {
    //TODO: attach the key handlers and monitor for any activity with a timeout
    //of 500 ms.
    goog.base(this, 'enterDocument');
    this.keyHandler_.attach(this.contentElement_);
    this.getHandler().listen(this.keyHandler_,
      goog.events.KeyHandler.EventType.KEY, function(e) { this.delay_.start();});
    this.getHandler().listen(this.contentElement_, goog.events.EventType.PASTE,
      this.checkTags_);
    this.saveButton_.setEnabled(false);
    this.getHandler().listen(this.saveButton_, goog.ui.Component.EventType.ACTION,
      function(e) {this.saveButton_.setEnabled(false)})
  };

  /**
   * Performs a check on the tags and if they have changed activates the save
   * button.
   * @private
   */
  p.checkTags_ = function() {
    var tags = this.contentElement_.value;
    this.saveButton_.setEnabled(this.getModel()['message_tags'] != tags)
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
