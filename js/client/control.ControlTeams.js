goog.provide('spo.control.ControlTeams');

goog.require('goog.async.DeferredList');
goog.require('pstj.ui.CustomScrollArea');
goog.require('spo.ds.ControlTeamList');
goog.require('spo.ds.Game');
goog.require('spo.ui.Header');
goog.require('spo.ui.Team');
goog.require('spo.ui.TeamList');

/**
 * Provides the control for team lists. Extends this one to support the
 * player teams. This is user for the control team lists.
 *
 *
 * @constructor
 * @extends {spo.control.Base}
 * @param {!element} container The container to render the control view in.
 * @param {pstj.ds.RecordID} gameid  The ID of the game whos teams will be
 *                                   rendered.
 * @param {pstj.ds.RecordID=} selectedTeamId The ID of the selected team in the
 *                                          view.
 */
spo.control.ControlTeams = function(container, gameid, selectedTeamId) {
  goog.base(this, container);
  this.gameid_ = gameid;
  this.selectedTeamId_ selectedTeamId;

  this.view_ = pstj.ui.CustomScrollArea();
  this.view_.setScrollInsideTheWidget(false);
  this.loadUsers_cache_ = goog.bind(this.loadUsers, this);
  this.init();
};

goog.scope(function() {
  var proto = spo.cotrol.ControlTeams.prototype;

  /**
   * The main view for the controller.
   *
   * @type {pstj.ui.CustomScrollArea}
   * @private
   */
  proto.view_;

  /**
   * The ID of the game whos teas will be viewed.
   *
   * @type {pstj.ds.RecordID}
   * @private
   */
  proto.gameid_;

  /**
   * The ID of the team whos users to display.
   *
   * @type {pstj.ds.RecordID}
   * @private
   */
  proto.selectedTeamId_;

  /**
   * The list of all games.
   *
   * @type {spo.ds.List}
   * @private
   */
  proto.gameList_;

  /**
   * The list of all teams for the game id that the control is bound to..
   *
   * @type {spo.ds.List}
   * @private
   */
  proto.teamList_;

  /**
   * The list of all users for a particular (selected) team id.
   *
   * @type {spo.ds.List}
   * @private
   */
  proto.userList_;

  /**
   * Refference to the control for user display. Can be different, so settled
   * on the base type.
   *
   * @type {spo.control.Base}
   * @private
   */
  proto.userConstrolReferrence_;

  /**
   * Flag to denote if the control has been initialized.
   *
   * @type {boolean}
   * @private
   */
  proto.inited_ = false;

  /**
   * Returns the ID of the game the control is bound to,
   *
   * @return {pstj.dsRecordID} The recod id of the list item bound in the
   *                               control.
   */
  proto.getId = function() { return this.gameid_; };

  /**
   * @inheritDoc
   */
  proto.disposeInternal = function() {
    goog.dispose(this.userConstrolReferrence_);
    goog.dispose(this.view_);
    delete this.inited_;
    delete this.gameid_;
    delete this.selectedTeamId_;
    delete this.gameList_;
    delete this.teamList_;
    delete this.userList_;
    delete this.userConstrolReferrence_;
    delete this.view_;
    goog.base(this, 'disposeInternal');
  };
  /**
   * Provides the initialization logic for the control.
   *
   * @protected
   */
  proto.init = function() {
    this.inited_ = true;
    goog.async.DeferredList.gatherResults([spo.ds.GameList.getList(),
      spo.ds.ControlTeamList.map.getList(this.getId())]).addCallback(
      goog.bind(this.load_, this));
  };

  /**
   * Provides hadler for the event fired by the deferred when all requested
   * lists are available.
   *
   * @param  {Array.<pstj.ds.List>} results Flat list of the live list rewquired
   *                                        by the initialization function. Note
   *                                        that the list might consist of spo
   *                                        Lists or the Base list type.
   * @private
   */
  proto.load_ = function(results) {
    this.gameList_ = results[0];
    this.teamList_ = results[1];
    this.loadView();
  };

  /**
   * Sets up the Header widget with the needed links, title and description.
   *
   * @protected
   */
  proto.setHeaderSettings = function() {
    spo.ui.Header.getInstance().setViewName('Manage Control Teams/Users');
    spo.ui.Header.getInstance().setLinks('/game/' + this.getId(),
      'game details');
    spo.ui.Header.getInstance().setGameName(this.gameList_.getById(
      this.getId()).getProp(spo.ds.Game.Property.NAME).toString());
  };

  /**
   * Extracted setter for the 'new' component in the list view. This is required
   * as the control teams need different widget to configure a new team than the
   * one required by the player team.
   *
   * @protected
   */
  proto.getNewWidget = function() {
    return spo.ui.NewControlTeam(this.getId());
  };

  /**
   * Loads the views and initialized UI components.
   *
   * @protected
   */
  proto.loadView = function() {
    var game = this.gameList_.getById(this.getId());
    this.setHeaderSettings();
    this.view_.render(this.container_);
    var listview = new spo.ui.TeamList();
    this.view_.addChild(listview, true);
    listview.addChild(this.getNewWidget(), true);

    var len = this.teamList_.getCount();
    var team;
    for (var i = 0; i < len; i++) {
      team = new spo.ui.Team();
      team.setModel(this.teamList_.getByIndex(i));
      listview.addChild(team, true);
    }
    this.setUserControl();
    this.setupListeners();
    if (goog.isDef(this.selectedTeamId_)) {
      this.setSelectedTeam(this.selectedTeamId_);
    }
  };

  /**
   * Sets up listeners after the UI components have been completely loaded.
   *
   * @protected
   */
  proto.setupListeners = function() {
    this.getHandler().listen(this.view_.getChildAt(0),
      goog.ui.Component.EventType.ACTION, this.handleTeamClick);
    this.getHandler().listen(this.teamList_, pstj.ds.List.EventType.ADD,
      this.handleAddTeam_);
  };

  /**
   * Handles clicks on a team in the list view. This one is marked protected
   * as the player team will need to handle this differently.
   *
   * @protected
   * @param  {goog.events.Event} ev The ACTION event from a list item (child).
   */
  proto.handleTeamClick = function(ev) {
    spo.admin.Router.getInstance().navigate('/control_teams/' + this.getId() +
      '/' + ev.target.getModel().getId());
  };

  /**
   * Handles the event of adding a new team to the list coming from the server.
   *
   * @private
   * @param  {pstj.ds.List.Event} ev The ADD event from the list.
   */
  proto.handleAddTeam_ = function(ev) {
    var data = ev.getNode();
    var team = new spo.ui.Team();
    team.setModel(data);
    this.getTeamListComponent().addChild(team, this.teamList_.getIndexByItem(
      data) + 1, true);
  };

  /**
   * Sets the ID of the selected team. It is assumed that the team ID exists
   * in the list.
   * TODO: work out the use case where the ID of the team is actually not in
   * the list.
   *
   * @param {pstj.ds.RecordID} teamid The team ID that is selected.
   */
  proto.setSelectedTeam = function(teamid) {
    if (goog.isDef(this.selectedTeamId_))
      this.getTeamListComponentByDataId_(this.selectedTeamId_).setActive(false);

    this.selectedTeamId_ = teamid;
    this.getTeamListComponentByDataId_(this.selectedTeamId_).setActive(true);
    this.requestUsers();
  };

  /**
   * Gets/requests the user list corresponding to the selected team id.
   *
   * @protected
   */
  proto.requestUsers = function() {
    spo.ds.ControlUserList.map.getList(this.selectedTeamId_).addCallback(
      this.loadUsers_cache_);
  };

  /**
   * Creates the user control. This method is protected so the regular user
   * instance can sets its own control.
   *
   * @protected
   */
  proto.setUserControl = function() {
    this.userConstrolReferrence_ = new spo.control.ControlUsers(
      /** @type {!Element} */ this.view_.getContentElement());
  };

  /**
   * Getter for the team list component from the control. It is requested when
   * adding new items to it.
   *
   * @protected
   * @return {spo.ui.TeamList} The team list component.
   */
  proto.getTeamListComponent = function() {
    return /** @type {spo.ui.TeamList} */ (this.view_.getChildAt(0));
  };

  /**
   * Gets the list item that matches the record id provided.
   *
   * @private
   * @param  {pstj.ds.RecordID} teamid The ID of the team to look up in the
   *                                   list items in the component.
   * @return {spo.ui.Team} The subcomponent that visualizes the team matching
   *                           the provided id.
   */
  proto.getTeamListComponentByDataId_ = function(teamid) {
    var index = this.teamList_.getIndexById(teamid);
    var parent = this.getTeamListComponent();
    return /** @type {spo.ui.Team} */ (parent.getChildAt(index + 1));
  };

  /**
   * Loads the user list into the controller. Internally it will also load it
   * into the user control (subcontrol).
   *
   * @protected
   * @param  {spo.ui.List} list The list of users to load.
   */
  proto.loadUsers = function(list) {
    this.userList_ = list;
    this.userConstrolReferrence_.setList(this.teamList_.getById(this.getId()),
      this.userList_);
  };

  /**
   * @inheritDoc
   */
  proto.setEnabled = function(enable, fn) {
    if (!enable) {
      goog.dispose(this);
      fn();
    }
  };
});
