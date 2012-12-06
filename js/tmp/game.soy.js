// This file was automatically generated from game.soy.
// Please don't edit this file by hand.

goog.provide('spo.gametemplate');

goog.require('soy');


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.gametemplate.UserList = function(opt_data) {
  var output = '';
  var recipientList3 = opt_data.list;
  var recipientListLen3 = recipientList3.length;
  for (var recipientIndex3 = 0; recipientIndex3 < recipientListLen3; recipientIndex3++) {
    var recipientData3 = recipientList3[recipientIndex3];
    output += '<span class="clickable" data-indexkey="' + soy.$$escapeHtml(recipientIndex3) + '">' + soy.$$escapeHtml(recipientData3) + '</span>' + ((recipientIndex3 == recipientListLen3 - 1) ? '&nbsp;' : ',&nbsp;');
  }
  return output;
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.gametemplate.PreviewControl = function(opt_data) {
  return '<div class="' + goog.getCssName('game-controls') + '"><div class="' + goog.getCssName('game-control-item') + ' ' + goog.getCssName('form-button') + ' ' + goog.getCssName('goog-button') + ' ' + goog.getCssName('reply-button') + ' ' + goog.getCssName('circle-button') + '" data-action="reply"></div><div class="' + goog.getCssName('game-control-item') + ' ' + goog.getCssName('form-button') + ' ' + goog.getCssName('goog-button') + ' ' + goog.getCssName('forward-button') + ' ' + goog.getCssName('circle-button') + '" data-action="forward"></div><div class="' + goog.getCssName('game-control-item') + ' ' + goog.getCssName('form-button') + ' ' + goog.getCssName('goog-button') + ' ' + goog.getCssName('delete-button') + ' ' + goog.getCssName('circle-button') + '" data-action="delete"></div></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.gametemplate.Tags = function(opt_data) {
  return '\t<div class="' + goog.getCssName('tags-container') + '"><div class="' + goog.getCssName('goog-button') + ' ' + goog.getCssName('text-button') + ' ' + goog.getCssName('form-button') + '">Save</div><input class="' + goog.getCssName('form-values') + ' ' + goog.getCssName('field-tags') + '" type="text" value="' + soy.$$escapeHtml(opt_data.tags) + '"/></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.gametemplate.Composer = function(opt_data) {
  return '<div class="' + goog.getCssName('mail-composer') + '"><div class="' + goog.getCssName('error') + ' ' + goog.getCssName('error-toolbar') + '" style="display: none;"></div><div class="' + goog.getCssName('toolbars-wrap') + ' ' + goog.getCssName('mail-bottom-border') + ' ' + goog.getCssName('mail-padded') + '"><div class="' + goog.getCssName('goog-button') + ' ' + goog.getCssName('form-button') + ' ' + goog.getCssName('circle-button') + ' ' + goog.getCssName('send-button') + '"></div><div class="' + goog.getCssName('text-button') + ' ' + goog.getCssName('goog-button') + ' ' + goog.getCssName('from-button') + ' ' + goog.getCssName('template-button') + '">Templates</div><div class="' + goog.getCssName('goog-menu') + '" style="display: none;"><div class="' + goog.getCssName('goog-menuitem') + '" data-template="draft">Load draft</div><div class="' + goog.getCssName('goog-menuitem') + '" data-template="meeting">New meeting</div><div class="' + goog.getCssName('goog-menuitem') + '" data-template="intelligence">Intelligence request</div></div><div class="' + goog.getCssName('editor-toolbar') + '"></div></div><div class="' + goog.getCssName('fields-wrap') + ' ' + goog.getCssName('mail-bottom-border') + ' ' + goog.getCssName('mail-padded') + '"><div class="' + goog.getCssName('mail-composer-form-field') + '"><label>To:</label><input class="' + goog.getCssName('form-values') + ' ' + goog.getCssName('field-to') + '" type="text"/></div><div class="' + goog.getCssName('mail-composer-form-field') + '"><label>From:</label><input class="' + goog.getCssName('form-values') + ' ' + goog.getCssName('field-from') + '" type="text"/></div><div class="' + goog.getCssName('mail-composer-form-field') + '"><label>Subject:</label><input class="' + goog.getCssName('form-values') + ' ' + goog.getCssName('field-subject') + '" type="text"/></div></div><div class="' + goog.getCssName('web-form-container') + '"></div><div class="' + goog.getCssName('editor-field') + '" id="mail-composer-text-field"></div></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.gametemplate.MeetingForm = function(opt_data) {
  return '\t<div class="' + goog.getCssName('meeting-form') + '"><div><input class="' + goog.getCssName('meeting-date') + '" label="' + soy.$$escapeHtml(opt_data.date_format) + '" value="' + soy.$$escapeHtml(opt_data.date) + '" /></div><div><input class="' + goog.getCssName('meeting-time') + '" label="' + soy.$$escapeHtml(opt_data.time_format) + '" value="' + soy.$$escapeHtml(opt_data.time) + '" /></div></div>';
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
  return '<div class="' + goog.getCssName('mail-preview-box') + '"><div class="' + goog.getCssName('mail-preview-controls') + ' ' + goog.getCssName('mail-padded') + ' ' + goog.getCssName('mail-bottom-border') + '"><!-- controls go here --></div><div class="' + goog.getCssName('mail-preview-details') + ' ' + goog.getCssName('mail-padded') + ' ' + goog.getCssName('mail-bottom-border') + '"><div><span class="' + goog.getCssName('mail-service-info') + '">From:&nbsp;</span>' + opt_data.from + '</div><div><span class="' + goog.getCssName('mail-service-info') + '">Date:&nbsp;</span>' + opt_data.date + '</div><div><span class="' + goog.getCssName('mail-service-info') + '">Subject:&nbsp;</span>' + opt_data.subject + '</div><div><span class="' + goog.getCssName('mail-service-info') + ' ' + goog.getCssName('user-list-container') + '">To:&nbsp;</span>' + opt_data.recepients + '</div><div class="' + goog.getCssName('tags-list-container') + '"></div><div class="' + goog.getCssName('web-form-container') + '">' + opt_data.webform + '</div></div><div class="' + goog.getCssName('mail-preview-body') + ' ' + goog.getCssName('mail-padded') + '">' + opt_data.body + '</div></div>';
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
