goog.provide('spo.ui.NewUser');

goog.require('goog.array');
goog.require('goog.async.Delay');
goog.require('goog.dom');
goog.require('goog.ui.LabelInput');
goog.require('spo.control.Action');
goog.require('spo.control.Event');
goog.require('spo.ds.Resource');
goog.require('spo.template');
goog.require('spo.ui.User');

/**
 * @constructor
 * @extends {spo.ui.User}
 * @param {!pstj.ds.RecordID} teamid The ID of team to bind the new user to.
 * @param {boolean=} is_control True if this instance will serve control user.
 */
spo.ui.NewUser = function(teamid, is_control) {
  goog.base(this, is_control);
  this.teamid_ = teamid;
  this.editMode_ = true;

};
goog.inherits(spo.ui.NewUser, spo.ui.User);

goog.scope(function() {
  var proto = spo.ui.NewUser.prototype;
  var dom = goog.dom;
  var array = goog.array;
  var template = spo.template;
  var CEvent = spo.control.Event;
  var Action = spo.control.Action;
  var Resource = spo.ds.Resource;
  var LabelInput = goog.ui.LabelInput;

  /**
   * @type {pstj.ds.RecordID}
   * @private
   */
  proto.teamid_;
  /**
   * @protected
   * @type {string}
   */
  proto.createUrl = '/player/create';

  /** @inheritDoc */
  proto.getTemplate = function() {
    return (this.control_) ? template.NewControlUser({}) : template.NewUser({});
  };

  /**
   * Remove the listeners related to the data model as we do not have one here.
   *
   * @inheritDoc
   */
  proto.setupListeners = function() {};

  /** @inheritDoc */
  proto.createValueHolders = function() {
    goog.base(this, 'createValueHolders');
    this.pass_ = new LabelInput();
    this.addChild(this.pass_);
  };

  /** @inheritDoc */
  proto.decorateValueHolders = function() {
    goog.base(this, 'decorateValueHolders');
    var values = dom.getElementsByClass(goog.getCssName('form-values'),
      this.getElement());
    this.pass_.decorate(array.peek(values));
  };

  /** @inheritDoc */
  proto.handleUserAction = function(ev) {
    if (ev.target == this.saveBtn_) {
      this.handleSaveButton();
    } else {
      goog.dispose(this);
    }
  };

  /** @inheritDoc */
  proto.getValues = function() {
    var res = {};
    res['name'] = this.name_.getValue();
    if (!this.control_) {
      res['role'] = this.role_.getValue();
      res['function'] = this.func_.getValue();
      res['team_id'] = this.teamid_;
    } else {
      res['control_team_id'] = this.teamid_;
    }
    res['email'] = this.mail_.getValue();
    res['password'] = this.pass_.getValue();
    return res;
  };

  /**
   * Handles the save button.
   * @protected
   */
  proto.handleSaveButton = function() {
    Resource.getInstance().get({
      'url': ((this.control_) ? '/control_user' : '/player') + '/create',
      'data': this.getValues()
    }, goog.bind(this.handleCreate, this));
  };

  /**
   * Handles the response of creation.
   *
   * @param  {*} resp The server response.
   */
  proto.handleCreate = function(resp) {
    if (resp['status'] == 'ok') {
      goog.dispose(this);
    } else {
      this.showError(resp['error']);
    }
  };

  /** @inheritDoc */
  proto.disposeInternal = function() {
    delete this.teamid_;
    goog.base(this, 'disposeInternal');
  };
});
