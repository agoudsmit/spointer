goog.provide('spo.ui.GameDetails');

goog.require('goog.async.Delay');
goog.require('goog.ui.Component');
goog.require('spo.ds.Game');
goog.require('spo.template');

/**
 * @constructor
 * @extends {goog.ui.Component}
 * @param {goog.dom.DomHelper=} odh Optional dom helper.
 */
spo.ui.GameDetails = function(odh) {
  goog.base(this, odh);
  this.delay_ = new goog.async.Delay(this.clearNotification, 1500, this);
};
goog.inherits(spo.ui.GameDetails, goog.ui.Component);


/**
 * Contains the notification area element.
 * @type {Element}
 * @private
 */
spo.ui.GameDetails.prototype.notificationArea_;

/**
 * Holds the delayed function to clear the notifications.
 * @type {goog.async.Delay}
 * @private
 */
spo.ui.GameDetails.prototype.delay_;

/**
 * @inheritDoc
 */
spo.ui.GameDetails.prototype.createDom = function() {
  this.decorateInternal(
    /** @type {Element} */ (goog.dom.htmlToDocumentFragment(
    spo.template.gameSettings({
      gamestartdate: this.getModel().getFormatedStartDate(),
      description: this.getModel().getProp(spo.ds.Game.Property.DESCRIPTION)
    }))));
};

/**
 * @inheritDoc
 */
spo.ui.GameDetails.prototype.decorateInternal = function(el) {
  goog.base(this, 'decorateInternal', el);
  this.notificationArea_ = goog.dom.getElementByClass(goog.getCssName(
    'notification-area'), this.getElement());
};

/**
 * @inheritDoc
 */
spo.ui.GameDetails.prototype.disposeInternal = function() {
  this.delay_.stop();
  goog.dispose(this.delay_);
  delete this.delay_;
  delete this.notificationArea_;
  goog.base(this, 'disposeInternal');
};

/**
 * Clears the notification area for the game.
 */
spo.ui.GameDetails.prototype.clearNotification = function() {
  this.notificationArea_.innerHTML = '&nbsp';
};

/**
 * Sets the notification string for the notification area.
 * @param {string} notice The notification to display.
 */
spo.ui.GameDetails.prototype.setNotification = function(notice) {
  this.delay_.stop();
  this.notificationArea_.innerHTML = notice;
  this.delay_.start();
};
