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

/**
 * Loads a new record in the controller.
 * @param {*} record The mail record to load.
 */
spo.control.MailPreview.prototype.loadRecord = function(record) {
  this.mailRecord_ = record;
  this.loadView();
};
spo.control.MailPreview.prototype.clean = function() {
  goog.dispose(this.view_);
};
/**
 * Loads the view into existence.
 */
spo.control.MailPreview.prototype.loadView = function() {
  if (goog.isDefAndNotNull(this.view_)) {
    this.clean();
  } else {
    // Basically the view has never been used, make it visible!
    this.container_.style.display = 'block';
  }
  this.view_ = new spo.ui.MailPreview();
  this.view_.setModel(this.mailRecord_);
  this.view_.render(this.container_);
};

