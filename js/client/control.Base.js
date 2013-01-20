goog.provide('spo.control.Base');
goog.require('spo.control.Action');

goog.require('goog.Disposable');
goog.require('goog.events.EventHandler');

/**
 * A base controller class to inherit from. This class aims to standardize a
 * controller interface, most important method would be #notify and
 * #setParentControl which allow a child control to propagate an action to its
 * parent control. Works like the events propagation, but is a much simpler.
 *
 * @constructor
 *
 * @extends {goog.Disposable}
 *
 * @param {!Element} container The HTMl element to use as container.
 */
spo.control.Base = function(container) {
  goog.base(this);
  this.container_ = container;
};
goog.inherits(spo.control.Base, goog.Disposable);

/**
 * The event handler for this instance.
 *
 * @type {goog.events.EventHandler}
 *
 * @private
 */
spo.control.Base.prototype.eh_;

/**
 * Flag - true if the control has been initialized already.
 *
 * @type {!boolean}
 *
 * @private
 */
spo.control.Base.prototype.inited_ = false;


/**
 * Method to set the controller state. Implementers should override this
 * class.
 *
 * @param {!boolean} enable The state to put the controller in, true if it
 * should be enabled, false otherwise.
 * @param {Function=} fn Function to execute after the disable finished.
 */
spo.control.Base.prototype.setEnabled = goog.abstractMethod;

/**
 * Optional parent control. If the control cannot handle an action, it should
 * populate it to the parent.
 *
 * @type {spo.control.Base}
 *
 * @private
 */
spo.control.Base.prototype.parentControl_ = null;

/**
 * Sets a parent control for this control.
 *
 * @param {spo.control.Base} control The control to use as parent control.
 */
spo.control.Base.prototype.setParentControl = function(control) {
  this.parentControl_ = control;
};

/**
 * Method used by child controls to notify for control Action that they cannot
 * handle.
 *
 * @param {spo.control.Base} child The child the notification comes from.
 * @param {spo.control.Action} action The action not handled at the child.
 */
spo.control.Base.prototype.notify = function(child, action) {
  if (this.parentControl_ != null) {
    this.parentControl_.notify(this, action);
  }
};

/**
 * Imitate the getHandler method from Component to allow lazy initialization
 * of a handler.
 *
 * @protected
 *
 * @return {!goog.events.EventHandler} The bound EventHandler.
 */
spo.control.Base.prototype.getHandler = function() {
  if (!this.eh_) {
    this.eh_ = new goog.events.EventHandler(this);
  }
  return this.eh_;
};

/** @inheritDoc */
spo.control.Base.prototype.disposeInternal = function() {
  if (this.eh_) this.eh_.dispose();
  delete this.eh_;
  delete this.inited_;
  goog.base(this, 'disposeInternal');
};
