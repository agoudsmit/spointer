goog.provide('spo.ui.Composer');

goog.require('pstj.ui.Templated');
goog.require('spo.gametemplate');
goog.require('goog.ui.CustomButton');
goog.require('spo.ui.ButtonRenderer');

/**
 * @constructor
 * @extends {pstj.ui.Templated}
 */
spo.ui.Composer = function() {
  goog.base(this);
  this.sendButton_ = new goog.ui.CustomButton('', spo.ui.ButtonRenderer.getInstance());
};
goog.inherits(spo.ui.Composer, pstj.ui.Templated);

/** @inheritDoc */
spo.ui.Composer.prototype.getTemplate = function() {
  return spo.gametemplate.Composer({});
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
 * sets the fields in the composer to match a state.
 * @param {Array.<string>=} to_list Optional list of recipients.
 * @param {string=} from Optinal alias to use as 'from'
 */
spo.ui.Composer.prototype.setFields = function(to_list, from, subject) {
  if (goog.isDefAndNotNull(to_list)) {
    this.toField.value = to_list.join(' ,');
  } else this.toField.value = '';
  if (goog.isDefAndNotNull(from)) {
    this.fromField.value = from;
  } else this.fromField.value = '';
  if (goog.isString(subject)) this.subjectField.value = subject;
  else this.subjectField.value = '';
};

/** @inheritDoc */
spo.ui.Composer.prototype.decorateInternal = function(el) {
  goog.base(this, 'decorateInternal', el);
  this.googToolbar = /** @type {!Element} */ (goog.dom.getElementByClass(goog.getCssName('editor-toolbar'), this.getElement()));
  this.sendButton_.decorate(goog.dom.getElementByClass(goog.getCssName('send-button'), this.getElement()));
  this.filedElement = /** @type {!Element} */(goog.dom.getElementByClass(goog.getCssName('editor-field'), this.getElement()));
  this.toField = /** @type {!Element} */(goog.dom.getElementByClass(goog.getCssName('field-to'), this.getElement()));
  this.fromField = /** @type {!Element} */(goog.dom.getElementByClass(goog.getCssName('field-from'), this.getElement()));
  this.subjectField = /** @type {!Element} */(goog.dom.getElementByClass(goog.getCssName('field-subject'), this.getElement()));
};

