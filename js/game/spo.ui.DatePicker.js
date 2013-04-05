goog.provide('spo.ui.DatePicker');

goog.require('goog.functions');
goog.require('spo.ui.Calendar');

/**
 * Toched up date picker widget designed to be aware of the game time.
 * @param {goog.date.Date|Date=} opt_date Date to initialize the date picker
 *     with, defaults to the current date.
 * @param {Object=} opt_dateTimeSymbols Date and time symbols to use.
 *     Defaults to goog.i18n.DateTimeSymbols if not set.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 *
 * @constructor
 * @extends {spo.ui.Calendar}
 */
spo.ui.DatePicker = function(opt_date, opt_dateTimeSymbols, opt_domHelper) {
  goog.base(this, opt_date, opt_dateTimeSymbols, opt_domHelper);
};
goog.inherits(spo.ui.DatePicker, spo.ui.Calendar);

/** @inheritDoc */
spo.ui.DatePicker.prototype.handleTimeUpdate = goog.functions.FALSE;
