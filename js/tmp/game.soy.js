// This file was automatically generated from game.soy.
// Please don't edit this file by hand.

goog.provide('spo.gametemplate');

goog.require('soy');


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.gametemplate.EditorWrapper = function(opt_data) {
  return '<div class="' + goog.getCssName('editor-wrapper') + '"><div class="' + goog.getCssName('editor-toolbar') + '"></div><div class="' + goog.getCssName('editor-field') + '" id="' + soy.$$escapeHtml(opt_data.id) + '"></div></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.gametemplate.MailBox = function(opt_data) {
  return '<div class="' + goog.getCssName('mail-box') + '"><div class="' + goog.getCssName('mail-box-content') + '"><span class="' + goog.getCssName('mail-box-name') + '">' + soy.$$escapeHtml(opt_data.name) + '</span><span class="' + goog.getCssName('mail-box-count') + '">' + soy.$$escapeHtml(opt_data.count) + '</span></div><div class="' + goog.getCssName('mail-box-active-indicator') + '"></div></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.gametemplate.MailBoxList = function(opt_data) {
  return '<div class="' + goog.getCssName('mail-box-list') + '"><div class="' + goog.getCssName('detail-heading') + '">' + soy.$$escapeHtml(opt_data.header) + '</div></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.gametemplate.MailList = function(opt_data) {
  return '\t<div class="' + goog.getCssName('mail-list-container') + '"><div class="' + goog.getCssName('mail-listing-view') + '"><!-- mails should go here --></div><div class="' + goog.getCssName('control-buttons') + '"><span class="' + goog.getCssName('goog-button') + ' ' + goog.getCssName('text-button') + ' ' + goog.getCssName('form-button') + ' ' + goog.getCssName('prev') + '">Prev</span><span class="' + goog.getCssName('goog-button') + ' ' + goog.getCssName('text-button') + ' ' + goog.getCssName('form-button') + ' ' + goog.getCssName('next') + '">Next</span></div></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.gametemplate.MailRecord = function(opt_data) {
  return '\t<div class="' + ((opt_data.isread == false) ? goog.getCssName('mail-record-container') + ' ' + goog.getCssName('unread') : goog.getCssName('mail-record-container')) + '"><div class="' + goog.getCssName('mail-record') + '"><div class="' + goog.getCssName('record-raw') + ' ' + goog.getCssName('raw-one') + '"><span>' + soy.$$escapeHtml(opt_data.sender) + '</span><span class="' + goog.getCssName('mail-date') + '">' + soy.$$escapeHtml(opt_data.date) + '</span><span class="' + goog.getCssName('mail-preview-indicator') + '"></span></div><div class="' + goog.getCssName('record-raw') + ' ' + goog.getCssName('raw-two') + '">' + soy.$$escapeHtml(opt_data.subject) + '</div></div><div class="' + goog.getCssName('mail-record-overlay') + '" data-recordid="' + soy.$$escapeHtml(opt_data.recordid) + '"></div></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.gametemplate.Widgets = function(opt_data) {
  return '\t<div class="' + goog.getCssName('left-pane') + '"><div class="' + goog.getCssName('top-pane') + '"><div class="' + goog.getCssName('mail-list-placeholder') + '"><!-- set the mailbox list here and next to it float the mail list --></div></div><div class="' + goog.getCssName('bottom-pane') + '"><div class="' + goog.getCssName('meeting-box-placeholder') + '"><!-- setup the meeting widget here --></div></div></div><div class="' + goog.getCssName('right-pane') + '"><!-- set the mail view here --></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.gametemplate.ListLoading = function(opt_data) {
  return '\t<div class="' + goog.getCssName('load-indicator') + '">Loading...</div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.gametemplate.game = function(opt_data) {
  return '<div class="' + goog.getCssName('fullscreen') + '"><div class="' + goog.getCssName('header') + ' ' + goog.getCssName('game-header') + '"><!-- put here the header widget --></div><div class="' + goog.getCssName('content') + '"></div></div>';
};
