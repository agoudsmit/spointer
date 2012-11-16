goog.provide('spo.ds.ControlUserList');

goog.require('spo.ds.ControlUser');
goog.require('spo.ds.List');
goog.require('spo.ds.MapList');

/**
 * Team List abstraction.
 *
 * @constructor
 * @extends {spo.ds.List}
 * @param {pstj.ds.RecordID} tid The ID of the team to retrieve the users for.
 */
spo.ds.ControlUserList = function(tid) {
  goog.base(this, tid);
};
goog.inherits(spo.ds.ControlUserList, spo.ds.List);

/** @inheritDoc */
spo.ds.ControlUserList.prototype.loadData = function(content) {
  var users = content['controlUsers'];
  for (var i = 0; i < users.length; i++) {
    this.add(new spo.ds.ControlUser(users[i]));
  }
};

/** @inheritDoc */
spo.ds.ControlUserList.prototype.getQuery = function() {
  return {
    'url': '/team_control_users/' + this.id_
  };
};

/**
 * The prefix to match when constructing web socket listeners for resources.
 * Eg:
 * /control_user + /create
 * /control_user + /update/:id
 * /control_user + /remove/:id
 * The middle one is not automatic.
 *
 * @type {string}
 */
spo.ds.ControlUserList.path = '/control_user';

/**
 * The mapped map list instance that can feed mapped list of this list type.
 *
 * @type {spo.ds.MapList}
 */
spo.ds.ControlUserList.map = new spo.ds.MapList(spo.ds.ControlUserList,
  spo.ds.ControlUser, 'control_team_id');
