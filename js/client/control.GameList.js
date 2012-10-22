/**
 * @fileoverview provide control and management on the game list view.
 */

goog.provide('spo.control.LiveList');

goog.require('goog.ui.Component.EventType');
goog.require('pstj.ui.ScrollList');
goog.require('spo.control.Base');
goog.require('spo.ds.GameList');
goog.require('spo.ui.Game');
goog.require('spo.ui.Header');
goog.require('spo.ui.NewGame');

/**
 * @constructor
 * @param {!Element} container The HTML element to render the view in.
 * @extends {spo.control.Base}
 */
spo.control.LiveList = function(container) {
  goog.base(this, container);

  this.view_ = new pstj.ui.ScrollList(195);
  this.view_.setScrollInsideTheWidget(false);

  // Listen for action on the new game.
  this.getHandler().listen(this.view_, goog.ui.Component.EventType.ACTION,
    this.handleChildAction_);
};
goog.inherits(spo.control.LiveList, spo.control.Base);

/**
 * Contains the strings used by this component.
 * @enum {string}
 */
spo.control.LiveList.Strings = {
  CANNOT_BE_EMPTY: 'The value cannot be empty!'
};

/**
 * This should be called when an internal ACTION was detected (i.e. ACTION
 * event that is coming from a child).
 * @param  {goog.events.Event} e The ACTION event detected from a child.
 * @private
 */
spo.control.LiveList.prototype.handleChildAction_ = function(e) {
  var target = e.target;
  // If this is the create game child action
  if (target == this.view_.getChildAt(0)) {
    e.stopPropagation();
    this.requestNewGame_(/** @type {!spo.ui.NewGame} */(target));
  }
};

/**
 * Handles the requests for creating a new game on the server.
 * @param  {!spo.ui.NewGame} widget The new game widget.
 * @private
 */
spo.control.LiveList.prototype.requestNewGame_ = function(widget) {

  var value = widget.getValue();
  widget.setEnabled(false);

  if (goog.string.isEmpty(value)) {
    widget.setError(spo.control.LiveList.Strings.CANNOT_BE_EMPTY);
    setTimeout(function() {
      widget.resetWidget();
    }, 2000);
  } else {
    // Submit new game request and exit. The backend should use the default
    // handler if one is not provided and route to the specified list.
    // var data = ..;
    // spo.ds.Resource.getInstance().get( data, undefined); // use the default
    // handler that will use the url to route the result
  }
};

/**
 * INit the controler.
 */
spo.control.LiveList.prototype.init = function() {
  this.inited_ = true;
  spo.ds.GameList.getList().addCallback(goog.bind(this.load_, this));
};

/**
 * Load the data into the controller.
 * @param  {spo.ds.GameList} list The list of games returned by the server.
 * @private
 */
spo.control.LiveList.prototype.load_ = function(list) {
  this.list_ = list;
  this.loadView();
};

/**
 * Public method to be called when the list has been added a new member.
 * @param  {pstj.ds.List.Event} ev The addition event.
 * @private
 */
spo.control.LiveList.prototype.handleListAddition_ = function(ev) {
  console.log('The list has been updated a new feature is added');
  console.log(ev);
};

/**
 * Shows the controller's view (and activates it).
 * @private
 */
spo.control.LiveList.prototype.show_ = function() {
  if (!this.inited_) this.init();
  else {
    spo.ui.Header.getInstance().setLinks();
    this.view_.enterDocument();
  }
};

/**
 * @inheritDoc
 */
spo.control.LiveList.prototype.setEnabled = function(enable, fn) {
  if (enable) this.show_();
  else {
    this.hide_();
    fn();
  }
};

/**
 * Hides the controller's view (and desactivates it).
 * @private
 */
spo.control.LiveList.prototype.hide_ = function() {
  this.view_.exitDocument();
};

/**
 * Adds a new game view to the list of games in accordance to its position in
 * the list.
 * @param {spo.ds.Game} gameRecord The game record to work with.
 * @private
 */
spo.control.LiveList.prototype.addGame_ = function(gameRecord) {
  var gameView = new spo.ui.Game();
  gameView.setModel(gameRecord);
  //Add +1 for the "new game" child
  this.view_.addChildAt(gameView, this.list_.getIndexByItem(gameRecord) + 1,
    true);
};

/**
 * Loads the view into existence. This is performed right after ew have the
 * initial data to show.
 */
spo.control.LiveList.prototype.loadView = function() {
  //data = data['games'];
  this.view_.render(this.container_);

  var renderElement = this.view_.getContentElement();

  var newGame = new spo.ui.NewGame();
  this.view_.addChildAt(newGame, 0, true);

  var len = this.list_.getCount();

  for (var i = 0; i < len; i++) {
    var g = this.list_.getByIndex(i);
    var gi = this.list_.getIndexByItem(g);
    this.addGame_(this.list_.getByIndex(i));
  }

  // From now on listen for additions as to react by adding new view
  this.getHandler().listen(this.list_, pstj.ds.List.EventType.ADD,
    this.handleListAddition_);
};
