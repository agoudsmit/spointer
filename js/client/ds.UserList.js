goog.provide('spo.ds.UserList');

goog.require('spo.ds.List');
goog.require('spo.ds.MapList');
goog.require('spo.ds.User');

/**
 * Team List abstraction.
 *
 * @constructor
 * @extends {spo.ds.List}
 * @param {pstj.ds.RecordID} team_id The ID of the team to retrieve the users
 *                                   for.
 */
spo.ds.UserList = function(team_id) {
  goog.base(this, team_id);
};
goog.inherits(spo.ds.UserList, spo.ds.List);

/** @inheritDoc */
spo.ds.UserList.prototype.loadData = function(content) {
  var users = content['payers'];
  for (var i = 0; i < users.length; i++) {
    this.add(new spo.ds.User(users[i]));
  }
};

/** @inheritDoc */
spo.ds.UserList.prototype.getQuery = function() {
  return {
    'url': '/team_players/' + this.id_
  };
};

/**
 * The prefix to match when constructing web socket listeners for resources.
 * Eg:
 * /player + /create
 * /player + /update/:id
 * /player + /remove/:id
 * The middle one is not automatic.
 *
 * @type {string}
 */
spo.ds.UserList.path = '/player';

/**
 * The mapped map list instance that can feed mapped list of this list type.
 *
 * @type {spo.ds.MapList}
 */
spo.ds.UserList.map = new spo.ds.MapList(spo.ds.UserList, spo.ds.User,
  'team_id');
