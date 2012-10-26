/**
 * @fileoverview Describes the GAME record type.
 */

goog.provide('spo.ds.Game');

goog.require('pstj.ds.ListItem');

/**
 * Provides specification for the Game records.
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
 * @return {boolean} True is the game is paused, false othrewise.
 */
spo.ds.Game.prototype.isPaused = function() {
  return (this.getProp(spo.ds.Game.Property.STATUS) == 2);
};

/**
 * Provides the names for the object literal.
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
  STATUS: 'state_id'
};
