/**
 * @fileoverview  Provides the login screen entry point.
 */

goog.provide('login');

goog.require('goog.dom');
goog.require('pstj.mvc.SimpleRouter');
goog.require('spo.screen.Login');

login = function() {
  var screen = goog.dom.getElement('screen');
  var loginscreen = new spo.screen.Login();
  var router = new pstj.mvc.SimpleRouter();

  router.route('/forgotpass', function() {
    loginscreen.setLostPassMode(true);
  });
  router.route('', function() {
    loginscreen.setLostPassMode(false);
  });
  router.setEnabled(true);

  loginscreen.render(screen);
};

/**
 * Auto load the screen. This is controversial because we assume the
 * elements are ready before onload, however the history API support
 * insist on putting an input in the body and overriding the whole html..
 */
login();

