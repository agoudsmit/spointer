goog.provide('spo.control.MeetingList');

goog.require('spo.control.Base');
goog.require('goog.ui.Component.EventType');
goog.require('spo.ui.MeetingList');
goog.require('spo.ds.MeetingList');
goog.require('goog.dom.dataset');
goog.require('goog.events.EventType');
goog.require('pstj.date.utils');
goog.require('goog.array');
goog.require('spo.control.Action');

/**
 * @constructor
 * @extends {spo.control.Base}
 * @param {!Element} container The container element to render in.
 */
spo.control.MeetingList = function(container) {
  goog.base(this, container);
  this.view_ = new spo.ui.MeetingList();
  // Render it immediately so it can take the first place in the float order
  this.view_.render(this.container_);
  this.model_ = new spo.ds.MeetingList();
  this.getHandler().listenOnce(this.model_, spo.ds.OverrideList.EventType.INITED,
      this.loadView);
  this.getHandler().listen(this.view_, goog.ui.Component.EventType.SELECT, this.handleChildAction_);
  this.getHandler().listen(this.view_.getContentElement(),
      goog.events.EventType.CLICK, this.handleMeetingClick);
  // TODO: enable this after tests
  this.model_.update();
};
goog.inherits(spo.control.MeetingList, spo.control.Base);


goog.scope(function() {
  var p = spo.control.MeetingList.prototype;
  /**
   * @private
   * @type {string}
   */
  p.filterType_ = 'upcoming';
  /**
   * @type {number}
   */
  p.lastSelectedId;
  /**
   * Handle tab selection
   * @param  {goog.events.Event} ev The SELECT component event.
   */
  p.handleChildAction_ = function(ev) {
    var type = goog.dom.dataset.get(ev.target.getElement(), 'type');
    this.setFilterByType(/** @type {!string} */ (type));
  };
  /**
   * [setFilterByType description]
   * @param {!string} type [description]
   */
  p.setFilterByType = function(type) {
    this.filterType_ = type;
    this.loadView();
  };
  /**
   * @return {Array.<*>}
   */
  p.filter = function() {
    return goog.array.filter(this.model_.getList(), function(el) {
      if (el['status'] == this.filterType_) return true;
      return false;
    }, this);

  };
  p.handleMeetingClick = function(ev) {
    var id = ev.target;
    this.lastSelectedId = /** @type {!string} */ (goog.dom.dataset.get(ev.target, 'recordid'));
    this.notify(this, spo.control.Action.SELECT);
  };

  p.getList = function() {
    return this.model_.getList();
  };

  p.loadView = function() {
    var list = this.filter();
    var result = '';
    for (var i = 0; i < list.length; i++) {
      result = result + spo.gametemplate.MeetingRecord({
        recordid: list[i]['msgid'],
        date: pstj.date.utils.renderTime(list[i]['time'], 'Month dd, yyyy'),
        subject: list[i]['subject']
      });
    }
    if (result == '') {
      result = 'No meetings in the calendar';
    }
    this.view_.getContentElement().innerHTML = result;
    this.notify(this, spo.control.Action.UPDATE);
    //force resize!
  };
});
