goog.provide('spo.ui.Game');

goog.require('goog.dom');
goog.require('goog.events.EventType');
goog.require('goog.ui.Component');
goog.require('pstj.date.utils');
goog.require('pstj.ds.ListItem.EventType');
goog.require('spo.admin.Router');
goog.require('spo.ds.Game');
goog.require('spo.template');
goog.require('spo.ui.GameTime');

/**
 * Provides a widget view for a game record. It is only used to activate
 * games and to show information.
 *
 * @constructor
 * @extends {goog.ui.Component}
 * @param {goog.dom.DomHelper=} odh Optional dom helper.
 */
spo.ui.Game = function(odh) {
  goog.base(this, odh);
};
goog.inherits(spo.ui.Game, goog.ui.Component);

/**
 * THe strings used in the template(s) for this widget.
 * @enum {string}
 */
spo.ui.Game.Strings = {
  STARTED: 'STARTED',
  PAUSED: 'PAUSED',
  STOPPED: 'STOPPED',
  REMOVED: 'REMOVED'
};

/**
 * A default time format to use when displaying data/time in widget.
 * This is then used with the parseTime function to produce the desired format.
 * @type {string}
 * @private
 */
spo.ui.Game.defaultTimeFormat_ = 'mm/dd/yy hh:xx';

/**
 * The CSS class name to use to setthe pressed state of the widget.
 * @type {string}
 * @private
 */
spo.ui.Game.prototype.cssClassPressed_ = goog.getCssName('depressed');

/**
 * The live game time clock instance for this game view.
 *
 * @type {spo.ui.GameTime}
 * @private
 */
spo.ui.Game.prototype.gameTimeUi_;

/**
 * Constructs the view. This is extracted because it has to be called on
 * model updates.
 *
 * @private
 */
spo.ui.Game.prototype.constructInternalView_ = function() {
  var model = this.getModel();
  var s_time = model.getProp(spo.ds.Game.Property.START_TIME);
  if (goog.isDef(this.gameTimeUi_)) {
    this.gameTimeUi_.exitDocument();
    goog.dispose(this.gameTimeUi_);
  }
  this.gameTimeUi_ = new spo.ui.GameTime(undefined,
    spo.ui.Game.defaultTimeFormat_);

  this.getElement().innerHTML = spo.template.gameTile({
    name: model.getProp(spo.ds.Game.Property.NAME),
    starttime: ((s_time != 0) ? pstj.date.utils.renderTime(
      parseInt(s_time, 10), spo.ui.Game.defaultTimeFormat_) : 'N/A'),
    playercount: model.getProp(spo.ds.Game.Property.PLAYERS_COUNT),
    status: this.getPrintStatus_(),
    locked: !!model.getProp(spo.ds.Game.Property.IS_LOCKED)
  });

  // No need to add as child, as the games are never exiting, only disposed.
  this.gameTimeUi_.setModel(this.getModel());
  this.gameTimeUi_.decorate(goog.dom.getElementByClass(goog.getCssName(
    'game-time'), this.getElement()));
};

/**
 * @inheritDoc
 */
spo.ui.Game.prototype.createDom = function() {
  var base = goog.dom.createDom('div', [goog.getCssName('tile-item'),
    goog.getCssName('scroll-list-item')]);

  this.decorateInternal(base);
  this.constructInternalView_();
};

/**
 * @inheritDoc
 */
spo.ui.Game.prototype.enterDocument = function() {
  // Setup mouse click and UI sugar.
  this.getHandler().listen(this.getElement(), goog.events.EventType.MOUSEDOWN,
    this.onMouseDown_);
  this.getHandler().listen(this.getElement(), goog.events.EventType.MOUSEUP,
    this.onMouseUp_);
  this.getHandler().listen(this.getElement(), goog.events.EventType.CLICK,
    this.showGameDetails_);

  // Setup model events
  this.getHandler().listen(/** @type {pstj.ds.ListItem} */ (this.getModel()),
    pstj.ds.ListItem.EventType.DELETE, this.dispose);
  this.getHandler().listen(/** @type {pstj.ds.ListItem} */ (this.getModel()),
    pstj.ds.ListItem.EventType.UPDATE, this.constructInternalView_);
};

/**
 * @inheritDoc
 */
spo.ui.Game.prototype.disposeInternal = function() {
  goog.dispose(this.gameTimeUi_);
  delete this.gameTimeUi_;
  goog.base(this, 'disposeInternal');
};


/**
 * Helper function to prettify the status. Purely cosmetic.
 * @return {string} The string that matches the game status. Strings defined
 * on the widget are used.
 *
 * @private
 */
spo.ui.Game.prototype.getPrintStatus_ = function() {
  var status = this.getModel().getProp(spo.ds.Game.Property.STATUS);
  if (status == 1) return spo.ui.Game.Strings.STARTED;
  if (status == 2) return spo.ui.Game.Strings.PAUSED;
  if (status == 3) return spo.ui.Game.Strings.STOPPED;
  return spo.ui.Game.Strings.REMOVED;
};

/**
 * This widget class should be able to use navigation, i.e set new route
 * on the state and thus is used for navigating the game -> game details
 * screens.
 *
 * @private
 */
spo.ui.Game.prototype.showGameDetails_ = function() {
  if (this.getModel().getProp(spo.ds.Game.Property.STATUS) == 3) {
    window.location.pathname = goog.global['FINISHED_GAME_STATS_URL'] +
    this.getModel().getProp(spo.ds.Game.Property.ID);
  } else {
    spo.admin.Router.getInstance().navigate('/game/' +
      this.getModel().getProp(spo.ds.Game.Property.ID));
  }
};


/**
 * Handles the MOUSEDOWN event. The trick used here to handle the casess
 * where the MOUSEDOWN happens on the widget but the user then moves the mouse
 * and releases it outside the widget (and thus not triggering the mouse up)
 * is deprecated, a MOUSEOUT event listener should be used instead.
 * TODO: change the listenOnce from mouseup to MOUSEOUT.
 *
 * @private
 * @param  {goog.events.Event} ev The MOUSEDOWN event.
 */
spo.ui.Game.prototype.onMouseDown_ = function(ev) {
  goog.dom.classes.add(this.getElement(), this.cssClassPressed_);
  this.getHandler().listenOnce(document, goog.events.EventType.MOUSEUP,
    this.onMouseUp_);
};

/**
 * Handles the mouse up event that is produced when the mouse button
 * is released. It is only handled to allow for the release action to
 * happen. If you activate the deperssed state of the component and without
 * releasing the mouse button start move and go outside the bounding rectangle
 * of the widget it will stay in this state, so one need to call this
 * when the mouse moves out.
 *
 * @param  {goog.events.Event} ev The MOUSEUP event.
 * @private
 */
spo.ui.Game.prototype.onMouseUp_ = function(ev) {
  goog.dom.classes.remove(this.getElement(), this.cssClassPressed_);
};
