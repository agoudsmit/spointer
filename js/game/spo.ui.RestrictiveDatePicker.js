goog.provide('spo.ui.RestrictiveDatePicker');

goog.require('goog.ui.InputDatePicker');

/**
 * @fileoverview Provides augmented date picker, instances will check with the
 *   system wide date before accepting values and if the value date is prior
 *   to the current date the value will be rejected and error will be raised.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

/**
 * Provides date picker that we can set restriction on. The implementation
 *   relies on external function that has to check the value we are attempting
 *   to set as date and if it does not pass the check it will not be altered.
 * @constructor
 * @extends {goog.ui.InputDatePicker}
 * @param {goog.i18n.DateTimeFormat} dateTimeFormatter A formatter instance
 *     used to format the date picker's date for display in the input element.
 * @param {goog.i18n.DateTimeParse} dateTimeParser A parser instance used to
 *     parse the input element's string as a date to set the picker.
 * @param {goog.ui.DatePicker=} opt_datePicker Optional DatePicker.  This
 *     enables the use of a custom date-picker instance.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 */
spo.ui.RestrictiveDatePicker = function(dateTimeFormatter, dateTimeParser,
  opt_datePicker, opt_domHelper) {

  goog.base(this, dateTimeFormatter, dateTimeParser, opt_datePicker,
    opt_domHelper);
  /**
   * @private
   * @type {?function(string): boolean}
   */
  this.restrictionFunction_ = null;
};
goog.inherits(spo.ui.RestrictiveDatePicker, goog.ui.InputDatePicker);

goog.scope(function() {

  var _ = spo.ui.RestrictiveDatePicker.prototype;

  /**
   * Setter for the checking function.
   * @param {function(string): boolean} fn Checker function to use.
   */
  _.setCheckFunction = function(fn) {
    this.restrictionFunction_ = fn;
  };

  /** @inheritDoc */
  _.setInputValue = function(value) {
    console.log(' setn input value with ', value);
    if (this.restrictionFunction_(value)) {
      goog.base(this, 'setInputValue', value);
    } else {
      this.setDate(new goog.date.Date());
    }
  };

  /** @inheritDoc */
  _.disposeInternal = function() {
    goog.base(this, 'disposeInternal');
    this.restrictionFunction_ = null;
  }

});
