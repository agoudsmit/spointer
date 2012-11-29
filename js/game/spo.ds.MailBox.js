/**
 * @fileoverview By design the mailbox is a list of items, each item is a
 * message. Because of time constrains the mail box list is reloaded each
 * time. For optimization's sake on each request the messages up to the last
 * loaded message are requested. Upon loading all the downloaded messages are
 * overriding the ones that are currently loaded. This means that  the rendered
 * view has no way of knowing if the message has changed. For this reason we
 * make a copy of the data that is currently displayed and after the list is
 * reloaded the segment of it that is displayed need to be compared to the new
 * state. This works as this: if there is one message that is selected we
 * determine its ID, then we load the view as document fragment and check again
 * if this same ID exists, if yes, we mark it as selected and replace the DOM
 * tree on place. If not we simply replace the DOM tree and leave no selected
 * node.
 */

goog.provide('spo.ds.MailBox');

goog.require('goog.events.EventTarget');
/**
 * Provides the mail box wrapper abstraction. It should be responsible for the
 * server loading and message listing.
 * NOTICE: Mailboxes are never disposed. It is expected that their memory
 * footprint is manager in the instance.
 *
 * @constructor
 * @extends {goog.events.EventTarget}
 */
spo.ds.MailBox = function() {
  goog.base(this);
};
goog.inherits(spo.ds.MailBox, goog.events.EventTarget);

/**
 * Number of items per page.
 * @type {!number}
 * @protected
 */
spo.ds.MailBox.prototype.msgsPerPage = 8;
/**
 * Pointer to the list of messages that are loaded from the server.
 * @type {Array.<*>}
 * @private
 */
spo.ds.MailBox.prototype.list_;
/**
 * Holds the number of messages total on the server.
 * @type {!number}
 * @private
 */
spo.ds.MailBox.prototype.msgCount_;
/**
 * Holds the viewed property state. This is used to monitor the server list.
 * It is supposed to work as this: Initially the box is not viewed and the list
 * is empty. When the view state changes the first page is requested from the
 * server and once the data is available a callback is executed. At this point
 * it should be possible to get the page portion of the list and use it. Now,
 * when a next page is requested the whole list is requested from the server
 * including the second page - once it is loaded it works as with the first
 * page. When a page is requested that is bellow the last loaded page the page
 * pointer should be decreased and the nest list requested should be again up to
 * the page that is currently viewed. This will allow for lowering the response
 * time from the server and parse times. When the view state is changed to 'not
 * viewed' the page count of this list should be reset and the update interval
 * increased to 1 minute or cease at all if the 'new' count could be retrieved
 * otherwise.
 *
 * @type {!boolean}
 * @private
 */
spo.ds.MailBox.prototype.viewState_;
/**
 * Counter indicating on which page the view is currently.
 *
 * @type {!number}
 * @private
 */
spo.ds.MailBox.prototype.onPage_ = 1;
/**
 * The interval to use when updating the list from the server.
 * Default to 30 seconds.
 *
 * @type {!number}
 * @protected
 */
spo.ds.MailBox.prototype.updateInterval = 30000;
/**
 * Overrides the data set that is stored for this mail box.
 *
 * @param {!Array.<*>} list The list of messages currently saved on the server
 * for this particular mailbox.
 */
spo.ds.MailBox.prototype.overrideSet = function(list) {
  this.list_ = list;
  this.dispatchEvent(spo.ds.MailBox.EventType.UPDATE);
};
/**
 * Returns the count of all messages in the mail box list.
 * @return {!number} Message count.
 */
spo.ds.MailBox.prototype.getBoxCount = function() {
  return this.msgCount_;
};
/**
 * Sets the number of messages in this mail box. Note that the number of loaded
 * messages does not necessarily match the number of mails in the box stored on
 * the server.
 *
 * @param {!number} count The total number of messages on the server for this
 * mailbox.
 */
spo.ds.MailBox.prototype.setBoxCount = function(count) {
  this.msgCount_ = count;
};
/**
 * Updates the view state of the list.
 * @param {!boolean} viewed True if the list is currently viewed / monitored.
 */
spo.ds.MailBox.prototype.setViewState = function(viewed) {
  if (this.viewState_ != viewed) {
    this.viewState_ = viewed;
  }
};
/**
 * The event type to use when the internal list ref is overloaded by the server.
 * @enum {string}
 */
spo.ds.MailBox.EventType = {
  UPDATE: goog.events.getUniqueId('update')
};
