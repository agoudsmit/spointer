goog.provide('spo.ds.Game');

goog.require('pstj.ds.ListItem');

spo.ds.Game = function(data) {
  goog.base(this, data);
};
goog.inherits(spo.ds.Game, pstj.ds.ListItem);

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
