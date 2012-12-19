goog.provide('spo.control.MailPreview');

goog.require('spo.control.Base');
goog.require('spo.ui.MailPreview');
goog.require('spo.ds.mail');
goog.require('goog.dom.dataset');
goog.require('goog.events.EventType');
goog.require('spo.control.Action');
goog.require('goog.array');
goog.require('goog.string');
goog.require('spo.ui.PreviewControl');
goog.require('spo.control.EventType');
goog.require('spo.control.Event');

/**
 * @constructor
 * @extends {spo.control.Base}
 * @param {!Element} container The container to render the controls in.
 */
spo.control.MailPreview = function(container) {
  goog.base(this, container);
  this.controlView_ = null;
  this.clickedUserName_ = null;
  this.handleFormResult_bound_ = goog.bind(this.handleFormResult, this);
  this.messageControls_ = new spo.ui.PreviewControl();
  this.getHandler().listen(this.messageControls_, spo.control.EventType.CONTROL_ACTION,
    this.handleMessageControlAction);
  // FIXME: very very ugly! should not be here at all.
  this.scrollBottom_bound_ = goog.bind(function() {
    if (goog.isDef(this.scrollElement_))
      this.container_.parentNode.parentNode.scrollTop = this.scrollElement_.clientHeight;
  }, this);
};
goog.inherits(spo.control.MailPreview, spo.control.Base);

spo.control.MailPreview.prototype.handleMessageControlAction = function(ev) {
  switch(ev.getAction()) {
    case spo.control.Action.REPLY:
    case spo.control.Action.FORWARD:
      this.notify(this, ev.getAction());
      break;
  }
};

/**
 * @type {!Element}
 * @private
 */
spo.control.MailPreview.prototype.scrollElement_;

/**
 * Sets the element to scroll when updating.
 * @param {!Element} el The element to update.
 */
spo.control.MailPreview.prototype.setScrollElement = function(el) {
  this.scrollElement_ = el;
};
/**
 * Loads a new record in the controller.
 * @param {*} record The mail record to load.
 */
spo.control.MailPreview.prototype.loadRecord = function(record) {
  this.mailRecord_ = record;
  this.nextMessageId = record['reply_message_id'] || null;
  this.loadView();
};
/**
 * @type {?number}
 * @private
 */
spo.control.MailPreview.prototype.nextMessageId = null;

/**
 * The view currently used.
 * @type {spo.ui.MailPreview}
 * @private
 */
spo.control.MailPreview.prototype.view_;
/**
 * getter for the currently utilized mail record. Notice that it might not be the same as
 * the one that initialize it so comparison should be made using spo.ds.mail.
 * @return {*} The mail record that is currently visualized.
 */
spo.control.MailPreview.prototype.getRecord = function() {
  return this.mailRecord_ || null;
};

spo.control.MailPreview.prototype.clean = function() {
  this.messageControls_.exitDocument();
  this.getHandler().unlisten(this.view_.userListContainer, goog.events.EventType.CLICK, this.handleUserClick);
  this.getHandler().unlisten(this.view_.webFormContainer, goog.events.EventType.CLICK, this.handleWebForms);
  this.getHandler().unlisten(this.view_.nextMessageButton, goog.events.EventType.CLICK, this.loadNextMEssage)
  this.getHandler().unlisten(this.view_, goog.ui.Component.EventType.ACTION, this.saveTags);
  goog.dispose(this.view_);
};

/**
 * Loads the view into existence.
 */
spo.control.MailPreview.prototype.loadView = function() {
  if (goog.isDefAndNotNull(this.view_)) {
    this.clean();
  } else {
    // Basically the view has never been used, make it visible!
    this.container_.style.display = 'block';
  }
  this.view_ = new spo.ui.MailPreview();
  this.view_.setModel(this.mailRecord_);
  this.view_.render(this.container_);
  this.messageControls_.render(this.view_.controlContainer);
  this.getHandler().listen(this.view_.userListContainer, goog.events.EventType.CLICK, this.handleUserClick);
  this.getHandler().listen(this.view_.webFormContainer, goog.events.EventType.CLICK, this.handleWebForms);
  this.getHandler().listen(this.view_.nextMessageButton, goog.events.EventType.CLICK, this.loadNextMEssage)
  this.getHandler().listen(this.view_, goog.ui.Component.EventType.ACTION, this.saveTags);
  //this.view_.getElement().scrollIntoView(true);
  //var el =
  setTimeout(this.scrollBottom_bound_, 50);
  this.setNextButtonState();
};

