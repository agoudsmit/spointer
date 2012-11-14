goog.provide('spo.control.Game');

goog.require('goog.async.Deferred');
goog.require('goog.async.DeferredList');
goog.require('goog.dom.classes');
goog.require('pstj.ds.ListItem.EventType');
goog.require('pstj.ui.CustomScrollArea');
goog.require('spo.admin.Router');
goog.require('spo.control.Base');
goog.require('spo.control.EventType');
goog.require('spo.ds.ControlTeam');
goog.require('spo.ds.ControlTeamList');
goog.require('spo.ds.Game');
goog.require('spo.ds.GameList');
goog.require('spo.ds.Resource');
goog.require('spo.ds.Team');
goog.require('spo.ds.TeamList');
goog.require('spo.ui.Forms');
goog.require('spo.ui.GameControls');
goog.require('spo.ui.GameDetails');
goog.require('spo.ui.GameEdit');

/**
 * Provides the game details control.
 * @constructor
 * @extends {spo.control.Base}
 * @param {!Element} container The element to render the view of the controler
 * in.
 * @param {!string} gameid The ID of the game to render.
 * @param {string} edit If the game should be in edit state.
 */
spo.control.Game = function(container, gameid, edit) {
  goog.base(this, container);

  if (edit == 'edit') {
    this.editMode_ = true;
  }

  this.gameId_ = gameid;
  this.view_ = new pstj.ui.CustomScrollArea();
  this.view_.setScrollInsideTheWidget(false);

  // Init immediately, this view is disposable
  this.init();
};
goog.inherits(spo.control.Game, spo.control.Base);

/**
 * Getter for the current game id controlled.
 * @return {string} The game id.
 */
spo.control.Game.prototype.getId = function() {
  return this.gameId_;
};

/**
 * If the game is in edit mode (i.e. editable content)
 * @type {boolean}
 * @private
 */
spo.control.Game.prototype.editMode_ = false;
/**
 * The Game ID that is viewed by this control.
 * @type {string}
 * @private
 */
spo.control.Game.prototype.gameId_;

/**
 * The forms control used to upload files.
 * @type {goog.ui.Component}
 * @private
 */
spo.control.Game.prototype.hiddenForms_;

/**
 * @type {spo.ds.GameList} The game list used by the controller.
 * @private
 */
spo.control.Game.prototype.gamelist_;
/**
 * @type {spo.ds.TeamList}
 * @private
 */
spo.control.Game.prototype.teamlist_;
/**
 * @type {Array}
 * @private
 */
spo.control.Game.prototype.playerslist_;
/**
 * @type {spo.ds.ControlTeamList}
 * @private
 */
spo.control.Game.prototype.cteamList_;
/**
 * @type {Array}
 * @private
 */
spo.control.Game.prototype.cplayerslist_;

/**
 * Initialize the view.
 */
spo.control.Game.prototype.init = function() {
  this.inited_ = true;
  var gamesdef = spo.ds.GameList.getList();
  var teamsdef = spo.ds.TeamList.getList(this.gameId_);
  var cteamsdef = spo.ds.ControlTeamList.getList(this.gameId_);
  var playersdef = new goog.async.Deferred();
  var cplayersdef = new goog.async.Deferred();
  goog.async.DeferredList.gatherResults(
    [gamesdef, teamsdef, playersdef, cteamsdef, cplayersdef]).addCallback(
    goog.bind(this.load_, this));

  spo.ds.Resource.getInstance().get({
    'url': '/game_players/' + this.gameId_
  }, function(response) {
    if (response['status'] != 'ok') playersdef.errback();
    else playersdef.callback(response['content']['players']);
  });

  spo.ds.Resource.getInstance().get({
    'url': '/game_control_users/' + this.gameId_
  }, function(response) {
    if (response['status'] != 'ok') playersdef.errback();
    else cplayersdef.callback(response['content']['controlUsers']);
  });

};

/**
 * If the game control should be disabled (i.e. the game is viewed
 * but is locked by another user).
 * @type {boolean}
 * @private
 */
spo.control.Game.prototype.disabled_ = false;

/**
 * Load the data returned by the deferred requests
 * @param  {Array} lists The lists that have been requested by the deferred.
 * @private
 */
spo.control.Game.prototype.load_ = function(lists) {
  this.gamelist_ = lists[0];
  this.teamlist_ = lists[1];
  this.playerslist_ = lists[2];
  this.cteamList_ = lists[3];
  this.cplayerslist_ = lists[4];

  this.loadView();

  spo.ds.Resource.getInstance().get({
    'url': '/game/lock/' + this.gameId_
  }, goog.bind(function(resp) {
    if (resp['status'] != 'ok') {
      this.view_.getChildAt(1).setNotification(
        'Game is locked by nother user!');
      this.disabled_ = true;
    }
  }, this));
};

