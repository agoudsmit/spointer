/**
 * @fileoverview Provides the 'user' record UI.
 */

goog.provide('spo.ui.User');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.events.EventType');
goog.require('goog.string');
goog.require('goog.ui.Component');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.CustomButton');
goog.require('goog.ui.LabelInput');
goog.require('spo.control.Action');
goog.require('spo.control.Event');
goog.require('spo.control.EventType');
goog.require('spo.ds.User');
goog.require('spo.template');
goog.require('spo.ui.ButtonRenderer');

/**
 * Provides a widget that displays an user record in the user list.
 * Handles both view and edit states.
 *
 * @constructor
 * @extends {goog.ui.Component}
 */
spo.ui.User = function() {

  goog.base(this);
  this.saveBtn_ = new goog.ui.CustomButton('',
    spo.ui.ButtonRenderer.getInstance());
  this.delBtn_ = new goog.ui.CustomButton('',
    spo.ui.ButtonRenderer.getInstance());

  this.getHandler().listen(this, goog.ui.Component.EventType.ACTION,
    this.handleUserAction_);


  this.role_ = new goog.ui.LabelInput();
  this.func_ = new goog.ui.LabelInput();
  this.name_ = new goog.ui.LabelInput();
  this.mail_ = new goog.ui.LabelInput();

  this.addChild(this.role_);
  this.addChild(this.func_);
  this.addChild(this.name_);
  this.addChild(this.mail_);
};
goog.inherits(spo.ui.User, goog.ui.Component);

/**
 * Flag for the edit mode of the widget.
 *
 * @type {boolean}
 * @private
 */
spo.ui.User.prototype.editMode_ = false;

/**
 * @inheritDoc
 */
spo.ui.User.prototype.createDom = function() {

  this.decorateInternal(
    /** @type {Element} */ (goog.dom.htmlToDocumentFragment(
      spo.template.User({
        username: this.getModel().getProp(spo.ds.User.Property.NAME),
        userrole: this.getModel().getProp(spo.ds.User.Property.ROLE),
        userfunction: this.getModel().getProp(spo.ds.User.Property.FUNCTION),
        useremail: this.getModel().getProp(spo.ds.User.Property.EMAIL)
      }))));
};

/**
 * @inheritDoc
 */
spo.ui.User.prototype.enterDocument = function() {

  var actions = goog.dom.getElementsByClass(goog.getCssName('form-button'),
    this.getElement());

  // Bind buttons
  this.addChild(this.saveBtn_);
  this.saveBtn_.decorate(actions[0]);
  this.addChild(this.delBtn_);
  this.delBtn_.decorate(actions[1]);

  // Populate values as labeled inputs.
  var values = goog.dom.getElementsByClass(goog.getCssName('form-values'),
    this.getElement());
  this.role_.decorate(values[0]);
  this.func_.decorate(values[1]);
  this.name_.decorate(values[2]);
  this.mail_.decorate(values[3]);

  // Listen for 'edit' UI requests.
  this.getHandler().listen(this.getElement(), goog.events.EventType.CLICK,
    this.enterEditMode_);

  // Bind the data model events.
  this.getHandler().listen(
    /** @type {pstj.ds.ListItem} */ (this.getModel()),
    pstj.ds.ListItem.EventType.UPDATE, this.onRecordUpdate_);
  this.getHandler().listen(/** @type {pstj.ds.ListItem} */ (this.getModel()),
    pstj.ds.ListItem.EventType.DELETE, this.onRecordDelete_);
};

/**
 * Handles the record updates in the model. The event will be received when
 * data storage notices an update in this record.
 *
 * @param  {goog.events.Event} ev The update event.
 * @private
 */
spo.ui.User.prototype.onRecordUpdate_ = function(ev) {
  ev.stopPropagation();
  this.name_.setValue(this.getModel().getProp(spo.ds.User.Property.NAME));
  this.role_.setValue(this.getModel().getProp(spo.ds.User.Property.ROLE));
  this.mail_.setValue(this.getModel().getProp(spo.ds.User.Property.EMAIL));
  this.func_.setValue(this.getModel().getProp(spo.ds.User.Property.FUNCTION));
  this.exitEditMode_();
};

/**
 * Handles the record delete event from the model.
 *
 * @private
 */
spo.ui.User.prototype.onRecordDelete_ = function() {
  this.exitDocument();
  this.dispose();
};

/**
 * Utility method that returns the values of the inputs as literal object.
 *
 * @return {Object} The records structured as literal.
 */
spo.ui.User.prototype.getValues = function() {
  var res = {
    'role': this.role_.getValue(),
    'function': this.func_.getValue(),
    'name': this.name_.getValue()
  };
  var newmail = this.mail_.getValue();
  if (this.getModel().getProp(spo.ds.User.Property.EMAIL) != goog.string.trim(
    newmail)) {
    res['email'] = newmail;
  }
  return res;
};

/**
 * Handles the events dispatched by the buttons activation. It 'translates'
 * the button action info control action and dispatches a new control event.
 *
 * @param  {goog.events.Event} ev The ACTION event from one of the button.
 * @private
 */
spo.ui.User.prototype.handleUserAction_ = function(ev) {
  ev.stopPropagation();
  if (ev.target == this.delBtn_) {
    this.dispatchEvent(new spo.control.Event(this, spo.control.Action.DELETE));
  } else if (ev.target == this.saveBtn_) {
    this.dispatchEvent(new spo.control.Event(this, spo.control.Action.SAVE));
  }
};

/**
 * Method to call when the widget should enter edit mode.
 *
 * @private
 */
spo.ui.User.prototype.enterEditMode_ = function() {
  this.getHandler().unlisten(this.getElement(), goog.events.EventType.CLICK,
    this.enterEditMode_);
  this.editMode_ = true;
  goog.dom.classes.add(this.getElement(), goog.getCssName('active'));
};

/**
 * Method to call when the widget should exit edit mode.
 *
 * @private
 */
spo.ui.User.prototype.exitEditMode_ = function() {
  this.getHandler().listen(this.getElement(), goog.events.EventType.CLICK,
    this.enterEditMode_);
  this.editMode_ = false;
  goog.dom.classes.remove(this.getElement(), goog.getCssName('active'));
};
