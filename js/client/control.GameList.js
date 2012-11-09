/**
 * @fileoverview provide control and management on the game list view.
 */

goog.provide('spo.control.LiveList');

goog.require('goog.array');
goog.require('goog.string');
goog.require('goog.ui.Component.EventType');
goog.require('pstj.ui.ScrollList');
goog.require('spo.control.Base');
goog.require('spo.ds.Game');
goog.require('spo.ds.GameList');
goog.require('spo.ds.Resource');
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

  this.hiddenChildrenIndexes_ = [];
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
    spo.ds.Resource.getInstance().get({
      'url': '/game/create',
      'data': {
        'name': value
      }
    }, function(response) {
      if (response['status'] == 'ok') widget.resetWidget();
      else {
        widget.setError(response['error']);
        setTimeout(function() {
          widget.resetWidget();
        }, 2000);
      }
    });
  }
};

/**
 * Init the controler.
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
  var node = /** @type {spo.ds.Game} */ (ev.getNode());
  var index = this.list_.getIndexByItem(node);
  this.addGame_(node, index + 1);
};

/**
 * Shows the controller's view (and activates it).
 * @private
 */
spo.control.LiveList.prototype.show_ = function() {
  if (!this.inited_) {
    this.init();
  } else {
    this.view_.enterDocument();
    spo.ui.Header.getInstance().setLinks();
  }
  this.enableSearch_(true);
};

/**
 * Sets the filter on the view.
 * @private
 * @param {string} str The string from the search field.
 */
spo.control.LiveList.prototype.setFilter_ = function(str) {
  if (goog.isString(str)) {
    str = goog.string.trim(str);
    str = str.toLowerCase();
    this.list_.setFilter((str != '') ? function(item) {
      // if the item does not match, filter it out - return true;
      if (goog.string.contains(item.getProp(
        spo.ds.Game.Property.NAME).toLowerCase(), str)) {
        return false;
      }
      return true;
    } : null);
    // Should be filtered now, go and filter view.
    var indexes = this.list_.getFilteredIndexes();
    this.filterOutList_(indexes);
  }
};

/**
 * Filters out the list view based on indexes.
 * @param  {Array.<number>} indexes LIst of indexes to hide.
 * @private
 */
spo.control.LiveList.prototype.filterOutList_ = function(indexes) {
  console.log('Filtered indexes', indexes);
  var all = this.list_.getCount();
  var cindex;
  for (var i = 0; i < all; i++) {
    cindex = i + 1;
    this.view_.getChildAt(cindex).getElement().style.display = (
      goog.array.indexOf(indexes, i) == -1) ? 'block' : 'none';
  }
};

/**
 * Enables/disables the search in the header and bind search function.
 * @param  {boolean} enable True if the search should be enabled.
 * @private
 */
spo.control.LiveList.prototype.enableSearch_ = function(enable) {
  if (enable) {
    spo.ui.Header.getInstance().setSearchFiledState('Search games..',
      goog.bind(this.setFilter_, this));

  } else {
    spo.ui.Header.getInstance().setSearchFiledState();
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
  this.enableSearch_(false);
};

/**
 * Adds a new game view to the list of games in accordance to its position in
 * the list.
 * @param {spo.ds.Game} gameRecord The game record to work with.
 * @param {number=} position The position to add the child at.
 * @private
 */
spo.control.LiveList.prototype.addGame_ = function(gameRecord, position) {
  var gameView = new spo.ui.Game();
  gameView.setModel(gameRecord);
  //Add +1 to compensate for the "new game" child.
  this.view_.addChildAt(gameView, (goog.isNumber(position) ? position :
    this.list_.getIndexByItem(gameRecord) + 1),
    true);
};


/**
 * Loads the view into existence. This is performed right after ew have the
 * initial data to show.
 */
spo.control.LiveList.prototype.loadView = function() {
  // Add the 'add new' widget at 0.
  this.view_.render(this.container_);
  this.view_.addChildAt((new spo.ui.NewGame()), 0, true);

  // Add all games in the order they are provided by the server.
  var len = this.list_.getCount();
  for (var i = 0; i < len; i++) {
    this.addGame_(this.list_.getByIndex(i));
  }

  // From now on listen for additions as to react by adding new view
  this.getHandler().listen(this.list_, pstj.ds.List.EventType.ADD,
    this.handleListAddition_);
};
