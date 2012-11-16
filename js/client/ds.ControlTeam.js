/**
 * @fileoverview Describes the TEAM record type.
 */

goog.provide('spo.ds.ControlTeam');

goog.require('pstj.ds.ListItem');

/**
 * Adds customization for name handling specifically for players teams.
 *
 * @constructor
 * @extends {pstj.ds.ListItem}
 * @param {*} data The control team list from the server.
 */
spo.ds.ControlTeam = function(data) {
  goog.base(this, data);
};
goog.inherits(spo.ds.ControlTeam, pstj.ds.ListItem);

/**
 * Provides the names for the object literal.
 *
 * @enum {string}
 */
spo.ds.ControlTeam.Property = {
  ID: 'id',
  NAME: 'name',
  DESCRIPTION: 'description',
  INTEL: 'intelligence',
  WORLD: 'rest_of_the_world',
  MEETINGS: 'validation_meetings',
  MESSAGES: 'validation_messages',
  PRESS: 'worldpress'
};
