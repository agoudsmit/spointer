// This file was automatically generated from game.soy.
// Please don't edit this file by hand.

goog.provide('spo.gametemplate');

goog.require('soy');


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.gametemplate.Composer = function(opt_data) {
  return '<div class="' + goog.getCssName('mail-composer') + '"><div class="' + goog.getCssName('toolbars-wrap') + ' ' + goog.getCssName('mail-bottom-border') + ' ' + goog.getCssName('mail-padded') + '"><div class="' + goog.getCssName('goog-button') + ' ' + goog.getCssName('form-button') + ' ' + goog.getCssName('circle-button') + ' ' + goog.getCssName('send-button') + '"></div><div class="' + goog.getCssName('editor-toolbar') + '"></div></div><div class="' + goog.getCssName('fields-wrap') + ' ' + goog.getCssName('mail-bottom-border') + ' ' + goog.getCssName('mail-padded') + '"><div class="' + goog.getCssName('mail-composer-form-field') + '"><label>To:</label><input class="' + goog.getCssName('form-values') + ' ' + goog.getCssName('field-to') + '" type="text"/></div><div class="' + goog.getCssName('mail-composer-form-field') + '"><label>From:</label><input class="' + goog.getCssName('form-values') + ' ' + goog.getCssName('field-from') + '" type="text"/></div><div class="' + goog.getCssName('mail-composer-form-field') + '"><label>Subject:</label><input class="' + goog.getCssName('form-values') + ' ' + goog.getCssName('field-subject') + '" type="text"/></div></div><div class="' + goog.getCssName('editor-field') + '" id="mail-composer-text-field"></div></div>';
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
  return '\t<div class="' + ((opt_data.isread == false) ? goog.getCssName('mail-record-container') + ' ' + goog.getCssName('unread') : goog.getCssName('mail-record-container')) + '"><div class="' + goog.getCssName('mail-record') + '"><div class="' + goog.getCssName('record-raw') + ' ' + goog.getCssName('raw-one') + '"><span>' + soy.$$escapeHtml(opt_data.sender) + '</span><span class="' + goog.getCssName('mail-date') + '">' + soy.$$escapeHtml(opt_data.date) + '</span><span class="' + goog.getCssName('mail-preview-indicator') + '"></span><div class="' + goog.getCssName('current-indicator') + '"></div></div><div class="' + goog.getCssName('record-raw') + ' ' + goog.getCssName('raw-two') + '">' + soy.$$escapeHtml(opt_data.subject) + '</div></div><div class="' + goog.getCssName('mail-record-overlay') + '" data-recordid="' + soy.$$escapeHtml(opt_data.recordid) + '"></div></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.gametemplate.MailPreview = function(opt_data) {
  return '<div class="' + goog.getCssName('mail-preview-box') + '"><div class="' + goog.getCssName('mail-preview-controls') + ' ' + goog.getCssName('mail-padded') + ' ' + goog.getCssName('mail-bottom-border') + '"><!-- controls go here --></div><div class="' + goog.getCssName('mail-preview-details') + ' ' + goog.getCssName('mail-padded') + ' ' + goog.getCssName('mail-bottom-border') + '"><div><span class="' + goog.getCssName('mail-service-info') + '">From:&nbsp;</span>' + opt_data.from + '</div><div><span class="' + goog.getCssName('mail-service-info') + '">Date:&nbsp;</span>' + opt_data.date + '</div><div><span class="' + goog.getCssName('mail-service-info') + '">Subject:&nbsp;</span>' + opt_data.subject + '</div><div><span class="' + goog.getCssName('mail-service-info') + '">To:&nbsp;</span>' + opt_data.recepients + '</div></div><div class="' + goog.getCssName('mail-preview-body') + ' ' + goog.getCssName('mail-padded') + '">' + opt_data.body + '</div></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.gametemplate.Widgets = function(opt_data) {
  return '\t<div class="' + goog.getCssName('left-pane') + '"><div class="' + goog.getCssName('top-pane') + '"><div class="' + goog.getCssName('mail-list-placeholder') + '"><!-- set the mailbox list here and next to it float the mail list --></div></div><div class="' + goog.getCssName('bottom-pane') + '"><div class="' + goog.getCssName('meeting-box-placeholder') + '"><!-- setup the meeting widget here --></div></div></div><div class="' + goog.getCssName('right-pane') + '"><div class="' + goog.getCssName('mail-editor-container') + '" style="display: none;"></div><div class="' + goog.getCssName('mail-preview-container') + '" style="display: none;"></div></div>';
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
