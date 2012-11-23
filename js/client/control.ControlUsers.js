goog.provide('spo.control.ControlUsers');

goog.require('spo.control.Action');
goog.require('spo.control.Users');
goog.require('spo.ds.Resource');
goog.require('spo.ui.ControlUsers');
goog.require('spo.ui.NewUser');
goog.require('spo.ui.User');

/**
 * Provides modified version of the User control suited for the Control Users.
 *
 * @constructor
 * @extends {spo.control.Users}
 * @param {!Element} container Where to host the view of the control.
 */
spo.control.ControlUsers = function(container) {
  goog.base(this, container);
};
goog.inherits(spo.control.ControlUsers, spo.control.Users);

goog.scope(function() {
  var proto = spo.control.ControlUsers.prototype;
  var Resource = spo.ds.Resource;
  var Action = spo.control.Action;

  /** @inheritDoc */
  proto.handleControlAction = function(ev) {
    var id = ev.target.getModel().getId();
    if (ev.getAction() == Action.SAVE) {
      Resource.getInstance().get({
        'url': '/control_user/update/' + id,
        'data': ev.target.getValues()
      }, goog.bind(this.handleUpdateResponse, this, ev.target));
    } else if (ev.getAction() == Action.DELETE) {
      Resource.getInstance().get({
        'url': '/control_user/remove/' + id
      });
    }
  };
  /**
   * @inheritDoc
   */
  proto.getUserViewInstance = function() {
    return new spo.ui.User(true);
  };
  /** @inheritDoc */
  proto.getNewView = function() {
    this.view_ = new spo.ui.ControlUsers();
  };
  proto.getNewUserWidget = function() {
    return new spo.ui.NewUser(this.team_.getId(), true);
  }
});
