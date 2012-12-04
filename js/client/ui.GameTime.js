goog.provide('spo.ui.GameTime');

goog.require('pstj.date.utils');
goog.require('pstj.ui.Clock');
goog.require('spo.ds.Game');
goog.require('spo.ds.STP');

/**
 * Provides the game time clock for each game. Internally it works by
 * calculating the game time on each update taking into account the server time
 * and the game speed.
 *
 * @constructor
 * @extends {pstj.ui.Clock}
 * @param {goog.dom.DomHelper=} odh Optional dom helper.
 * @param {string=} format Optional formatting.
 */
spo.ui.GameTime = function(odh, format) {
  goog.base(this, odh);
  this.format_ = format || 'mm/dd/yy';
};
goog.inherits(spo.ui.GameTime, pstj.ui.Clock);

/**
 * @inheritDoc
 */
spo.ui.GameTime.prototype.setTime = function(time) {
  // If game start time is not set, then the time cannot be calculated.
  if (this.getModel().getProp(spo.ds.Game.Property.START_TIME) == 0) {
    this.renderTime();
    return;
  }

  // If the game is paused then is pointeless to calculate time, set it as
  // the last saved game time on server.
  if (this.getModel().isPaused()) {
    this.renderTime(this.getModel().getProp(
      spo.ds.Game.Property.SAVED_GAME_TIME));
    return;
  }

  /****************************************
    DESCRIBES THE SCENARIO OF CALCULATING GAME TIME !!!
   *****************************************/

  // Get the server time.
  var serverNow = spo.ds.STP.getInstance().getServerTime(time);

  // Get the last saved game time.
  var savedgametime = this.getModel().getProp(
    spo.ds.Game.Property.SAVED_GAME_TIME);

  // Get the time of last save on server.
  var savets = this.getModel().getProp(
    spo.ds.Game.Property.SAVED_REAL_TIME);

  // Calculate the time elapsed between the last save on server and currenr time
  // on server.
  var delta = serverNow - savets;

  // Calculate how much milliseconds (time) ellapsed in game time compared to
  // real time elapsed.
  var delta_game_time = delta * this.getModel().getProp(
    spo.ds.Game.Property.SPEED);

  // Calculate the current game time based on the actual time elapsed.
  var gametimeNow = (savedgametime + delta_game_time);

  // Set the time into the view.
  this.renderTime(gametimeNow);
  // this.getContentElement().innerHTML = pstj.date.utils.renderTime(
  //   gametimeNow, this.format_);
};


/**
 * Extracted custom rendered, allows for time calculation to be performed
 * separately and thus tweak the visualization as much as needed.
 *
 * @protected
 * @param  {string|number=} time The milliseconds UNIX representation of the time to
 *                        visualize.
 */
spo.ui.GameTime.prototype.renderTime = function(time) {
  if (!goog.isDef(time)) {
    this.getContentElement().innerHTML = 'N/A';
    return;
  }
  if (goog.isString(time)) {
    this.getContentElement().innerHTML = time;
    return;
  }
  this.getContentElement().innerHTML = pstj.date.utils.renderTime(time,
    this.format_);
};

