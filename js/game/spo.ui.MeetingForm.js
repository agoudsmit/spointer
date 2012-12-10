goog.provide('spo.ui.MeetingForm');

goog.require('pstj.ui.Templated');
goog.require('spo.ds.Game');
goog.require('spo.gametemplate');
goog.require('spo.ds.STP');
goog.require('pstj.date.utils');
goog.require('goog.ui.InputDatePicker');
goog.require('goog.ui.LabelInput');

/**
 * @constructor
 * @extends {pstj.ui.Templated}
 * @param {number=} meeting_date Optional meeting date - used when restoring composed meetings.
 */
spo.ui.MeetingForm = function(meeting_date) {
  goog.base(this);
  this.meetingDate_ = (goog.isNumber(meeting_date)) ? meeting_date :
   +new Date(this.getCurrentGameTime(goog.global['GAME'], 'mm/dd/yyyy hh:xx', this.meetingStartOffset));
  this.datePicker_ = new goog.ui.InputDatePicker(spo.ds.Game.DateFormatter,
      spo.ds.Game.DateParser);
  this.datePicker_.getDatePicker().setShowToday(false);
  this.datePicker_.getDatePicker().setShowWeekNum(false);
  this.datePicker_.getDatePicker().setAllowNone(false);
  this.datePicker_.getDatePicker().setShowOtherMonths(false);
  this.timeInput_ = new goog.ui.LabelInput();
};
goog.inherits(spo.ui.MeetingForm, pstj.ui.Templated);

goog.scope(function() {
  var p = spo.ui.MeetingForm.prototype;
  /**
   * Gets the current game time rendered
   * @param {*} model The game model to use.
   * @param {string=} format How to format the date.
   * @param {number=} offset offset in milliseconds to apply to the current game time.
   * @return {string}
   */
  p.getCurrentGameTime = function(model, format, offset) {
    var serverNow = spo.ds.STP.getInstance().getServerTime();
    var savedgametime = model.getProp(spo.ds.Game.Property.SAVED_GAME_TIME);
    var savets = model.getProp(spo.ds.Game.Property.SAVED_REAL_TIME);
    var delta = serverNow - savets;
    var delta_game_time = delta * model.getProp(spo.ds.Game.Property.SPEED);
    var gametimeNow = (savedgametime + delta_game_time);
    if (goog.isNumber(offset)) {
      gametimeNow = gametimeNow + offset;
    }
    return(pstj.date.utils.renderTime(gametimeNow, (goog.isString(format))  ?
      format : spo.ds.Game.Formatting.DATE_ONLY));
  };
  /**
   * How much forward / backward in time to calculate the meeting date/time
   * @type {number}
   * @protected
   */
  p.meetingStartOffset = 1000*60*60*24*3;

  /** @inheritDoc */
  p.getTemplate = function() {
    return spo.gametemplate.MeetingForm({
      date_format: spo.ds.Game.Formatting.DATE_ONLY,
      time_format: spo.ds.Game.Formatting.TIME_ONLY,
      date: pstj.date.utils.renderTime(this.meetingDate_, spo.ds.Game.Formatting.DATE_ONLY),
      time: pstj.date.utils.renderTime(this.meetingDate_, spo.ds.Game.Formatting.TIME_ONLY)
    });
  };
  /** @inheritDoc */
  p.decorateInternal = function(el) {
    goog.base(this, 'decorateInternal', el);
    this.addChild(this.timeInput_);
    this.timeInput_.decorate(goog.dom.getElementByClass(goog.getCssName('meeting-time'), el));
    var date_el = goog.dom.getElementByClass(goog.getCssName('meeting-date'), el);
    this.addChild(this.datePicker_);
    this.datePicker_.setPopupParentElement(date_el.parentElement);
    this.datePicker_.decorate(date_el);
  };
  /**
   * Should return an object with the values as config
   * @return {*}
   */
  p.getValues = function() {
    var time = this.timeInput_.getValue();
    var date = this.datePicker_.getInputValue();
    var datetime = new Date(date + ' ' + time);
    return {
      web_form_config: {
        datetime: +(datetime)
      }
    };
  };
});
