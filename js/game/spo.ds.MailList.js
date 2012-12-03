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

goog.provide('spo.ds.MailList');

goog.require('spo.ds.OverrideList');
goog.require('spo.ds.Resource');

/**
 * Provides the mail box wrapper abstraction. It should be responsible for the
 * server loading and message listing.
 * NOTICE: Mailboxes are never disposed. It is expected that their memory
 * footprint is manager in the instance.
 *
 * @constructor
 * @extends {spo.ds.OverrideList}
 * @param {!string} resource The resource for this mail listing.
 */
spo.ds.MailList = function(resource) {
  goog.base(this, resource);
  this.list_ = [];
};
goog.inherits(spo.ds.MailList, spo.ds.OverrideList);

/**
 * @inheritDoc
 */
spo.ds.MailList.prototype.interval = 5000;

/**
 * Number of items per page.
 * @type {!number}
 * @protected
 */
spo.ds.MailList.prototype.msgsPerPage = 6;

/**
 * Pointer to the list of messages that are loaded from the server.
 * @type {!Array.<*>}
 * @private
 */
spo.ds.MailList.prototype.list_;

/**
 * Holds the number of messages total on the server.
 * @type {number}
 * @private
 */
spo.ds.MailList.prototype.msgCount_ = -1;
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
spo.ds.MailList.prototype.viewState_;

/**
 * Counter indicating on which page the view is currently.
 *
 * @type {!number}
 * @private
 */
spo.ds.MailList.prototype.onPage_ = 1;

/**
 * @inheritDoc
 */
spo.ds.MailList.prototype.update = function() {
  if (this.hasScheduledUpdate()) this.cancelUpdate();
  goog.base(this, 'update');
};

/**
 * Determines if there is a previous page
 * @return {boolean}
 */
spo.ds.MailList.prototype.hasPreviousPage = function() {
  if (this.start_ != 1) return true;
  return false;
};

/**
 * Determines if there is a next page
 * @return {boolean}
 */
spo.ds.MailList.prototype.hasNextPage = function() {
  return this.getBoxCount() / this.msgsPerPage > 1;
};

spo.ds.MailList.prototype.getPage = function(page) {
  var start = 1 + ((this.onPage_ - 1) * this.msgsPerPage);
  console.log('start is ',start);
  if (this.msgCount_ != -1)
    if (start > this.msgCount_) return;
  this.start_ = start;
  this.update();
};

/** @inheritDoc */
spo.ds.MailList.prototype.getRequest = function() {
  return {
    'url': this.resource_,
    'config': {
      'start': this.start_,
      'count': this.msgsPerPage
     }
  };
};

/**
 * @inheritDoc
 */
spo.ds.MailList.prototype.handleUpdate = function(resp) {
  goog.base(this, 'handleUpdate', resp);
  var content = resp['content'];
  this.setBoxCount(content['message_count']);
  this.overrideSet(content['messages']);
  this.dispatchEvent(spo.ds.OverrideList.EventType.UPDATED);
  if (this.viewState_) {
    this.scheduleNextUpdate();
  }
};

/**
 * Overrides the data set that is stored for this mail box.
 *
 * @param {!Array.<*>} list The list of messages currently saved on the server
 * for this particular mailbox.
 */
spo.ds.MailList.prototype.overrideSet = function(list) {
  this.list_ = list;
};

/**
 * Returns the count of all messages in the mail box list.
 * @return {!number} Message count.
 */
spo.ds.MailList.prototype.getBoxCount = function() {
  return this.msgCount_;
};

/**
 * Getter for the raw data listing.
 * @return {!Array.<*>}
 */
spo.ds.MailList.prototype.getList = function() {
  return this.list_;
};


/**
 * Sets the number of messages in this mail box. Note that the number of loaded
 * messages does not necessarily match the number of mails in the box stored on
 * the server.
 *
 * @param {!number} count The total number of messages on the server for this
 * mailbox.
 */
spo.ds.MailList.prototype.setBoxCount = function(count) {
  this.msgCount_ = count;
};

spo.ds.MailList.prototype.clean = function() {
  this.cancelUpdate();
  this.list_ = [];
  this.msgCount_ = -1;
  this.onPage_ = 1;
};

/**
 * Updates the view state of the list.
 * @param {!boolean} viewed True if the list is currently viewed / monitored.
 */
spo.ds.MailList.prototype.setViewState = function(viewed) {
  if (this.viewState_ != viewed) {
    this.viewState_ = viewed;
    if (this.viewState_ == false) {
      this.clean();
    }
  }
};

/**
 * The event type to use when the internal list ref is overloaded by the server.
 * @enum {string}
 */
spo.ds.MailList.EventType = {
  UPDATE: goog.events.getUniqueId('update')
};
