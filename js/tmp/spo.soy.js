// This file was automatically generated from spo.soy.
// Please don't edit this file by hand.

goog.provide('spo.template');

goog.require('soy');


spo.template.clock = function(opt_data) {
  return '<div>time <span class="' + goog.getCssName('time') + ' ' + goog.getCssName('bold') + '">' + soy.$$escapeHtml(opt_data.time) + '</span></div><div>date <span class="' + goog.getCssName('date') + ' ' + goog.getCssName('bold') + '">' + soy.$$escapeHtml(opt_data.date) + '</span></div>';
};


spo.template.header = function(opt_data) {
  return '<div class="' + goog.getCssName('header') + '"><h1>InterAct</h1><div class="' + goog.getCssName('to-right') + '"><div class="' + goog.getCssName('date-time') + '"></div><div>You are not logged in</div></div></div>';
};


spo.template.headerWithLogin = function(opt_data) {
  return '<h1>InterAct</h1><h3 class="' + goog.getCssName('live') + ' ' + goog.getCssName('game-name') + '"></h3><h2 class="' + goog.getCssName('live') + ' ' + goog.getCssName('view-name') + '"></h2><div class="' + goog.getCssName('to-right') + '"><div class="' + goog.getCssName('date-time') + '"></div><div>You are logged in as <span class="' + goog.getCssName('bold') + '">' + soy.$$escapeHtml(opt_data.username) + '</span></div><div><a class="' + goog.getCssName('header-link') + '" href="' + soy.$$escapeHtml(opt_data.logoutlink) + '">Log out</a></div><div class="' + goog.getCssName('input') + '"><input class="' + goog.getCssName('live') + ' ' + goog.getCssName('search-input') + '" style="display: none;" type="text" /></div></div><div class="' + goog.getCssName('back-link') + '"></div><div class="' + goog.getCssName('forward-link') + '"></div>';
};


spo.template.loginForm = function(opt_data) {
  return '<div class="' + goog.getCssName('login-panel') + '"><div class="' + goog.getCssName('greeting') + '"></div><form action="' + soy.$$escapeHtml(opt_data.loginurl) + '" method="post" accept-charset="utf-8"><div class="' + goog.getCssName('input') + '"><input id="loginemail" name="loginemail" type="text" label="Name" /></div><div class="' + goog.getCssName('login-mode') + '" style="display:none;"><div class="' + goog.getCssName('input') + '"><input id="password" name="password" type="password" label="Password" class="' + goog.getCssName('input-password') + '" /></div><div><a href="#/forgotpass"><span class="' + goog.getCssName('link') + '">Lost your password?</span></a></div></div><div class="' + goog.getCssName('forgotpass-mode') + '" style="display:none;"><div><a href="#"><span class="' + goog.getCssName('link') + '">Return to login form</span></a></div></div><div style="clear:both;"></div><div style="float:right;position:relative;width:25px;height:25px;top:-50px;left: -10px"><div class="' + goog.getCssName('goog-button') + ' ' + goog.getCssName('form-button') + '"></div></div></form></div>';
};


spo.template.login = function(opt_data) {
  return '<div class="' + goog.getCssName('fullscreen') + '">' + spo.template.header(null) + '<div class="' + goog.getCssName('content') + '"><div class="' + goog.getCssName('center-both') + '">' + spo.template.loginForm(opt_data) + '</div></div></div>';
};


spo.template.admin = function(opt_data) {
  return '<div class="' + goog.getCssName('fullscreen') + '"><div class="' + goog.getCssName('header') + '"><!-- put here the header widget --></div><div class="' + goog.getCssName('content') + '"></div></div>';
};


spo.template.screenWithTileList = function(opt_data) {
  return '<div class="' + goog.getCssName('left-panel-sixty') + '"><div class="' + goog.getCssName('tile-list-container') + '"></div></div><div class="' + goog.getCssName('right-panel-fourty') + '"></div><div class="' + goog.getCssName('top-panel') + '"><span class="' + goog.getCssName('back-button') + '" aria-hidden="true" data-icon="&#x21;"></span><span class="' + goog.getCssName('main-header') + '">' + soy.$$escapeHtml(opt_data.title) + '</span><input name="searchterm" type="text" label="Search for game" class="' + goog.getCssName('search-field') + '"></input></div>';
};


spo.template.gameTile = function(opt_data) {
  return '<div class="' + goog.getCssName('tile-item') + ' ' + goog.getCssName('scroll-list-item') + '"><div class="' + goog.getCssName('tile-inner-container') + '"><div class="' + goog.getCssName('tile-body') + '"><div class="' + goog.getCssName('game-name') + '">' + soy.$$escapeHtml(opt_data.name) + '</div><div>Users: ' + soy.$$escapeHtml(opt_data.playercount) + '</div><div>Game started: ' + soy.$$escapeHtml(opt_data.starttime) + '</div><div>Current time: <span class="' + goog.getCssName('game-time') + '"></span></div><div>State: <span class="' + goog.getCssName('game-status') + '">' + soy.$$escapeHtml(opt_data.status) + '</span></div></div></div></div>';
};


