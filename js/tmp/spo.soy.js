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
  return '<h1>InterAct</h1><h3 class="' + goog.getCssName('live') + ' ' + goog.getCssName('game-name') + '"></h3><h2 class="' + goog.getCssName('live') + ' ' + goog.getCssName('view-name') + '"></h2><div class="' + goog.getCssName('to-right') + '"><div class="' + goog.getCssName('date-time') + '"></div><div>You are logged in as <span class="' + goog.getCssName('bold') + '">' + soy.$$escapeHtml(opt_data.username) + '</span></div><div><a class="' + goog.getCssName('header-link') + '" href="">Log out</a></div><div class="' + goog.getCssName('live') + ' ' + goog.getCssName('search-input') + '" style="display: none;"><input type="text" /></div></div>';
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
