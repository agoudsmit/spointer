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
 * @param {pstj.ds.RecordID} gameid The ID of the game the widget will create
 *                                  teams for.
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
 * @type {pstj.ds.RecordID}
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
 * An ID of a team when the submition is for editing a team.
 *
 * @type {pstj.ds.RecordID}
 * @private
 */
spo.ui.NewTeam.prototype.teamid_;

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
    /** @type {Element} */ (goog.dom.htmlToDocumentFragment(
        spo.template.NewTeam({}))));
};

/**
 * Make the widget enter edit mode. In edit mode values are added to the
 * fields (those are being pre-populated) and an ID is supplied, which is used
 * for the update request. After submition the widget exits the edit mode
 * automatically.
 *
 * @param  {!pstj.ds.RecordID} teamid The ID of the team to update.
 * @param  {string=} name The name of the team to edit.
 */
spo.ui.NewTeam.prototype.enterEditMode = function(teamid, name) {
  this.teamid_ = teamid;
  this.input_.setValue(name);
  this.button_.setValue('Update');
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
  this.getHandler().listen(this, goog.ui.Component.EventType.ACTION,
    function(ev){ ev.stopPropagation()});
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
 * @protected
 */
spo.ui.NewTeam.prototype.handleActionReply = function(resp) {
  if (resp['status'] != 'ok') {
    this.setMessage_('Error:' + resp['error']);
  } else {
    delete this.teamid_;
    this.input_.setValue('');
    this.button_.setValue('Add');
    this.setEnabled(true);
  }
};

/**
 * Getter for the create packet structure.
 *
 * @protected
 * @return {Object} The object literal that is the packet for the update/create.
 */
spo.ui.NewTeam.prototype.getCreatePacket = function() {
  return {
    'url': '/team/create',
    'data': {
      'game_id': this.gameId_,
      'name': goog.string.trim(this.input_.getValue())
    }
  }
};

/**
 * Getter for the update packet.
 *
 * @protected
 * @return {Object} The object literal that is an update pakcet for the server.
 */
spo.ui.NewTeam.prototype.getUpdatePacket = function() {
  return {
    'url': '/team/update/' + this.teamid_,
    'data': {
      'name': goog.string.trim(this.input_.getValue())
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
    // Edit mode
    if (goog.isDef(this.teamid_)) {
      spo.ds.Resource.getInstance().get(this.getUpdatePacket(),
        goog.bind(this.handleActionReply, this));
    } else {
      spo.ds.Resource.getInstance().get(this.getCreatePacket(),
        goog.bind(this.handleActionReply, this));
    }
  } else {
    this.setMessage_('Error: Name cannot be empty.')
  }
};
