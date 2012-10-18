/**
 * @fileoverview Provide the entry point for /admin path
 */
goog.provide('admin');

goog.require('goog.dom');
goog.require('spo.admin.Router');
goog.require('spo.control.LiveList');
goog.require('spo.ds.Resource');
goog.require('spo.template');
goog.require('spo.ui.Header');
goog.require('spo.control.Game');

/**
 * Entry point for the admin view
 */
admin = function() {
  var screen = goog.dom.getElement('screen');
  screen.innerHTML = spo.template.admin();

  var header_element = goog.dom.getElementByClass(goog.getCssName('header'),
    screen);
  var header = new spo.ui.Header.getInstance();
  header.decorate(header_element);

  var contentElement = goog.dom.getElementByClass(goog.getCssName('content'),
    screen);
  var currentView = null;
  var Router = spo.admin.Router.getInstance();

  /**
   * Enable switching active screen with callback. This is if we want to perform
   * something nice for the eye without distorting the view and logic
   * @param {!spo.control.Base} screen The screen to enable next
   */
  function setActiveScreen(app) {
    console.log('change screen')
    if (currentView != null) {
      console.log('tell the current view to disapear');
      currentView.setEnabled(false, function() {
        app.setEnabled(true);
      });
    } else {
      app.setEnabled(true);
    }
    currentView = app;
  }

  var gamesScreen = new spo.control.LiveList(contentElement);

  /** Never serve empty url, all URI should point to a meaningful state of the
   app */
  Router.route('', function() {
    setTimeout(function(){
      Router.navigate('/games');
    }, 0);
  });

  /** The default view, list all games */
  Router.route('/games', function() {
    // Assume game list
    header.setViewName('dashboard');
    header.setGameName();
    setActiveScreen(gamesScreen);
  });

  /** Detailed view of a game, an ID is used to figure out the game */
  Router.route('/game/:id', function(fragment, id) {
    var gamed = new spo.control.Game(contentElement);
    setActiveScreen(gamed);
  });

  Router.setEnabled(true);

};

/**
 * Auto invoke the admin panel loading. Do not wait for onload event
 * because of the history handling.
 * TODO: Notify PlastronJS developer for the issue of body overriding when
 * call is made to MVC#setEnable after the load event has fired.
 */
admin();
