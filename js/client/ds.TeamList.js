/**
 * @fileoverview Provides the team list abstraction.
 * To use it simply require the namespace and then require the list
 * with the game id, ex:
 * spo.ds.TeamList.getList("1").addListener(function(the_team_list){...});.
 */
goog.provide('spo.ds.TeamList');

goog.require('goog.async.Deferred');
goog.require('pstj.ds.List');
goog.require('spo.ds.Team');

/**
 * Team List abstraction.
 * @constructor
 * @extends {pstj.ds.List}
 * @param {string} gid The ID of the team to retrieve the teams for.
 */
spo.ds.TeamList = function(gid) {
  goog.base(this);
  this.gameId_ = gid;
};
goog.inherits(spo.ds.TeamList, pstj.ds.List);

/**
 * Loads the data into the list once it is available. The data should be of
 * form {content: [record1, record2,... recordN]}.
 * @param  {*} content The content of the server result.
 */
spo.ds.TeamList.prototype.loadData = function(content) {
  var teams = content['teams'];

  for (var i = 0; i < teams.length; i++) {
    this.add(new spo.ds.Team(teams[i]));
  }
};

/**
 * Returns the query params for the server to load this particular resource.
 * @return {*} The url for the component's resource.
 */
spo.ds.TeamList.prototype.getQuery = function() {
  return {
    'url': '/teams/' + this.gameId_
  };
};

/**
 * Provides the map gameid -> deferred
 * @type {Object}
 * @private
 */
spo.ds.TeamList.defMap_ = {
  // gameid: deferred
};

/**
 * Provides the map gameid -> TeamList
 * @type {Object}
 * @private
 */
spo.ds.TeamList.gameMap_ = {
  // gameid: list
};

/**
 * Public method abstracting the list obtaining. It works internally by
 * creating a deferred object for each list (by gameid) and returnuing it.
 * @param  {string} gameid The game id to return deferred for.
 * @return {!goog.async.Deferred} The deferred object that matches this gameid.
 */
spo.ds.TeamList.getList = function(gameid) {
  if (!spo.ds.TeamList.defMap_[gameid]) {
    spo.ds.TeamList.defMap_[gameid] = new goog.async.Deferred();
    spo.ds.TeamList.gameMap_[gameid] = new spo.ds.TeamList(gameid);
    spo.ds.Resource.getInstance().get(
      spo.ds.TeamList.gameMap_[gameid].getQuery(), function(response) {
        if (response['status'] != 'ok') {
          spo.ds.TeamList.defMap_[gameid].errback(/** error? */);
        } else {
          spo.ds.TeamList.gameMap_[gameid].loadData(response['content']);
          spo.ds.TeamList.defMap_[gameid].callback(
            spo.ds.TeamList.gameMap_[gameid]);
        }
      });

  }
  return spo.ds.TeamList.defMap_[gameid];
};
