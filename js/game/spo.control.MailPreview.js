goog.provide('spo.control.MailPreview');

goog.require('spo.control.Base');
goog.require('spo.ui.MailPreview');

/**
 * @constructor
 * @extends {spo.control.Base}
 * @param {!Element} container The container to render the controls in.
 */
spo.control.MailPreview = function(container) {
  goog.base(this, container);
  this.view_ = null;
  this.controlView_ = null;
};
goog.inherits(spo.control.MailPreview, spo.control.Base);

goog.scope(function() {
  var p = spo.control.MailPreview.prototype;

  /**
   * Loads a new record in the controller.
   * @param {*} record The mail record to load.
   */
  p.loadRecord = function(record) {
    this.mailRecord_ = record;
    this.loadView();
  };
  p.clean = function() {
    goog.dispose(this.view_);
  };
  /**
   * Loads the view into existence.
   */
  p.loadView = function() {
    if (this.view_ != null) {
      this.clean();
    }
    this.view_ = new spo.ui.MailPreview();
    this.view_.setModel(this.mailRecord_);
    this.view_.render(this.container_);
  };
});
