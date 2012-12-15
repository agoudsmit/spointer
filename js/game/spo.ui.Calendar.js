goog.provide('spo.ui.Calendar');
goog.require('goog.ui.DatePicker');

goog.require('goog.ui.DatePicker');
goog.require('goog.array');
goog.require('pstj.date.utils');
/**
 * @param {goog.date.Date|Date=} opt_date Date to initialize the date picker
 *     with, defaults to the current date.
 * @param {Object=} opt_dateTimeSymbols Date and time symbols to use.
 *     Defaults to goog.i18n.DateTimeSymbols if not set.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 *
 * @constructor
 * @extends {goog.ui.DatePicker}
 */
spo.ui.Calendar = function(opt_date, opt_dateTimeSymbols, opt_domHelper) {
    goog.base(this, opt_date, spo.ui.Calendar.symbols_ , opt_domHelper);
    this.setDecorator(this.eventDecorator);
    this.setShowWeekNum(false);
    this.setShowWeekdayNames(true);
    this.setUseNarrowWeekdayNames(true);
    this.setShowToday(false);
    this.setAllowNone(false);
    this.setFirstWeekday(0);
    this.setShowOtherMonths(false);
};

goog.inherits(spo.ui.Calendar, goog.ui.DatePicker);
spo.ui.Calendar.symbols_ = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O',
      'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
      'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
      'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
      'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday',
      'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
      'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, MMMM d, y', 'MMMM d, y', 'MMM d, y', 'M/d/yy'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};

/**
 * @override
 * @return {Array.<*>|null}
 */
spo.ui.Calendar.prototype.getModel;

/**
 * Searches for matching date in the event list and returns true on success and null failure
 * @param {goog.date.Date|Date=} date date to search for in the event array
 * @return {boolean}
 */
spo.ui.Calendar.prototype.getDateByEvent = function(date) {
  var events = this.getModel();
  if (events) {
      var dateString = date.toIsoString(true);
      var result = goog.array.find(events, function(event) {
          var eventDate = pstj.date.utils.renderTime(event['time'], 'yyyy-mm-dd');
          return eventDate == dateString;
      });
      if (result === null) return false;
      return true;
  }
  return false;
};


/**
 * Decorator function for drawing active events on the date table
 * @param {goog.date.Date|Date=} date the date that may be decorated
 * @return {string}
 */
spo.ui.Calendar.prototype.eventDecorator = function(date) {
    var hasEvent = this.getDateByEvent(date);

    if (hasEvent) {
        return goog.getCssName('goog-date-picker-event');
    }
    return '';
};

/**
 * Sets the model associated with the UI component.
 * Every time setModel is executed it will force redrawCalendarGrid_ on the widget
 * @param {*} obj The model.
 */
spo.ui.Calendar.prototype.setModel = function(obj) {
    goog.base(this, 'setModel', obj);
    this.redrawCalendarGrid_();
}
