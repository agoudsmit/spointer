goog.provide('spo.ui.ControlUsers');

goog.require('spo.ds.ControlTeam');
goog.require('spo.ui.Users');

/**
 * @constructor
 * @extends {spo.ui.Users}
 */
spo.ui.ControlUsers = function() {
  goog.base(this);
};
goog.inherits(spo.ui.ControlUsers, spo.ui.Users);


/** @inheritDoc */
spo.ui.ControlUsers.prototype.getTeamName = function() {
  return this.getModel().getProp(spo.ds.ControlTeam.Property.NAME);
};
