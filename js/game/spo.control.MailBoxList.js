goog.provide('spo.control.MailBoxList');

goog.require('spo.control.Base');
goog.require('spo.ui.MailBoxList');
goog.require('spo.ui.MailBoxItem');
goog.require('spo.ds.MailBoxList');
goog.require('spo.ds.OverrideList.EventType');
goog.require('goog.ui.Component.EventType');
goog.require('spo.control.Action');
goog.require('spo.control.Event');
goog.require('spo.control.EventType');

/**
 * @constructor
 * @extends {spo.control.Base}
 * @param {!Element} container The container to render in.
 */
spo.control.MailBoxList = function(container) {
  goog.base(this, container);
  this.view_ = new spo.ui.MailBoxList();
  // Render it immediately so it can take the first place in the float order
  this.view_.render(this.container_);
  this.model_ = new spo.ds.MailBoxList();
  this.getHandler().listenOnce(this.model_, spo.ds.OverrideList.EventType.INITED,
      this.loadView);
  this.getHandler().listen(this.view_, goog.ui.Component.EventType.ACTION, this.handleChildAction);
  this.model_.update();
};
goog.inherits(spo.control.MailBoxList, spo.control.Base);

/**
 * @type {spo.ui.MailBoxItem}
 * @private
 */
spo.control.MailBoxList.prototype.activeBox_ = null;
/**
 * @type {string}
 * @private
 */
spo.control.MailBoxList.prototype.currentActiveResource_;

/**
 * Handles the action of a child, this is usually to change the focus to another box.
 * @param {goog.events.Event} ev The ACTION component event.
 * @protected
 */
spo.control.MailBoxList.prototype.handleChildAction = function(ev) {
  var target = /** @type {!spo.ui.MailBoxItem} */ (ev.target);
  if (this.activeBox_ != target) {
    if (this.activeBox_ != null) {
      this.activeBox_.setActive(false);
    }
    target.setActive(true);
    this.activeBox_ = target;
    this.currentActiveResource_ = /** @type {string} */ (target.getModel().getId());
    this.notify(this, spo.control.Action.SELECT);
  }
};

/**
 * Getter for the currently active resource - it will return the resource (mailbox) that is selected in the view.
 * @return {string|null} The resource if one is selected, null otherwise.
 */
spo.control.MailBoxList.prototype.getActiveResource = function() {
  return (typeof this.currentActiveResource_ == 'string') ? this.currentActiveResource_ : null;
};

/**
 * Loads the view after the needed data has been provided.
 * @protected
 */
spo.control.MailBoxList.prototype.loadView = function() {
  var list = this.model_.getList();
  var count = list.getCount();
  for (var i = 0; i < count; i++) {
    var box = new spo.ui.MailBoxItem();
    box.setModel(list.getByIndex(i));
    this.view_.addChild(box, true);
  }
};
