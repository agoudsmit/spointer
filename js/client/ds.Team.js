/**
 * @fileoverview Describes the TEAM record type.
 */

goog.provide('spo.ds.Team');

goog.require('pstj.ds.ListItem');

/**
 * Adds customization for name handling specifically for players teams.
 *
 * @constructor
 * @extends {pstj.ds.ListItem}
 * @param {*} data The data from the server that contains the Team.
 */
spo.ds.Team = function(data) {
  goog.base(this, data);
};
goog.inherits(spo.ds.Team, pstj.ds.ListItem);

/**
 * Provides the names for the object literal.
 *
 * @enum {string}
 */
spo.ds.Team.Property = {
  ID: 'id',
  NAME: 'name',
  DESCRIPTION: 'description'
};
