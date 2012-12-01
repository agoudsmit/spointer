goog.provide('spo.ds.MailBoxList');

goog.require('spo.ds.OverrideList');
goog.require('pstj.ds.List');
goog.require('goog.array');
goog.require('spo.ds.MailBoxListItem');

/**
 * Provides the Mail box listing - this is the list of available mail boxes
 * for each user.
 * 
 * @constructor
 * @extends {spo.ds.OverrideList}
 */
spo.ds.MailBoxList = function() {
  goog.base(this, '/mailbox/status');
};
goog.inherits(spo.ds.MailBoxList, spo.ds.OverrideList);

/**
 * The mailbox list.
 * @type {!pstj.ds.List}
 * @private
 */
spo.ds.MailBoxList.prototype.boxes_;

/**
 * Provides access to the underlying LiveList.
 * @return {!pstj.ds.List}
 */
spo.ds.MailBoxList.prototype.getList = function() {
  return this.boxes_;
};

/**
 * @inheritDoc
 */
spo.ds.MailBoxList.prototype.handleUpdate = function(resp) {
  goog.base(this, 'handleUpdate', resp);
  if (resp['status'] == 'ok') {
    if (!goog.isDefAndNotNull(resp['content'])) {
      this.dispatchEvent(spo.ds.OverrideList.EventType.UPDATE_ERROR);
      return;
    }    
    if (!goog.isArray(resp['content']['mailboxes'])) {
      this.dispatchEvent(spo.ds.OverrideList.EventType.UPDATE_ERROR);
      return;
    }
    var boxes = resp['content']['mailboxes'];
    var len = boxes.length;
    var box = null;
    if (!goog.isDef(this.boxes_)) {
      this.boxes_ = new pstj.ds.List();
      goog.array.forEach(boxes, function(raw_box_data) {
        this.boxes_.add(new spo.ds.MailBoxListItem(raw_box_data));
      }, this);
      this.dispatchEvent(spo.ds.OverrideList.EventType.INITED);
    } else {
      // Assume there are no new boxes in the middle of the process.
      for (var i = 0; i < len; i++) {
        box = boxes[i];
        this.boxes_.update(new spo.ds.MailBoxListItem(box));
      }  
    }
  }
  // Schedule next update
  if (!this.hasScheduledUpdate()) {
    this.scheduleNextUpdate();
  }
};

goog.addSingletonGetter(spo.ds.MailBoxList);