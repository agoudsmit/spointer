goog.provide('spo.ui.HeaderGameTime');

goog.require('pstj.date.utils');
goog.require('spo.template');
goog.require('spo.ui.GameTime');

/**
 * Provides a customized clock renderer for the header element.
 *
 * @constructor
 * @extends {spo.ui.GameTime}
 * @param {goog.dom.DomHelper=} odh Optional DOM helper.
 */
spo.ui.HeaderGameTime = function(odh) {
  goog.base(this, odh, undefined);
};
goog.inherits(spo.ui.HeaderGameTime, spo.ui.GameTime);

goog.scope(function() {
  var proto = spo.ui.HeaderGameTime.prototype;
  var template = spo.template;
  var utils = pstj.date.utils;

  /** @inheritDoc */
  proto.renderTime = function(time) {
    if (this.isInDocument()) {
      if (!goog.isDef(time)) this.getContentElement().innerHTML = '';
      else {
        this.getContentElement().innerHTML = template.clock({
          time: utils.renderTime(/** @type {number} */ (time), 'hh:xx'),
          date: utils.renderTime(/** @type {number} */ (time), 'Month dd')
        });
      }
    }
  };
});
