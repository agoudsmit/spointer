goog.provide('spo.ui.Calendar');
goog.require('goog.ui.DatePicker');

goog.require('goog.ui.DatePicker');
goog.require('goog.array');
goog.require('pstj.date.utils');
goog.require('goog.dom');
goog.require('goog.date.Date');
goog.require('spo.ds.Game');
goog.require('spo.ds.STP');
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
    this.gr = null;
    this.setDecorator(this.eventDecorator);
    this.setShowWeekNum(false);
    this.setShowWeekdayNames(true);
    this.setUseNarrowWeekdayNames(true);
    this.setShowToday(true);
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


/** @inheritDoc */
spo.ui.Calendar.prototype.decorateInternal = function(el) {
  goog.base(this, 'decorateInternal', el);
  var e = goog.dom.getElementByClass(goog.getCssName(this.getBaseCssClass(), 'today-cont'), this.getElement());
  e.colSpan = 4;
  e = goog.dom.getElementByClass(goog.getCssName(this.getBaseCssClass(), 'none-cont'), this.getElement());
  e.colSpan = 1;
};

spo.ui.Calendar.prototype.getGameTimeFromRecord = function() {
   // If game start time is not set, then the time cannot be calculated.
  if (this.gr.getProp(spo.ds.Game.Property.START_TIME) == 0) {
    // This will not happen as the user should not be able to log in when the game is not
    // started at all.
    return goog.now();
  }

  // If the game is paused then is pointeless to calculate time, set it as
  // the last saved game time on server.
  if (this.gr.isPaused()) {
    return this.gr.getProp(spo.ds.Game.Property.SAVED_GAME_TIME);
  }

  /****************************************
    DESCRIBES THE SCENARIO OF CALCULATING GAME TIME !!!
   *****************************************/

  // Get the server time.
  var serverNow = spo.ds.STP.getInstance().getServerTime();

  // Get the last saved game time.
  var savedgametime = this.gr.getProp(spo.ds.Game.Property.SAVED_GAME_TIME);

  // Get the time of last save on server.
  var savets = this.gr.getProp(spo.ds.Game.Property.SAVED_REAL_TIME);

  // Calculate the time elapsed between the last save on server and currenr time
  // on server.
  var delta = serverNow - savets;

  // Calculate how much milliseconds (time) ellapsed in game time compared to
  // real time elapsed.
  var delta_game_time = delta * this.gr.getProp(spo.ds.Game.Property.SPEED);

  // Calculate the current game time based on the actual time elapsed.
  var gametimeNow = (savedgametime + delta_game_time);
  return gametimeNow;

}

spo.ui.Calendar.prototype.getGameTime = function() {
  if (this.gr) {
    var a = this.getGameTimeFromRecord();
    if (a !== null) return a;
  }
  return goog.now();
};

/** @inheritDoc */
spo.ui.Calendar.prototype.selectToday = function() {
  this.setDate(new Date(this.getGameTime()));
};

spo.ui.Calendar.prototype.getCurrentTime = function() {
  return new goog.date.Date(new Date(this.getGameTime()));
};

spo.ui.Calendar.prototype.setgame = function(gr) {
  this.gr = gr;
};
