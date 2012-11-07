/**
 * @fileoverview Provides the login screen logic enclosed as an
 * instantiable component.
 */

goog.provide('spo.screen.Login');

goog.require('goog.Uri.QueryData');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classes');
goog.require('goog.dom.forms');
goog.require('goog.events.EventType');
goog.require('goog.format.EmailAddress');
goog.require('goog.net.XhrIo');
goog.require('goog.net.IframeIo');
goog.require('goog.ui.Component');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.CustomButton');
goog.require('goog.ui.Dialog');
goog.require('goog.ui.Dialog.ButtonSet');
goog.require('goog.ui.LabelInput');
goog.require('spo.ui.ButtonRenderer');
goog.require('spo.widget.SystemClock');

/**
 * Provides the login screen as a widget, because it is simple enough
 * to organize as such and render it inside a container.
 *
 * @constructor
 * @extends {goog.ui.Component}
 */
spo.screen.Login = function() {
  goog.base(this);
  if (goog.global['SHOULD_CHECK_EMAIL_VALIDITY'] == true) {
    this.shouldCheckEMailValidity_ = true;
  }
  // Setup elements of the form
  this.emailElement_ = new goog.ui.LabelInput();
  this.passwordElement_ = new goog.ui.LabelInput();
  this.submitButton_ = new goog.ui.CustomButton('',
    spo.ui.ButtonRenderer.getInstance());

  //Setup the system clock
  this.clock_ = new spo.widget.SystemClock();

  //Setup the form to confirm that the reset link was sent to email
  //This should probably be moved away from here.
  this.dialog_ = new goog.ui.Dialog(undefined, true);
  this.dialog_.setTitle('');
  this.dialog_.setContent(this.configmrationString_);
  this.dialog_.setButtonSet(goog.ui.Dialog.ButtonSet.createOk());

  this.addChild(this.emailElement_);
  this.addChild(this.passwordElement_);
  this.addChild(this.submitButton_);
  this.addChild(this.clock_);
  if (goog.global['LOGIN_URL'] && goog.global['LOST_PASSWORD_URL']) {
    this.loginUrl_ = goog.global['LOGIN_URL'];
    this.lostPasswordUrl_ = goog.global['LOST_PASSWORD_URL'];
  } else {
    throw Error('No URLs provided for the login system');
  }

  this.io_ = new goog.net.IframeIo();
  this.getHandler().listen(this.io_, goog.net.EventType.COMPLETE,
    this.onIOComplete_);
};
goog.inherits(spo.screen.Login, goog.ui.Component);

/**
 * The invalid indication css class to set to the inputs
 * @type {string}
 * @private
 */
spo.screen.Login.prototype.cssClassInvalid_ = goog.getCssName('invalid-value');

/**
 * The text of the dialog when a confirmation has been sent to the email.
 * @type {string}
 * @private
 */
spo.screen.Login.prototype.configmrationString_ = 'You have requested ' +
  'password reset. Please check your email';

/**
 * Flag that is raied is the login panel is in recover password mode.
 * @type {boolean}
 * @private
 */
spo.screen.Login.prototype.lostPasswordMode_ = false;

/**
 * Flag that is raised if the client specified that the email validity
 * should be checked on the server. A global definition is looked up
 * for this flag.
 * @type {boolean}
 * @private
 */
spo.screen.Login.prototype.shouldCheckEMailValidity_ = false;

/**
 * The email component.
 * @type {goog.ui.LabelInput}
 * @private
 */
spo.screen.Login.prototype.emailElement_;

/**
 * The password component.
 * @type {goog.ui.LabelInput}
 * @private
 */
spo.screen.Login.prototype.passwordElement_;

/**
 * The submit button component. Custom button.
 * @type {goog.ui.CustomButton}
 * @private
 */
spo.screen.Login.prototype.submitButton_;

/**
 * The login div. The form is separated in divs that represen the two
 * forms : login mode and password recovery mode. This div should be
 * viaible/used when the form is in login mode.
 * @type {Element}
 * @private
 */
spo.screen.Login.prototype.loginDiv_;

/**
 * The recovery mode div. See Login#loginDiv_
 * @type {Element}
 * @private
 */
spo.screen.Login.prototype.forgotpassDiv_;

/**
 * The global clock instance.
 * @type {spo.widget.SystemClock}
 * @private
 */
spo.screen.Login.prototype.clock_;

/**
 * The header/greeting div element. Changed when the form mode is changed.
 * @type {Element}
 * @private
 */
spo.screen.Login.prototype.greetingElement_;

/**
 * The labels to use for the email component depending on the form state.
 * @type {string}
 * @private
 */
spo.screen.Login.prototype.loginLabel_ = 'name';

/**
 * see Login#loginLabel_
 * @type {string}
 * @private
 */
spo.screen.Login.prototype.recoverLabel_ = 'email to send reset link to';

/**
 * Greeting/header to use when in login mode of the form.
 * @type {string}
 * @private
 */
spo.screen.Login.prototype.loginGreeting_ = 'LOGIN';

/**
 * See Login#loginGreeting_
 * @type {string}
 * @private
 */
