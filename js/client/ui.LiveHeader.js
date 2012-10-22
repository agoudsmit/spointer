goog.provide('spo.ui.Header');

goog.require('goog.ui.Component');

/**
 * The live header widget
 * @constructor
 * @extends {goog.ui.Component}
 * @param {goog.dom.DomHelper=} dh The optional dom helper.
 */
spo.ui.Header = function(dh) {
  goog.base(this, dh);
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
 * Setups the links in the header.
 * @param {string=} back_link    The link url.
 * @param {string=} back_text    The inner html of the link.
 * @param {string=} forward_link The link url.
 * @param {string=} forward_text The inner html of the link.
 */
spo.ui.Header.prototype.setLinks = function(back_link, back_text, forward_link,
  forward_text) {
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
