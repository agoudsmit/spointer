goog.provide('spo.control.Game');

goog.require('spo.control.Base');
goog.requier('spo.ds.TeamList');
goog.require('spo.ds.ControlTeamList');
goog.require('spo.ds.PlayerList');
goog.require('spo.ds.ControlPlayerList');
goog.require('pstj.ui.CustomScrollArea');
goog.require('spo.ui.GameControls');
goog.require('spo.ui.GameDetails');
goog.require('goog.dom.classes');

spo.control.Game = function(query, container) {
  goog.base(this, query, container);

  this.view_ = new pstj.ui.CustomScrollArea();
  this.view_.setScrollInsideTheWidget(false);
  // Init immediately, this view is disposable
  this.init();
};
goog.inherits(spo.control.Game, spo.control.Base);

goog.scope(function() {
  var proto = spo.control.Game.prototype;
  proto.init = function() {
    this.inited_ = true;
    this.load();
  };
  proto.load = function() {
    spo.ds.Resource.getInstance().get(this.query_,
      goog.bind(this.loadData, this));
  };
  proto.loadData = function(data) {
    this.data_ = data;
    this.view_.render(this.container_);
    // Set blue, by design...
    goog.dom.classes.add(this.view_.getElement(),
      goog.getCssName('colored-content'))
    var gc = new spo.ui.GameControls();
    gc.render(this.view_.getContentElement());
    this.view_.addChild(gc);

    var gd = new spo.ui.GameDetails();
    gd.setModel(new spo.ds.Game(data['game']));
    gd.render(this.view_.getContentElement());
    this.view_.addChild(gd);

    spo.ui.Header.getInstance().setViewName('game details');
    spo.ui.Header.getInstance().setGameName(this.data_['game']['name']);
  };
  proto.setEnabled = function(enable, fn) {
    if (enable) {
    }
    else {
      console.log('call dispose on this view');
      goog.dispose(this);

      fn();
    }
  };
  proto.disposeInternal = function() {
    this.data_ = null;
    this.view_.exitDocument();
    this.view_.dispose();
    delete this.inited_;
    goog.base(this, 'disposeInternal');
  };
});
