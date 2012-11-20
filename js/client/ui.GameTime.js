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
  // If the g
  if (this.getModel().getProp(spo.ds.Game.Property.START_TIME) == 0) {
    this.getContentElement().innerHTML = 'N/A';
    return;
  }

  if (this.getModel().isPaused()) {
    this.getContentElement().innerHTML = pstj.date.utils.renderTime(
      this.getModel().getProp(spo.ds.Game.Property.SAVED_GAME_TIME),
        this.format_);
    return;
  }

  var serverNow = spo.ds.STP.getInstance().getServerTime();

  var savedgametime = this.getModel().getProp(
    spo.ds.Game.Property.SAVED_GAME_TIME);

  var savets = this.getModel().getProp(
    spo.ds.Game.Property.SAVED_REAL_TIME);

  var delta = serverNow - savets;
  var delta_game_time = delta * this.getModel().getProp(
    spo.ds.Game.Property.SPEED);

  var gametimeNow = (savedgametime + delta_game_time);
  // console.log('Server time:', serverNow, delta, delta_game_time, savedgametime)
  this.getContentElement().innerHTML = pstj.date.utils.renderTime(
    gametimeNow, this.format_);
};
