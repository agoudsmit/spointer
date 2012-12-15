goog.provide('spo.ds.MeetingList');

goog.require('spo.ds.OverrideList');
goog.require('pstj.object');

/**
 * @constructor
 * @extends {spo.ds.OverrideList}
 */
spo.ds.MeetingList = function() {
  goog.base(this, '/meetings/get');
};
goog.inherits(spo.ds.MeetingList, spo.ds.OverrideList);

goog.scope(function() {
  var p = spo.ds.MeetingList.prototype;
  /**
   * @type {*}
   * @private
   */
  p.data_ = null;
  /**
   * @return {*} The data.
   */
  p.getList = function() {
    return this.data_;
  };
  /** @inheritDoc */
  p.handleUpdate = function(resp) {
    goog.base(this, 'handleUpdate', resp);
    if (this.data_ == null) {
      this.data_ = resp['content']['meetings'];
      this.dispatchEvent(spo.ds.OverrideList.EventType.INITED);
    } else {
      if (!pstj.object.deepEquals(this.data_, resp['content']['meetings'])) {
        this.data_ = resp['content']['meetings'];
        this.dispatchEvent(spo.ds.OverrideList.EventType.INITED);
      }
    }
    // TODO: Enable this after tests
    // Schedule next update
    if (!this.hasScheduledUpdate()) {
      this.scheduleNextUpdate();
    }
  };

});
