goog.provide('spo.ds.STP');

goog.require('pstj.ds.TimeProvider');

/**
 * Global time provider that accounts for server time shift.
 * @constructor
 * @extends {pstj.ds.TimeProvider}
 */
spo.ds.STP = function() {};

/**
 * Use this only for debugging.
 * @return {number} The server-client time delta.
 */
spo.ds.STP.prototype.getDelta = function() {
  return  this.delta_;
};

/**
 * Returns the current server time in PHP time (seconds in unix epoch).
 * @return {number} The current time on the server.
 */
spo.ds.STP.prototype.getServerTime = function(time) {
  if (!goog.isNumber(time)) time = (goog.now() / 1000) << 0;
  return time - this.delta_;
};

/**
 * Updates the server time the provider knows about. Use it to sync
 * to the server time once it is provided.
 * @param  {number} server_time The server time in PHP seconds unix time.
 */
spo.ds.STP.prototype.setServerTime = function(server_time) {
  this.delta_ = ((goog.now() / 1000) << 0) - server_time;
};

goog.addSingletonGetter(spo.ds.STP);
