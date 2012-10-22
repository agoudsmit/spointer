goog.provide('spo.control.Game');

goog.require('goog.async.Deferred');
goog.require('goog.async.DeferredList');
goog.require('goog.dom.classes');
goog.require('pstj.ui.CustomScrollArea');
goog.require('spo.admin.Router');
goog.require('spo.control.Base');
goog.require('spo.control.EventType');
goog.require('spo.ds.ControlTeam');
goog.require('spo.ds.ControlTeamList');
goog.require('spo.ds.Game');
goog.require('spo.ds.Resource');
goog.require('spo.ds.Team');
goog.require('spo.ds.TeamList');
goog.require('spo.ui.Forms');
goog.require('spo.ui.GameControls');
goog.require('spo.ui.GameDetails');

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
 * @type {spo.ds.GameList}
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
//    gc.render(this.view_.getContentElement());
  this.view_.addChildAt(gc, 0, true);

  var gd = new spo.ui.GameDetails();
  var dsGame = this.gamelist_.getById(this.gameId_);
  gd.setModel(dsGame);
  //gd.render(this.view_.getContentElement());
  this.view_.addChildAt(gd, 1, true);

  this.hiddenForms_ = new spo.ui.Forms();
  this.hiddenForms_.setModel(this.gamelist_.getById(this.gameId_));
  this.view_.addChildAt(this.hiddenForms_, 2, true);

  spo.ui.Header.getInstance().setViewName('game details');
  spo.ui.Header.getInstance().setGameName(
    dsGame.getProp(spo.ds.Game.Property.NAME).toString());

  spo.ui.Header.getInstance().setLinks('/games', 'dashboard', '/teams/' +
    this.gameId_, 'manager teams/users');

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

  this.setupListeners_();


};

/**
 * Sets up the listeners for the time of the game being active.
 * @private
 */
spo.control.Game.prototype.setupListeners_ = function() {
  var handler = this.getHandler();
  handler.listen(this.view_, spo.control.EventType.CONTROL_ACTION,
    this.handleExternalControlAction_);

  handler.listen(this.hiddenForms_, [spo.control.EventType.SUCCESS,
    spo.control.EventType.FAILURE], this.handleFormUploadFinish_);
};

/**
 * Hanlder for the upload of files finish action.
 * @param  {spo.control.Event} e The SUCCESS/FAILURE event from control.
 * @private
 */
spo.control.Game.prototype.handleFormUploadFinish_ = function(e) {
  if (e.type = spo.control.EventType.SUCCESS) {
    this.view_.getChildAt(1).setNotification('Upload completed!');
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
  if (action == spo.control.Action.UPLOAD_SCENARIO) {
    this.hiddenForms_.enableScneario();
  } else if (action == spo.control.Action.UPLOAD_TEAMLIST) {
    this.hiddenForms_.enableTeam();
  } else if (action == spo.control.Action.MANAGE_CONTROLS) {
    if (this.editMode_) {
      // Flash error!
    } else {
      spo.admin.Router.getInstance().navigate('/control_users/' + this.gameId_);
    }
  }

};

/**
 * @inheritDoc
 */
spo.control.Game.prototype.setEnabled = function(enable, fn) {
  if (enable) {

  }
  else {
    console.log('call dispose on this view');
    goog.dispose(this);
    fn();
  }
};
/**
 * @inheritDoc
 */
spo.control.Game.prototype.disposeInternal = function() {
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
