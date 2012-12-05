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
  this.meetingDate_ = meeting_date;
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
   * @return {string}
   */
  p.getCurrentGameTime = function(model) {
    var serverNow = spo.ds.STP.getInstance().getServerTime();
    var savedgametime = model.getProp(spo.ds.Game.Property.SAVED_GAME_TIME);
    var savets = model.getProp(spo.ds.Game.Property.SAVED_REAL_TIME);
    var delta = serverNow - savets;
    var delta_game_time = delta * model.getProp(spo.ds.Game.Property.SPEED);
    var gametimeNow = (savedgametime + delta_game_time);
    return(pstj.date.utils.renderTime(gametimeNow, spo.ds.Game.Formatting.DATE_ONLY));
  };
  /** @inheritDoc */
  p.getTemplate = function() {
    return spo.gametemplate.MeetingForm({
      date_format: spo.ds.Game.Formatting.DATE_ONLY,
      time_format: spo.ds.Game.Formatting.TIME_ONLY,
      date: (goog.isNumber(this.meetingDate_)) ? pstj.date.utils.renderTime(
          this.meetingDate_, spo.ds.Game.Formatting.DATE_ONLY) : this.getCurrentGameTime(goog.global['GAME']),
      time: (goog.isNumber(this.meetingDate_)) ? pstj.date.utils.renderTime(
          this.meetingDate_, spo.ds.Game.Formatting.TIME_ONLY) : '0:00'
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
