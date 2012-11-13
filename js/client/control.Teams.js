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
 * @param {Element} container The DOM element to consider as render base for
 *                            the views.
 * @param {number} gameid The ID of the game to handle teams for.
 * @param {number} selectedTeamId The ID of the team to select when the team
 *                                data is loaded.
 */
spo.control.Teams = function(container, gameid, selectedTeamId) {
  goog.base(this, container);
  this.gameId_ = gameid;
  this.selectedTeamId_ = selectedTeamId;

  this.view_ = new pstj.ui.CustomScrollArea();
  this.view_.setScrollInsideTheWidget(false);

  // Cache the load users as it will be invoked multiple times.
  this.loadUsers_cached_ = goog.bind(this.loadUsers, this);

  this.currentlySelectedTeamComponent_ = null;
  this.init();
};
goog.inherits(spo.control.Teams, spo.control.Base);

/**
 * Getter for the game id that the control is handing on.
 *
 * @return {number} The ID of the game that is currently attached in the
 *                      constroller.
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
  var teams = spo.ds.TeamList.getList(this.gameId_);

  goog.async.DeferredList.gatherResults([games, teams]).addCallback(
      goog.bind(this.load_, this));
};

/**
 * Loads the results into the controller from the deferred object and
 * initializes the views.
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

  var newteam = new spo.ui.NewTeam();

  var teamlistview = new spo.ui.TeamList();
  this.view_.addChild(teamlistview, true);
  teamlistview.addChild(newteam);

  var len = this.teamsList_.getCount();
  var team;
  for (var i = 0; i < len; i++) {
    team = new spo.ui.Team();
    team.setModel(this.teamsList_.getByIndex(i));
    teamlistview.addChild(team, true);
  }

  this.usersControl_ = new spo.control.Users(this.view_.getContentElement());

  this.setupListeners_();

  // If a team was pre-selected, reflect it in the controller.
  if (goog.isDef(this.selectedTeamId_)) {
    this.setSelectedTeam(this.selectedTeamId_);
  }
};

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
  delete this.currentlySelectedTeamComponent_;
  delete this.gameId_;
};

spo.control.Teams.prototype.usersControl_;
spo.control.Teams.prototype.view_;
spo.control.Teams.prototype.gamesList_;
spo.control.Teams.prototype.teamsList_;
spo.control.Teams.prototype.selectedTeamId_;
spo.control.Teams.prototype.currentlySelectedTeamComponent_;
spo.control.Teams.prototype.gameId_;


/**
 * Setups the selected team by its ID. This will load the team users.
 * @param {number} teamid The ID of the team to show.
 */
spo.control.Teams.prototype.setSelectedTeam = function(teamid) {

  console.log('getting team members for team', teamid);

  this.selectedTeamId_ = teamid;
  var index = this.teamsList_.getIndexById(teamid);

  console.log('Found index data: ', index);
  console.log(this.teamsList_);

  // Show selection 'highlight' in team list
  this.currentlySelectedTeamComponent_ = this.view_.getChildAt(0).getChildAt(
    index);
  this.currentlySelectedTeamComponent_.setActive(true);
  var ulist = spo.ds.UserList.getList(teamid);
  ulist.addCallback(this.loadUsers_cached_);
};

spo.control.Teams.prototype.loadUsers = function(list) {
  this.usersList_ = list;
  console.log('Loaded user list', list);

  this.usersControl_.setList(this.teamsList_.getById(
    this.selectedTeamId_), this.usersList_);

};

spo.control.Teams.prototype.setupListeners_ = function() {
  this.getHandler().listen(this.view_.getChildAt(0),
    goog.ui.Component.EventType.ACTION, this.handleTeamClick);
};

spo.control.Teams.prototype.handleTeamClick = function(ev) {
  var num = ev.target.getModel().getId();
  if (goog.isDefAndNotNull(this.currentlySelectedTeamComponent_))
    this.currentlySelectedTeamComponent_.setActive(false);
  spo.admin.Router.getInstance().navigate('/teams/' + this.gameId_ + '/' +
    num);
};

spo.control.Teams.prototype.setEnabled = function(enable, fn) {
  if (!enable) {
    goog.dispose(this);
    fn();
  }
};
