goog.provide('spo.control.Composer');

goog.require('goog.async.Delay');
goog.require('goog.dom');
goog.require('goog.editor.Command');
goog.require('goog.editor.SeamlessField');
goog.require('goog.editor.plugins.BasicTextFormatter');
goog.require('goog.editor.plugins.EnterHandler');
goog.require('goog.editor.plugins.HeaderFormatter');
goog.require('goog.editor.plugins.LinkBubble');
goog.require('goog.editor.plugins.LinkDialogPlugin');
goog.require('goog.editor.plugins.ListTabHandler');
goog.require('goog.editor.plugins.LoremIpsum');
goog.require('goog.editor.plugins.SpacesTabHandler');
goog.require('goog.object');
goog.require('goog.ui.ac');
goog.require('goog.ui.editor.DefaultToolbar');
goog.require('goog.ui.editor.ToolbarController');
goog.require('pstj.ui.Upload.Event');
goog.require('spo.control.Attachments');
goog.require('spo.control.Base');
goog.require('spo.ds.mail');
goog.require('spo.ui.Attachment');
goog.require('spo.ui.Composer');
goog.require('spo.ui.MeetingForm');


/**
 * @constructor
 * @extends {spo.control.Base}
 * @param {!Element} container The container to use to render.
 */
spo.control.Composer = function(container) {
  // render everything in mail editor container.
  goog.base(this, container);
  this.gamerecord_ = null;
  /** @type {!boolean} */
  this.isCreated = false;
  this.view_ = new spo.ui.Composer();
  this.view_.render(this.container_);
  this.form = new spo.ui.Attachment();
  this.form.render(this.container_);
  this.getHandler().listen(this.form, [pstj.ui.Upload.EventType.SUCCESS,
    pstj.ui.Upload.EventType.FAIL], this.handleAttachmentUpload);
  this.processTemplate_bound_ = goog.bind(this.processTemplate, this);
  this.showError_delayed_ = new goog.async.Delay(this.showError, 8000, this);
  this.attachmentsControl = new spo.control.Attachments();
  this.attachmentsControl.render(this.view_.getEls(goog.getCssName(
    'attachments')));
};
goog.inherits(spo.control.Composer, spo.control.Base);



/**
 * Sets the availability of the composer control. Simply hide it from the user
 *  when not needed.
 * @param {!boolean} enable True if the composer should be visible for the
 *  user. False to hide it.
 */
