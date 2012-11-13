/**
 * @fileoverview Provides the team list abstraction.
 * To use it simply require the namespace and then require the list
 * with the game id, ex:
 * spo.ds.ControlTeamList.getList("1").addListener(function(the_team_list){...});.
 */
goog.provide('spo.ds.ControlTeamList');

goog.require('goog.async.Deferred');
goog.require('pstj.ds.List');
goog.require('spo.ds.ControlTeam');

/**
 * Team List abstraction.
 *
 * @constructor
 * @extends {pstj.ds.List}
 * @param {string} gid The ID of the team to retrieve the teams for.
 */
spo.ds.ControlTeamList = function(gid) {
  goog.base(this);
  this.gameId_ = gid;
};
goog.inherits(spo.ds.ControlTeamList, pstj.ds.List);

/**
 * Loads the data into the list once it is available. The data should be of
 * form {content: [record1, record2,... recordN]}.
 *
 * @param  {*} content The content of the server result.
 */
spo.ds.ControlTeamList.prototype.loadData = function(content) {
  var teams = content['controlTeams'];

  for (var i = 0; i < teams.length; i++) {
    this.add(new spo.ds.ControlTeam(teams[i]));
  }
};

/**
 * Returns the query structure the server can understands to get the resource.
 *
 * @return {*} The url structure.
 */
spo.ds.ControlTeamList.prototype.getQuery = function() {
  return {
    'url': '/control_teams/' + this.gameId_
  };
};

/**
 * Provides the map gameid -> deferred
 *
 * @type {Object}
 * @private
 */
spo.ds.ControlTeamList.defMap_ = {
  // gameid: deferred
};

/**
 * Provides the map gameid -> TeamList
 *
 * @type {Object}
 * @private
 */
spo.ds.ControlTeamList.gameMap_ = {
  // gameid: list
};

/**
 * Public method abstracting the list obtaining. It works internally by
 * creating a deferred object for each list (by gameid) and returnuing it.
 *
 * @param  {string} gameid The game id to return deferred for.
 * @return {!goog.async.Deferred} The deferred object that matches this gameid.
 */
spo.ds.ControlTeamList.getList = function(gameid) {
  if (!spo.ds.ControlTeamList.defMap_[gameid]) {
    spo.ds.ControlTeamList.defMap_[gameid] = new goog.async.Deferred();
    spo.ds.ControlTeamList.gameMap_[gameid] = new spo.ds.ControlTeamList(
      gameid);
    spo.ds.Resource.getInstance().get(
      spo.ds.ControlTeamList.gameMap_[gameid].getQuery(), function(response) {
        if (response['status'] != 'ok') {
          spo.ds.ControlTeamList.defMap_[gameid].errback(/** error? */);
        } else {
          spo.ds.ControlTeamList.gameMap_[gameid].loadData(response['content']);
          spo.ds.ControlTeamList.defMap_[gameid].callback(
            spo.ds.ControlTeamList.gameMap_[gameid]);
        }
      });

  }
  return spo.ds.ControlTeamList.defMap_[gameid];
};
