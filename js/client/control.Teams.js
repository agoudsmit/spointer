goog.provide('spo.control.Teams');

goog.require('spo.control.Base');
goog.require('spo.control.Users');
goog.require('spo.ds.GameList');
goog.require('spo.ds.TeamList');
goog.require('spo.ds.UserList');
goog.require('spo.ui.Header');
goog.require('spo.ui.NewTeam');
goog.require('spo.ui.Team');
goog.require('spo.ui.TeamList');

/**
 * Provides the Teams view control.
 *
 * @constructor
 * @extends {spo.control.Base}
 * @param {!Element} container The DOM element to consider as render base for
 *                            the views.
 * @param {pstj.ds.RecordID} gameid The ID of the game to handle teams for.
 * @param {pstj.ds.RecordID} selectedTeamId The ID of the team to select when
 *                                          the team data is loaded.
 */
spo.control.Teams = function(container, gameid, selectedTeamId) {
  goog.base(this, container);
  this.gameId_ = gameid;
  this.selectedTeamId_ = selectedTeamId;

  this.view_ = new pstj.ui.CustomScrollArea();
  this.view_.setScrollInsideTheWidget(false);

  // Cache the load users as it will be invoked multiple times.
  this.loadUsers_cached_ = goog.bind(this.loadUsers, this);

  this.init();
};
goog.inherits(spo.control.Teams, spo.control.Base);

/**
 * The main view for this controller.
 *
 * @type {pstj.ui.CustomScrollArea}
 * @private
 */
spo.control.Teams.prototype.view_;

/**
 * The live list of games. This is needed to extract the game details for
 * the view and updates as the teams are locked to a game id.
 *
 * @type {pstj.ds.List}
 * @private
 */
spo.control.Teams.prototype.gamesList_;

/**
 * The live list of teams corresponding to the game id of this controller.
 *
 * @type {pstj.ds.List}
 * @private
 */
spo.control.Teams.prototype.teamsList_;

/**
 * The ID of the currently selected team. Used for UI indication of the active
 * team and updates.
 *
 * @type {pstj.ds.RecordID}
 * @private
 */
spo.control.Teams.prototype.selectedTeamId_;

/**
 * The id of the game that this control is locked on.
 *
 * @type {pstj.ds.RecordID}
 * @private
 */
spo.control.Teams.prototype.gameId_;

/**
 * Pointer to the User control instance for this control. The instance is
 * designed to be re-usable, so one can initialize it multiple times with
 * different lists (i.e. visualize and work with multiple teams without
 * dreating a new control each time).
 *
 * @type {spo.control.Users}
 * @private
 */
spo.control.Teams.prototype.usersControl_;

/**
 * Getter for the game id that the control is handing on.
 *
 * @return {pstj.ds.RecordID} The ID of the game that is currently attached in
 *                                the constroller.
 */
spo.control.Teams.prototype.getId = function() {
  return this.gameId_;
};

/**
 * Initialize the control after its creation.
 */
spo.control.Teams.prototype.init = function() {
  this.inited_ = true;

  var games = spo.ds.GameList.getList();
  var teams = spo.ds.TeamList.map.getList(this.gameId_);

  goog.async.DeferredList.gatherResults([games, teams]).addCallback(
    goog.bind(this.load_, this));
};

/**
 * Loads the results into the controller from the deferred object and
 * initializes the views.
 *
 * @param {Array.<pstj.ds.List>} results The list of List instances to use.
 * @private
 */
spo.control.Teams.prototype.load_ = function(results) {
  this.gamesList_ = results[0];
  this.teamsList_ = results[1];
  this.loadView();
};

/**
 * Loads the view of the controller. This method should be strictly used
 * internally only.
 *
 * @protected.
 */
spo.control.Teams.prototype.loadView = function() {
  var game = this.gamesList_.getById(this.gameId_);

  // Setup the header for this team view.
  spo.ui.Header.getInstance().setViewName('manage teams/users');
  spo.ui.Header.getInstance().setLinks('/game/' + this.gameId_, 'game details');
  spo.ui.Header.getInstance().setGameName(game.getProp(
    spo.ds.Game.Property.NAME).toString());


  this.view_.render(this.container_);

  var newteam = new spo.ui.NewTeam(this.gameId_);
  var teamlistview = new spo.ui.TeamList();
  this.view_.addChild(teamlistview, true);
  teamlistview.addChild(newteam, true);

  var len = this.teamsList_.getCount();
  var team;
  for (var i = 0; i < len; i++) {
    team = new spo.ui.Team();
    team.setModel(this.teamsList_.getByIndex(i));
    teamlistview.addChild(team, true);
  }
  // Create the user list control.
  this.usersControl_ = new spo.control.Users(
    /** @type {!Element} */ (this.view_.getContentElement()));

  this.setupListeners_();

  // If a team was pre-selected, reflect it in the controller.
  if (goog.isDef(this.selectedTeamId_)) {
    this.setSelectedTeam(this.selectedTeamId_);
  }
};

