goog.provide('spo.ui.Composer');

goog.require('pstj.ui.Templated');
goog.require('spo.gametemplate');
goog.require('goog.ui.CustomButton');
goog.require('spo.ui.ButtonRenderer');
goog.require('goog.ui.PopupMenu');
goog.require('goog.positioning.Corner');
goog.require('goog.ui.Component.EventType');
goog.require('goog.dom.dataset');
goog.require('spo.control.Action');
goog.require('spo.control.Event');

/**
 * The composer view implementation. This view should be reused for all composing in the session.
 * It also exports all the fields as properties.
 *
 * @constructor
 * @extends {pstj.ui.Templated}
 */
spo.ui.Composer = function() {
  goog.base(this);
  this.sendButton_ = new goog.ui.CustomButton('', spo.ui.ButtonRenderer.getInstance());
  this.saveButton_ = new goog.ui.CustomButton('', spo.ui.ButtonRenderer.getInstance());
  this.attachButton_ = new goog.ui.CustomButton('', spo.ui.ButtonRenderer.getInstance());
  this.addChild(this.sendButton_);
  this.addChild(this.saveButton_);
  this.addChild(this.attachButton_);
  this.templateButton_ = new goog.ui.CustomButton('', spo.ui.ButtonRenderer.getInstance());
  this.templateMenu_ = new goog.ui.PopupMenu();
  this.templateMenu_.setToggleMode(true);
};
goog.inherits(spo.ui.Composer, pstj.ui.Templated);

/** @inheritDoc */
spo.ui.Composer.prototype.getTemplate = function() {
  return spo.gametemplate.Composer({
    shouldSeeTeam: goog.global['SETUP']['is_control_user']
  });
};

/**
 * Reference to the tool bar for the editor
 * @type {!Element}
 */
spo.ui.Composer.prototype.googToolbar;

/**
 * Reference to the editor field.
 * @type {!Element}
 */
spo.ui.Composer.prototype.fieldElement;
/**
 * Reference to the To field.
 * @type {!Element}
 */
spo.ui.Composer.prototype.toField;
/**
 * Reference to the From field.
 * @type {!Element}
 */
spo.ui.Composer.prototype.fromField;
/**
 * Reference to the Subject field.
 * @type {!Element}
 */
spo.ui.Composer.prototype.subjectField;
/**
 * Reference to the error tool bar.
 * @type {!Element}
 */
spo.ui.Composer.prototype.errorToolbar;
/**
 * Reference to the Web form container.
 * @type {!Element}
 */
spo.ui.Composer.prototype.formContainer;
/**
 * sets the fields in the composer to match a state.
 * @param {Array.<string>=} to_list Optional list of recipients.
 * @param {string=} from Optional alias to use as 'from'.
 * @param {string=} subject Optional subject string.
 */
spo.ui.Composer.prototype.setFields = function(to_list, from, subject) {
  if (goog.isDefAndNotNull(to_list)) {
    this.toField.value = to_list.join(' ,');
  } else this.toField.value = '';
  if (goog.isDefAndNotNull(from)) {
    this.fromField.value = from;
  } else this.fromField.value = goog.global['PLAYER_NAME'];
  if (goog.isString(subject)) this.subjectField.value = subject;
  else this.subjectField.value = '';
};

/**
 * Reference to the selected template if any.
 * @type {string}
 * @private
 */
spo.ui.Composer.prototype.selectedTemplateName_ = '';

/**
 * Handles the menu selection for templates.
 * @param {goog.events.Event} ev The ACTION event.
 * @protected
 */
spo.ui.Composer.prototype.handleMenuAction = function(ev) {
  var target = /** @type {!goog.ui.Component} */ ev.target;
  var el = target.getElement();
  if (goog.dom.dataset.has(el, 'template')) {
    this.selectedTemplateName_ = /** @type {!string} */ (goog.dom.dataset.get(el, 'template'));
    this.dispatchEvent(new spo.control.Event(this, spo.control.Action.SELECT));
  }
};

/**
 * Getter for the selected template name.
 * @return {string} The template name;
 */
spo.ui.Composer.prototype.getSelectedTemplateName = function() {
  return this.selectedTemplateName_;
};

/** @inheritDoc */
spo.ui.Composer.prototype.decorateInternal = function(el) {
  goog.base(this, 'decorateInternal', el);
  this.googToolbar = /** @type {!Element} */ (goog.dom.getElementByClass(goog.getCssName('editor-toolbar'), this.getElement()));
  this.sendButton_.decorate(goog.dom.getElementByClass(goog.getCssName('send-button'), this.getElement()));
  this.saveButton_.decorate(goog.dom.getElementByClass(goog.getCssName('save-button'), this.getElement()));
  this.attachButton_.decorate(this.getEls(goog.getCssName('attachment-button')));
  this.templateButton_.decorate(goog.dom.getElementByClass(goog.getCssName('template-button'), el));
  this.templateMenu_.decorate(goog.dom.getElementByClass(goog.getCssName('goog-menu'), el));
  this.templateMenu_.attach(this.templateButton_.getElement(),
      goog.positioning.Corner.TOP_LEFT,
      goog.positioning.Corner.BOTTOM_LEFT);
  this.getHandler().listen(this.templateMenu_, goog.ui.Component.EventType.ACTION, this.handleMenuAction);
  this.filedElement = /** @type {!Element} */(goog.dom.getElementByClass(goog.getCssName('editor-field'), this.getElement()));
  this.toField = /** @type {!Element} */(goog.dom.getElementByClass(goog.getCssName('field-to'), this.getElement()));
  this.fromField = /** @type {!Element} */(goog.dom.getElementByClass(goog.getCssName('field-from'), this.getElement()));
  this.subjectField = /** @type {!Element} */(goog.dom.getElementByClass(goog.getCssName('field-subject'), this.getElement()));
  this.errorToolbar = /** @type {!Element} */(goog.dom.getElementByClass(goog.getCssName('error-toolbar'), this.getElement()));
  this.formContainer = /** @type {!Element} */(goog.dom.getElementByClass(goog.getCssName('web-form-container'), this.getElement()));
  this.attachments_ = this.getEls(goog.getCssName('attachments'));
  if (!goog.global['SETUP']['can_set_from']) {
    this.fromField.parentNode.style.display = 'none';
  }
};
