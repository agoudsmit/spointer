goog.provide('spo.ds.STP');

/**
 * Global time provider that accounts for server time shift.
 * Use it if one needs to have access to the exact time on the server
 * in cases where the server might be in another time zone and you do not want
 * to fight with the UTC.
 *
 * @constructor
 */
spo.ds.STP = function() {};

/**
 * Informational method, getter for the delta currently used.
 *
 * @return {number} Returns the delta time between the server and the
 *                          client time in milliseconds.
 */
spo.ds.STP.prototype.getDelta = function() {
  return  this.delta_;
};

/**
 * Returns the current server time as milliseconds from 1970 UTC.
 *
 * @return {number} The current time on the server as calculated by the
 *                      initially provided delta in milliseconds.
 */
spo.ds.STP.prototype.getServerTime = function(time) {
  if (!goog.isNumber(time)) time = goog.now();
  return time - this.delta_;
};

/**
 * Updates the server time the provider knows about. Use it to sync
 * to the server time once it is provided.
 *
 * @param {number} server_time The server time in milliseconds.
 */
spo.ds.STP.prototype.setServerTime = function(server_time) {
  this.delta_ = goog.now() - server_time;
};

goog.addSingletonGetter(spo.ds.STP);
