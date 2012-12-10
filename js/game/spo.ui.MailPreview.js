goog.provide('spo.ui.MailPreview');

goog.require('pstj.ui.Templated');
goog.require('spo.gametemplate');
goog.require('pstj.date.utils');
goog.require('goog.dom');
goog.require('spo.ui.Tags');

/**
 * @constructor
 * @extends {pstj.ui.Templated}
 */
spo.ui.MailPreview = function() {
  goog.base(this);
};
goog.inherits(spo.ui.MailPreview, pstj.ui.Templated);

/**
 * @type {!Element}
 * @private
 */
spo.ui.MailPreview.prototype.userListContainer;

goog.scope(function() {
  var p = spo.ui.MailPreview.prototype;
  /**
   * @type {!Element}
   * @private
   */
  p.webFormContainer;
  /**
   * @type {spo.ui.Tags}
   * @private
   */
  p.taglist_;
  /** @inheritDoc */
  p.getTemplate = function() {
    var data = this.getModel();
    return spo.gametemplate.MailPreview({
      from: data['from'][0],
      date: pstj.date.utils.renderTime(data['date'], 'Month dd, yyyy / hh:xx'),
      subject: data['subject'],
      recepients: spo.gametemplate.UserList({
        list: data['to']
      }), // Should be list generated form the ids.
      body: data['body'],
      webform: (goog.isString(data['web_form'])) ? data['web_form'] : ''
    });
  };
  /** @inheritDoc */
  p.decorateInternal = function(el) {
    goog.base(this, 'decorateInternal', el);
    this.controlContainer = /** @type {!Element} */(goog.dom.getElementByClass(goog.getCssName('mail-preview-controls'), el));
    this.userListContainer = /** @type {!Element} */(goog.dom.getElementByClass(goog.getCssName('user-list-container'), el).parentNode);
    this.webFormContainer = /** @type {!Element} */(goog.dom.getElementByClass(goog.getCssName('web-form-container'), el).parentNode);
    var tagcontainer = /** @type {!Element} */(goog.dom.getElementByClass(goog.getCssName('tags-list-container'), el));
    if (goog.global['SETUP']['can_use_tags']) {
      this.taglist_ = new spo.ui.Tags();
      this.taglist_.setModel(this.getModel());
      this.addChild(this.taglist_);
      this.taglist_.render(tagcontainer);
    } else {
      tagcontainer.style.display = 'none';
    }
  };
  /** @inheritDoc */
  p.disposeInternal = function() {
    delete this.userListContainer;
    goog.dispose(this.taglist_);
    delete this.taglist_;
    goog.base(this, 'disposeInternal');
  };

  /**
   * @return {string}
   */
  p.getTagList = function() {
    if (this.taglist_) {
      return this.taglist_.getContentElement().value;
    } else {
      throw Error('This should not happen');
    }
  };
});
