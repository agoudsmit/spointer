goog.provide('spo.ui.NewGame');

goog.require('goog.ui.Component');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.CustomButton');
goog.require('goog.ui.LabelInput');
goog.require('spo.template');
goog.require('spo.ui.ButtonRenderer');

/**
 * Provide the 'new game' widget in game list.
 * It only serves to create the new game's name and then add it to the list.
 * Further editing should be handled by other components.
 * @constructor
 * @extends {goog.ui.Component}
 * @param {goog.dom.DomHelper=} odh An optional DOM helper.
 */
spo.ui.NewGame = function(odh) {
  goog.base(this, odh);
  this.input_ = new goog.ui.LabelInput();
  this.button_ = new goog.ui.CustomButton('',
    spo.ui.ButtonRenderer.getInstance());
};
goog.inherits(spo.ui.NewGame, goog.ui.Component);

/**
 * Provides the strings for the template related to this widget.
 * @enum {string}
 */
spo.ui.NewGame.Strings = {
  ADD_GAME: 'Add new game'
};

/**
 * @inheritDoc
 */
spo.ui.NewGame.prototype.createDom = function() {
  var a = spo.template.createGame({
    hint: spo.ui.NewGame.Strings.ADD_GAME
  });
  this.decorateInternal(
    /** @type {Element} */ (goog.dom.htmlToDocumentFragment(
    a)));
};

/**
 * @inheritDoc
 */
spo.ui.NewGame.prototype.getContentElement = function() {
  var ce = goog.dom.getElementByClass(goog.getCssName('error'),
    this.getElement());
  if (goog.dom.isElement(ce)) return ce;
  return this.getElement();
};

/**
 * @inheritDoc
 */
spo.ui.NewGame.prototype.decorateInternal = function(element)  {
  goog.base(this, 'decorateInternal', element);
  this.input_.decorate(goog.dom.getElementsByTagNameAndClass('input',
    undefined, this.getElement())[0]);
  this.addChild(this.button_);
  this.button_.decorate(goog.dom.getElementByClass(goog.getCssName(
    'form-button'), element));
  // this.addChild(this.button_);
};

/**
 * Handles the button on the widget, upon ACTION event it should be
 * able to create a new game, store it on the server an upon success
 * notify the parent about new game being created. The parent then should
 * be able to notify controler and update the needed parts in both view and
 * data.
 * @param  {goog.events.Event} e The goog.ui.Component.EventType.ACTION event.
 * @private
 */
spo.ui.NewGame.prototype.handleNewGameButton_ = function(e) {
  e.stopPropagation();
  this.dispatchEvent(goog.ui.Component.EventType.ACTION);
};

/**
 * Re-purpose the action event from the button to make the action being
 * emited by the component instead.
 * @inheritDoc
 */
spo.ui.NewGame.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.getHandler().listen(this.button_, goog.ui.Component.EventType.ACTION,
    this.handleNewGameButton_);
};

/**
 * Returns the value of the input. Getter should take care of validation.
 * @return {string} The string as it is currently set in the input.
 */
spo.ui.NewGame.prototype.getValue = function() {
  return this.input_.getValue();
};

/**
 * Copies the setEnable method from control.
 * @param {boolean} enable True to enable, false to disable.
 */
spo.ui.NewGame.prototype.setEnabled = function(enable) {
  this.input_.setEnabled(enable);
  this.button_.setEnabled(enable);
};

/**
 * Clears the value (i.e. resets the widget)
 */
spo.ui.NewGame.prototype.resetWidget = function() {
  this.input_.clear();
  this.setEnabled(true);
  this.setError('');
};

/**
 * Sets error notice on the widget.
 * The error does not alter the widget state in any way!
 * @param {!string} errorText The text of the error.
 */
spo.ui.NewGame.prototype.setError = function(errorText) {
  this.getContentElement().innerHTML = errorText;
};
