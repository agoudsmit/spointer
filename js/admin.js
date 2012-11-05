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
goog.require('spo.control.Teams');

/**
 * Entry point for the admin view
 */
admin = function() {
  var screen = goog.dom.getElement('screen');
  screen.innerHTML = spo.template.admin({});

  var header_element = goog.dom.getElementByClass(goog.getCssName('header'),
    screen);
  var header = spo.ui.Header.getInstance();
  header.decorate(header_element);

  var contentElement = /** @type {!Element} */(goog.dom.getElementByClass(
    goog.getCssName('content'),
      screen));
  var currentView = null;
  var Router = spo.admin.Router.getInstance();

  /**
   * Enable switching active screen with callback. This is if we want to perform
   * something nice for the eye without distorting the view and logic
   * @param {!spo.control.Base} app The screen to enable next
   */
  function setActiveControl(app) {
    if (currentView != null) {
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
    setActiveControl(gamesScreen);
  });

  /** Detailed view of a game, an ID is used to figure out the game */
  Router.route('/game/:id{/:edit}',
    /** @type {function(string, ...[string]): ?} */ (function(fragment,
      id, edit) {
    var gid = /** @type {!string} */ id;
    if (!goog.isString(gid)) {
      throw Error('Cannot create game control without game id.');
    }
    var gamed = new spo.control.Game(contentElement, gid, edit);
    setActiveControl(gamed);
  }));

  /** The team/user edit view */
  Router.route('/teams/:id{/:tid}',
    /** @type {function(string, ...[string]): ?} */ (function(fragment, id, tid) {
    var gid = /** @type {!string} */ id;

    if (!goog.isString(gid)) {
      throw Error('Cannot create game control without game id.');
    }

    if (currentView instanceof spo.control.Teams) {
      if (currentView.getId() == gid) {
        currentView.setSelectedTeam(tid);
        return;
      }
    }
    var teamcontrol = new spo.control.Teams(contentElement, gid, tid);
    setActiveControl(teamcontrol);
  }));

  Router.setEnabled(true);

};

/**
 * Auto invoke the admin panel loading. Do not wait for onload event
 * because of the history handling.
 * TODO: Notify PlastronJS developer for the issue of body overriding when
 * call is made to MVC#setEnable after the load event has fired.
 */
admin();
