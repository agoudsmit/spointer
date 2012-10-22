goog.provide('spo.ui.Game');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.ui.Component');
goog.require('pstj.date.utils');
goog.require('spo.admin.Router');
goog.require('spo.ds.Game');
goog.require('spo.template');

/**
 * Provides a widget view for a game record. It is only used to activate
 * games and to show information for those.
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

goog.scope(function() {

  var proto = spo.ui.Game.prototype;

  /**
   * The CSS class name to use to setthe pressed state of the widget.
   * @type {string}
   * @private
   */
  proto.cssClassPressed_ = goog.getCssName('depressed');

  /**
   * @inheritDoc
   */
  proto.createDom = function() {
    var model = this.getModel();

    if (model instanceof spo.ds.Game) {
      var s_time = model.getProp(spo.ds.Game.Property.START_TIME);

      this.decorateInternal(
          /** @type {!Element} */ (goog.dom.htmlToDocumentFragment(
        spo.template.gameTile({
          name: model.getProp(spo.ds.Game.Property.NAME),
          starttime: ((s_time != 0) ? pstj.date.utils.renderTime(
            parseInt(s_time, 10), spo.ui.Game.defaultTimeFormat_) : 'N/A'),
          playercount: model.getProp(spo.ds.Game.Property.PLAYERS_COUNT),
          status: this.getPrintStatus_()
        }))));

    } else {
      throw Error('Canot create Tile Item without data');
    }
  };

  /**
   * Helper function to prettify the status. Purely cosmetic.
   * @return {string} The string that matches the game status. Strings defined
   * on the widget are used.
   * @private
   */
  proto.getPrintStatus_ = function() {
    var status = this.getModel().getProp(spo.ds.Game.Property.STATUS);
    if (status == 1) return spo.ui.Game.Strings.STARTED;
    else if (status == 2) return spo.ui.Game.Strings.PAUSED;
    else if (status == 3) return spo.ui.Game.Strings.STOPPED;
    else return spo.ui.Game.Strings.REMOVED;
  };

  /**
   * This widget class should be able to use navigation, i.e set new route
   * on the state and thus is used for navigating the game -> game details
   * screens.
   * @private
   */
  proto.showGameDetails_ = function() {
    spo.admin.Router.getInstance().navigate('/game/' +
      this.getModel().getProp(spo.ds.Game.Property.ID));
  };


  /**
   * Handles the MOUSEDOWN event. The trick used here to handle the casess
   * where the MOUSEDOWN happens on the widget but the user then moves the mouse
   * and releases it outside the widget (and thus not triggering the mouse up)
   * is deprecated, a MOUSEOUT event listener should be used instead.
   * TODO: change the listenOnce from mouseup to MOUSEOUT.
   * @private
   * @param  {goog.events.Event} ev The MOUSEDOWN event.
   */
  proto.onMouseDown_ = function(ev) {
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
   * @param  {goog.events.Event} ev The MOUSEUP event.
   * @private
   */
  proto.onMouseUp_ = function(ev) {
    goog.dom.classes.remove(this.getElement(), this.cssClassPressed_);
  };
  /**
   * @inheritDoc
   */
  proto.enterDocument = function() {
    var el = this.getElement();
    this.getHandler().listen(el, goog.events.EventType.MOUSEDOWN,
      this.onMouseDown_);
    this.getHandler().listen(el, goog.events.EventType.MOUSEUP,
      this.onMouseUp_);
    this.getHandler().listen(this.getElement(), goog.events.EventType.CLICK,
      this.showGameDetails_);
  };
});
