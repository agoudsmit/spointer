// This file was automatically generated from pstj.soy.
// Please don't edit this file by hand.

goog.provide('pstj.templates');

goog.require('soy');


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
pstj.templates.CustomScrollArea = function(opt_data) {
  return '<div class="' + goog.getCssName('custom-scroll-area') + '"><div class="' + goog.getCssName('custom-scroll-internal') + '"><div class="' + goog.getCssName('custom-scroll-div') + '"></div></div><div class="' + goog.getCssName('custom-scroll-bar') + ' ' + goog.getCssName('goog-slider') + '"><div class="' + goog.getCssName('custom-scroll-bar-line') + '"></div><div class="' + goog.getCssName('goog-slider-thumb') + ' ' + goog.getCssName('custom-scroll-bar-thumb') + '"></div></div></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
pstj.templates.Scale = function(opt_data) {
  return '<div class="' + goog.getCssName('goog-slider') + ' ' + goog.getCssName('pstj-scale') + '"><div class="' + goog.getCssName('pstj-scale-hinge') + '"></div><div class="' + goog.getCssName('goog-slider-thumb') + '" title="' + soy.$$escapeHtml(opt_data.title) + '"></div></div>';
};
