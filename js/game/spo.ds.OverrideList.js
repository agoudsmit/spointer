goog.provide('spo.ds.OverrideList');
goog.provide('spo.ds.OverrideList.EventType');

goog.require('goog.events.EventTarget');
goog.require('goog.async.Delay');
goog.require('spo.ds.Resource');

/**
 * @constructor
 * @extends {goog.events.EventTarget}
 * @param {!string} resource The resource on the server to query.
 */
spo.ds.OverrideList = function(resource) {
  goog.base(this);
  this.resource_ = resource;
  this.update_delayed_ = new goog.async.Delay(this.update, this.interval, this);
  this.handleUpdate_bound_ = goog.bind(this.handleUpdate, this);
};
goog.inherits(spo.ds.OverrideList, goog.events.EventTarget);

/**
 * Specifies a default update interval;
 *
 * @type {!number}
 */
spo.ds.OverrideList.UPDATE_INTERVAL = 60000;

/**
 * @type {!number}
 * @protected
 */
spo.ds.OverrideList.prototype.interval = spo.ds.OverrideList.UPDATE_INTERVAL;

/**
 * Method to call on every interval to retrieve updates. Note that it is not
 * called directly.
 * TODO: allow receiving timeout notification from transport layer.
 *
 * @protected
 */
spo.ds.OverrideList.prototype.update = function() {
  spo.ds.Resource.getInstance().get(this.getRequest(), this.handleUpdate_bound_);
};

/**
 * Created the request for the resource manager.
 * @return {Object}
 */
spo.ds.OverrideList.prototype.getRequest = function() {
  return {
    'url': this.resource_
  };
};

/**
 * Method to schedule the next update. It is protected, but could be overridden
 * to allow control on whether the request for update should actually go to the
 * server (i.e. the widget is inactive).
 *
 *  @protected
 */
spo.ds.OverrideList.prototype.scheduleNextUpdate = function() {
  this.update_delayed_.start();
};

/**
 * Cancels the scheduled update in order to create a new one directly.
 */
spo.ds.OverrideList.prototype.cancelUpdate = function() {
  this.update_delayed_.stop();
};

/**
 * Method to check if the data store has an update scheduled.
 *
 * @return {!boolean} True if there is a scheduled update already. False
 * otherwise.
 */
spo.ds.OverrideList.prototype.hasScheduledUpdate = function() {
  return this.update_delayed_.isActive();
};

/**
 * Handle the update packet. In this class just check if there is a status of
 * the response as it is obligatory. Subclasses should override this method.
 *
 * @protected
 * @param {*} resp The server response
 */
spo.ds.OverrideList.prototype.handleUpdate = function(resp) {
  if (!goog.isString(resp['status'])) throw Error('No status in the response');
  if (resp['status'] != 'ok') this.dispatchEvent(
      spo.ds.OverrideList.EventType.UPDATE_ERROR);
};

/**
 * List of events that could be fired by overriding list.
 * @enum {string}
 */
spo.ds.OverrideList.EventType = {
    INITED: goog.events.getUniqueId('inited'),
    UPDATED: goog.events.getUniqueId('updated'),
    UPDATE_ERROR: goog.events.getUniqueId('update_error')
};
