goog.provide('spo.ui.MeetingForm');

goog.require('goog.events');
goog.require('goog.ui.LabelInput');
goog.require('pstj.date.utils');
goog.require('pstj.ui.Templated');
goog.require('spo.ds.Game');
goog.require('spo.ds.STP');
goog.require('spo.gametemplate');
goog.require('spo.ui.DatePicker');
goog.require('spo.ui.RestrictiveDatePicker');

/**
 * The meeting form UI component.
 * @constructor
 * @extends {pstj.ui.Templated}
 * @param {Object} gamerecord The game record to configure against.
 * @param {number=} meeting_date Optional meeting date - used when restoring
 *   composed meetings.
 */
spo.ui.MeetingForm = function(gamerecord, meeting_date) {
  goog.base(this);

  // by default select 3 days in advance, based on the game time.
  this.meetingDate_ = (goog.isNumber(meeting_date)) ? meeting_date :
    +new Date(this.getCurrentGameTime(goog.global['GAME'], 'mm/dd/yyyy hh:xx',
      this.meetingStartOffset));

  // we need custom instance of the date picker that understands our timeing.
  // use custom date picker derived from more generic Calendar. Here the
  // inheritance is wrong, the Calendar should inherit from DatePicker, but it
  // is too late to fix that.
  var datepicker = new spo.ui.DatePicker();
  datepicker.setGameRecord(gamerecord);

  // creating the Input date picker, make sure the current date shown in the
  // date picker is our 'game' current date for this to work we need a date
  // picker that is aware of the game (see above)
  this.datePicker_ = new spo.ui.RestrictiveDatePicker(
    spo.ds.Game.DateFormatter, spo.ds.Game.DateParser, datepicker);

  // Assign chekcing function for the input date picker to perform when setting
  // the date, if date does not match our criteria simply set the current game
  // time.
  this.datePicker_.setCheckFunction(
    /** @type {function(string): boolean} */ (goog.bind(
      this.confirmMeetingDate, this)));

  this.datePicker_.getDatePicker().setShowToday(false);
  this.datePicker_.getDatePicker().setShowWeekNum(false);
  this.datePicker_.getDatePicker().setAllowNone(false);
  this.datePicker_.getDatePicker().setShowOtherMonths(false);
  this.timeInput_ = new goog.ui.LabelInput();
};
goog.inherits(spo.ui.MeetingForm, pstj.ui.Templated);

spo.ui.MeetingForm.EventType = {
  DISALLOWED_DATE: goog.events.getUniqueId('dissalowed-date')
};

goog.scope(function() {

  var p = spo.ui.MeetingForm.prototype;

  /**
   * Checks if the date (as string) is before the current date, if it is we
   *   will return false, if it is matching of is in the future true is
   *   retrned.
   * @param {string} value The date as string (MM/dd/yyyy).
   * @return {boolean} True if the date is allowed. False otherwise.
   */
  p.confirmMeetingDate = function(value) {
    var nv = value.split('/')
    var nd = new goog.date.Date(+nv[2], +nv[0] - 1, +nv[1]);
    var od = new goog.date.Date(this.getCurrentGameTime(goog.global['GAME'],
      'mm/dd/yyyy hh:xx', 0));
    if (goog.date.Date.compare(nd, od) < 0) {
      this.dispatchEvent(spo.ui.MeetingForm.EventType.DISALLOWED_DATE);
      return false
    }
    return true;
  };

  /**
   * Gets the current game time rendered
   * @param {*} model The game model to use.
   * @param {string=} format How to format the date.
   * @param {number=} offset offset in milliseconds to apply to the current
   *   game time.
   * @return {string} The current game time string.
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
    return (pstj.date.utils.renderTime(gametimeNow, (goog.isString(format)) ?
      format : spo.ds.Game.Formatting.DATE_ONLY));
  };
  /**
   * How much forward / backward in time to calculate the meeting date/time
   * @type {number}
   * @protected
   */
  p.meetingStartOffset = 1000 * 60 * 60 * 24 * 3;

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
  p.getValue = function() {
    var time = this.timeInput_.getValue();
    var date = this.datePicker_.getInputValue();
    var datetime = new Date(date + ' ' + time);
    return +(datetime);
  };

  p.setGameRecord = function(gr) {

  }
});
