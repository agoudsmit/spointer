goog.provide('spo.ds.UserList');

goog.require('goog.async.Deferred');
goog.require('pstj.ds.List');
goog.require('spo.ds.User');

/**
 * Team List abstraction.
 * @constructor
 * @extends {pstj.ds.List}
 * @param {string} tid The ID of the team to retrieve the users for.
 */
spo.ds.UserList = function(tid) {
  goog.base(this);
  this.teamId_ = tid;
};
goog.inherits(spo.ds.UserList, pstj.ds.List);

/**
 * Loads the data into the list once it is available. The data should be of
 * form {content: [record1, record2,... recordN]}.
 * @param  {*} content The content of the server result.
 */
spo.ds.UserList.prototype.loadData = function(content) {
  var users = content['payers'];

  for (var i = 0; i < users.length; i++) {
    this.add(new spo.ds.User(users[i]));
  }

  spo.ds.Resource.getInstance().registerResourceHandler('/player/update/' +
    this.teamId_, goog.bind(function(response) {
      console.log('Update list in place', response['content']);
      return;
      this.update(new spo.ds.User(response['content']));
    }, this));
};

/**
 * Returns the query params for the server to load this particular resource.
 * @return {*} The url for the component's resource.
 */
spo.ds.UserList.prototype.getQuery = function() {
  return {
    'url': '/team_players/' + this.teamId_
  };
};

/**
 * Provides the map teamid -> deferred
 * @type {Object}
 * @private
 */
spo.ds.UserList.dmap_ = {
  // teamid: deferred
};

/**
 * Provides the map teamid -> UserList
 * @type {Object}
 * @private
 */
spo.ds.UserList.lmap_ = {
  // teamid: list
};

/**
 * Public method abstracting the list obtaining. It works internally by
 * creating a deferred object for each list (by teamid) and returnuing it.
 * @param  {string} teamid The game id to return deferred for.
 * @return {!goog.async.Deferred} The deferred object that matches this teamid.
 */
spo.ds.UserList.getList = function(teamid) {
  if (!spo.ds.UserList.dmap_[teamid]) {
    spo.ds.UserList.dmap_[teamid] = new goog.async.Deferred();
    spo.ds.UserList.lmap_[teamid] = new spo.ds.UserList(teamid);
    spo.ds.Resource.getInstance().get(
      spo.ds.UserList.lmap_[teamid].getQuery(), function(response) {
        if (response['status'] != 'ok') {
          spo.ds.UserList.dmap_[teamid].errback(/** error? */);
        } else {
          spo.ds.UserList.lmap_[teamid].loadData(response['content']);
          spo.ds.UserList.dmap_[teamid].callback(
            spo.ds.UserList.lmap_[teamid]);
        }
      });
  }
  return spo.ds.UserList.dmap_[teamid];
};
