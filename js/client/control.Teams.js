goog.provide('spo.control.Teams');

goog.require('spo.control.Base');
goog.require('spo.control.Users');
goog.require('spo.ds.GameList');
goog.require('spo.ds.TeamList');
goog.require('spo.ds.UserList');
goog.require('spo.ui.Header');
goog.require('spo.ui.TeamList');
goog.require('spo.ui.Team');

spo.control.Teams = function(container, gameid, selectedTeamId) {
  goog.base(this, container);
  this.gameId_ = gameid;
  this.selectedTeamId_ = selectedTeamId;
  this.view_ = new pstj.ui.CustomScrollArea();
  this.view_.setScrollInsideTheWidget(false);
  this.currentlySelectedTeamComponent_ = null;
  this.init();
};
goog.inherits(spo.control.Teams, spo.control.Base);

goog.scope(function() {
  var proto = spo.control.Teams.prototype;
  proto.getId = function() {
    return this.gameId_;
  };
  proto.init = function() {
    this.inited_ = true;
    var games = spo.ds.GameList.getList();
    var teams = spo.ds.TeamList.getList(this.gameId_);
    goog.async.DeferredList.gatherResults(
      [games, teams]).addCallback(
        goog.bind(this.load_, this));
  };
  proto.load_ = function(results) {
    this.gamesList_ = results[0];
    this.teamsList_ = results[1];
    this.loadView();
  };
  proto.loadView = function() {
    var game = this.gamesList_.getById(this.gameId_);
    spo.ui.Header.getInstance().setViewName('manage teams/users');
    spo.ui.Header.getInstance().setLinks('/game/' + this.gameId_,
      'game details');
    spo.ui.Header.getInstance().setGameName(
      game.getProp(spo.ds.Game.Property.NAME).toString());

    this.view_.render(this.container_);
    var teamlistview = new spo.ui.TeamList();
    this.view_.addChild(teamlistview, true);
    var len = this.teamsList_.getCount();
    var team;
    for (var i = 0; i < len; i++) {
      team = new spo.ui.Team();
      team.setModel(this.teamsList_.getByIndex(i));
      teamlistview.addChild(team, true);
    }

    this.usersControl_ = new spo.control.Users(this.view_.getContentElement());

    this.setupListeners_();
    if (goog.isDef(this.selectedTeamId_)) {
      this.setSelectedTeam(this.selectedTeamId_);
    }
  };

  proto.disposeInternal = function() {
    this.view_.exitDocument();
    goog.dispose(this.usersControl_);
    goog.dispose(this.view_);
    delete this.usersControl_;
    delete this.inited_;
    delete this.view_;
    delete this.gamesList_;
    delete this.teamsList_;
    delete this.selectedTeamId_;
    delete this.currentlySelectedTeamComponent_;
    delete this.gameId_;
  };

  proto.usersControl_;
  proto.view_;
  proto.gamesList_;
  proto.teamsList_;
  proto.selectedTeamId_;
  proto.currentlySelectedTeamComponent_;
  proto.gameId_;


  proto.setSelectedTeam = function(teamid) {
    console.log('getting team members for team', teamid);
    this.selectedTeamId_ = teamid;
    var index = this.teamsList_.getIndexById(teamid);
    console.log('Found index data: ', index);
    console.log(this.teamsList_);
    this.currentlySelectedTeamComponent_ = this.view_.getChildAt(0).getChildAt(
      index);
    this.currentlySelectedTeamComponent_.setActive(true);
    var ulist = spo.ds.UserList.getList(teamid);
    ulist.addCallback(goog.bind(this.loadUsers, this));
  };

  proto.loadUsers = function(list) {
    this.usersList_ = list;
    console.log('Loaded user list', list);

    this.usersControl_.setList(this.teamsList_.getById(
      this.selectedTeamId_), this.usersList_);

  };

  proto.setupListeners_ = function() {
    this.getHandler().listen(this.view_.getChildAt(0),
      goog.ui.Component.EventType.ACTION, this.handleTeamClick);
  };

  proto.handleTeamClick = function(ev) {
    var num = ev.target.getModel().getId();
    if (goog.isDefAndNotNull(this.currentlySelectedTeamComponent_))
      this.currentlySelectedTeamComponent_.setActive(false);
    spo.admin.Router.getInstance().navigate('/teams/' + this.gameId_ + '/' +
      num);
  };

  proto.setEnabled = function(enable, fn) {
    if (!enable) {
      goog.dispose(this);
      fn();
    }
  };

});
