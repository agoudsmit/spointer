goog.provide('spo.ds.MailBoxListItem');

goog.require('pstj.ds.ListItem');


/**
 * @constructor
 * @extends {pstj.ds.ListItem}
 * @param {*} data The data to use internally.
 */
spo.ds.MailBoxListItem = function(data) {
  goog.base(this, data);
};
goog.inherits(spo.ds.MailBoxListItem, pstj.ds.ListItem);

/**
 * @inheritDoc
 */
spo.ds.MailBoxListItem.prototype.getIdProperty = function() {
  return spo.ds.MailBoxListItem.Property.RESOURCE;
};

/**
 * Defines the properties of the mail box.
 * @enum {string}
 */
spo.ds.MailBoxListItem.Property = {
    RESOURCE: 'resource',
    NAME: 'name',
    COUNT: 'messages_count',
    UNREAD_COUNT: 'unread_messages'
};