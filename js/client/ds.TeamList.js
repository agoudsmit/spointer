/**
 * @fileoverview Provides the team list abstraction.
 * To use it simply require the namespace and then require the list
 * with the game id, ex:
 * spo.ds.TeamList.getList("1").addListener(function(the_team_list){...});.
 */
goog.provide('spo.ds.TeamList');

goog.require('spo.ds.List');
goog.require('spo.ds.MapList');
goog.require('spo.ds.Team');

/**
 * Team List abstraction.
 *
 * @constructor
 * @extends {spo.ds.List}
 * @param {pstj.ds.RecordID} game_id The ID of the game to retrieve the teams
 *                                   for.
 */
spo.ds.TeamList = function(game_id) {
  goog.base(this, game_id);
};
goog.inherits(spo.ds.TeamList, spo.ds.List);

/** @inheritDoc */
spo.ds.TeamList.prototype.loadData = function(content) {
  var teams = content['teams'];
  for (var i = 0; i < teams.length; i++) {
    this.add(new spo.ds.Team(teams[i]));
  }
};

/** @inheritDoc */
spo.ds.TeamList.prototype.getQuery = function() {
  return {
    'url': '/teams/' + this.id_
  };
};

/**
 * The prefix to match when constructing web socket listeners for resources.
 * Eg:
 * /team + /create
 * /team + /update/:id
 * /team + /remove/:id
 * The middle one is not automatic.
 *
 * @type {string}
 */
spo.ds.TeamList.path = '/team';

/**
 * The mapped map list instance that can feed mapped list of this list type.
 *
 * @type {spo.ds.MapList}
 */
spo.ds.TeamList.map = new spo.ds.MapList(spo.ds.TeamList, spo.ds.Team,
  'game_id');
