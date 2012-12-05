goog.provide('spo.ui.MailPreview');

goog.require('pstj.ui.Templated');
goog.require('spo.gametemplate');
goog.require('pstj.date.utils');
goog.require('goog.dom');

/**
 * @constructor
 * @extends {pstj.ui.Templated}
 */
spo.ui.MailPreview = function() {
  goog.base(this);
};
goog.inherits(spo.ui.MailPreview, pstj.ui.Templated);

goog.scope(function() {
  var p = spo.ui.MailPreview.prototype;
  /**
   * @type {!Element}
   * @private
   */
  p.userListContainer;
  /** @inheritDoc */
  p.getTemplate = function() {
    var data = this.getModel();
    return spo.gametemplate.MailPreview({
      from: data['from']['alias'],
      date: pstj.date.utils.renderTime(data['date'], 'Month dd, yyyy / hh:xx'),
      subject: data['subject'],
      recepients: spo.gametemplate.UserList({
        list: data['to']
      }), // Should be list generated form the ids.
      body: data['body']
    });
  };
  /** @inheritDoc */
  p.decorateInternal = function(el) {
    goog.base(this, 'decorateInternal', el);
    this.userListContainer = /** @type {!Element} */(goog.dom.getElementByClass(goog.getCssName('user-list-container'), el).parentNode);
  };
  /** @inheritDoc */
  p.disposeInternal = function() {
    delete this.userListContainer;
    goog.base(this, 'disposeInternal');
  };
});
