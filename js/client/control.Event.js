/**
 * @fileoverview Provides the control events. The controls should listen for
 * those events to manage the user actions coming from UI.
 */
goog.provide('spo.control.Action');
goog.provide('spo.control.Event');
goog.provide('spo.control.EventType');

goog.require('goog.events');
goog.require('goog.events.Event');


/**
 * Custom event for the actions that a control should listen for.
 * @constructor
 * @extends {goog.events.Event}
 * @param {goog.events.EventTarget} target A target that emits the event.
 * @param {spo.control.Action} action_type The action to attach to the event.
 */
spo.control.Event = function(target, action_type) {
  goog.base(this, spo.control.EventType.CONTROL_ACTION, target);
  this.detail_ = action_type;
};
goog.inherits(spo.control.Event, goog.events.Event);

/**
 * Getter for the action assosiated with this event.
 * @return {spo.control.Action} The action of the event.
 */
spo.control.Event.prototype.getAction = function() {
  return this.detail_;
};

/**
 * The control action events type.
 * @enum {string}
 */
spo.control.EventType = {
  CONTROL_ACTION: goog.events.getUniqueId('control-action'),
  SUCCESS: goog.events.getUniqueId('success'),
  FAILURE: goog.events.getUniqueId('failed')
};

/**
 * Enumarate the known action types.
 * @enum {number}
 */
spo.control.Action = {
  UPLOAD_SCENARIO: 0,
  UPLOAD_TEAMLIST: 1,
  MANAGE_CONTROLS: 2,
  EDIT: 3,
  STOP: 4,
  PLAY: 5,
  DELETE: 6,
  SAVE: 7,
  PAUSE: 8
};
