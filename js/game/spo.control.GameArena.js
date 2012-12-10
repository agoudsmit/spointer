goog.provide('spo.control.GameArena');

goog.require('spo.control.Base');
goog.require('pstj.ui.CustomScrollArea');
goog.require('spo.control.MailBoxList');
goog.require('spo.control.Action');
goog.require('spo.control.Event');
goog.require('spo.control.EventType');
goog.require('spo.ds.mail');
goog.require('spo.ui.MailList');
goog.require('spo.control.MailPreview');
goog.require('spo.control.Composer');
goog.require('spo.ui.GameHeader');
goog.require('goog.object');
goog.require('spo.ui.Calendar');

/**
 * The mail control of the game area.
 *
 * @constructor
 * @extends {spo.control.Base}
 * @param {!Element} container The container to render the views in.
 */
spo.control.GameArena = function(container) {
  goog.base(this, container);
  this.init();
};
goog.inherits(spo.control.GameArena, spo.control.Base);

/**
 * Initialize the controller.
 * @protected
 */
spo.control.GameArena.prototype.init = function() {
  // Create the view
  this.view_ = new pstj.ui.CustomScrollArea();
  this.view_.setScrollInsideTheWidget(false);
  this.view_.render(this.container_);
  this.view_.getContentElement().innerHTML = spo.gametemplate.Widgets({});

  var top_pane = /** @type {!Element} */ (goog.dom.getElementByClass(goog.getCssName(
  'mail-list-placeholder'), this.view_.getContentElement()));

  //Load mailbox list => setup mailbox list
  this.mailbox_ = new spo.control.MailBoxList(top_pane);
  this.mailbox_.setParentControl(this);

  // Load mail listing UI.
  this.maillist_ = new spo.ui.MailList();
  this.getHandler().listen(this.maillist_, spo.control.EventType.CONTROL_ACTION,
    this.handleMailListAction);
  this.maillist_.render(top_pane);


  this.previewControl_ = new spo.control.MailPreview(
    /** @type {!Element} */ (goog.dom.getElementByClass(goog.getCssName(
      'mail-preview-container'), this.view_.getContentElement())));
  this.previewControl_.setParentControl(this);
  this.previewControl_.setScrollElement(
      /** @type {!Element} */ (goog.dom.getElementByClass(goog.getCssName(
    'mail-editor-container'), this.view_.getElement())));
  //this.previewControl_.setScrollElement(this.view_.getContentElement());

  this.composer = new spo.control.Composer(/** @type {!Element} */(goog.dom.getElementByClass(goog.getCssName(
  'mail-editor-container'), this.view_.getContentElement())));
  //this.composer.setEnable(true);

  spo.ui.GameHeader.getInstance().setSearchFiledState('search messages', goog.bind(this.performSearch, this), true);


  // FIXME: this is to test the preview with webforms
  this.previewControl_.loadRecord({
    'id': 1,
    'from': ['Team Blia'],
    'to': ['You', 'And Me'],
    'message_tags': ['tag1', 'tag2'],
    'date': 12398128491,
    'subject': 'Test web forms',
    'body': '<b>Some html <span style="color:yellow;"> here</span>',
    'is_read': 1,
    'web_form': '<div><div style="margin: 10px;">Are you ging to this meeting?</div><span class="clickable" data-resource="/bluibliu" style="padding: 0 10px;"><b>Yes, I am!</b></span><span class="clickable" data-resource="/bluibliu" style="padding: 0 10px;"><b>No, I am not</b></span></div>'
  });

  var events = [
    {date: '2012-12-11'},
    {date: '2012-12-21'}
  ];

  this.callendar_ = new spo.ui.Calendar();
  this.callendar_.setModel(events);
  this.callendar_.render(
    goog.dom.getElementByClass(
      goog.getCssName('meeting-box-placeholder'), this.view_.getContentElement()
    )
  );

};

spo.control.GameArena.prototype.performSearch = function(text) {
  if (this.mailbox_.getActiveResource() != null) {
    this.maillist_.getModel().setFilter(text);
  } else {
     spo.ui.GameHeader.getInstance().setSearchTerm('');
  }
};

spo.control.GameArena.prototype.currentPreviewdMailRecord_ = null;

/**
 * Loads a mail using data from the mail listing.
 */
spo.control.GameArena.prototype.loadMailPreview = function() {
  var record = this.maillist_.getSelectedRecord();
  if (record != null) {
    this.currentPreviewdMailRecord_ = record;
    this.previewControl_.loadRecord(this.currentPreviewdMailRecord_);
  }
};

/**
 * Handles the control actions coming from the mail listing.
 * @param {spo.control.Event} ev The control event.
 * @protected
 */
spo.control.GameArena.prototype.handleMailListAction = function(ev) {
  ev.stopPropagation();
  switch (ev.getAction()) {
  case spo.control.Action.SELECT:
    this.loadMailPreview();
    break;
  case spo.control.Action.UPDATE:
    var record = this.previewControl_.getRecord();
    if (record != null) {
      var index = spo.ds.mail.getIndexOfMessage(this.maillist_.getModel().getList(), record);
      if (index != -1) {
        this.maillist_.setSelectedChild(index);
      }
    }
    // Check if the currently viewed mail is in the list and if yes - highlight it.
    break;
  }
};
/** @inheritDoc */
spo.control.GameArena.prototype.notify = function(child, action) {
  switch (child) {
    case this.mailbox_:
      if (action == spo.control.Action.SELECT) {
        this.maillist_.setModel(spo.ds.mail.getListing(this.mailbox_.getActiveResource()));

      }
      break;
    case this.previewControl_:
      if (action == spo.control.Action.SELECT) {
        var username = this.previewControl_.getSelectedUserName();
        if (username != null) {
          this.composer.setEnable(true);
          // change undefined to the 'my user name value'
          this.composer.loadData([username], undefined, undefined, 'Compose your message here.');
        }
      } else if (action == spo.control.Action.REPLY) {
        this.composer.setEnable(true);
        var model = this.previewControl_.getRecord();
        if (model != null) {
          // Useless piece of crap, even clones the model cannot be reused.
          var clone = goog.object.unsafeClone(model);
          clone['to'] = model['from'];
          clone['from'] = goog.global['PLAYER_NAME'];
          clone['subject'] = 'Re:'+ model['subject'];
          delete clone['web_form'];
          delete clone['web_form_config'];
          delete clone['is_read'];
          this.composer.loadModel(clone);
          this.composer.setReplyId(model['id']);
        }
          // this should actually work with models directly...

      } else if (action == spo.control.Action.FORWARD) {
        this.composer.setEnable(true);
        var model = this.previewControl_.getRecord();
        if (model != null)
          // this should actually work with models directly...
          this.composer.loadData(undefined, undefined, 'Fwd:'+ model['subject'], '<br>-----<br>' + model['body']);
          this.composer.setReplyId(model['id']);
      }
      break;
    default:
       goog.base(this, 'notify', null, action);
       break;
  }
};
