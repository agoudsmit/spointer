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
  return '<div class="' + goog.getCssName('game-controls') + '"><div class="' + goog.getCssName('game-control-item') + ' ' + goog.getCssName('form-button') + ' ' + goog.getCssName('goog-button') + ' ' + goog.getCssName('reply-button') + ' ' + goog.getCssName('circle-button') + '" data-action="reply" tutle="Reply"></div><div class="' + goog.getCssName('game-control-item') + ' ' + goog.getCssName('form-button') + ' ' + goog.getCssName('goog-button') + ' ' + goog.getCssName('forward-button') + ' ' + goog.getCssName('circle-button') + '" data-action="forward" title="Forward"></div></div>';
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
  return '<div class="' + goog.getCssName('mail-composer') + '"><div class="' + goog.getCssName('error') + ' ' + goog.getCssName('error-toolbar') + '" style="display: none;"></div><div class="' + goog.getCssName('toolbars-wrap') + ' ' + goog.getCssName('mail-bottom-border') + ' ' + goog.getCssName('mail-padded') + '"><div class="' + goog.getCssName('goog-button') + ' ' + goog.getCssName('form-button') + ' ' + goog.getCssName('circle-button') + ' ' + goog.getCssName('send-button') + '" title="Send"></div><div class="' + goog.getCssName('goog-button') + ' ' + goog.getCssName('form-button') + ' ' + goog.getCssName('circle-button') + ' ' + goog.getCssName('save-button') + '" title="Save"></div><div class="' + goog.getCssName('goog-button') + ' ' + goog.getCssName('form-button') + ' ' + goog.getCssName('text-button') + ' ' + goog.getCssName('attachment-button') + '">Attach file</div><div class="' + goog.getCssName('text-button') + ' ' + goog.getCssName('goog-button') + ' ' + goog.getCssName('from-button') + ' ' + goog.getCssName('template-button') + '">Templates</div><div class="' + goog.getCssName('goog-menu') + '" style="display: none;"><div class="' + goog.getCssName('goog-menuitem') + '" data-template="draft">Load from draft</div><div class="' + goog.getCssName('goog-menuitem') + '" data-template="actionrequest">Request an action</div><div class="' + goog.getCssName('goog-menuitem') + '" data-template="intelligence">Intelligence request</div><div class="' + goog.getCssName('goog-menuitem') + '" data-template="meeting">New meeting</div><div class="' + goog.getCssName('goog-menuitem') + '" data-template="meetingreport">Meeting report</div><div class="' + goog.getCssName('goog-menuitem') + '" data-template="press">Wolrd Press request</div>' + ((opt_data.shouldSeeTeam) ? '<div class="' + goog.getCssName('goog-menuitem') + '" data-template="team">Message from team name</div>' : '') + '</div><div class="' + goog.getCssName('editor-toolbar') + '"></div></div><div class="' + goog.getCssName('fields-wrap') + ' ' + goog.getCssName('mail-bottom-border') + ' ' + goog.getCssName('mail-padded') + '"><div class="' + goog.getCssName('mail-composer-form-field') + '"><label>To:</label><input class="' + goog.getCssName('form-values') + ' ' + goog.getCssName('field-to') + '" type="text"/></div><div class="' + goog.getCssName('mail-composer-form-field') + '"><label>From:</label><input class="' + goog.getCssName('form-values') + ' ' + goog.getCssName('field-from') + '" type="text"/></div><div class="' + goog.getCssName('mail-composer-form-field') + '"><label>Subject:</label><input class="' + goog.getCssName('form-values') + ' ' + goog.getCssName('field-subject') + '" type="text"/></div></div><div class="' + goog.getCssName('web-form-container') + '"></div><div class="' + goog.getCssName('editor-field') + '" id="mail-composer-text-field"></div><div class="' + goog.getCssName('attachments') + '"></div></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.gametemplate.AttachmentElement = function(opt_data) {
  return '<div class="' + goog.getCssName('attachment-item') + '"><span>' + soy.$$escapeHtml(opt_data.title) + '</span><div class="' + goog.getCssName('actionable') + '"></div></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.gametemplate.Attachments = function(opt_data) {
  return '<div class="' + goog.getCssName('attachments-container') + '"><div class="' + goog.getCssName('a-title') + '"></div><div class="' + goog.getCssName('content-element') + '"><div style="clear:both"></div></div></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.gametemplate.MeetingForm = function(opt_data) {
  return '\t<div class="' + goog.getCssName('meeting-form') + '"><div>Create meeting request for:</div><div><input class="' + goog.getCssName('meeting-date') + '" label="' + soy.$$escapeHtml(opt_data.date_format) + '" value="' + soy.$$escapeHtml(opt_data.date) + '" type="text"/></div><div><input class="' + goog.getCssName('meeting-time') + '" label="' + soy.$$escapeHtml(opt_data.time_format) + '" value="' + soy.$$escapeHtml(opt_data.time) + '" type="text"/></div></div>';
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
  return '\t<div class="' + goog.getCssName('mail-list-container') + '"><div class="' + goog.getCssName('mail-listing-view') + '"><!-- mails should go here --></div><div class="' + goog.getCssName('control-buttons') + '"><span class="' + goog.getCssName('goog-button') + ' ' + goog.getCssName('text-button') + ' ' + goog.getCssName('form-button') + ' ' + goog.getCssName('prev') + '">Prev</span><span class="' + goog.getCssName('goog-button') + ' ' + goog.getCssName('text-button') + ' ' + goog.getCssName('form-button') + ' ' + goog.getCssName('next') + '">Next</span><div class="' + goog.getCssName('paginator') + '"></div></div></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.gametemplate.MeetingRecord = function(opt_data) {
  return '<div class="' + goog.getCssName('meeting-record-container') + '"><div class="' + goog.getCssName('meeting-record') + '"><div class="' + goog.getCssName('meeting-date') + '">' + soy.$$escapeHtml(opt_data.date) + '</div><div class="' + goog.getCssName('meeting-subject') + '">' + soy.$$escapeHtml(opt_data.subject) + '</div></div><div class="' + goog.getCssName('meeting-record-overlay') + '" data-recordid="' + soy.$$escapeHtml(opt_data.recordid) + '"></div></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.gametemplate.MailRecord = function(opt_data) {
  return '\t<div class="' + ((opt_data.isread == false) ? (opt_data.isheld == true) ? goog.getCssName('mail-record-container') + ' ' + goog.getCssName('unread') + ' ' + goog.getCssName('held') : goog.getCssName('mail-record-container') + ' ' + goog.getCssName('unread') : (opt_data.isheld == true) ? goog.getCssName('mail-record-container') + ' ' + goog.getCssName('held') : goog.getCssName('mail-record-container')) + '"><div class="' + goog.getCssName('mail-record') + '"><div class="' + goog.getCssName('record-raw') + ' ' + goog.getCssName('raw-one') + '"><span>' + soy.$$escapeHtml(opt_data.sender) + '</span><span class="' + goog.getCssName('mail-date') + '">' + soy.$$escapeHtml(opt_data.date) + '</span><span class="' + goog.getCssName('mail-preview-indicator') + '"></span><div class="' + goog.getCssName('current-indicator') + '"></div></div><div class="' + goog.getCssName('record-raw') + ' ' + goog.getCssName('raw-two') + '">' + soy.$$escapeHtml(opt_data.subject) + '</div></div><div class="' + goog.getCssName('mail-record-overlay') + '" data-recordid="' + soy.$$escapeHtml(opt_data.recordid) + '"></div></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.gametemplate.MailPreview = function(opt_data) {
  var output = '<div class="' + goog.getCssName('mail-preview-box') + '"><div class="' + goog.getCssName('mail-preview-controls') + ' ' + goog.getCssName('mail-padded') + ' ' + goog.getCssName('mail-bottom-border') + '"><!-- controls go here --></div><div class="' + goog.getCssName('mail-preview-details') + ' ' + goog.getCssName('mail-padded') + ' ' + goog.getCssName('mail-bottom-border') + '"><div><span class="' + goog.getCssName('mail-service-info') + '">From:&nbsp;</span>' + opt_data.from + '</div><div><span class="' + goog.getCssName('mail-service-info') + '">Date:&nbsp;</span>' + opt_data.date + '</div><div><span class="' + goog.getCssName('mail-service-info') + '">Subject:&nbsp;</span>' + opt_data.subject + '</div><div><span class="' + goog.getCssName('mail-service-info') + ' ' + goog.getCssName('user-list-container') + '">To:&nbsp;</span>' + opt_data.recepients + '</div><div class="' + goog.getCssName('tags-list-container') + '"></div><div class="' + goog.getCssName('web-form-container') + '">' + opt_data.webform + '</div></div><div class="' + goog.getCssName('mail-preview-body') + ' ' + goog.getCssName('mail-padded') + '">' + opt_data.body + '</div><div class="' + goog.getCssName('attachments') + '">' + ((opt_data.attachments.length > 0) ? '<div>Message attachments:</div>' : '');
  var pathList354 = opt_data.attachments;
  var pathListLen354 = pathList354.length;
  for (var pathIndex354 = 0; pathIndex354 < pathListLen354; pathIndex354++) {
    var pathData354 = pathList354[pathIndex354];
    output += '<a class="attachment-link" target="_blank" href="' + pathData354 + '">' + opt_data.attachments_names[pathIndex354] + '</a>  ';
  }
  output += '</div><div class="' + goog.getCssName('previous-message-content') + '"></div><div class="' + goog.getCssName('text-button') + ' ' + goog.getCssName('form-button') + ' ' + goog.getCssName('loadnext-button') + '" style="display: none; width:  20ex;">Load related mesage</div></div>';
  return output;
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


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.gametemplate.MeetingList = function(opt_data) {
  return '<div class="' + goog.getCssName('meetings-list') + '"><div class="' + goog.getCssName('meetings-label') + '">meetings</div><div class="' + goog.getCssName('goog-tab-bar') + '  ' + goog.getCssName('goog-tab-bar-top') + '"><div class="' + goog.getCssName('right') + ' ' + goog.getCssName('goog-tab') + '" data-type="pending">Pending</div><div class="' + goog.getCssName('right') + ' ' + goog.getCssName('goog-tab') + ' ' + goog.getCssName('goog-tab-selected') + '" data-type="upcoming">Upcoming</div></div><div class="' + goog.getCssName('goog-tab-bar-clear') + '"></div><div class="' + goog.getCssName('goog-tab-content') + '">Example content</div></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.gametemplate.Form = function(opt_data) {
  return '<div class="' + goog.getCssName('hidden-form') + '"><form method="post" enctype="multipart/form-data" action="' + soy.$$escapeHtml(opt_data.link) + '" name="uploadscenario"><input type="hidden" value="' + soy.$$escapeHtml(opt_data.hash) + '" name="hash" class="' + goog.getCssName('hash-value') + '" /><input name="' + soy.$$escapeHtml(opt_data.name) + '" type="file" style="display: none;" class="' + goog.getCssName('monitor') + '" id="attachment" /></form></div>';
};
