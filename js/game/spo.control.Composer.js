goog.provide('spo.control.Composer');

goog.require('spo.control.Base');
goog.require('goog.editor.SeamlessField');
goog.require('goog.editor.Command');
goog.require('goog.editor.plugins.BasicTextFormatter');
goog.require('goog.editor.plugins.EnterHandler');
goog.require('goog.editor.plugins.HeaderFormatter');
goog.require('goog.editor.plugins.LinkBubble');
goog.require('goog.editor.plugins.LinkDialogPlugin');
goog.require('goog.editor.plugins.ListTabHandler');
goog.require('goog.editor.plugins.LoremIpsum');
goog.require('goog.editor.plugins.SpacesTabHandler');
goog.require('goog.ui.editor.DefaultToolbar');
goog.require('goog.ui.editor.ToolbarController');
goog.require('spo.ui.Composer');
goog.require('goog.ui.ac');
goog.require('spo.ds.mail');
goog.require('goog.dom');

/**
 * @constructor
 * @extends {spo.control.Base}
 * @param {!Element} container The container to use to render.
 */
spo.control.Composer = function(container) {
  // render everything in mail editor container.
  goog.base(this, container);
  /** @type {!boolean} */
  this.isCreated = false;
  this.view_ = new spo.ui.Composer();
  this.view_.render(this.container_);
};
goog.inherits(spo.control.Composer, spo.control.Base);

/**
 * Sets the availability of the composer control. Simply hide it from the user when not needed.
 * @param {!boolean} enable True if the composer should be visible for the user. False to hide it.
 */
spo.control.Composer.prototype.setEnable = function(enable) {

  if (enable) {
    this.container_.style.display = 'block';
    if (!this.isCreated) {
      this.createEditor();
      this.createAutoComplete();
    }
  }
  else this.container_.style.display = 'none';
};

/**
 * Loads the composer with the optional data.
 * @param  {{Array.<string>}=} to The list of recipients.
 * @param  {string=} from  Optionally who the msg is from.
 * @param  {string=} body Optional body for the messages.
 * @param  {web_form} web_form Optional web form to load, used for creating events.
 */
spo.control.Composer.prototype.loadData = function(to, from, body, web_form) {
  this.view_.setFields(to, from);
  this.field_.setHtml(undefined, (goog.isString(body)) ? body : '');
};

spo.control.Composer.prototype.createAutoComplete = function() {
  this.ac = goog.ui.ac.createSimpleAutoComplete(spo.ds.mail.getNames(), this.view_.toField, true);
};

/**
 * Creates the actual editor.
 */
spo.control.Composer.prototype.createEditor = function() {
  if (this.isCreated) return;
  var original = goog.dom.getElement('mail-composer-text-field');
  this.isCreated = true;
  this.field_ = new goog.editor.SeamlessField('mail-composer-text-field');
  this.field_.setMinHeight(400);
  this.field_.registerPlugin(new goog.editor.plugins.BasicTextFormatter());
  this.field_.registerPlugin(new goog.editor.plugins.EnterHandler());

  this.buttons_ = [
    goog.editor.Command.BOLD,
    goog.editor.Command.ITALIC,
    goog.editor.Command.UNDERLINE,
    goog.editor.Command.INDENT,
    goog.editor.Command.OUTDENT,
    goog.editor.Command.JUSTIFY_LEFT,
    goog.editor.Command.JUSTIFY_CENTER,
    goog.editor.Command.JUSTIFY_RIGHT
  ];
  var toolbarControl = goog.ui.editor.DefaultToolbar.makeToolbar(this.buttons_, this.view_.googToolbar);
  var tc = new goog.ui.editor.ToolbarController(this.field_, toolbarControl );
  // Make the write field at least 300 px tall, otherwise it looks funny.
  original.style.minHeight = '300px';

  this.field_.makeEditable();
};
