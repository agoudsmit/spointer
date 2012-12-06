// This file was automatically generated from spo.soy.
// Please don't edit this file by hand.

goog.provide('spo.template');

goog.require('soy');


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.template.clock = function(opt_data) {
  return '<div>time <span class="' + goog.getCssName('time') + ' ' + goog.getCssName('bold') + '">' + soy.$$escapeHtml(opt_data.time) + '</span></div><div>date <span class="' + goog.getCssName('date') + ' ' + goog.getCssName('bold') + '">' + soy.$$escapeHtml(opt_data.date) + '</span></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.template.header = function(opt_data) {
  return '<div class="' + goog.getCssName('header') + '"><h1>InterAct</h1><div class="' + goog.getCssName('to-right') + '"><div class="' + goog.getCssName('date-time') + '"></div><div>You are not logged in</div></div></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.template.headerWithLogin = function(opt_data) {
  return '<h1>InterAct</h1><h3 class="' + goog.getCssName('live') + ' ' + goog.getCssName('game-name') + '"></h3><h2 class="' + goog.getCssName('live') + ' ' + goog.getCssName('view-name') + '"></h2><div class="' + goog.getCssName('to-right') + '"><div class="' + goog.getCssName('date-time') + '"></div><div>You are logged in as <span class="' + goog.getCssName('bold') + '">' + soy.$$escapeHtml(opt_data.username) + '</span></div><div><a class="' + goog.getCssName('header-link') + '" href="' + soy.$$escapeHtml(opt_data.logoutlink) + '">Log out</a></div><div class="' + goog.getCssName('input') + '"><input class="' + goog.getCssName('live') + ' ' + goog.getCssName('search-input') + '" style="display: none;" type="text" /></div></div><div class="' + goog.getCssName('back-link') + '"></div><div class="' + goog.getCssName('forward-link') + '"></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.template.loginForm = function(opt_data) {
  return '<div class="' + goog.getCssName('login-panel') + '"><div class="' + goog.getCssName('greeting') + '"></div><form action="' + soy.$$escapeHtml(opt_data.loginurl) + '" method="post" accept-charset="utf-8"><div class="' + goog.getCssName('input') + '"><input id="loginemail" name="loginemail" type="text" label="Name" /></div><div class="' + goog.getCssName('login-mode') + '" style="display:none;"><div class="' + goog.getCssName('input') + '"><input id="password" name="password" type="password" label="Password" class="' + goog.getCssName('input-password') + '" /></div><div><a href="#/forgotpass"><span class="' + goog.getCssName('link') + '">Lost your password?</span></a></div></div><div class="' + goog.getCssName('forgotpass-mode') + '" style="display:none;"><div><a href="#"><span class="' + goog.getCssName('link') + '">Return to login form</span></a></div></div><div style="clear:both;"></div><div style="float:right;position:relative;width:25px;height:25px;top:-50px;left: -10px"><div class="' + goog.getCssName('goog-button') + ' ' + goog.getCssName('form-button') + '"></div></div></form></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.template.login = function(opt_data) {
  return '<div class="' + goog.getCssName('fullscreen') + '">' + spo.template.header(null) + '<div class="' + goog.getCssName('content') + '"><div class="' + goog.getCssName('center-both') + '">' + spo.template.loginForm(opt_data) + '</div></div></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.template.admin = function(opt_data) {
  return '<div class="' + goog.getCssName('fullscreen') + '"><div class="' + goog.getCssName('header') + '"><!-- put here the header widget --></div><div class="' + goog.getCssName('content') + '"></div></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.template.screenWithTileList = function(opt_data) {
  return '<div class="' + goog.getCssName('left-panel-sixty') + '"><div class="' + goog.getCssName('tile-list-container') + '"></div></div><div class="' + goog.getCssName('right-panel-fourty') + '"></div><div class="' + goog.getCssName('top-panel') + '"><span class="' + goog.getCssName('back-button') + '" aria-hidden="true" data-icon="&#x21;"></span><span class="' + goog.getCssName('main-header') + '">' + soy.$$escapeHtml(opt_data.title) + '</span><input name="searchterm" type="text" label="Search for game" class="' + goog.getCssName('search-field') + '"></input></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.template.gameTile = function(opt_data) {
  return '<div class="' + goog.getCssName('tile-inner-container') + '"><div class="' + goog.getCssName('tile-body') + '"><div class="' + goog.getCssName('game-name') + '">' + soy.$$escapeHtml(opt_data.name) + '</div><div>Users: ' + soy.$$escapeHtml(opt_data.playercount) + '</div><div>Game started: ' + soy.$$escapeHtml(opt_data.starttime) + '</div><div>Current time: <span class="' + goog.getCssName('game-time') + '"></span></div><div>State: <span class="' + goog.getCssName('game-status') + '">' + soy.$$escapeHtml(opt_data.status) + '</span></div><div class="' + goog.getCssName('lock-state') + '" style="display:' + ((opt_data.locked == true) ? 'block' : 'none') + ';"></div></div></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.template.createGame = function(opt_data) {
  return '<div class="' + goog.getCssName('tile-item') + ' ' + goog.getCssName('scroll-list-item') + '"><div class="' + goog.getCssName('tile-inner-container') + '"><div class="' + goog.getCssName('tile-body') + '"><div class="' + goog.getCssName('input') + '"><input id="gamename" name="gamename" type="text" label="Add new game" /></div><div class="' + goog.getCssName('error') + ' ' + goog.getCssName('bold') + '"></div><div class="' + goog.getCssName('bottom-right') + '"><div class="' + goog.getCssName('goog-button') + ' ' + goog.getCssName('form-button') + ' ' + goog.getCssName('text-button') + '">Confirm</div></div></div></div></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.template.uploadForms = function(opt_data) {
  return '<div class="' + goog.getCssName('hidden-form') + '"><form method="post" enctype="multipart/form-data" action="' + soy.$$escapeHtml(opt_data.action_upload_scenario) + '" name="uploadscenario"><input type="hidden" value="' + soy.$$escapeHtml(opt_data.gameid) + '" name="game_id" /><input name="file" type="file" style="display: none;" class="' + goog.getCssName('monitor') + '" id="scenario" /></form><form method="post" enctype="multipart/form-data" action="' + soy.$$escapeHtml(opt_data.action_upload_teams) + '" name="uploadteams"><input type="hidden" value="' + soy.$$escapeHtml(opt_data.gameid) + '" name="game_id" /><input name="file" type="file" style="display: none;" class="' + goog.getCssName('monitor') + '" id="teamlist" /></form></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.template.gameSettings = function(opt_data) {
  return '<div class="' + goog.getCssName('column-one') + '"><div class="' + goog.getCssName('notification-area') + '">&nbsp;</div><div class="' + goog.getCssName('detail-heading') + '">Game description</div><div class="' + goog.getCssName('game-description') + '">' + soy.$$escapeHtml(opt_data.description) + '</div><div class="' + goog.getCssName('hr') + '"></div><div class="' + goog.getCssName('detail-heading') + '">Game start date <span class="' + goog.getCssName('game-date') + '">' + soy.$$escapeHtml(opt_data.gamestartdate) + '</span></div><div class="' + goog.getCssName('hr') + '"></div><div class="' + goog.getCssName('detail-heading') + '">Game start time <span class="' + goog.getCssName('game-time') + '">' + soy.$$escapeHtml(opt_data.gamestarttime) + '</span></div><div class="' + goog.getCssName('hr') + '"></div><div class="' + goog.getCssName('detail-heading') + '">Game speed</div><div>One day passes in <span class="' + goog.getCssName('detail-heading') + ' ' + goog.getCssName('in-minutes') + '">' + soy.$$escapeHtml(opt_data.minutes) + '</span> minute(s)</div></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.template.gameEdit = function(opt_data) {
  return '<div class="' + goog.getCssName('column-one') + '"><div class="' + goog.getCssName('notification-area') + '">&nbsp;</div><div class="' + goog.getCssName('detail-heading') + '">Game description</div><textarea class="' + goog.getCssName('game-description-edit') + '">' + soy.$$escapeHtml(opt_data.description) + '</textarea><div class="' + goog.getCssName('hr') + '"></div><div class="' + goog.getCssName('detail-heading') + '">Game start date <input class="' + goog.getCssName('game-date-picker') + '" label="' + soy.$$escapeHtml(opt_data.date_format) + '" value="' + soy.$$escapeHtml(opt_data.gamestartdate) + '" /></div><div class="' + goog.getCssName('hr') + '"></div><div class="' + goog.getCssName('detail-heading') + '">Game start time <input class="' + goog.getCssName('game-time') + '" label="' + soy.$$escapeHtml(opt_data.time_format) + '" value="' + soy.$$escapeHtml(opt_data.gamestarttime) + '" /></div><div class="' + goog.getCssName('hr') + '"></div><div class="' + goog.getCssName('detail-heading') + '">Change game time</div><div>One day passes in <span class="' + goog.getCssName('detail-heading') + ' ' + goog.getCssName('in-minutes') + '">' + soy.$$escapeHtml(opt_data.minutes) + '</span> minute(s)</div><div class="' + goog.getCssName('goog-slider') + '"><div class="' + goog.getCssName('custom-scroll-bar-line') + '"></div><div class="' + goog.getCssName('goog-slider-thumb') + '"></div></div><div class="' + goog.getCssName('text-button') + ' ' + goog.getCssName('form-button') + ' ' + goog.getCssName('goog-button') + '">Save</div></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.template.gameControls = function(opt_data) {
  return '<div class="' + goog.getCssName('game-controls') + '"><div class="' + goog.getCssName('game-control-item') + ' ' + goog.getCssName('form-button') + ' ' + goog.getCssName('goog-button') + ' ' + goog.getCssName('pause-button') + ' ' + goog.getCssName('circle-button') + '" data-action="pause"></div><div class="' + goog.getCssName('game-control-item') + ' ' + goog.getCssName('form-button') + ' ' + goog.getCssName('goog-button') + ' ' + goog.getCssName('play-button') + ' ' + goog.getCssName('circle-button') + '" data-action="play"></div><div class="' + goog.getCssName('game-control-item') + ' ' + goog.getCssName('form-button') + ' ' + goog.getCssName('goog-button') + ' ' + goog.getCssName('stop-button') + ' ' + goog.getCssName('circle-button') + '" data-action="stop"></div><div class="' + goog.getCssName('game-control-item') + ' ' + goog.getCssName('form-button') + ' ' + goog.getCssName('goog-button') + ' ' + goog.getCssName('delete-button') + ' ' + goog.getCssName('circle-button') + '" data-action="delete"></div><div class="' + goog.getCssName('game-control-item') + ' ' + goog.getCssName('form-button') + ' ' + goog.getCssName('goog-button') + ' ' + goog.getCssName('edit-button') + ' ' + goog.getCssName('circle-button') + '" data-action="edit"></div><div class="' + goog.getCssName('game-control-item') + ' ' + goog.getCssName('text-button') + ' ' + goog.getCssName('form-button') + ' ' + goog.getCssName('goog-button') + '" data-action="uploaduser" style="position:relative;top:5px;float:right;margin-right:11px;">Upload user/team list</div><div class="' + goog.getCssName('game-control-item') + ' ' + goog.getCssName('text-button') + ' ' + goog.getCssName('form-button') + ' ' + goog.getCssName('goog-button') + '" data-action="managecontrols" style="position:relative;top:5px;float:right;margin-right:11px">Manage controls</div><div class="' + goog.getCssName('game-control-item') + ' ' + goog.getCssName('text-button') + ' ' + goog.getCssName('form-button') + ' ' + goog.getCssName('goog-button') + '" data-action="uploadscenario" style="position:relative;top:5px;float:right;margin-right:11px;">Upload scenario</div></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.template.simplelist = function(opt_data) {
  var output = '<div class="' + goog.getCssName('simple-list') + '"><div class="' + goog.getCssName('simple-list-title') + '">' + soy.$$escapeHtml(opt_data.title) + '</div><ul class="' + goog.getCssName('simple-list-list') + '">';
  var nameList698 = opt_data.teams;
  var nameListLen698 = nameList698.length;
  for (var nameIndex698 = 0; nameIndex698 < nameListLen698; nameIndex698++) {
    var nameData698 = nameList698[nameIndex698];
    output += '<li>' + soy.$$escapeHtml(nameData698) + '</li>';
  }
  output += '</ul></div>';
  return output;
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.template.TeamList = function(opt_data) {
  return '<div class="' + goog.getCssName('team-list') + '"><div class="' + goog.getCssName('detail-heading') + '">' + soy.$$escapeHtml(opt_data.header) + '</div></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.template.Team = function(opt_data) {
  return '<div class="' + goog.getCssName('team-item') + '"><span class="' + goog.getCssName('live-update') + '">' + soy.$$escapeHtml(opt_data.teamName) + '</span><div class="' + goog.getCssName('team-edit-link') + '">Edit</div></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.template.Users = function(opt_data) {
  return '<div class="' + goog.getCssName('user-list') + '"><div class="' + goog.getCssName('detail-heading') + '">' + soy.$$escapeHtml(opt_data.teamname) + '</div><div class="' + goog.getCssName('add-user-button') + ' ' + goog.getCssName('goog-button') + ' ' + goog.getCssName('form-button') + ' ' + goog.getCssName('text-button') + '">Add</div></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.template.User = function(opt_data) {
  return '<div class="' + goog.getCssName('user-item') + '"><div class="' + goog.getCssName('user-icon') + ' ' + goog.getCssName('circle-button') + ' ' + goog.getCssName('user-icon-users') + '"></div><div class="' + goog.getCssName('error') + '" style="display: none;"></div><input class="' + goog.getCssName('form-values') + ' ' + goog.getCssName('user-role') + ' ' + goog.getCssName('sub-item') + ' ' + goog.getCssName('super-item') + '" type="text" value="' + soy.$$escapeHtml(opt_data.userrole) + '" label="Role.." /><input class="' + goog.getCssName('form-values') + ' ' + goog.getCssName('user-function') + ' ' + goog.getCssName('sub-item') + '" value="' + soy.$$escapeHtml(opt_data.userfunction) + '" label="Function..." /><input class="' + goog.getCssName('form-values') + ' ' + goog.getCssName('user-name') + ' ' + goog.getCssName('sub-item') + '" value="' + soy.$$escapeHtml(opt_data.username) + '" label="Name..." /><input class="' + goog.getCssName('form-values') + ' ' + goog.getCssName('user-email') + ' ' + goog.getCssName('sub-item') + '" value="' + soy.$$escapeHtml(opt_data.useremail) + '" label="E-Mail..." /><div class="' + goog.getCssName('user-controls') + '"><div class="' + goog.getCssName('form-button') + ' ' + goog.getCssName('goog-button') + ' ' + goog.getCssName('save-button') + ' ' + goog.getCssName('circle-button') + '" style="float:right"></div><div class="' + goog.getCssName('form-button') + ' ' + goog.getCssName('goog-button') + ' ' + goog.getCssName('delete-button') + ' ' + goog.getCssName('circle-button') + '" style="float:right"></div><div style="clear:both"></div></div><div class="' + goog.getCssName('transparent-overlay') + '"></div></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.template.NewUser = function(opt_data) {
  return '<div class="' + goog.getCssName('user-item') + ' ' + goog.getCssName('active') + '"><div class="' + goog.getCssName('user-icon') + ' ' + goog.getCssName('circle-button') + ' ' + goog.getCssName('user-icon-users') + '"></div><div class="' + goog.getCssName('error') + '" style="display: none;"></div><input class="' + goog.getCssName('form-values') + ' ' + goog.getCssName('user-role') + ' ' + goog.getCssName('sub-item') + ' ' + goog.getCssName('super-item') + '" type="text" label="Role.." /><input class="' + goog.getCssName('form-values') + ' ' + goog.getCssName('user-function') + ' ' + goog.getCssName('sub-item') + '" label="Function" /><input class="' + goog.getCssName('form-values') + ' ' + goog.getCssName('user-name') + ' ' + goog.getCssName('sub-item') + '" label="Name" /><input class="' + goog.getCssName('form-values') + ' ' + goog.getCssName('user-email') + ' ' + goog.getCssName('sub-item') + '" label="E-Mail" /><input class="' + goog.getCssName('form-values') + ' ' + goog.getCssName('user-pass') + ' ' + goog.getCssName('sub-item') + '" label="Password" /><div class="' + goog.getCssName('user-controls') + '"><div class="' + goog.getCssName('form-button') + ' ' + goog.getCssName('goog-button') + ' ' + goog.getCssName('save-button') + ' ' + goog.getCssName('circle-button') + '" style="float:right"></div><div class="' + goog.getCssName('form-button') + ' ' + goog.getCssName('goog-button') + ' ' + goog.getCssName('delete-button') + ' ' + goog.getCssName('circle-button') + '" style="float:right"></div><div style="clear:both"></div></div></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.template.ControlUser = function(opt_data) {
  return '<div class="' + goog.getCssName('user-item') + '"><div class="' + goog.getCssName('user-icon') + ' ' + goog.getCssName('circle-button') + ' ' + goog.getCssName('user-icon-users') + '"></div><div class="' + goog.getCssName('error') + '" style="display: none;"></div><input class="' + goog.getCssName('form-values') + ' ' + goog.getCssName('user-name') + ' ' + goog.getCssName('sub-item') + ' ' + goog.getCssName('super-item') + '" value="' + soy.$$escapeHtml(opt_data.name) + '" label="Name..." /><input class="' + goog.getCssName('form-values') + ' ' + goog.getCssName('user-email') + ' ' + goog.getCssName('sub-item') + '" value="' + soy.$$escapeHtml(opt_data.mail) + '" label="E-Mail..." /><div class="' + goog.getCssName('user-controls') + '"><div class="' + goog.getCssName('form-button') + ' ' + goog.getCssName('goog-button') + ' ' + goog.getCssName('save-button') + ' ' + goog.getCssName('circle-button') + '" style="float:right"></div><div class="' + goog.getCssName('form-button') + ' ' + goog.getCssName('goog-button') + ' ' + goog.getCssName('delete-button') + ' ' + goog.getCssName('circle-button') + '" style="float:right"></div><div style="clear:both"></div></div><div class="' + goog.getCssName('transparent-overlay') + '"></div></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.template.NewControlUser = function(opt_data) {
  return '<div class="' + goog.getCssName('user-item') + ' ' + goog.getCssName('active') + '"><div class="' + goog.getCssName('user-icon') + ' ' + goog.getCssName('circle-button') + ' ' + goog.getCssName('user-icon-users') + '"></div><div class="' + goog.getCssName('error') + '" style="display: none;"></div><input class="' + goog.getCssName('form-values') + ' ' + goog.getCssName('user-name') + ' ' + goog.getCssName('sub-item') + ' ' + goog.getCssName('super-item') + '" label="Name" /><input class="' + goog.getCssName('form-values') + ' ' + goog.getCssName('user-email') + ' ' + goog.getCssName('sub-item') + '" label="E-Mail" /><input class="' + goog.getCssName('form-values') + ' ' + goog.getCssName('user-pass') + ' ' + goog.getCssName('sub-item') + '" label="Password" /><div class="' + goog.getCssName('user-controls') + '"><div class="' + goog.getCssName('form-button') + ' ' + goog.getCssName('goog-button') + ' ' + goog.getCssName('save-button') + ' ' + goog.getCssName('circle-button') + '" style="float:right"></div><div class="' + goog.getCssName('form-button') + ' ' + goog.getCssName('goog-button') + ' ' + goog.getCssName('delete-button') + ' ' + goog.getCssName('circle-button') + '" style="float:right"></div><div style="clear:both"></div></div><div class="' + goog.getCssName('transparent-overlay') + '"></div></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.template.NewTeam = function(opt_data) {
  return '<div class="' + goog.getCssName('new-user-container') + '"><div class="' + goog.getCssName('new-user-error-container') + ' ' + goog.getCssName('bold') + ' ' + goog.getCssName('error') + '"></div><div><div class="' + goog.getCssName('new-user-input-container') + '" style="float:left"><input label="add new team" type="text" /></div><div class="' + goog.getCssName('goog-button') + ' ' + goog.getCssName('form-button') + ' ' + goog.getCssName('text-button') + '" style="float:left;">Add</div><div style="clear:both"></div></div></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
spo.template.NewControlTeam = function(opt_data) {
  return '<div class="' + goog.getCssName('new-user-container') + '"><div class="' + goog.getCssName('new-user-error-container') + ' ' + goog.getCssName('bold') + ' ' + goog.getCssName('error') + '"></div><div><div class="' + goog.getCssName('new-user-input-container') + '" style="float:left"><input label="add new team" type="text" /></div><div class="' + goog.getCssName('goog-button') + ' ' + goog.getCssName('form-button') + ' ' + goog.getCssName('text-button') + '" style="float:left;">Add</div><div style="clear:both"></div><div class="' + goog.getCssName('new-control-user-checks') + '"><div class="' + goog.getCssName('checkbox') + '"><span class="' + goog.getCssName('decorate') + ' ' + goog.getCssName('goog-checkbox-unchecked') + '"></span>worldpress</div><div class="' + goog.getCssName('checkbox') + '"><span class="' + goog.getCssName('decorate') + ' ' + goog.getCssName('goog-checkbox-unchecked') + '"></span>validate meeting</div><div class="' + goog.getCssName('checkbox') + '"><span class="' + goog.getCssName('decorate') + ' ' + goog.getCssName('goog-checkbox-unchecked') + '"></span>inteligence</div><div class="' + goog.getCssName('checkbox') + '"><span class="' + goog.getCssName('decorate') + ' ' + goog.getCssName('goog-checkbox-unchecked') + '"></span>validate messages</div><div class="' + goog.getCssName('checkbox') + '"><span class="' + goog.getCssName('decorate') + ' ' + goog.getCssName('goog-checkbox-unchecked') + '"></span>rest of the world</div><div style="clear:both"></div></div></div>';
};
