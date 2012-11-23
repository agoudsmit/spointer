goog.provide('spo.control.Users');

goog.require('goog.ui.Component.EventType');
goog.require('spo.control.Action');
goog.require('spo.control.Base');
goog.require('spo.control.Event');
goog.require('spo.control.EventType');
goog.require('spo.ui.NewUser');
goog.require('spo.ui.User');
goog.require('spo.ui.Users');

/**
 * Provides the control for the User list (team edit view).
 *
 * @constructor
 * @extends {spo.control.Base}
 * @param {!Element} container The element to render in.
 */
spo.control.Users = function(container) {
  goog.base(this, container);
};
goog.inherits(spo.control.Users, spo.control.Base);

/**
 * The main UI for this control.
 *
 * @type {spo.ui.Users}
 * @private
 */
spo.control.Users.prototype.view_;

/**
 * Sets the active team with its corresponding user list. This control can
 * be used continuously for the management of users of different teams in the
 * same game.
 *
 * @param {pstj.ds.ListItem} team The team record to work with.
 * @param {pstj.ds.List} userlist The user list to display (should be
 *                                   matching the team).
 */
spo.control.Users.prototype.setList = function(team, userlist) {
  this.team_ = team;
  this.list_ = userlist;
  this.loadView();
};

/**
 * Cleans up the view (i.e. prepair to use a new one).
 *
 * @private
 */
spo.control.Users.prototype.clean_ = function() {
  this.getHandler().unlisten(this.view_, spo.control.EventType.CONTROL_ACTION, this.handleControlAction);
  goog.dispose(this.view_);
};

/**
 * @inheritDoc
 */
spo.control.Users.prototype.disposeInternal = function() {
  this.clean_();
  delete this.team_;
  delete this.list_;
  delete this.view_;
  goog.base(this, 'disposeInternal');
};

/**
 * Handles the user action delegated from sub-components.
 *
 * @protected
 * @param  {spo.control.Event} ev The control event generated in a
 *                                sub-component.
 */
spo.control.Users.prototype.handleControlAction = function(ev) {
  var id = ev.target.getModel().getId();
  var action = ev.getAction();
  if (action == spo.control.Action.SAVE) {
    spo.ds.Resource.getInstance().get({
      'url': '/player/update/' + id,
      'data': ev.target.getValues()
    }, goog.bind(this.handleUpdateResponse, this, ev.target));

  } else if (action == spo.control.Action.DELETE) {
    spo.ds.Resource.getInstance().get({
      'url': '/player/remove/' + id
    });
  }
};

/**
 * @protected
 * @param  {spo.ui.User} target The User ui component.
 * @param  {*} resp   The server response.
 */
spo.control.Users.prototype.handleUpdateResponse = function(target, resp) {
  if (resp['status'] != 'ok') {
    target.showError(resp['error']);
  }
};

/**
 * Assigns a new view instance - makes the control reusable for multiple
 * subsequent views (of different teams).
 *
 * @protected
 */
spo.control.Users.prototype.getNewView = function() {
  this.view_ = new spo.ui.Users();
};

/**
 * Creates a new user record view and returns it.
 *
 * @protected
 * @return {goog.ui.Component} The user view (reflects one user record).
 */
spo.control.Users.prototype.getUserViewInstance = function() {
  return new spo.ui.User();
};

/**
 * Loads the view into existence after the needed data has been retrieved.
 *
 * @protected
 */
spo.control.Users.prototype.loadView = function() {
  this.clean_();
  this.getNewView();
  this.view_.setModel(this.team_);
  this.view_.render(this.container_);

  var len = this.list_.getCount();
  var user;

  for (var i = 0; i < len; i++) {
    user = this.getUserViewInstance();
    user.setModel(this.list_.getByIndex(i));
    this.view_.addChild(user, true);
  }

  this.getHandler().listen(this.view_, spo.control.EventType.CONTROL_ACTION, this.handleControlAction);
  this.getHandler().listen(this.view_, goog.ui.Component.EventType.ACTION, this.handleComponentAction_);
  this.getHandler().listen(this.list_, pstj.ds.List.EventType.ADD, this.handleUserAdd);
};

/**
 * Creates a new user widget compatible with the control and returns it.
 *
 * @protected
 * @return {goog.ui.Component} The created widget.
 */
spo.control.Users.prototype.getNewUserWidget = function() {
  return new spo.ui.NewUser(this.team_.getId());
};

/**
 * Handles new user created event.
 *
 * @param  {goog.events.Event} ev The ADD event from the list.
 * @protected
 */
spo.control.Users.prototype.handleUserAdd = function(ev) {
  var node = ev.getNode();
  var ui = this.getUserViewInstance();
  ui.setModel(node);
  this.view_.addChildAt(ui, this.list_.getIndexByItem(node) + 1, true);
};

/**
 * Handles the ACTION event from view. In this case listen only for events from
 * the 'add' button.
 *
 * @private
 * @param  {goog.events.Event} ev The ACTION component event.
 */
spo.control.Users.prototype.handleComponentAction_ = function(ev) {
  if (ev.target == this.view_.getActionButton()) {
    var child = this.getNewUserWidget();
    if (this.view_.getChildAt(1) instanceof spo.ui.NewUser) {
      this.view_.removeChildAt(1, true);
    }
    this.view_.addChildAt(child, 1, true);
  }
};
