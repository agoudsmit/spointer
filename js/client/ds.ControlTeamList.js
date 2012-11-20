/**
 * @fileoverview Provides the team list abstraction.
 * To use it simply require the namespace and then require the list
 * with the game id, ex:
 * spo.ds.ControlTeamList.getList("1").addListener(function(the_team_list){
 *   ...});.
 */
goog.provide('spo.ds.ControlTeamList');

goog.require('spo.ds.ControlTeam');
goog.require('spo.ds.List');
goog.require('spo.ds.MapList');

/**
 * Team List abstraction.
 *
 * @constructor
 * @extends {spo.ds.List}
 * @param {!pstj.ds.RecordID} contolr_team_id The ID of the team to retrieve the teams for.
 */
spo.ds.ControlTeamList = function(contolr_team_id) {
  goog.base(this, contolr_team_id);
};
goog.inherits(spo.ds.ControlTeamList, spo.ds.List);

/** @inheritDoc */
spo.ds.ControlTeamList.prototype.loadData = function(content) {
  var teams = content['controlTeams'];
  for (var i = 0; i < teams.length; i++) {
    this.add(new spo.ds.ControlTeam(teams[i]));
  }
};

/** @inheritDoc */
spo.ds.ControlTeamList.prototype.getQuery = function() {
  return {
    'url': '/control_teams/' + this.id_
  };
};

/**
 * The prefix to match when constructing web socket listeners for resources.
 * Eg:
 * /control_team + /create
 * /control_team + /update/:id
 * /control_team + /remove/:id
 * The middle one is not automatic.
 *
 * @type {string}
 */
//spo.ds.ControlTeamList.path = '/control_team';

/**
 * The mapped map list instance that can feed mapped list of this list type.
 *
 * @type {spo.ds.MapList}
 */
spo.ds.ControlTeamList.map = new spo.ds.MapList(spo.ds.ControlTeamList,
  spo.ds.ControlTeam, 'game_id', '/control_team');


