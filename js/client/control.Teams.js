goog.provide('spo.control.Teams');

goog.require('goog.async.DeferredList');
goog.require('goog.functions');
goog.require('spo.admin.Router');
goog.require('spo.control.ControlTeams');
goog.require('spo.control.Users');
goog.require('spo.ds.Game');
goog.require('spo.ds.GameList');
goog.require('spo.ds.Team');
goog.require('spo.ds.TeamList');
goog.require('spo.ds.UserList');
goog.require('spo.ui.Header');
goog.require('spo.ui.NewTeam');

/**
 * Slightly tweaked version of the control team controller to handle the
 * player teams.
 *
 * @constructor
 * @extends {spo.control.ControlTeams}
 * @param {!Element} container The DOM element to recnder the views in.
 * @param {!pstj.ds.RecordID} gameid  The game id to bind the control to.
 * @param {pstj.ds.RecordID=} teamid  Optional team id - the selected team.
 */
spo.control.Teams = function(container, gameid, teamid) {
  goog.base(this, container, gameid, teamid);
};
goog.inherits(spo.control.Teams, spo.control.ControlTeams);

goog.scope(function() {
  var proto = spo.control.Teams.prototype;
  /** @inheritDoc */
  proto.isControl = goog.functions.FALSE;
  /** @inheritDoc */
  proto.init = function() {
    this.inited_ = true;
    var games = spo.ds.GameList.getList();
    var teams = spo.ds.TeamList.map.getList(this.getId());
    goog.async.DeferredList.gatherResults([games, teams]).addCallback(
      goog.bind(this.load_, this));
  };
  /** @inheritDoc */
  proto.setHeaderSettings = function() {
    spo.ui.Header.getInstance().setViewName('manage teams/users');
    spo.ui.Header.getInstance().setLinks('/game/' + this.getId(),
      'game details');
    spo.ui.Header.getInstance().setGameName(this.gameList_.getById(
      this.getId()).getProp(spo.ds.Game.Property.NAME).toString());
  };
  /** @inheritDoc */
  proto.getNewWidget = function() {
    return new spo.ui.NewTeam(this.getId());
  };
  /** @inheritDoc */
  proto.handleTeamClick = function(ev) {
    spo.admin.Router.getInstance().navigate('/teams/' + this.getId() +
      '/' + ev.target.getModel().getId());
  };
  /** @inheritDoc */
  proto.handleTeamEdit = function(ev) {
    var teamid = ev.target.getModel().getId();
    this.getTeamListComponent().getChildAt(0).enterEditMode(teamid,
      ev.target.getModel().getProp(spo.ds.Team.Property.NAME));
  };
  /** @inheritDoc */
  proto.requestUsers = function() {
    spo.ds.UserList.map.getList(this.selectedTeamId_).addCallback(
      this.loadUsers_cache_);
  };
  /** @inheritDoc */
  proto.setUserControl = function() {
    var el = /** @type {!Element} */ (this.view_.getContentElement());
    this.userConstrolReferrence_ = new spo.control.Users(el);
  };
});