spo.control.Composer.prototype.setEnable = function(enable) {

  if (enable) {
    this.container_.style.display = 'block';
    if (!this.isCreated) {
      this.createEditor();
      this.createAutoComplete();
      this.attachEvents();
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
 * Reference to a mail model/record to use
 * @type {*}
 * @private
 */
spo.control.Composer.prototype.mailRecordModel_;

/**
 * Handles the form event for upload.
 * @param  {pstj.ui.Upload.Event} ev The upload event.
 * @protected
 */
spo.control.Composer.prototype.handleAttachmentUpload = function(ev) {
  if (ev.type = pstj.ui.Upload.EventType.SUCCESS) {
    // potencially missing in IE9...
    if (ev.formResponse['status'] == 'ok') {
      if (!goog.isArray(this.mailRecordModel_['message_attachments'])) {
        this.mailRecordModel_['message_attachments'] = [];
      }
      this.mailRecordModel_['message_attachments'].push(ev.formResponse['content']['message_attachments'][0])
      this.saveDraft(goog.bind(this.setAttachments, this));
    }
  }
};

/**
 * Method to load data from a mail record directly instead of parts.
 * @param {*} model The mail model to use.
 */
spo.control.Composer.prototype.loadModel = function(model) {
  this.mailRecordModel_ = model;
  if (goog.isDef(this.mailRecordModel_['id'])) {
    this.setReplyId(model['id']);
  }
  this.loadData(model['to'], model['from'], model['subject'], model['body'], model['web_form'], model['web_form_config']);
};

/**
 * The msg ID that the composed message should be a reply of.
 * @type {?string}
 * @protected
 */
spo.control.Composer.prototype.inReplyOf = null;
/**
 * Sets the ID of the reply to field. Note that it must be set manually each
 * time a data is loaded in the composer as it will be overriden on each load.
 * @param {string} msgid The message id that the compose should be reply of.
 */
spo.control.Composer.prototype.setReplyId = function(msgid) {
  this.inReplyOf = msgid;
};
/**
 * Flag that tells us if the composing involves a form for meeting.
 * @type {!boolean}
 */
spo.control.Composer.prototype.isComposingMeeting = false;

spo.control.Composer.prototype.handleDissalowedDate = function() {
  this.showError('Selected date is in the past!');
};
/**
 * Loads the composer with the optional data.
 * @param  {Array.<string>=} to The list of recipients.
 * @param  {string=} from  Optionally who the message is from.
 * @param {string=} subject Optional subject to use.
 * @param  {string=} body Optional body for the messages.
 * @param  {string=} web_form Optional web form to load, used for creating events.
 * @param {*=} web_form_config Optional configuration for the form - this is the date.
 */
spo.control.Composer.prototype.loadData = function(to, from, subject, body, web_form, web_form_config) {
  if (this.webFormView) {
    this.getHandler().unlisten(this.webFormView, spo.ui.MeetingForm.EventType.DISALLOWED_DATE,
      this.handleDissalowedDate);
    goog.dispose(this.webFormView);
    this.webFormView = null;
  }
  this.isComposingMeeting = false;
  this.inReplyOf = null;
  this.view_.formContainer.innerHTML = '';
  this.view_.setFields(to, from, subject);
  this.field_.setHtml(undefined, (goog.isString(body)) ? body : '');
  if (goog.isNumber(web_form_config)) {
    this.isComposingMeeting = true;
    this.webFormView = new spo.ui.MeetingForm(this.gamerecord_,
      (web_form_config == 0) ? undefined : web_form_config);
    this.getHandler().listen(this.webFormView, spo.ui.MeetingForm.EventType.DISALLOWED_DATE,
      this.handleDissalowedDate);
    this.webFormView.setGameRecord(this.gamerecord_);
    this.webFormView.render(this.view_.formContainer);
  }
  this.setAttachments();
};

/**
 * @type {*} The mail we are working with currently.
 * @private
 */
spo.control.Composer.prototype.model_;
/**
 * Applies a record on the composer, it will override all things done..
 * @param {*} msg_record The message record to apply.
 */
spo.control.Composer.prototype.setRecordModel = function(msg_record) {
  this.model_ = msg_record;
};

spo.control.Composer.prototype.setAttachments = function() {
  //var result = '';
  this.attachmentsControl.setModel(this.mailRecordModel_['message_attachments']);
  // if (goog.isArray(this.mailRecordModel_['message_attachments']) &&
  //     !goog.array.isEmpty(this.mailRecordModel_['message_attachments'])) {
  //   result = 'Attachments: ' +
  //     goog.array.map(this.mailRecordModel_['message_attachments'], function(path) {
  //       return path.replace(/\\/g,'/').replace( /.*\//, '' );
  //     }).join(', ');
  // }
  // this.view_.attachments_.innerHTML = result;
};
/**
 * Binds events from buttons
 * @protected
 */
spo.control.Composer.prototype.attachEvents = function() {
  this.getHandler().listen(this.view_, goog.ui.Component.EventType.ACTION, this.handleActionFromButtons);
  this.getHandler().listen(this.view_, spo.control.EventType.CONTROL_ACTION, this.handleTemplateSelection);
  this.getHandler().listen(this.attachmentsControl, spo.control.EventType.CONTROL_ACTION, function(ev) {
    // Simply save the draft, should be enough.
    this.saveDraft();
  });
};

/**
 * Saves the message as draft on the server.
 * @param  {function(*): void} callback The callback to execute over the result.
 * @protected
 */
spo.control.Composer.prototype.saveDraft = function(callback) {
  this.mailRecordModel_['to'] = spo.ds.mail.parseStringToNameList(this.view_.toField.value);
  this.mailRecordModel_['from'] = spo.ds.mail.parseStringToNameList(this.view_.fromField.value);
  this.mailRecordModel_['subject'] = this.view_.subjectField.value;
  this.mailRecordModel_['body'] = this.field_.getCleanContents();
  if (this.webFormView && !this.webFormView.isDisposed()) {
    this.mailRecordModel_['web_form_config'] = this.webFormView.getValue()
  }
  spo.ds.Resource.getInstance().get({
    'url' : '/message/draft/put',
    'data' : {
      'message': this.mailRecordModel_
    }
  }, callback);
};

spo.control.Composer.prototype.sendMessage = function(resp) {

  //console.log('resp', resp)
  if (resp['status'] == 'ok') {
    if (goog.string.trim(this.mailRecordModel_['to']) == '') {
      this.showError('Please fill in an email address.');
      return;
    }
    if (goog.string.trim(this.mailRecordModel_['subject']) == '') {
      this.showError('Please fill in a subject.');
      return;
    }
    spo.ds.Resource.getInstance().get({
      'url' : '/message/draft/send',
      'data': {
        'is_team_sent': 0
      }
    }, goog.bind(function(resp) {
      if (resp['status'] != 'ok') {
        this.showError('Error sending message: ' + resp['error']);
      } else {
        this.setEnable(false);
      }
    }, this));
  }
};

spo.control.Composer.prototype.updateDraft = function(resp) {
  if (resp['status'] == 'ok') {
    var hash = resp['content']['message']['hash'];
    if (goog.isString(hash))
      this.mailRecordModel_['hash'] = hash;
  }
}

/**
 * @param  {goog.events.Event} ev The ACTION event from a child
 * @protected
 */
spo.control.Composer.prototype.handleActionFromButtons = function(ev) {
  var target = ev.target;
  switch (target) {
    case this.view_.closeButton_:
      this.setEnable(false);
      break;
    case this.view_.saveButton_:
      // compose message from the values.
      // both regular messages and meeting requests are saved as regular messages
      // the diferentiation is made on send.
      this.saveDraft(goog.bind(this.updateDraft, this));
      break;
    case this.view_.sendButton_:
      this.saveDraft(goog.bind(this.sendMessage, this));
      break;
    case this.view_.attachButton_:
      if (goog.isString(this.mailRecordModel_['hash'])) {
        this.openFileSelector();
      } else {
        this.showError('Please save the draft first (save button).')
      }
  }
};

/**
 * Opens up the file selection.
 */
spo.control.Composer.prototype.openFileSelector = function() {
  if (goog.isString(this.mailRecordModel_['hash'])) {
    this.form.setHash(this.mailRecordModel_['hash']);
  } else {
    return;
  }
  this.form.trigger();
};

/**
 * Processes a template loading response.
 * This will not be used as we will inline the templates.
 * @deprecated
 * @param {*} resp The response package.
 * @protected
 */
spo.control.Composer.prototype.processTemplate = function(resp) {
  if (resp['status'] != 'ok') {
    this.showError('Problem loading template: ' + resp['error']);
    return;
  }
  //console.log('received draft template', resp);
  var message = resp['content']['message'];
  message['from'] = [goog.global['PLAYER_NAME']];
  this.loadModel(message);
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
  if (ev.getAction() == spo.control.Action.SELECT) {
    var templateName = ev.target.getSelectedTemplateName();
    if (templateName == 'draft') {
      // TODO: make the requests when it is ready.
      //this.showError('not implemented');
     spo.ds.Resource.getInstance().get({
       'url': '/message/draft/get',
       'data': {
          'is_team_sent': 0
       }
     }, this.processTemplate_bound_);
    } else {
      if (goog.isDefAndNotNull(goog.global['TEMPLATES'][templateName])) {
        var template = goog.global['TEMPLATES'][templateName];
        var model = goog.object.unsafeClone(template);
        if (!model['from']) model['from'] = [goog.global['PLAYER_NAME']];
        this.loadModel(model);
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
 * Sets the game record once it is availbale, passed down from the main control.
 * @param {Object} gr The game record proeprties.
 */
spo.control.Composer.prototype.setGameRecord = function(gr) {
  this.gamerecord_ = gr;
};

/**
 * Creates the actual editor.
 */
spo.control.Composer.prototype.createEditor = function() {
  if (this.isCreated) return;
  var original = goog.dom.getElement('mail-composer-text-field');
  this.isCreated = true;
  this.field_ = new goog.editor.SeamlessField('mail-composer-text-field');
  this.field_.setMinHeight(100);
  this.field_.registerPlugin(new goog.editor.plugins.BasicTextFormatter());
  this.field_.registerPlugin(new goog.editor.plugins.EnterHandler());
  var linkplugin = new goog.editor.plugins.LinkDialogPlugin();
  linkplugin.showOpenLinkInNewWindow(true);
  this.field_.registerPlugin(linkplugin);
  this.field_.registerPlugin(new goog.editor.plugins.LinkBubble());

  this.buttons_ = [
    goog.editor.Command.BOLD,
    goog.editor.Command.ITALIC,
    goog.editor.Command.UNDERLINE,
    goog.editor.Command.LINK,
    goog.editor.Command.INDENT,
    goog.editor.Command.OUTDENT,
    goog.editor.Command.JUSTIFY_LEFT,
    goog.editor.Command.JUSTIFY_CENTER,
    goog.editor.Command.JUSTIFY_RIGHT,
    goog.editor.Command.UPDATE_LINK_BUBBLE
  ];
  var toolbarControl = goog.ui.editor.DefaultToolbar.makeToolbar(this.buttons_, this.view_.googToolbar);
  (new goog.ui.editor.ToolbarController(this.field_, toolbarControl));
  // Make the write field at least 300 pixels tall, otherwise it looks funny.
  original.style.minHeight = '100px';
  this.field_.makeEditable();
};
