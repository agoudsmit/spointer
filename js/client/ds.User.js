goog.provide('spo.ds.User');

goog.require('pstj.ds.ListItem');

/**
 * The user record type. Provides the known properties as strings.
 *
 * @constructor
 * @extends {pstj.ds.ListItem}
 * @param {*} data The user record literal object.
 */
spo.ds.User = function(data) {
  goog.base(this, data);
};
goog.inherits(spo.ds.User, pstj.ds.ListItem);

/**
 * The known properties on this data record's object literal.
 *
 * @enum {string}
 */
spo.ds.User.Property = {
  ID: 'id',
  EMAIL: 'email',
  FUNCTION: 'function',
  NAME: 'name',
  ROLE: 'role'
};
