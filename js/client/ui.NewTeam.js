/**
 * @fileoverview Provides the 'new team' widget for the regular teams. It
 * combines the view and control in the same Component as the action is very
 * simple and does not need any further abstraction.
 */
goog.provide('spo.ui.NewTeam');

goog.require('goog.async.Delay');
goog.require('goog.dom');
goog.require('goog.string');
goog.require('goog.ui.CustomButton');
goog.require('goog.ui.LabelInput');
goog.require('spo.ds.Resource');
goog.require('spo.template');
goog.require('spo.ui.ButtonRenderer');


/**
 * Provides the 'new team' widget for the team list view.
 *
 * @constructor
 * @extends {goog.ui.Component}
 * @param {number} gameid The ID of the game the widget will create teams for.
 */
spo.ui.NewTeam = function(gameid) {
  goog.base(this);
  this.gameId_ = gameid;
  this.input_ = new goog.ui.LabelInput();
  this.button_ = new goog.ui.CustomButton('',
    spo.ui.ButtonRenderer.getInstance());
  this.cleanMessage_delayed_ = new goog.async.Delay(this.cleanMessage_, 2000,
    this);
};
goog.inherits(spo.ui.NewTeam, goog.ui.Component);

/**
 * The ID of the game the team list belongs to, used to create new games
 * with the proper game id.
 *
 * @type {number}
 * @private
 */
spo.ui.NewTeam.prototype.gameId_;

/**
 * The input field in the widget.
 *
 * @type {goog.ui.LabelInput}
 * @private
 */
spo.ui.NewTeam.prototype.input_;

/**
 * The 'ok' button in the widget.
 *
 * @type {goog.ui.CustomButton}
 * @private
 */
spo.ui.NewTeam.prototype.button_;

/**
 * A delayed derivate of the cleaning message method.
 * Used to allow reutilization of the method without binding it
 * every time and stoping the timer in case multiple messages occur.
 *
 * @type {goog.async.Delay}
 * @private
 */
spo.ui.NewTeam.prototype.cleanMessage_delayed_;

/**
 * @inheritDoc
 */
spo.ui.NewTeam.prototype.createDom = function() {
  this.decorateInternal(
    /** @type {Element} */ goog.dom.htmlToDocumentFragment(
    spo.template.NewTeam({})));
};

/**
 * @inheritDoc
 */
spo.ui.NewTeam.prototype.decorateInternal = function(el) {
  goog.base(this, 'decorateInternal', el);
  var input = goog.dom.getElementsByTagNameAndClass('input', undefined,
    this.getElement())[0];
  var button = goog.dom.getElementByClass(goog.getCssName('form-button'),
    this.getElement());

  this.addChild(this.input_);
  this.addChild(this.button_);

  this.input_.decorate(input);
  this.button_.decorate(button);

};

/**
 * @inheritDoc
 */
spo.ui.NewTeam.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.getHandler().listen(this.button_, goog.ui.Component.EventType.ACTION,
    this.handleButtonAction_);
};

/**
 * @inheritDoc
 */
spo.ui.NewTeam.prototype.getContentElement = function() {
  return goog.dom.getElementByClass(goog.getCssName(
    'error'), this.getElement());
};

/**
 * @inheritDoc
 */
spo.ui.NewTeam.prototype.disposeInternal = function() {
  goog.dispose(this.cleanMessage_delayed_);
  delete this.cleanMessage_delayed_;

  goog.base(this, 'disposeInternal');
  delete this.gameId_;
  delete this.input_;
  delete this.button_;
};

/**
 * Sets the enabled state of thr widget.
 *
 * @param {boolean} enable True if the widget should be enabled.
 * @protected
 */
spo.ui.NewTeam.prototype.setEnabled = function(enable) {
  this.input_.setEnabled(enable);
  this.button_.setEnabled(enable);
};

/**
 * Handles the messages and displays them in the content element of the
 * widget. The messages are automatically cleaned after that.
 *
 * @param {!string} msg The message to set.
 * @private
 */
spo.ui.NewTeam.prototype.setMessage_ = function(msg) {
  this.cleanMessage_delayed_.stop();
  this.getContentElement().innerHTML = msg;
  this.cleanMessage_delayed_.start();
};

/**
 * Cleans up the messages in the content element.
 *
 * @private
 */
spo.ui.NewTeam.prototype.cleanMessage_ = function() {
  this.getContentElement().innerHTML = '';
  this.setEnabled(true);
};

/**
 * Handles the reply the server sends when new game creation is attempted.
 *
 * @param  {*} resp The server response (JSON object).
 * @private
 */
spo.ui.NewTeam.prototype.handleActionReply_ = function(resp) {
  if (resp['status'] != 'ok') {
    this.setMessage_('Error:' + resp['error']);
  } else {
    this.input_.setValue('');
    this.setEnabled(true);
  }
};

/**
 * Getter for the update/create packet structure.
 *
 * @protected
 * @param  {string} name The name of the new item to create.
 * @return {Object} The object literal that is the packet for the update/create.
 */
spo.ui.NewTeam.prototype.getCreatePacket = function(name) {
  return {
    'url': '/team/create',
    'data': {
      'game_id': this.gameId_,
      'name': name
    }
  }
};

/**
 * Handles the button activation in the widget.
 *
 * @param  {goog.events.Event} ev The ACTION event instance.
 * @private
 */
spo.ui.NewTeam.prototype.handleButtonAction_ = function(ev) {
  ev.stopPropagation();
  this.setEnabled(false);
  var value = goog.string.trim(this.input_.getValue());
  if (value != '') {
    spo.ds.Resource.getInstance().get(this.getCreatePacket(value),
      goog.bind(this.handleActionReply_, this));
  } else {
    this.setMessage_('Error: Name cannot be empty.')
  }
};
