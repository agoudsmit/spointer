goog.provide('spo.ui.GameDetails');

goog.require('goog.async.Delay');
goog.require('goog.ui.Component');
goog.require('pstj.date.utils');
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
  console.log(this.getModel().getProp(spo.ds.Game.Property.SCENARIO));
  this.decorateInternal(
    /** @type {Element} */ (goog.dom.htmlToDocumentFragment(
    spo.template.gameSettings({
      scenarioUrl: this.getModel().getProp(spo.ds.Game.Property.SCENARIO),
      gamestartdate: this.getModel().getFormatedStartDate(),
      gamestarttime: pstj.date.utils.renderTime(this.getModel().getProp(
        spo.ds.Game.Property.START_TIME), 'hh:xx'),
      description: this.getModel().getProp(spo.ds.Game.Property.DESCRIPTION),
      minutes: this.speedToDays_(this.getModel().getProp(
        spo.ds.Game.Property.SPEED))
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

/**
 * Calculates the minutes it takes in the real life for one day to pass in
 * the game.
 * @param  {number} speed The speed of the game.
 * @return {string} Number of minutes that takes in the real life for one day
 *                         to pass in the game.
 */
spo.ui.GameDetails.prototype.speedToDays_ = function(speed) {
  if (speed < 1) speed = 1;
  if (speed > 1440) speed = 1440;
  var inMinutes = 1440 / speed;
  if (inMinutes ==  1) return '1';
  if (inMinutes < 60) return 'more than ' + (inMinutes << 0);
  if (inMinutes == 1440) return "24 hours and 0"
  var hours = inMinutes / 60 << 0;
  var minutes = inMinutes % 60 << 0;
  return '' + hours + ' hours and ' + minutes;
};