spo.screen.Login.prototype.recoverGreeting_ = 'REQUEST PASSWORD RESET';

/**
 * Basically it creates the dom fomr a template. This is a pattern used
 * thruout in this project.
 * @inheritDoc
 */
spo.screen.Login.prototype.createDom = function() {
  var html = spo.template.login({
    loginurl: this.loginUrl_
  });
  this.decorateInternal(
    /** @type {Element} */ (goog.dom.htmlToDocumentFragment(html)));
};


spo.screen.Login.prototype.onIOComplete_ = function(ev) {

  // FIXME: This should not be here for client!
  if (~this.io_.getResponseText().indexOf('ok')) {
    window.location.href = "http://localhost:3000/closure/apps/158/admin.html"
  }
};

/**
 * @inheritDoc
 */
spo.screen.Login.prototype.decorateInternal = function(element) {
  goog.base(this, 'decorateInternal', element);
  var inputs = goog.dom.getElementsByTagNameAndClass('input', undefined,
    this.getElement());
  var i_mail = inputs[0];
  this.emailElement_.decorate(inputs[0]);
  this.passwordElement_.decorate(inputs[1]);
  this.submitButton_.decorate(goog.dom.getElementByClass(
    goog.getCssName('form-button'), this.getElement()));
  this.clock_.decorate(goog.dom.getElementByClass(
    goog.getCssName('date-time'), this.getElement()));

  // Setup divs/routes
  this.loginDiv_ = goog.dom.getElementByClass(goog.getCssName('login-mode'),
    this.getElement());
  this.forgotpassDiv_ = goog.dom.getElementByClass(
    goog.getCssName('forgotpass-mode'), this.getElement());
  this.greetingElement_ = goog.dom.getElementByClass(
    goog.getCssName('greeting'), this.getElement());

};

/**
 * @inheritDoc
 */
spo.screen.Login.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().listen(this.submitButton_,
    goog.ui.Component.EventType.ACTION, this.handleSubmit_);
  this.getHandler().listen(this.emailElement_.getElement(),
    goog.events.EventType.BLUR,
    this.checkMailValidity_);

  this.onModeChange_();
  goog.dom.forms.focusAndSelect(this.emailElement_.getElement());
};

/**
 * Checks the validity of the email value. This is always called, but acts
 * only if the check is enabled by the server.
 * @private
 */
spo.screen.Login.prototype.checkMailValidity_ = function() {
  if (this.shouldCheckEMailValidity_ && this.emailElement_.hasChanged()) {
    var value = goog.dom.forms.getValue(this.emailElement_.getElement());
    if (goog.isString(value) &&
      goog.format.EmailAddress.isValidAddrSpec(value)) {
      goog.dom.classes.remove(this.emailElement_.getElement(),
        this.cssClassInvalid_);
    } else {
      goog.dom.classes.add(this.emailElement_.getElement(),
        this.cssClassInvalid_);
    }
  }
};

/**
 * Handles the button presses for the form. Two actions are known, login
 * and password recovery mode.
 * @param  {goog.events.Event} ev The ui ACTION event. We just stop it anyway.
 * @private
 */
spo.screen.Login.prototype.handleSubmit_ = function(ev) {
  ev.stopPropagation();
  ev.preventDefault();

  var form = goog.dom.getElementsByTagNameAndClass(
    goog.dom.TagName.FORM, undefined, this.getElement())[0];

  if (this.lostPasswordMode_) {
    var value = goog.dom.forms.getValue(this.emailElement_.getElement());
    var query = goog.Uri.QueryData.createFromMap({
      'loginemail': value
    });
    console.log(query.toString());
    // TODO: Make a real request where the data is correctly formatted
    goog.net.XhrIo.send(this.lostPasswordUrl_, undefined, 'POST',
      query.toString());
    this.dialog_.setVisible(true);
  } else {
    if (form) this.io_.sendFromForm(form);
  }
};

/**
 * Method to handle mode changes of the form. It basically takes the actions
 * needed when switching between the two modes.
 * @private
 */
spo.screen.Login.prototype.onModeChange_ = function() {
  if (!this.getElement()) return;
  if (this.dialog_.isVisible()) {
    this.dialog_.setVisible(false);
  }
  if (this.lostPasswordMode_) {
    this.loginDiv_.style.display = 'none';
    this.forgotpassDiv_.style.display = 'block';
    this.greetingElement_.innerHTML = this.recoverGreeting_;
    this.emailElement_.setLabel(this.recoverLabel_);
  } else {
    this.forgotpassDiv_.style.display = 'none';
    this.loginDiv_.style.display = 'block';
    this.greetingElement_.innerHTML = this.loginGreeting_;
    this.emailElement_.setLabel(this.loginLabel_);
  }
  this.emailElement_.getElement().focus();
};

/**
 * Public method to allow setting the mode from external code if needed.
 * @param {boolean} enable If true the recovery mode will be enabled in the
 * form, otherwise the login mode will be set. If the mode does not change
 * nothing will be triggered.
 */
spo.screen.Login.prototype.setLostPassMode = function(enable) {
  if (this.lostPasswordMode_ != enable) {
    this.lostPasswordMode_ = enable;
    this.onModeChange_();
  }
};
