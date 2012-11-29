goog.provide('spo.ui.MailBox');
goog.provide('spo.ui.MailBoxList');

goog.require('spo.ui.Widget');
goog.require('spo.ds.MailBox');
goog.require('spo.gametemplate');


/**
 * @constructor
 * @extends {spo.ui.Widget}
 */
spo.ui.MailBox = function() {
  goog.base(this);
};
goog.inherits(spo.ui.MailBox, spo.ui.Widget);

/**
 * Getter for the mail box name. It will return the UI name.
 * 
 * @return {!string} The name of the mailbox.
 */
spo.ui.MailBox.prototype.getBoxName = function() {
  return this.getModel().getProp(spo.ds.MailBox.Property.NAME);
};
/**
 * If the mailbox is currently selected.
 * @type {boolean}
 * @private
 */
spo.ui.MailBox.prototype.selected_ = false;

/**
 * Property getter.
 * @return {boolean}
 */
spo.ui.MailBox.prototype.isSelected = function() {
  return this.selected_;
};

/**
 * Gets the unred count.
 * @return {number} The unred count for this mailbox.
 */
spo.ui.MailBox.prototype.getUnredCount = function() {
  return this.getModel().getUnredCount();
};

/** @inheritDoc */
spo.ui.MailBox.prototype.getTemplate = function() {
  return spo.gametemplate.MailBox({
    name: this.getBoxName(),
    count: this.getUnredCount()
  });
}