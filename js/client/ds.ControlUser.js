goog.provide('spo.ds.ControlUser');

goog.require('pstj.ds.ListItem');

/**
 * The user record type. Provides the known properties as strings.
 *
 * @constructor
 * @extends {pstj.ds.ListItem}
 * @param {*} data The user record literal object.
 */
spo.ds.ControlUser = function(data) {
  goog.base(this, data);
};
goog.inherits(spo.ds.ControlUser, pstj.ds.ListItem);

/**
 * The known properties on this data record's object literal.
 *
 * @enum {string}
 */
spo.ds.ControlUser.Property = {
  ID: 'id',
  EMAIL: 'email',
  NAME: 'name',
  TEAMID: 'control_team_id',
  INCOGNITO: 'is_incognito'
};