spo.control.MailPreview.prototype.setNextButtonState = function() {
  if (this.nextMessageId == null) {
    this.view_.nextMessageButton.style.display='none';
  } else {
    this.view_.nextMessageButton.style.display='block';
  }
};

spo.control.MailPreview.prototype.loadNextMEssage = function() {
  if (this.nextMessageId != null) {
    spo.ds.Resource.getInstance().get({
      'url': '/message/get/' + this.nextMessageId
    }, goog.bind(this.showRelatedMessage, this));
  }
};

spo.control.MailPreview.prototype.showRelatedMessage = function(resp) {
  //console.log(resp);
  if (resp['status'] == 'ok') {
    var msg = resp['content']['message'];
    if (msg['id'] == this.nextMessageId) {
      this.view_.relatedMessageContent.innerHTML = this.view_.relatedMessageContent.innerHTML +
      '<div style="padding: 5px; border: 1px solid black;">' +
      msg['body'] +
      '</div>';
      this.nextMessageId = msg['reply_message_id'] || null;
      this.setNextButtonState();
    }

  }
};



/**
 * saves the tags/
 * @param  {goog.events.Event} ev The action event.
 * @protected
 */
spo.control.MailPreview.prototype.saveTags = function(ev) {
  ev.stopPropagation();
  var input = this.view_.getTagList();
  //console.log('Input value is', input);
  var arr = input.split(',');
  goog.array.forEach(arr, function(el, i) {
    arr[i] = goog.string.trim(el);
  });
  spo.ds.Resource.getInstance().get({
    'url': '/message/tag/update/' + this.mailRecord_['message_details_id'],
    'data': {
      'message_tags': arr.join(', ')
    }
  });
};

/**
 * Handles the web form click events - looks up for the node that has the dataset for it.
 * @param {goog.events.Event} ev The CLICK event.
 * @protected
 */
spo.control.MailPreview.prototype.handleWebForms = function(ev) {
  var el = /** @type {!Element} */ (ev.target);
  if (goog.dom.dataset.has(el, 'resource')) {
    var resource = goog.dom.dataset.get(el, 'resource');
    spo.ds.Resource.getInstance().get({
      'url': resource
    }, this.handleFormResult_bound_);
  }
};

/**
 * Custom handler for server response.
 * @param {*} resp The server response as json object.
 */
spo.control.MailPreview.prototype.handleFormResult = function(resp) {
  if (goog.dom.isElement(this.view_.webFormContainer)) {
    if (resp['status'] == 'ok') {
      this.view_.webFormContainer.innerHTML = 'Form was submitted.';
    } else {
      var oldErr = goog.dom.getElementByClass('error', this.view_.webFormContainer);
      if (oldErr != null) goog.dom.removeNode(oldErr);
      this.view_.webFormContainer.innerHTML = '<div class="error" style="color: red;">' + resp['error'] + '</div>' +
        this.view_.webFormContainer.innerHTML;
    }
  }
};

/**
 * Returns the selected user name selected by clicking on a user name.
 * @return {string|null}
 */
spo.control.MailPreview.prototype.getSelectedUserName = function() {
  return this.clickedUserName_;
};

/**
 * @protected
 * @param  {goog.events.Event} ev The CLICK event.
 */
spo.control.MailPreview.prototype.handleUserClick = function(ev) {
  ev.stopPropagation();
  var target = /** @type {!Element} */(ev.target);
  if (goog.dom.dataset.has(target, 'indexkey')) {
    // User name has been clicked.
    var index = goog.dom.dataset.get(target, 'indexkey');
    var username = spo.ds.mail.getRecipientByIndex(this.mailRecord_, +index);
    if (username != null) {
      this.clickedUserName_ = username;
      this.notify(this, spo.control.Action.SELECT);
    }
  }
};
