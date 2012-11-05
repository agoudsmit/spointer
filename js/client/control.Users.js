goog.provide('spo.control.Users');

goog.require('spo.control.Base');
goog.require('spo.ui.User');
goog.require('spo.ui.Users');
goog.require('spo.control.Action');
goog.require('spo.control.Event');
goog.require('spo.control.EventType');

spo.control.Users = function(container) {
  goog.base(this, container);
  this.view_ = null;
};
goog.inherits(spo.control.Users, spo.control.Base);

spo.control.Users.prototype.setList = function(team, userlist) {
  this.team_ = team;
  this.list_ = userlist;
  this.loadView();
};

spo.control.Users.prototype.clean_ = function() {
  if (goog.isDefAndNotNull(this.view_)) {
    goog.dispose(this.view_);
  }
}

spo.control.Users.prototype.disposeInternal = function() {
  this.clean_();
  delete this.team_;
  delete this.list_;
  delete this.view_;
  goog.base(this, 'disposeInternal');
};

spo.control.Users.prototype.handleControlAction_ = function(ev) {
  var id = ev.target.getModel().getId();
  var action = ev.getAction();
  console.log('Received action and id:', action, id);
  if (action == spo.control.Action.SAVE) {
    spo.ds.Resource.getInstance().get({
      'url': '/player/update/' + id,
      'data': ev.target.getValues()
    }, function(resp) {
      console.log('The response on save', resp);
    });
  } else {
    // handle delete
  }
};

spo.control.Users.prototype.loadView = function() {
  this.clean_();
  this.view_ = new spo.ui.Users();
  this.view_.setModel(this.team_);
  this.view_.render(this.container_);

  var len = this.list_.getCount();
  var user;
  for (var i = 0; i < len; i++) {
    user = new spo.ui.User();
    console.log(user);
    user.setModel(this.list_.getByIndex(i));
    this.view_.addChild(user, true);
  }
  this.getHandler().listen(this.view_, spo.control.EventType.CONTROL_ACTION,
    this.handleControlAction_);
};