/** @inheritDoc */
spo.control.Teams.prototype.disposeInternal = function() {
  this.view_.exitDocument();
  goog.dispose(this.usersControl_);
  goog.dispose(this.view_);
  delete this.loadUsers_cached_;
  delete this.usersControl_;
  delete this.inited_;
  delete this.view_;
  delete this.gamesList_;
  delete this.teamsList_;
  delete this.selectedTeamId_;
  delete this.gameId_;
};


/**
 * Helper function: retrieves the 'Teams' component. Allows for more
 * robust access to the list of 'team' components (this is useful if the
 * placement of the component changes).
 *
 * @private
 * @return {spo.ui.TeamList} The component that is parent of the team ui list.
 */
spo.control.Teams.prototype.getTeamListComponent_ = function() {
  return /** @type {spo.ui.TeamList} */ (this.view_.getChildAt(0));
};

/**
 * Retrieves the Team component by index from the Team list component.
 * Accounts for the offsetting components before the actual list that are
 * also children of the parent component. Utility method.
 *
 * @param  {pstj.ds.RecordID} tid The DATA id to retrieve comonent by. I.e. this
 *                                is the unique id of the data record, using
 *                                it one can find the data in the list records.
 * @private
 * @return {spo.ui.Team} The Team component matching the index.
 */
spo.control.Teams.prototype.getTeamComponentByDataId_ = function(tid) {
  var index = this.teamsList_.getIndexById(tid);
  var parent = this.getTeamListComponent_();
  return /** @type {spo.ui.Team} */ (parent.getChildAt(index + 1));
};

/**
 * Setups the selected team by its ID. This will load the team users.
 * @param {pstj.ds.RecordID} teamid The ID of the team to show.
 */
spo.control.Teams.prototype.setSelectedTeam = function(teamid) {

  console.log('getting team members for team', teamid);

  // First, find the 'old' selected team index and remove the hghlight from it.
  if (goog.isDef(this.selectedTeamId_)) {
    this.getTeamComponentByDataId_(this.selectedTeamId_).setActive(false);
  }

  this.selectedTeamId_ = teamid;

  // Show selection 'highlight' in team list
  this.getTeamComponentByDataId_(this.selectedTeamId_).setActive(true);

  spo.ds.UserList.map.getList(this.selectedTeamId_).addCallback(
    this.loadUsers_cached_);
};


/**
 * Setups the list of user to be displayed in the subcontrol responsible
 * for the user lists.
 * @param  {pstj.ds.List} list The user list.
 */
spo.control.Teams.prototype.loadUsers = function(list) {
  this.usersList_ = list;
  this.usersControl_.setList(this.teamsList_.getById(
    this.selectedTeamId_), this.usersList_);
};

/**
 * Sets up the listeners in this control. Just listens for ACTION on the list.
 *
 * @private
 */
spo.control.Teams.prototype.setupListeners_ = function() {
  this.getHandler().listen(this.view_.getChildAt(0),
    goog.ui.Component.EventType.ACTION, this.handleTeamClick);
  this.getHandler().listen(this.teamsList_, pstj.ds.List.EventType.ADD,
    this.handleAddTeam_);
};

/**
 * Handles the event of adding a new item in the list of teams (ds).
 *
 * @param  {goog.events.Event} ev The ADD event.
 * @private
 */
spo.control.Teams.prototype.handleAddTeam_ = function(ev) {
  var data = ev.getNode();
  var team = new spo.ui.Team();
  team.setModel(data);
  this.getTeamListComponent_().addChildAt(team, this.teamsList_.getIndexByItem(
    data) + 1, true);
};

/**
 * Handler for the ACTION event from the list of teams component.
 *
 * @param  {goog.events.Event} ev The ACTION event from a child component.
 * @private
 */
spo.control.Teams.prototype.handleTeamClick = function(ev) {
  var num = ev.target.getModel().getId();

  spo.admin.Router.getInstance().navigate('/teams/' + this.gameId_ + '/' +
    num);
};

spo.control.Teams.prototype.setEnabled = function(enable, fn) {
  if (!enable) {
    goog.dispose(this);
    fn();
  }
};
