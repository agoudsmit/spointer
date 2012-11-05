goog.provide('spo.ui.Team');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.ui.Component');
goog.require('goog.ui.Component.EventType');
goog.require('spo.ds.Team');
goog.require('spo.template');

/**
 * @constructor
 * @extends {goog.ui.Component}
 */
spo.ui.Team = function() {
  goog.base(this);
};
goog.inherits(spo.ui.Team, goog.ui.Component);

/**
 * The state of the component.
 * @type {boolean}
 * @private
 */
spo.ui.Team.prototype.active_ = false;

/**
 * @inheritDoc
 */
spo.ui.Team.prototype.createDom = function() {
  this.decorateInternal(
    goog.dom.htmlToDocumentFragment(
      spo.template.Team({
        teamName: this.getModel().getProp(spo.ds.Team.Property.NAME)
      })));
};

/**
 * @inheritDoc
 */
spo.ui.Team.prototype.enterDocument = function() {
  this.getHandler().listen(this.getElement(), goog.events.EventType.CLICK,
    this.handleClick_);
};

/**
 * Changes the state of the component.
 * @param {boolean} active True if the component is to be marked as active.
 */
spo.ui.Team.prototype.setActive = function(active) {
  if (active != this.active_) {
    this.active_ = active;
    this.onStateChange_();
  }
};

/**
 * Handler for the state change.
 * @private
 */
spo.ui.Team.prototype.onStateChange_ = function() {
  if (this.active_) {
    goog.dom.classes.add(this.getElement(), goog.getCssName('active'));
  } else {
    goog.dom.classes.remove(this.getElement(), goog.getCssName('active'));
  }
};

/**
 * Handles the clicks.
 *
 * @param  {goog.events.Event} ev The clikc event.
 * @private
 */
spo.ui.Team.prototype.handleClick_ = function(ev) {
  ev.stopPropagation();
  this.dispatchEvent(goog.ui.Component.EventType.ACTION);
};
