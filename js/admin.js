/**
 * @fileoverview Provide the entry point for /admin path.
 */
goog.provide('admin');

goog.require('goog.dom');
goog.require('spo.admin.Router');
goog.require('spo.control.Game');
goog.require('spo.control.LiveList');
goog.require('spo.control.Teams');
goog.require('spo.ds.Resource');
goog.require('spo.ds.STP');
goog.require('spo.template');
goog.require('spo.ui.Header');
goog.require('spo.widget.SystemClock');
goog.require('spo.ds.TeamList');
goog.require('spo.ds.UserList');


/**
 * Entry point for the administrator view
 */
admin = function() {
  // Initialize server clock, multiply by 1k as the server time is provided
  // in seconds.
  spo.ds.STP.getInstance().setServerTime(goog.global['SERVER_TIME'] * 1000);


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
   * @param {!spo.control.Base} app The screen to enable next.
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
    setTimeout(function() {
      Router.navigate('/games');
    }, 0);
  });

  /** The default view, list all games */
  Router.route('/games', function() {
    // Assume game list
    header.setViewName('dashboard');
    header.setGameName();
    spo.ui.Header.getInstance().setClockInstance(new spo.widget.SystemClock());
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
    /** @type {function(string, ...[string]): ?} */ (function(fragment,
      id, tid) {
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


  // Enable tearing down data structures.
  spo.ds.Resource.getInstance().registerResourceHandler('/game/teardown/:id',
    function(response) {
      // The game ID to tear down
      var gid = response['content']['id'];

      // Hack: because it is much easier to just make reload of the data
      // instead of tearing down and rebuilding when the user is inside the view
      // just force reload.
      if (currentView instanceof spo.control.Game &&
        currentView.getId() == gid) {
        window.location.reload(true);
      }
      if (currentView instanceof spo.control.Teams &&
        currentView.getId() == gid) {
        window.location.reload(true);
      }

      // Finally, if we do not look at one of the affected controls,
      // tear down the data.
      //
      // find the list of teams for this game;
      // If there is a deferred created, cancel it.
      if (spo.ds.TeamList.map.hasList(gid)) {
        spo.ds.TeamList.map.cancel(gid);
        // the team list was loaded, iterate over the items on it, get the ID
        // of the team and tear down any user lists matching the current ID.
        var list = spo.ds.TeamList.map.getDirect(gid);
        var len = list.getCount();
        var tid;
        for (var i = 0; i < len; i++) {
          tid = list.getByIndex(i).getId();
          if (spo.ds.UserList.hasList(tid)) {
            spo.ds.UserList.tearDown(tid);
          }
        }
        // Finally tear down the team list as well.
        spo.ds.TeamList.map.tearDown(gid);
      }
  });

  Router.setEnabled(true);

};

/**
 * Auto invoke the administrator panel loading. Do not wait for "on load" event
 * because of the history handling.
 * TODO: Notify PlastronJS developer for the issue of body overriding when
 * call is made to MVC#setEnable after the load event has fired.
 */
admin();
