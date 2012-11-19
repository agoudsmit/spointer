goog.provide('spo.ui.NewControlTeam');

goog.require('spo.ui.NewTeam');
goog.require('goog.dom');
goog.require('spo.template');
goog.require('goog.ui.Checkbox');
goog.require('goog.array');
goog.require('goog.events.EventType');

/**
 * Creates a new control team for game (using game id).
 *
 * @constructor
 * @extends {spo.ui.NewTeam}
 * @param {!pstj.ds.RecordID} gameid The game id to bind the new team to.
 */
spo.ui.NewControlTeam = function(gameid) {
  goog.base(this, gameid);
  this.wp_ = new goog.ui.Checkbox();
  this.intel_ = new goog.ui.Checkbox();
  this.world_ = new goog.ui.Checkbox();
  this.meetings_ = new goog.ui.Checkbox();
  this.msgs_ = new goog.ui.Checkbox();
};
goog.inherits(spo.ui.NewControlTeam, spo.ui.NewTeam);

goog.scope(function() {
  var proto = spo.ui.NewControlTeam.prototype;
  var dom = goog.dom;
  var template = spo.template;
  var Checkbox = goog.ui.Checkbox;
  var array = goog.array;
  /**
   * Flag - true if the widget should edit instead of create team.
   *
   * @private
   * @type {boolean}
   */
  proto.editMode_ = false;

  /** @inheritDoc */
  proto.createDom = function() {
    this.decorateInternal(
      /** @type {Element} */ (dom.htmlToDocumentFragment(
              template.NewControlTeam({}))));
  };

  /** @inheritDoc */
  proto.decorateInternal = function(el) {
    goog.base(this, 'decorateInternal', el);
    var els = dom.getElementsByClass(goog.getCssName('decorate'),
      this.getElement());
    this.addChild(this.wp_);
    this.addChild(this.intel_);
    this.addChild(this.world_);
    this.addChild(this.meetings_);
    this.addChild(this.msgs_);
    this.wp_.decorate(els[0]);
    this.meetings_.decorate(els[1]);
    this.intel_.decorate(els[2]);
    this.msgs_.decorate(els[3]);
    this.world_.decorate(els[4]);
  };

  /**
   * Set the widget to edi mode (i.e. pre-populate values).
   *
   * @protected
   * @param  {!pstj.ds.RecordID} teamid The record id if the team to edit.
   * @param  {string=} name The team name.
   * @param  {boolean=} wp If the team has worldpress.
   * @param  {boolean=} meet  If the team has meetings.
   * @param  {boolean=} intel If the team has intel.
   * @param  {boolean=} msgs  If the team has msgs.
   * @param  {boolean=} world If the team has rest of the world.
   */
  proto.enterEditMode = function(teamid, name, wp, meet, intel, msgs, world) {
    goog.base(this, 'enterEditMode', teamid, name);
    this.wp_.setChecked(!!wp);
    this.meetings_.setChecked(!!meet);
    this.intel_.setChecked(!!intel);
    this.msgs_.setChecked(!!msgs);
    this.world_.setChecked(!!world);
  };

  /** @inheritDoc */
  proto.getCreatePacket = function() {
    return {
      'url': '/control_team/create',
      'data': {
        'game_id': this.gameId_,
        'name': goog.string.trim(this.input_.getValue()),
        'intelligence': this.intel_.isChecked(),
        'rest_of_the_world': this.world_.isChecked(),
        'validation_meetings': this.meetings_.isChecked(),
        'validation_messages': this.msgs_.isChecked(),
        'worldpress': this.wp_.isChecked()
      }
    }
  };
  /** @inheritDoc */
  proto.getUpdatePacket = function() {
    return {
      'url': '/control_team/update/' + this.teamid_,
      'data': {
        'game_id': this.gameId_,
        'name': goog.string.trim(this.input_.getValue()),
        'intelligence': this.intel_.isChecked(),
        'rest_of_the_world': this.world_.isChecked(),
        'validation_meetings': this.meetings_.isChecked(),
        'validation_messages': this.msgs_.isChecked(),
        'worldpress': this.wp_.isChecked()
      }
    }
  };
  /** @inheritDoc */
  proto.handleActionReply = function(resp) {
    goog.base(this, 'handleActionReply', resp);
    if (!goog.isDef(this.teamid_)) {
      this.world_.setChecked(false);
      this.msgs_.setChecked(false);
      this.meetings_.setChecked(false);
      this.intel_.setChecked(false);
      this.wp_.setChecked(false);
    }
  };
});
