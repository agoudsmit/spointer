goog.provide('spo.control.MailPreview');

goog.require('spo.control.Base');
goog.require('spo.ui.MailPreview');
goog.require('spo.ds.mail');
goog.require('goog.dom.dataset');
goog.require('goog.events.EventType');
goog.require('spo.control.Action');


/**
 * @constructor
 * @extends {spo.control.Base}
 * @param {!Element} container The container to render the controls in.
 */
spo.control.MailPreview = function(container) {
  goog.base(this, container);
  this.view_ = null;
  this.controlView_ = null;
  this.clickedUserName_ = null;
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

/**
 * getter for the currently utilized mail record. Notice that it might not be the same as
 * the one that initialize it so comparison should be made using spo.ds.mail.
 * @return {*} The mail record that is currently visualized.
 */
spo.control.MailPreview.prototype.getRecord = function() {
  return this.mailRecord_ || null;
};

spo.control.MailPreview.prototype.clean = function() {
  this.getHandler().unlisten(this.view_.userListContainer, goog.events.EventType.CLICK, this.handleUserClick);
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
  this.getHandler().listen(this.view_.userListContainer, goog.events.EventType.CLICK, this.handleUserClick);
};

/**
 * Returns the selected user name selected by clicking on a user name.
 * @return {string|null}
 */
spo.control.MailPreview.prototype.getSelectedUserName = function() {
  return this.clickedUserName_;
};

/**
 * @protected
 * @param  {goog.events.Event} ev The CLICK event.
 */
spo.control.MailPreview.prototype.handleUserClick = function(ev) {
  ev.stopPropagation();
  var target = /** @type {!Element} */(ev.target);
  if (goog.dom.dataset.has(target, 'indexkey')) {
    // User name has been clicked.
    var index = goog.dom.dataset.get(target, 'indexkey');
    var username = spo.ds.mail.getRecipientByIndex(this.mailRecord_, +index);
    if (username != null) {
      this.clickedUserName_ = username;
      this.notify(this, spo.control.Action.SELECT);
    }
  }
};
