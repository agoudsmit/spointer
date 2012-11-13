/**
 * @fileoverview Describes the GAME record type.
 */

goog.provide('spo.ds.Game');

goog.require('goog.i18n.DateTimeFormat');
goog.require('goog.i18n.DateTimeParse');
goog.require('pstj.date.utils');
goog.require('pstj.ds.ListItem');

/**
 * Provides specification for the Game records.
 *
 * @constructor
 * @extends {pstj.ds.ListItem}
 * @param {*} data The object literal that fits this record type.
 */
spo.ds.Game = function(data) {
  goog.base(this, data);
};
goog.inherits(spo.ds.Game, pstj.ds.ListItem);

/**
 * Checks if the game is paused.
 *
 * @return {boolean} True is the game is paused, false othrewise.
 */
spo.ds.Game.prototype.isPaused = function() {
  return (this.getProp(spo.ds.Game.Property.STATUS) == 2);
};

/**
 * @inheritDoc
 */
spo.ds.Game.prototype.getProp = function(property) {
  // Handle the case of date/time JSON proeprties.
  if (property == spo.ds.Game.Property.START_TIME ||
    property == spo.ds.Game.Property.SAVED_GAME_TIME ||
    property == spo.ds.Game.Property.SAVED_REAL_TIME) {
    var timestring = goog.base(this, 'getProp', property);
    // Return the date as milliseconds as is the specs.
    return +(new Date(timestring));
  }

  // Speed cap:
  // Speed should be from 1 to 1440 (24 hours to pass for one minute is
  // max speed).
  // this is for 60000 between 60000 and 86400000 milliseconds should pass.
  if (property == spo.ds.Game.Property.SPEED) {
    var speed = goog.base(this, 'getProp', property);
    if (speed < 1) speed = 1;
    if (speed > 1440) speed = 1440;
    return speed;
  }

  return goog.base(this, 'getProp', property);
};

/**
 * Gets a formatted version of the start date (for game details)
 *
 * @return {string} The formmated date as per the spo.ds.Game.Formatting rules.
 */
spo.ds.Game.prototype.getFormatedStartDate = function() {
  var starttime = this.getProp(spo.ds.Game.Property.START_TIME);
  return pstj.date.utils.renderTime(starttime,
    spo.ds.Game.Formatting.DATE_ONLY);
};

/**
 * Provides the names for the object literal.
 *
 * @enum {string}
 */
spo.ds.Game.Property = {
  ID: 'id',
  NAME: 'name',
  SPEED: 'speed',
  DESCRIPTION: 'description',
  START_TIME: 'game_started_date',
  IS_LOCKED: 'is_locked',
  PLAYERS_COUNT: 'players_count',
  STATUS: 'state_id',
  SAVED_GAME_TIME: 'last_saved_game_time',
  SAVED_REAL_TIME: 'last_saved_real_time'

};

/**
 * @enum {string}
 */
spo.ds.Game.Formatting = {
  DATE_ONLY: 'mm/dd/yyyy',
  TIME_ONLY: 'hh:xx'
};

/**
 * The formatter fot use when using those dates.
 *
 * @type {goog.i18n.DateTimeFormat}
 */
spo.ds.Game.DateFormatter = new goog.i18n.DateTimeFormat("MM'/'dd'/'yyyy");

/**
 * The parser to use when parsing date time from game edits.
 *
 * @type {goog.i18n.DateTimeParse}
 */
spo.ds.Game.DateParser = new goog.i18n.DateTimeParse(
  "MM'/'dd'/'yyyy");
