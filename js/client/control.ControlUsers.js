goog.provide('spo.control.ControlUsers');

goog.require('spo.control.Action');
goog.require('spo.control.Users');
goog.require('spo.ds.Resource');
goog.require('spo.ui.ControlUsers');
goog.require('spo.ui.ControlUser');

/**
 * @constructor
 * @extends {spo.control.Users}
 * @param {Element} container Where to host the view of the control.
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
    console.log('Received action and id:', ev.getAction(), id);
    if (ev.getAction() == Action.SAVE) {
      Resource.getInstance().get({
        'url': '/control_user/update/' + id,
        'data': ev.target.getValues()
      }, function(resp) {
        console.log('The response on save', resp);
      });
    } else if (ev.getAction() == Action.DELETE) {
      Resource.getInstance().get({
        'url': '/control_user/remove/' + id
      }, function(resp) {
        console.log('The response on delete', resp);
      });
    }
  };
  /** @inheritDoc */
  proto.getUserViewInstance = function() {
    return new spo.ui.ControlUser();
  };
  /** @inheritDoc */
  proto.getNewView = function() {
    this.view_ = new spo.ui.ControlUsers();
  };
});
