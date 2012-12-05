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
goog.require('goog.async.Delay');
goog.require('spo.ui.MeetingForm');

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
  this.processTemplate_bound_ = goog.bind(this.processTemplate, this);
  this.showError_delayed_ = new goog.async.Delay(this.showError, 2000, this);
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
      this.bindMenu();
    }
  }
  else this.container_.style.display = 'none';
};
/**
 * The web form if any.
 * @type {goog.ui.Component}
 * @protected
 */
spo.control.Composer.prototype.webFormView;

/**
 * Loads the composer with the optional data.
 * @param  {{Array.<string>}=} to The list of recipients.
 * @param  {string=} from  Optionally who the message is from.
 * @param  {string=} body Optional body for the messages.
 * @param  {string=} web_form Optional web form to load, used for creating events.
 * @param {*=} web_form_config Optional configuration for the form - this is the date.
 */
spo.control.Composer.prototype.loadData = function(to, from, body, web_form, web_form_config) {
  goog.dispose(this.webFormView);
  this.view_.formContainer.innerHTML = '';
  this.view_.setFields(to, from);
  this.field_.setHtml(undefined, (goog.isString(body)) ? body : '');
  if (goog.isDefAndNotNull(web_form)) {
    if (goog.isNumber(web_form)) {
      if (web_form == 1) {
        this.webFormView = new spo.ui.MeetingForm((goog.isDef(web_form_config)) ? +(web_form_config) : undefined);
        console.log(this.view_.formContainer);
        this.webFormView.render(this.view_.formContainer);
      }
    }
  }
};
/**
 * Binds the template menu.
 */
spo.control.Composer.prototype.bindMenu = function() {
  this.getHandler().listen(this.view_, spo.control.EventType.CONTROL_ACTION,
      this.handleTemplateSelection);
};

/**
 * Processes a template loading response
 * @param {*} resp The response package.
 * @protected
 */
spo.control.Composer.prototype.processTemplate = function(resp) {
  if (resp['status'] != 'ok') {
    this.showError('Problem loading template: ' + resp['error']);
    return;
  }
  //this.loadData( with all the shit );
};

/**
 * Displays an error related to the composer.
 * @param {string} err The error HTML.
 * @protected
 */
spo.control.Composer.prototype.showError = function(err) {
  if (!goog.isString(err)) {
    this.view_.errorToolbar.style.display = 'none';
    return;
  }
  this.view_.errorToolbar.innerHTML = err;
  this.view_.errorToolbar.style.display = '';
  if (this.showError_delayed_.isActive()) {
    this.showError_delayed_.stop();
  }
  this.showError_delayed_.start();
};

/**
 * Handles the ACTION event from the view - template selection.
 * @param {spo.control.Event} ev The CONTROL_ACTION event
 * @protected
 */
spo.control.Composer.prototype.handleTemplateSelection = function(ev) {
  ev.stopPropagation();
  console.log('1');
  if (ev.getAction() == spo.control.Action.SELECT) {
    var templateName = ev.target.getSelectedTemplateName();
    if (templateName == 'draft') {
      // TODO: make the requests when it is ready.
      this.showError('not implemented');
//      spo.ds.Resource.getInstance().get({
//        'url': '/message/draft/get'
//      }, this.processTemplate_bound_);
    } else {
      if (goog.isDefAndNotNull(goog.global['TEMPLATES'][templateName])) {
        var template = goog.global['TEMPLATES'][templateName];
        this.loadData(template['to'], template['from'], template['body'], template['web_form'],
            template['web_form_config']);
      } else {
        this.showError('not implemented yet');
      }
    }
  }
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
  (new goog.ui.editor.ToolbarController(this.field_, toolbarControl));
  // Make the write field at least 300 pixels tall, otherwise it looks funny.
  original.style.minHeight = '300px';
  this.field_.makeEditable();
};
