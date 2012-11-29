/**
 * @fileoverview  Provides implementation for user requirement. It is the
 * default time clock.
 */

goog.provide('spo.widget.SystemClock');

goog.require('pstj.date.utils');
goog.require('pstj.ui.Clock');
goog.require('spo.template');


/**
 * Implements the system wide clock as per design wireframe.
 *
 * @constructor
 * @extends {pstj.ui.Clock}
 */
spo.widget.SystemClock = function() {
  goog.base(this);
};
goog.inherits(spo.widget.SystemClock, pstj.ui.Clock);

/**
 * @inheritDoc
 */
spo.widget.SystemClock.prototype.setTime = function(time) {
  if (this.isInDocument()) {
    this.getContentElement().innerHTML = spo.template.clock({
      time: pstj.date.utils.renderTime(time, 'hh:xx'),
      date: pstj.date.utils.renderTime(time, 'Month dd')
    });
  }
};