/**
 * Load the view into existence.
 */
spo.control.Game.prototype.loadView = function() {

  this.view_.render(this.container_);
  // Set blue, by design...
  goog.dom.classes.add(this.view_.getElement(),
    goog.getCssName('colored-content'));

  var gc = new spo.ui.GameControls();
  this.view_.addChildAt(gc, 0, true);
  // Update the game control view to match the game state
  this.updatePauseControl_();

  // Create the game details view
  var gd = new spo.ui.GameDetails();
  var dsGame = this.gamelist_.getById(this.gameId_);
  gd.setModel(dsGame);
  this.view_.addChildAt(gd, 1, true);

  // Setup the forms for file upload
  this.hiddenForms_ = new spo.ui.Forms();
  this.hiddenForms_.setModel(this.gamelist_.getById(this.gameId_));
  this.view_.addChildAt(this.hiddenForms_, 2, true);

  // Setup the header attributes to match the view
  spo.ui.Header.getInstance().setViewName('game details');
  spo.ui.Header.getInstance().setGameName(
    dsGame.getProp(spo.ds.Game.Property.NAME).toString());
  console.log('takoa...', this.gameId_)
  console.log('Setting the links now...')
  spo.ui.Header.getInstance().setLinks('/games','dashboard', '/teams/' +
    this.gameId_, 'manage users/teams');


  // create the list views
  var column2 = goog.dom.getElementByClass(goog.getCssName(
    'column-two'), gd.getElement());
  var column3 = goog.dom.getElementByClass(goog.getCssName(
    'column-three'), this.view_.getElement());
  var i;

  var teamnames = [];
  var len = this.teamlist_.getCount();
  for (i = 0; i < len; i++) {
    teamnames.push(this.teamlist_.getByIndex(i).getProp(
      spo.ds.Team.Property.NAME));
  }
  var cteamnames = [];
  len = this.cteamList_.getCount();
  for (i = 0; i < len; i++) {
    cteamnames.push(this.cteamList_.getByIndex(i).getProp(
      spo.ds.ControlTeam.Property.NAME));
  }
  var playernames = [];
  len = this.playerslist_.length;
  for (i = 0; i < len; i++) {
    playernames.push(this.playerslist_[i]['name']);
  }
  var cplayersnames = [];
  len = this.cplayerslist_.length;
  for (i = 0; i < len; i++) {
    cplayersnames.push(this.cplayerslist_[i]['name']);
  }
  var lists = '<div class="' + goog.getCssName('column-two') +
  ' ' + goog.getCssName('float-left') + '">';
  lists += spo.template.simplelist({
    title: 'Teams',
    teams: teamnames
  });
  lists += spo.template.simplelist({
    title: 'Users',
    teams: playernames
  });
  lists += '</div>';
  goog.dom.appendChild(this.view_.getContentElement(),
    goog.dom.htmlToDocumentFragment(lists));

  lists = '<div class="' + goog.getCssName('column-three') +
    ' ' + goog.getCssName('float-left') + '">';
  lists += spo.template.simplelist({
    title: 'Control Teams',
    teams: cteamnames
  });
  lists += spo.template.simplelist({
    title: 'Control Users',
    teams: cplayersnames
  });
  lists += '</div>';
  goog.dom.appendChild(this.view_.getContentElement(),
    goog.dom.htmlToDocumentFragment(lists));

  // Setup any listeners for this view.
  this.setupListeners_();
};


/**
 * This method should be called to switch between edit and view state of the
 * games details only after it was initially rendered, regardless of the initial
 * state.
 * @param {boolean} enable True if the view should be switched to edit state.
 */
spo.control.Game.prototype.setEditState_ = function(enable) {
  this.editMode_ = enable;
  var oldView = this.view_.getChildAt(1);
  if (oldView instanceof spo.ui.GameEdit && enable) return;

  var newView;
  if (enable) {
    newView = new spo.ui.GameEdit();
  } else {
    newView = new spo.ui.GameDetails();
  }
  newView.setModel(this.getGameRecord());
  this.view_.removeChildAt(1, true);
  this.view_.addChildAt(newView, 1, true);
  if (enable) newView.focusFirstElement();
  this.view_.getChildAt(0).setEditState(this.editMode_);
  oldView.dispose();
};

/**
 * Returns the game record that is matching the viewed game.
 * @return {spo.ds.Game} The game record of this view.
 */
spo.control.Game.prototype.getGameRecord = function() {
  return  /** @type {spo.ds.Game} */ (this.gamelist_.getById(this.gameId_));
};

/**
 * Updates the game control view with the pause/play state of the game.
 * @private
 */
spo.control.Game.prototype.updatePauseControl_ = function() {
  this.view_.getChildAt(0).setPlayState(!this.getGameRecord().isPaused());
};

