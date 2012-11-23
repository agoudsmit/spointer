/**
 * @fileoverview Provides the 'user' record UI.
 */

goog.provide('spo.ui.User');

goog.require('goog.async.Delay');
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
goog.require('spo.ds.ControlUser');
goog.require('spo.template');
goog.require('spo.ui.ButtonRenderer');

/**
 * Provides a widget that displays an user record in the user list.
 * Handles both view and edit states.
 *
 * @constructor
 * @extends {goog.ui.Component}
 * @param {boolean=} is_control True if the component is to be control user view.
 */
spo.ui.User = function(is_control) {
  goog.base(this);
  this.control_ = !!is_control;
  this.saveBtn_ = new goog.ui.CustomButton('', spo.ui.ButtonRenderer.getInstance());
  this.delBtn_ = new goog.ui.CustomButton('', spo.ui.ButtonRenderer.getInstance());
  this.clearError_delay_ = new goog.async.Delay(this.clearError_, 2500, this);
  this.getHandler().listen(this, goog.ui.Component.EventType.ACTION, this.handleUserAction);
  this.createValueHolders();
};
goog.inherits(spo.ui.User, goog.ui.Component);

goog.scope(function() {
  var proto = spo.ui.User.prototype;
  var dom = goog.dom;
  var LabelInput = goog.ui.LabelInput;

  /**
   * @type {Element}
   * @private
   */
  proto.errorContainer_;
  /**
   * The flag for controls.
   * @type {boolean}
   * @private
   */
  proto.control_ = false;
  /**
   * Flag for the edit mode of the widget.
   *
   * @type {boolean}
   * @private
   */
  proto.editMode_ = false;

  /** @protected */
  proto.createValueHolders = function() {
    if (!this.control_) {
      this.role_ = new LabelInput();
      this.func_ = new LabelInput();
      this.addChild(this.role_);
      this.addChild(this.func_);
    }
    this.name_ = new LabelInput();
    this.mail_ = new LabelInput();
    this.addChild(this.name_);
    this.addChild(this.mail_);
  };

  /** @protected */
  proto.decorateValueHolders = function() {
    // Populate values as labeled inputs.
    var values = dom.getElementsByClass(goog.getCssName('form-values'), this.getElement());
    var i = -1;

    if (!this.control_) {
      this.role_.decorate(values[++i]);
      this.func_.decorate(values[++i]);
    }
    this.name_.decorate(values[++i]);
    this.mail_.decorate(values[++i]);
  };

  /** @protected */
  proto.setValuesOnValueHolders = function() {
    if (!this.control_) {
      this.name_.setValue(this.getModel().getProp(spo.ds.User.Property.NAME));
      this.role_.setValue(this.getModel().getProp(spo.ds.User.Property.ROLE));
      this.mail_.setValue(this.getModel().getProp(spo.ds.User.Property.EMAIL));
      this.func_.setValue(this.getModel().getProp(spo.ds.User.Property.FUNCTION));
    } else {
      this.name_.setValue(this.getModel().getProp(spo.ds.ControlUser.Property.NAME));
      this.mail_.setValue(this.getModel().getProp(spo.ds.ControlUser.Property.EMAIL));
    }
  };

  /** @inheritDoc */
  proto.createDom = function() {
    this.decorateInternal(
      /** @type {Element} */ (goog.dom.htmlToDocumentFragment(this.getTemplate())));
  };
  /** @inheritDoc */
  proto.decorateInternal = function(el) {
    goog.base(this, 'decorateInternal', el);
    this.errorContainer_ = dom.getElementByClass(goog.getCssName('error'), el);
  };

  /** @inheritDoc */
  proto.enterDocument = function() {
    goog.base(this, 'enterDocument');
    var actions = goog.dom.getElementsByClass(goog.getCssName('form-button'), this.getElement());
    // Bind buttons
    this.addChild(this.saveBtn_);
    this.saveBtn_.decorate(actions[0]);
    this.addChild(this.delBtn_);
    this.delBtn_.decorate(actions[1]);
    this.decorateValueHolders();
    this.setupListeners();
  };

  proto.setupListeners = function() {
    // Listen for 'edit' UI requests.
    this.getHandler().listen(this.getElement(), goog.events.EventType.CLICK, this.enterEditMode_);
    // Bind the data model events.
    this.getHandler().listen( /** @type {pstj.ds.ListItem} */ (this.getModel()),
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
  proto.onRecordUpdate_ = function(ev) {
    ev.stopPropagation();
    this.setValuesOnValueHolders();
    this.exitEditMode_();
  };

  /**
   * Handles the record delete event from the model.
   *
   * @private
   */
  proto.onRecordDelete_ = function() {
    this.exitDocument();
    this.dispose();
  };

  /**
   * Returns the template as html for this component.
   *
   * @protected
   * @return {!string} The suitable html.
   */
  proto.getTemplate = function() {
    return  this.control_ ?
    spo.template.ControlUser({
      name: this.getModel().getProp(spo.ds.ControlUser.Property.NAME),
      mail: this.getModel().getProp(spo.ds.ControlUser.Property.EMAIL)
    }) : spo.template.User({
      username: this.getModel().getProp(spo.ds.User.Property.NAME),
      userrole: this.getModel().getProp(spo.ds.User.Property.ROLE),
      userfunction: this.getModel().getProp(spo.ds.User.Property.FUNCTION),
      useremail: this.getModel().getProp(spo.ds.User.Property.EMAIL)
    });
  };

  /**
   * Shows an error on the operation that was started.
   *
   * @param  {String} err The error string from server.
   */
  proto.showError = function(err) {
    this.errorContainer_.innerHTML = err;
    this.errorContainer_.style.display = 'block';
    this.clearError_delay_.start();
  };

  /** @private */
  proto.clearError_ = function() {
    this.errorContainer_.innerHTML = '';
    this.errorContainer_.style.display = 'none';
  };
  /**
   * Handles the events dispatched by the buttons activation. It 'translates'
   * the button action info control action and dispatches a new control event.
   *
   * @param  {goog.events.Event} ev The ACTION event from one of the button.
   * @protected
   */
  proto.handleUserAction = function(ev) {
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
  proto.enterEditMode_ = function() {
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
  proto.exitEditMode_ = function() {
    this.getHandler().listen(this.getElement(), goog.events.EventType.CLICK,
      this.enterEditMode_);
    this.editMode_ = false;
    goog.dom.classes.remove(this.getElement(), goog.getCssName('active'));
  };

  /** @inheritDoc */
  proto.disposeInternal = function() {
    this.clearError_delay_.stop();
    goog.dispose(this.clearError_delay_);
    delete this.clearError_delay_;
    goog.base(this, 'disposeInternal');
    delete this.errorContainer_;
    delete this.editMode_;
    delete this.control_;
  };

  /**
   * Utility method that returns the values of the inputs as literal object.
   *
   * @return {Object} The records structured as literal.
   */
  proto.getValues = function() {
    var res = {};
    res['name'] = this.name_.getValue();
    if (!this.control_) {
      res['role'] = this.role_.getValue();
      res['function'] = this.func_.getValue();
    }
    var newmail = this.mail_.getValue();
    var current_mail = this.getModel().getProp(this.control_ ?
      spo.ds.ControlUser.Property.EMAIL : spo.ds.User.Property.EMAIL);


    if (current_mail != goog.string.trim(newmail)) {
      res['email'] = newmail;
    }
    return res;
  };
});







