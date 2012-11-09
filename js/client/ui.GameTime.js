goog.provide('spo.ui.GameTime');

goog.require('pstj.date.utils');
goog.require('pstj.ui.Clock');
goog.require('spo.ds.Game');
goog.require('spo.ds.STP');

/**
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
  if (this.getModel().getProp(spo.ds.Game.Property.START_TIME) == 0) {
    this.getContentElement().innerHTML = 'N/A';
    return;
  }

  if (this.getModel().isPaused()) {
    this.getContentElement().innerHTML = pstj.date.utils.renderTime(
      this.getModel().getProp(spo.ds.Game.Property.SAVED_GAME_TIME) * 1000,
    this.format_);
    return;
  }

  //time = (time / 1000) << 0;
  var current_server_time = spo.ds.STP.getInstance().getServerTime();

  var last_saved_game_time = this.getModel().getProp(
    spo.ds.Game.Property.SAVED_GAME_TIME);

  var time_of_last_save = this.getModel().getProp(
    spo.ds.Game.Property.SAVED_REAL_TIME);

  var delta = current_server_time - time_of_last_save;
  var delta_game_time = delta * this.getModel().getProp(
    spo.ds.Game.Property.SPEED);

  var game_current_time = (last_saved_game_time + delta_game_time) * 1000;
  this.getContentElement().innerHTML = pstj.date.utils.renderTime(time,
    this.format_);
};
