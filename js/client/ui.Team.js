/**
 * @fileoverview Provides the UI for a team record in the team list view.
 */

goog.provide('spo.ui.Team');

goog.require('pstj.ds.ListItem.EventType')
goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.ui.Component');
goog.require('goog.ui.Component.EventType');
goog.require('spo.ds.Team');
goog.require('spo.template');

/**
 * Provides the team record item.
 *
 * @constructor
 * @extends {goog.ui.Component}
 */
spo.ui.Team = function() {
  goog.base(this);
};
goog.inherits(spo.ui.Team, goog.ui.Component);

/**
 * Flag for the state of the component.
 *
 * @type {boolean}
 * @private
 */
spo.ui.Team.prototype.active_ = false;

/**
 * @inheritDoc
 */
spo.ui.Team.prototype.createDom = function() {
  this.decorateInternal(
    /** @type {Element} */ (goog.dom.htmlToDocumentFragment(
      spo.template.Team({
        teamName: this.getModel().getProp(spo.ds.Team.Property.NAME)
      }))));
};

/**
 * @inheritDoc
 */
spo.ui.Team.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.getHandler().listen(this.getElement(), goog.events.EventType.CLICK,
    this.handleClick_);
  this.getHandler().listen(/** @type {!pstj.ds.ListItem} */ (this.getModel()),
    pstj.ds.ListItem.EventType.UPDATE, this.handleRecordUpdate);
};

/**
 * Handle the team name update.
 *
 * @param {goog.events.Event} ev The update event from the model.
 */
spo.ui.Team.prototype.handleRecordUpdate = function(ev) {
  goog.dom.getElementByClass(goog.getCssName('live-update'),
    this.getElement()).innerHTML = this.getModel().getProp(
    spo.ds.Team.Property.NAME);
};

/**
 * Changes the state of the component.
 *
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
 *
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
 * Handles the clicks on the widget. No logic is implemented here,
 * instead the event is 'translated' to action event and dispatched further.
 *
 * @param  {goog.events.Event} ev The clikc event.
 * @private
 */
spo.ui.Team.prototype.handleClick_ = function(ev) {
  ev.stopPropagation();
  if (goog.dom.classes.has(
    /** @type {!Element} */ (ev.target), goog.getCssName('team-edit-link'))) {
    this.dispatchEvent(goog.ui.Component.EventType.SELECT);
  } else
    this.dispatchEvent(goog.ui.Component.EventType.ACTION);
};