spo.template.createGame = function(opt_data) {
  return '<div class="' + goog.getCssName('tile-item') + ' ' + goog.getCssName('scroll-list-item') + '"><div class="' + goog.getCssName('tile-inner-container') + '"><div class="' + goog.getCssName('tile-body') + '"><div class="' + goog.getCssName('input') + '"><input id="gamename" name="gamename" type="text" label="' + soy.$$escapeHtml(opt_data.hint) + '" /></div><div class="' + goog.getCssName('error') + ' ' + goog.getCssName('bold') + '"></div><div class="' + goog.getCssName('bottom-right') + '"><div class="' + goog.getCssName('goog-button') + ' ' + goog.getCssName('form-button') + ' ' + goog.getCssName('text-button') + '">Confirm</div></div></div></div></div>';
};


spo.template.uploadForms = function(opt_data) {
  return '<div class="' + goog.getCssName('hidden-form') + '"><form method="post" enctype="multipart/form-data" action="' + soy.$$escapeHtml(opt_data.action_upload_scenario) + '" name="uploadscenario"><input type="hidden" value="' + soy.$$escapeHtml(opt_data.gameid) + '" name="game_id" /><input name="file" type="file" style="display: none;" class="' + goog.getCssName('monitor') + '" id="scenario" /></form><form method="post" enctype="multipart/form-data" action="' + soy.$$escapeHtml(opt_data.action_upload_teams) + '" name="uploadteams"><input type="hidden" value="' + soy.$$escapeHtml(opt_data.gameid) + '" name="game_id" /><input name="file" type="file" style="display: none;" class="' + goog.getCssName('monitor') + '" id="teamlist" /></form></div>';
};


spo.template.gameSettings = function(opt_data) {
  return '<div class="' + goog.getCssName('column-one') + '"><div class="' + goog.getCssName('notification-area') + '">&nbsp;</div><div class="detail-heading">Game description</div><div class="game-description">' + soy.$$escapeHtml(opt_data.description) + '</div><div class="' + goog.getCssName('hr') + '"></div><div class="detail-heading">Game date <span class="game-date"></span></div><div class="' + goog.getCssName('hr') + '"></div><div class="detail-heading">Game time <span class="game-time"></span></div><div class="' + goog.getCssName('hr') + '"></div><div class="detail-heading">Change game time</div><div>One day passes in <span class="detail-heading"></span> minute(s)</div><div class="goog-slider"></div></div>';
};


spo.template.gameControls = function(opt_data) {
  return '<div class="' + goog.getCssName('game-controls') + '"><div class="' + goog.getCssName('game-control-item') + ' ' + goog.getCssName('form-button') + ' ' + goog.getCssName('goog-button') + ' ' + goog.getCssName('pause-button') + ' ' + goog.getCssName('circle-button') + '" data-action="pause"></div><div class="' + goog.getCssName('game-control-item') + ' ' + goog.getCssName('form-button') + ' ' + goog.getCssName('goog-button') + ' ' + goog.getCssName('stop-button') + ' ' + goog.getCssName('circle-button') + '" data-action="stop"></div><div class="' + goog.getCssName('game-control-item') + ' ' + goog.getCssName('form-button') + ' ' + goog.getCssName('goog-button') + ' ' + goog.getCssName('delete-button') + ' ' + goog.getCssName('circle-button') + '" data-action="delete"></div><div class="' + goog.getCssName('game-control-item') + ' ' + goog.getCssName('form-button') + ' ' + goog.getCssName('goog-button') + ' ' + goog.getCssName('edit-button') + ' ' + goog.getCssName('circle-button') + '" data-action="edit"></div><div class="' + goog.getCssName('game-control-item') + ' ' + goog.getCssName('text-button') + ' ' + goog.getCssName('form-button') + ' ' + goog.getCssName('goog-button') + '" data-action="uploaduser" style="position:relative;top:5px;float:right;margin-right:11px;">Upload user/team list</div><div class="' + goog.getCssName('game-control-item') + ' ' + goog.getCssName('text-button') + ' ' + goog.getCssName('form-button') + ' ' + goog.getCssName('goog-button') + '" data-action="managecontrols" style="position:relative;top:5px;float:right;margin-right:11px">Manage controls</div><div class="' + goog.getCssName('game-control-item') + ' ' + goog.getCssName('text-button') + ' ' + goog.getCssName('form-button') + ' ' + goog.getCssName('goog-button') + '" data-action="uploadscenario" style="position:relative;top:5px;float:right;margin-right:11px;">Upload scenario</div></div>';
};


spo.template.gameDetails = function(opt_data) {
  return '<div class="' + goog.getCssName('game-details') + '"><div class="' + goog.getCssName('back-link') + '"></div><div class="' + goog.getCssName('forward-link') + '"></div><div class="' + goog.getCssName('game-controls') + '"></div><div class="' + goog.getCssName('column-one') + ' ' + goog.getCssName('float-left') + '">' + spo.template.gameSettings(opt_data) + '</div><div class="' + goog.getCssName('column-two') + ' ' + goog.getCssName('float-left') + '"></div><div class="' + goog.getCssName('column-three') + ' ' + goog.getCssName('float-left') + '"></div></div>';
};


spo.template.simplelist = function(opt_data) {
  var output = '<div class="' + goog.getCssName('simple-list') + '"><div class="' + goog.getCssName('simple-list-title') + '">' + soy.$$escapeHtml(opt_data.title) + '</div><ul class="' + goog.getCssName('simple-list-list') + '">';
  var nameList323 = opt_data.teams;
  var nameListLen323 = nameList323.length;
  for (var nameIndex323 = 0; nameIndex323 < nameListLen323; nameIndex323++) {
    var nameData323 = nameList323[nameIndex323];
    output += '<li>' + soy.$$escapeHtml(nameData323) + '</li>';
  }
  output += '</ul></div>';
  return output;
};
