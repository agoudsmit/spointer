// TODO: Fix mem leaks/dispose
goog.provide('spo.ui.GameEdit');

goog.require('goog.async.Delay');
goog.require('goog.dom');
goog.require('goog.ui.Component');
goog.require('goog.ui.CustomButton');
goog.require('goog.ui.Textarea');
goog.require('spo.ds.Game');
goog.require('spo.template');
goog.require('spo.ui.ButtonRenderer');

/**
 * @constructor
 * @extends {goog.ui.Component}
 * @param {goog.dom.DomHelper=} odh Optional dom helper.
 */
spo.ui.GameEdit = function(odh) {
  goog.base(this, odh);
  this.delay_ = new goog.async.Delay(this.clearNotification, 1500, this);
};
goog.inherits(spo.ui.GameEdit, goog.ui.Component);


/**
 * Contains the notification area element.
 * @type {Element}
 * @private
 */
spo.ui.GameEdit.prototype.notificationArea_;

/**
 * Holds the delayed function to clear the notifications.
 * @type {goog.async.Delay}
 * @private
 */
spo.ui.GameEdit.prototype.delay_;

/**
 * Indicates if the form has been used already and it is safe to close/dispose
 * it.
 * @type {boolean}
 * @private
 */
spo.ui.GameEdit.prototype.used_ = false;

/**
 * POinter to text area - used to resize the area accroding to text size
 * FIXME: this seem to not be working at all...
 * @type {goog.ui.Textarea}
 * @private
 */
spo.ui.GameEdit.prototype.ta_;

/**
 * Pointer to the 'save' button.
 * @type {goog.ui.CustomButton}
 * @private
 */
spo.ui.GameEdit.prototype.saveBtn_;

/**
 * @inheritDoc
 */
spo.ui.GameEdit.prototype.createDom = function() {
  console.log(spo.template.gameEdit({
      description: this.getModel().getProp(spo.ds.Game.Property.DESCRIPTION)
    }));
  this.decorateInternal(
    /** @type {Element} */ (goog.dom.htmlToDocumentFragment(
    spo.template.gameEdit({
      description: this.getModel().getProp(spo.ds.Game.Property.DESCRIPTION)
    }))));
};

/**
 * Ceck if the form has been utilized to save data already.
 * @return {boolean} True is the save button has been used.
 */
spo.ui.GameEdit.prototype.isSafeToClose = function() {
  return this.used_;
};

/**
 * @inheritDoc
 */
spo.ui.GameEdit.prototype.decorateInternal = function(el) {
  goog.base(this, 'decorateInternal', el);
  console.log(el);

  // Setup text area
  console.log('TA');
  this.ta_ = new goog.ui.Textarea();
  this.ta_.setMinHeight(50);
  this.addChild(this.ta_);
  console.log(goog.getCssName('game-description-edit'));
  console.log(goog.dom.getElementByClass(goog.getCssName(
    'game-description-edit'), this.getElement()))
  this.ta_.decorate(goog.dom.getElementByClass(goog.getCssName(
    'game-description-edit'), this.getElement()));

  // Setup save button
  console.log('BUT')
  this.saveBtn_ = new goog.ui.CustomButton('',
    spo.ui.ButtonRenderer.getInstance());
  this.addChild(this.saveBtn_);
  this.saveBtn_.decorate(goog.dom.getElementByClass(goog.getCssName(
    'text-button'), el));

  // Setup listener for save button
  this.getHandler().listenOnce(this.saveBtn_,
    goog.ui.Component.EventType.ACTION, this.saveGame_);

  this.notificationArea_ = goog.dom.getElementByClass(goog.getCssName(
    'notification-area'), this.getElement());
};

/**
 * Private method to call on save button activation. It disables the components
 * and sends request to the server. The response is checked for errors only, if
 * the request succeeds an update should be received via websocket and the
 * control should catch the update event and close this edit view.
 * FIXME: if the save is successfull, but nothing changed the UPDATE event will
 * not fire in the DS, thus this view will not close. Add cancel button.
 * @private
 */
spo.ui.GameEdit.prototype.saveGame_ = function() {
  this.used_ = true;
  this.saveBtn_.setEnabled(false);
  this.saveBtn_.setValue('Saving');
  this.ta_.setEnabled(false);
  var desc = this.ta_.getValue();
  var data = this.getModel().getRawData();
  data[spo.ds.Game.Property.DESCRIPTION] = desc;
  spo.ds.Resource.getInstance().get({
    'url': '/game/update/' + this.getModel().getId(),
    'data': {
      'description': desc
    }
  }, goog.bind(this.onServerResponse_, this));
};

/**
 * Handle the server response for update.
 * @param  {*} resp The server response object.
 * @private
 */
spo.ui.GameEdit.prototype.onServerResponse_ = function(resp) {
  if (resp['status'] != 'ok') {
    this.setNotification('Server error: ' + resp['error']);
  }
};


/**
 * @inheritDoc
 */
spo.ui.GameEdit.prototype.disposeInternal = function() {
  this.delay_.stop();
  goog.dispose(this.delay_);
  delete this.delay_;
  delete this.notificationArea_;
  goog.base(this, 'disposeInternal');
  delete this.used_;
  delete this.ta_;
  delete this.saveBtn_;
};

/**
 * Helper function, just focus the text area for now.
 */
spo.ui.GameEdit.prototype.focusFirstElement = function() {
  this.ta_.getElement().focus();
};

/**
 * Clears the notification area for the game.
 */
spo.ui.GameEdit.prototype.clearNotification = function() {
  this.notificationArea_.innerHTML = '&nbsp';
};

/**
 * Sets the notification string for the notification area.
 * @param {string} notice The notification to display.
 */
spo.ui.GameEdit.prototype.setNotification = function(notice) {
  this.delay_.stop();
  this.notificationArea_.innerHTML = notice;
  this.delay_.start();
};