/**
 * Sets up the listeners for the time of the game being active.
 * @private
 */
spo.control.Game.prototype.setupListeners_ = function() {
  var handler = this.getHandler();
  // Listen for control actions (coming from the control panel, but casted
  // to the parent view)
  handler.listen(this.view_, spo.control.EventType.CONTROL_ACTION,
    this.handleExternalControlAction_);
  // Listen for the uploadd forms events.
  handler.listen(this.hiddenForms_, [spo.control.EventType.SUCCESS,
    spo.control.EventType.FAILURE], this.handleFormUploadFinish_);
  // Listen for game record updates: those are save to assume switching
  // to view (intead of edit) because the game should be uneditable
  // by other users.
  //
  // However the game is updates when player count changes as well, so
  // we need to check with the widget itself first
  handler.listen(this.getGameRecord(), pstj.ds.ListItem.EventType.UPDATE,
    function() {
      if (this.editMode_ && this.view_.getChildAt(1).isSafeToClose()) {
        this.setEditState_(false);
      }
      this.updatePauseControl_();
    });
};



/**
 * Hanlder for the upload of files finish action.
 * @param  {spo.control.Event} e The SUCCESS/FAILURE event from control.
 * @private
 */
spo.control.Game.prototype.handleFormUploadFinish_ = function(e) {
  if (e.type = spo.control.EventType.SUCCESS) {

    console.log(e.formResponse);
    this.view_.getChildAt(1).setNotification('Upload completed!');
    // FIXME: the websocket should send the teardown signal and not from here.
    var response = e.formResponse;
    setTimeout(function() {
      spo.ds.Resource.getInstance().wsShim(response);
    }, 1500);
  } else {
    this.view_.getChildAt(1).setNotification('Upload failed!');
  }
};

/**
 * Handles the action received from children (basically from the view).
 * @param  {spo.control.Event} e The control event (ACTION).
 * @private
 */
spo.control.Game.prototype.handleExternalControlAction_ = function(e) {
  var action = e.getAction();
  if (this.disabled_) {
    this.view_.getChildAt(1).setNotification(
      'Game is locked, actions will not be performed!');
    return;
  }
  if (action == spo.control.Action.UPLOAD_SCENARIO) {
    this.hiddenForms_.enableScneario();
  } else if (action == spo.control.Action.UPLOAD_TEAMLIST) {
    this.hiddenForms_.enableTeam();
  } else if (action == spo.control.Action.MANAGE_CONTROLS) {
    if (this.editMode_) {
      this.view_.getChildAt(1).setNotification('Game is being edited!');
      // Flash error!
    } else {
      // FIXME: enable this when it is ready
      //spo.admin.Router.getInstance().navigate('/control_users/' + this.gameId_);
    }
  } else if (action == spo.control.Action.EDIT) {
    if (this.editMode_ != true) {
      this.setEditState_(true);
    }
  } else if (action == spo.control.Action.DELETE) {
    console.log('Sending XHR');
    spo.ds.Resource.getInstance().get({
      'url': '/game/remove/' + this.gameId_
    }, function(resp) {
      if (resp['status'] == 'ok') {
        spo.admin.Router.getInstance().navigate('/games');
      }
    });
  } else if (action == spo.control.Action.PAUSE ||
      action == spo.control.Action.PLAY) {
    this.syncGameStateToServer_(action);
  }
};

/**
 * Set game state on the server and chekc for errors.
 * @param  {spo.control.Action} action The action to execute.
 */
spo.control.Game.prototype.syncGameStateToServer_ = function(action) {
  var state;
  if (action == spo.control.Action.PAUSE) {
    state = 2;
  } else if (action == spo.control.Action.PLAY) {
    state = 1;
  }
  spo.ds.Resource.getInstance().get({
    'url': '/game/update/' + this.gameId_,
    'data': {
      'state_id': state
    }
  }, goog.bind(function(resp) {
    if (resp['status'] != 'ok') {
      this.view_.getChildAt(1).setNotification('Error: ' +
        resp['error']);
    }
  }, this));
};

/**
 * @inheritDoc
 */
spo.control.Game.prototype.setEnabled = function(enable, fn) {
  if (enable) {

  }
  else {
    goog.dispose(this);
    fn();
  }
};
/**
 * @inheritDoc
 */
spo.control.Game.prototype.disposeInternal = function() {
  spo.ds.Resource.getInstance().get({
    'url': '/game/unlock/' + this.gameId_
  });
  this.view_.exitDocument();
  this.view_.dispose();
  // Should be disposed as it is a child of the main view
  delete this.hiddenForms_;
  delete this.editMode_;
  delete this.gameId_;
  delete this.gamelist_;
  delete this.teamlist_;
  delete this.playerslist_;
  delete this.cteamList_;
  delete this.cplayerslist_;
  goog.base(this, 'disposeInternal');
};
