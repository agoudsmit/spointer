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
    goog.base(this, opt_date, opt_dateTimeSymbols, opt_domHelper);
    this.setDecorator(this.eventDecorator);
};

goog.inherits(spo.ui.Calendar, goog.ui.DatePicker);

/**
 * Searches for matching date in the event list and returns true on success and null failure
 * @param {goog.date.Date|Date=} date date to search for in the event array
 * @return {Boolean=}
 */
spo.ui.Calendar.prototype.getDateByEvent = function(date) {
    var events = this.getModel();
    if (events) {
        var dateString = date.toIsoString(true);

        return goog.array.find(events, function(event) {
            var eventDate = pstj.date.utils.renderTime(event.date, 'yyyy-mm-dd');

            return eventDate == dateString;
        });
    }
};


/**
 * Decorator function for drawing active events on the date table
 * @param {goog.date.Date|Date=} date the date that may be decorated
 * @return {String}
 */
spo.ui.Calendar.prototype.eventDecorator = function(date) {
    var hasEvent = this.getDateByEvent(date);

    if (hasEvent) {
        return goog.getCssName('goog-date-picker-event');
    }
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
