goog.provide('spo.ui.Header');

goog.require('goog.ui.Component');
goog.require('goog.ui.LabelInput');
goog.require('goog.events.EventType');
goog.require('goog.events.KeyHandler');
goog.require('goog.events.KeyHandler.EventType');
goog.require('spo.template');
goog.require('goog.dom');
goog.require('goog.async.Delay');

/**
 * The live header widget
 * @constructor
 * @extends {goog.ui.Component}
 * @param {goog.dom.DomHelper=} dh The optional dom helper.
 */
spo.ui.Header = function(dh) {
  goog.base(this, dh);
  this.keyHandler_ = new goog.events.KeyHandler();
  this.searchDelayed_ = new goog.async.Delay(this.performSearchCallback_, 500,
    this);
};
goog.inherits(spo.ui.Header, goog.ui.Component);

/**
 * @private
 * @type {string}
 */
spo.ui.Header.prototype.defaultGameName_ = '&nbsp;';

/**
 * @private
 * @type {string}
 */
spo.ui.Header.prototype.defaultViewName_ = '&nbsp;';

/**
 * The key handler that is used by the search field.
 * @type {goog.events.KeyHandler}
 * @private
 */
spo.ui.Header.prototype.keyHandler_;

/**
 * The game name label element.
 * @type {Element}
 * @private
 */
spo.ui.Header.prototype.gameNameLabel_;

/**
 * The view name label element.
 * @type {Element}
 * @private
 */
spo.ui.Header.prototype.viewName_;

/**
 * The back link element.
 * @type {Element}
 * @private
 */
spo.ui.Header.prototype.backLink_;

/**
 * The forward link element.
 * @type {Element}
 * @private
 */
spo.ui.Header.prototype.forwardLink_;

/**
 * The saerch field as lable input component.
 * @type {goog.ui.LabelInput}
 * @private
 */
spo.ui.Header.prototype.searchField_;

/**
 * The clock to visualize in the date/time section.
 * @type {pstj.ui.Clock}
 * @private
 */
spo.ui.Header.prototype.clock_;

/**
 * The clock element to decorate by the ui clocks.
 * @type {Element}
 * @private
 */
spo.ui.Header.prototype.clockElement_;

/**
 * Sets the clock instance to be visualized in the header.
 * @param {pstj.ui.Clock} clock The clock instance to use.
 */
spo.ui.Header.prototype.setClockInstance = function(clock) {
  if (goog.isDefAndNotNull(this.clock_)) {
    goog.dispose(this.clock_);
  }
  this.clock_ = clock;
  this.clock_.decorate(this.clockElement_);
};

/**
 * @inheritDoc
 */
spo.ui.Header.prototype.decorateInternal = function(element) {
  // The element should already be in the page, because we want the header
  // to persists. Just fill it in now with the content.
  goog.base(this, 'decorateInternal', element);
  element.innerHTML = spo.template.headerWithLogin({
    username: goog.global['USER_NAME'],
    logoutlink: goog.global['LOGOUT_LINK']
  });

  // Label elements.
  this.gameNameLabel_ = goog.dom.getElementByClass(goog.getCssName(
    'game-name'), element);
  this.viewName_ = goog.dom.getElementByClass(goog.getCssName('view-name'),
    element);

  // Links elements.
  this.backLink_ = goog.dom.getElementByClass(goog.getCssName('back-link'),
    element);
  this.forwardLink_ = goog.dom.getElementByClass(goog.getCssName(
    'forward-link'), element);

  // Setup the search field.
  var searchField = goog.dom.getElementByClass(goog.getCssName(
    'search-input'), element);
  this.searchField_ = new goog.ui.LabelInput();
  this.searchField_.decorate(searchField);

  this.clockElement_ = goog.dom.getElementByClass(goog.getCssName('date-time'),
    this.getElement());

  this.keyHandler_.attach(this.searchField_.getElement());
};


spo.ui.Header.prototype.setSearchEnabled_ = function(enable) {
  var el = this.searchField_.getElement();
  if (enable) {
    this.getHandler().listen(this.keyHandler_,
      goog.events.KeyHandler.EventType.KEY, this.onSearchChange_);
  } else {
    this.getHandler().unlisten(this.keyHandler_,
      goog.events.KeyHandler.EventType.KEY, this.onSearchChange_);
  }
};

spo.ui.Header.prototype.onSearchChange_ = function(e) {
  this.searchDelayed_.stop();
  if (this.searchField_.hasChanged() &&
    goog.isFunction(this.searchFieldHandler_)) {
    this.searchDelayed_.start();

  }
};

spo.ui.Header.prototype.performSearchCallback_ = function() {
  this.searchFieldHandler_(this.searchField_.getValue());
};



/**
 * Public method to set the view name in the header.
 * @param {string=} viewname The view name to use.
 */
spo.ui.Header.prototype.setViewName = function(viewname) {
  this.viewName_.innerHTML = viewname || this.defaultViewName_;
};

/**
 * Public method to set the game name in the live header.
 * @param {string=} gamename The game name to set.
 */
spo.ui.Header.prototype.setGameName = function(gamename) {
  this.gameNameLabel_.innerHTML = gamename || this.defaultGameName_;
};

/**
 * Sets the text of the serchfiled in the header.
 * @param {string=} text The input label. Note that if no text is suppled
 * the field will be disabled/hidden.
 * @param {function(string): void=} handler The handler to use with
 * the fields change currently.
 */
spo.ui.Header.prototype.setSearchFiledState = function(text, handler) {
  this.searchField_.clear();

  if (goog.isString(text)) {
    this.searchField_.setLabel(text);
    this.searchFieldHandler_ = handler;
    this.setSearchEnabled_(true);
    this.searchField_.getElement().style.display = 'block';
  } else {
    this.setSearchEnabled_(false);
    this.searchFieldHandler_ = null;
    this.searchField_.getElement().style.display = 'none';
  }
};

/**
 * Setups the links in the header.
 * @param {function|string=} back_link    The link url.
 * @param {string=} back_text    The inner html of the link.
 * @param {function|string=} forward_link The link url.
 * @param {string=} forward_text The inner html of the link.
 */
spo.ui.Header.prototype.setLinks = function(back_link, back_text, forward_link,
  forward_text) {

  // Setup links
  if (goog.isString(back_link)) {
    this.backLink_.innerHTML = '<a href="#' + back_link + '">' + back_text +
      '</a>';
  } else {
    this.backLink_.innerHTML = '';
  }

  if (goog.isString(forward_link)) {
    this.forwardLink_.innerHTML = '<a href="#' + forward_link + '">' +
    forward_text + '</a>';
  } else {
    this.forwardLink_.innerHTML = '';
  }
};

goog.addSingletonGetter(spo.ui.Header);
