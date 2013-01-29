goog.provide('spo.ui.MailBoxItem');
goog.provide('spo.ui.MailBoxList');

goog.require('spo.ui.Widget');
goog.require('goog.dom.classes');
goog.require('spo.ds.MailBoxList');
goog.require('spo.gametemplate');
goog.require('spo.ds.MailBoxListItem');
goog.require('goog.events.EventType');

/**
 * Provides the mail box view.
 *
 * @constructor
 * @extends {spo.ui.Widget}
 */
spo.ui.MailBoxList = function() {
  goog.base(this);
};
goog.inherits(spo.ui.MailBoxList, spo.ui.Widget);

/**
 * @inheritDoc
 */
spo.ui.MailBoxList.prototype.getTemplate = function() {
  return spo.gametemplate.MailBoxList({
    header: 'messages',
    control: goog.global['SETUP']['is_control_user']
  });
};

/**
 * @constructor
 * @extends {spo.ui.Widget}
 */
spo.ui.MailBoxItem = function() {
  goog.base(this);
};
goog.inherits(spo.ui.MailBoxItem, spo.ui.Widget);

/**
 * If the mailbox is currently selected.
 * @type {boolean}
 * @private
 */
spo.ui.MailBoxItem.prototype.selected_ = false;

/**
 * @override
 * @return {!spo.ds.MailBoxListItem}
 */
spo.ui.MailBoxItem.prototype.getModel;

/**
 * @type {!Element}
 * @private
 */
spo.ui.MailBoxItem.prototype.countIndicator_;

/**
 * @type {!Element}
 * @private
 */
spo.ui.MailBoxItem.prototype.activeIndicator_;

/**
 * Getter for the mail box name. It will return the UI name.
 *
 * @return {!string} The name of the mailbox.
 */
spo.ui.MailBoxItem.prototype.getBoxName = function() {
  return /** @type {!string} */ (this.getModel().getProp(
      spo.ds.MailBoxListItem.Property.NAME));
};

/**
 * @inheritDoc
 */
spo.ui.MailBoxItem.prototype.enterDocument = function() {
  this.getHandler().listen(this.getModel(), pstj.ds.ListItem.EventType.UPDATE,
      this.handleUpdate);
  this.getHandler().listen(this.getElement(), goog.events.EventType.CLICK,
      this.onClick);
};

/**
 * Change the appearance of the box based on its selected state/active state.
 * @param {!boolean} active True if the element is to be set as active
 */
spo.ui.MailBoxItem.prototype.setActive = function(active) {
  if (active) {
    goog.dom.classes.add(this.getElement(), goog.getCssName('active'));
  } else {
    goog.dom.classes.remove(this.getElement(), goog.getCssName('active'));
  }
};

/**
 * Handles the click on the mail box item.
 * @protected
 * @param {goog.events.Event} ev The CLICK event.
 */
spo.ui.MailBoxItem.prototype.onClick = function(ev) {
  ev.stopPropagation();
  this.dispatchEvent(goog.ui.Component.EventType.ACTION);
};

/**
 * Handles the update of the record that is bound to this view.
 * @param {goog.events.Event} ev The UPDATE event from the list item.
 * @protected
 */
spo.ui.MailBoxItem.prototype.handleUpdate = function(ev) {
  var unread_count = this.getUnreadCount();
  if (unread_count != 0)
    this.countIndicator_.innerHTML = this.getUnreadCount().toString();
  else
    this.countIndicator_.innerHTML = '';
};

/**
 * @inheritDoc
 */
spo.ui.MailBoxItem.prototype.decorateInternal = function(el) {
  goog.base(this, 'decorateInternal', el);
  this.countIndicator_ = /** @type {!Element} */ (goog.dom.getElementByClass(
      goog.getCssName('mail-box-count'), el));
  this.activeIndicator_ = /** @type {!Element} */ (goog.dom.getElementByClass(
      goog.getCssName('mail-box-active-indicator'), el));
};


/**
 * Property getter.
 * @return {boolean}
 */
spo.ui.MailBoxItem.prototype.isSelected = function() {
  return this.selected_;
};

/**
 * Gets the unread count.
 * @return {number} The unread count for this mailbox.
 */
spo.ui.MailBoxItem.prototype.getUnreadCount = function() {
  var count = /** @type {!number} */ (this.getModel().getProp(
      spo.ds.MailBoxListItem.Property.UNREAD_COUNT));
  if (count != null) return count;
  return 0;
};

/**
 * Change the selected state of the list, purely cosmetic.
 * @param {!boolean} selected True if the item is to be marked as selected. False otherwise.
 */
spo.ui.MailBoxItem.prototype.setSelectedState = function(selected) {
  if (this.selected_ != selected) {
    this.selected_ = selected;
    if (selected) {
      this.activeIndicator_.style.display = '';
    } else {
      this.activeIndicator_.style.display = 'none';
    }
  }
};

/**
 * @inheritDoc
 */
spo.ui.MailBoxItem.prototype.getTemplate = function() {
  var count = this.getUnreadCount();
  return spo.gametemplate.MailBox({
    name: this.getBoxName(),
    count: (count == 0) ? '' : count
  });
};
