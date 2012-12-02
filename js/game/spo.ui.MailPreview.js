goog.provide('spo.ui.MailPreview');

goog.require('pstj.ui.Templated');
goog.require('spo.gametemplate');
goog.require('pstj.date.utils');

spo.ui.MailPreview = function() {
  goog.base(this);
};
goog.inherits(spo.ui.MailPreview, pstj.ui.Templated);

goog.scope(function() {
  var p = spo.ui.MailPreview.prototype;
  /** @inheritDoc */
  p.getTemplate = function() {
    var data = this.getModel();
    return spo.gametemplate.MailPreview({
      from: data['from']['alias'],
      date: pstj.date.utils.renderTime(data['date'], 'Month dd, yyyy / hh:xx'),
      subject: data['subject'],
      recepients: 'Static for now', // Should be list generated form the ids.
      body: data['body']
    });
  };
});
