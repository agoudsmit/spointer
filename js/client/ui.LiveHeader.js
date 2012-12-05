/**
 * @fileoverview Provides the global header widget.
 */
goog.provide('spo.ui.Header');

goog.require('goog.async.Delay');
goog.require('goog.dom');
goog.require('goog.events.EventType');
goog.require('goog.events.KeyHandler');
goog.require('goog.events.KeyHandler.EventType');
goog.require('goog.ui.Component');
goog.require('goog.ui.LabelInput');
goog.require('spo.template');
goog.require('goog.events.KeyCodes');
goog.require('pstj.ui.Clock');

/**
 * The live header widget is an universal widget that is able to handle
 * all views and updates itself accordingly.
 * This component should NOT be created, instead only one instance of it
 * should be used. Also the instance need to decorate a DOM element that is
 * already in the main DOM tree.
 * Usage example:
 * <code>
 * spo.ui.Header.getInstance().decorate(document.getElementById('header'));
 * </code>
 *
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
 * The key handler that is used by the search field sub-component.
 *
 * @type {goog.events.KeyHandler}
 * @private
 */
spo.ui.Header.prototype.keyHandler_;

/**
 * The game name label element. It is an HTML Element from the dom of this
 * widget.
 *
 * @type {Element}
 * @private
 */
spo.ui.Header.prototype.gameNameLabel_;

/**
 * The view name label element. An HTML Element from the Dom tree of this
 * widget.
 *
 * @type {Element}
 * @private
 */
spo.ui.Header.prototype.viewName_;

/**
 * The back link element.
 *
 * @type {Element}
 * @private
 */
spo.ui.Header.prototype.backLink_;

/**
 * The forward link element.
 *
 * @type {Element}
 * @private
 */
spo.ui.Header.prototype.forwardLink_;

/**
 * The search field as label input component.
 *
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
 * If the search function should be called only on enter key.
 * @type {!boolean}
 * @private
 */
spo.ui.Header.prototype.searchOnlyOnEnter_ = false;

/**
 * The default string to use as Game Name. We use non blocking space
 * to avoid additional styling.
 *
 * @private
 * @type {string}
 */
spo.ui.Header.prototype.defaultGameName_ = '&nbsp;';

/**
 * The default string to use as View Name. We use non blocking space to
 * avoid additional styling required to compensate for the 0px size.
 *
 * @private
 * @type {string}
 */
spo.ui.Header.prototype.defaultViewName_ = '&nbsp;';
/**
 * Flag if the search term in the search field was appplied.
 * @type {boolean}
 * @private
 */
spo.ui.Header.prototype.searchWasApplied_ = false;
/**
 * @inheritDoc
 */
spo.ui.Header.prototype.decorateInternal = function(element) {

  // The element should already be in the page, because we want the header
  // to persists. Just fill it in now with the content.
  goog.base(this, 'decorateInternal', element);

  // Setup the username and logout link as well as the rest of the internal DOM.
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
 * Enables/disables the search widget (a labeled input).
 *
 * @param {boolean} enable If true, the search widget will be shown and enabled.
 * @private
 */
spo.ui.Header.prototype.setSearchEnabled_ = function(enable) {
  if (enable) {
    this.getHandler().listen(this.keyHandler_,
      goog.events.KeyHandler.EventType.KEY, this.onSearchChange_);
  } else {
    this.getHandler().unlisten(this.keyHandler_,
      goog.events.KeyHandler.EventType.KEY, this.onSearchChange_);
  }
};

/**
 * Pains the search term, notice that this will NOT trigger search field change event.
 * @param {string=} term The search term to visualize.
 */
spo.ui.Header.prototype.setSearchTerm = function(term) {
  if (goog.isString(term)) this.searchField_.setValue(term);
  else this.searchField_.setValue('');
};


/**
 * Handler for the change in the search sub-widget.
 *
 * @param  {goog.events.Event} e The KeyHandler KEY event.
 * @private
 */
spo.ui.Header.prototype.onSearchChange_ = function(e) {
  this.searchDelayed_.stop();
  if (this.searchWasApplied_) {
    this.searchWasApplied_ = false;
    goog.dom.classes.remove(this.searchField_.getElement(), goog.getCssName('used'));
  }
  
  if (this.searchOnlyOnEnter_ == true) {
    if (e.keyCode != goog.events.KeyCodes.ENTER) {
      return;
    }
  }
  // Omit checks for 'changed' as we might change back to 'original'
  // and still need to call the search function to clear the search.
  if (goog.isFunction(this.searchFieldHandler_)) {
    this.searchDelayed_.start();
  }
};

/**
 * Calls the setup search widget handler with the current value of the input.
 *
 * @private
 */
spo.ui.Header.prototype.performSearchCallback_ = function() {
  var value = this.searchField_.getValue();
  if (value != '') {
    if (!this.searchWasApplied_) {
      this.searchWasApplied_ = true;
      goog.dom.classes.add(this.searchField_.getElement(), goog.getCssName('used'));
    }
  } else {
    if (this.searchWasApplied_) {
      this.searchWasApplied_ = false;
      goog.dom.classes.remove(this.searchField_.getElement(), goog.getCssName('used'));
    }
  }
  this.searchFieldHandler_(value);
};

/**
 * Public method to set the view name in the header.
 *
 * @param {string=} view_name The view name to use.
 */
spo.ui.Header.prototype.setViewName = function(view_name) {
  this.viewName_.innerHTML = view_name || this.defaultViewName_;
};

/**
 * Public method to set the game name in the live header.
 *
 * @param {string=} gamename The game name to set.
 */
spo.ui.Header.prototype.setGameName = function(gamename) {
  this.gameNameLabel_.innerHTML = gamename || this.defaultGameName_;
};

/**
 * Sets the text of the serchfiled in the header.
 *
 * @param {string=} text The input label. Note that if no text is suppled
 *                       the field will be disabled/hidden.
 * @param {function(string): void=} handler The handler to use with
 *                                  the fields change currently.
 * @param {boolean=} on_enter If the search should be perfored only on enter press or on everykey press.
 */
spo.ui.Header.prototype.setSearchFiledState = function(text, handler, on_enter) {
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
  if (on_enter == true) this.searchOnlyOnEnter_ = true;
  else this.searchOnlyOnEnter_ = false;
};

/**
 * Setups the links in the header.
 *
 * @param {string=} back_link    The link url.
 * @param {string=} back_text    The inner html of the link.
 * @param {string=} forward_link The link url.
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
