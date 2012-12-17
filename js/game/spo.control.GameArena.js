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
goog.require('spo.control.MeetingList');

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
  this.game_ = null;
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

  this.getHandler().listen(spo.ui.GameHeader.getInstance(), goog.ui.Component.EventType.ACTION,
      this.showEmptyComposer);

  // FIXME: this is to test the preview with webforms
  // this.previewControl_.loadRecord({
  //   'id': 1,
  //   'from': ['Team Blia'],
  //   'to': ['You', 'And Me'],
  //   'message_tags': 'tag1, tag2',
  //   'date': 12398128491,
  //   'subject': 'Test web forms',
  //   'body': '<b>Some html <span style="color:yellow;"> here</span>',
  //   'is_read': 1,
  //   'web_form': '<div><div style="margin: 10px;">Are you ging to this meeting?</div><span class="clickable" data-resource="/bluibliu" style="padding: 0 10px;"><b>Yes, I am!</b></span><span class="clickable" data-resource="/bluibliu" style="padding: 0 10px;"><b>No, I am not</b></span></div>',
  //   'message_attachments': ['/huhutja/babati.txt', '/second/tryal.csv']
  // });

  this.callendar_ = new spo.ui.Calendar();
  this.callendar_.setModel([]);
  this.callendar_.render(
    goog.dom.getElementByClass(
      goog.getCssName('meeting-box-placeholder'), this.view_.getContentElement()
    )
  );

  this.meetinglist_  = new spo.control.MeetingList(goog.dom.getElementByClass(
      goog.getCssName('meeting-box-placeholder'), this.view_.getContentElement()
    ));

  this.meetinglist_.setParentControl(this);
  // var events = {
  //     status: 'ok',
  //     content: {
  //       meetings: [
  //         {"time":1359315923000,"status":"upcoming","msgid":8,"subject":"meeting title"},
  //         {"time":1359318923000,"status":"pending","msgid":32,"subject":"meeting 2"},
  //         {"time":1359319923000,"status":"pending","msgid":22,"subject":"meeting skajskajs"},
  //         {"time":1359315923000,"status":"upcoming","msgid":8,"subject":"meeting title"},
  //         {"time":1359318923000,"status":"pending","msgid":10,"subject":"meeting 2"},
  //         {"time":1359315923000,"status":"upcoming","msgid":8,"subject":"meeting title"},
  //         {"time":1359318923000,"status":"pending","msgid":10,"subject":"meeting 2"},
  //         {"time":1359319923000,"status":"pending","msgid":22,"subject":"meeting skajskajs"},
  //         {"time":1359315923000,"status":"upcoming","msgid":8,"subject":"meeting title"},
  //         {"time":1359318923000,"status":"pending","msgid":10,"subject":"meeting 2"},
  //         {"time":1359319923000,"status":"pending","msgid":22," subject":"meeting skajskajs"}
  //       ]
  //     }
  //   };
  // this.meetinglist_.model_.handleUpdate(events);

  // this.meetinglist_ = new spo.ui.MeetingList();
  // this.meetinglist_.render(goog.dom.getElementByClass(
  //     goog.getCssName('meeting-box-placeholder'), this.view_.getContentElement()
  //   ));

};

spo.control.GameArena.prototype.setGame = function(gamerecord) {
  this.game_ = gamerecord;
  this.updateCalendar();
};

spo.control.GameArena.prototype.updateCalendar = function() {
  this.callendar_.setGame(this.game_);
};

spo.control.GameArena.prototype.showEmptyComposer = function(e) {
  e.stopPropagation();
  this.composer.setEnable(true);
  this.composer.loadModel(this.emptyMessage);
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
/**
 * The empty mesage template.
 * @type {Object}
 * @protected
 */
spo.control.GameArena.prototype.emptyMessage = {
  'id_read': 1,
  'from': [goog.global['PLAYER_NAME']],
  'body': 'Compose your message here',
  'web_form' : null,
  'web_form_config': null
};

/** @inheritDoc */
spo.control.GameArena.prototype.notify = function(child, action) {
  switch (child) {
    case this.meetinglist_:
      console.log('Notify from meeting list')
      if (action == spo.control.Action.UPDATE) {
        this.callendar_.setModel(this.meetinglist_.getList());
      } else if (action == spo.control.Action.SELECT) {
        var id = this.meetinglist_.lastSelectedId;
        spo.ds.Resource.getInstance().get({
          'url': '/message/get/' + id
        }, goog.bind(function(resp) {
          if (resp['status'] != 'ok') {
            // TODO: handle error, should not really happen
            return;
          }
          this.previewControl_.loadRecord(resp['content']['message']);
        }, this));
      }
      break;
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
          var clone = goog.object.clone(spo.control.GameArena.prototype.emptyMessage);
          clone['to'] = [username];
          this.composer.loadModel(clone);
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
          clone['reply_message_id'] = model['id'];
          clone['web_form'] = null;
          clone['web_form_config'] = null;
          clone['body'] = '';
          clone['is_read'] = 1;
          this.composer.loadModel(clone);
        }
          // this should actually work with models directly...

      } else if (action == spo.control.Action.FORWARD) {
        this.composer.setEnable(true);
        var model = this.previewControl_.getRecord();
        if (model != null) {
          var clone = goog.object.unsafeClone(model);
          clone['to'] = [];
          clone['from'] = [goog.global['PLAYER_NAME']];
          clone['id'] = [];
          clone['web_form'] = null;
          clone['web_form_config'] = null;
          clone['reply_message_id'] = null;
          clone['is_read'] = 1;
          clone['subject'] = 'Fwd:'+ model['subject'];
          clone['body'] = '<br>-----<br>' + model['body'];
          console.log(clone);
          this.composer.loadModel(clone);
        }
      }
      break;
    default:
       goog.base(this, 'notify', null, action);
       break;
  }
};
