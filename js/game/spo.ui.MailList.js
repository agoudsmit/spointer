goog.provide('spo.ui.MailList');

goog.require('goog.dom');
goog.require('spo.ui.Widget');
goog.require('spo.ds.MailList');
goog.require('spo.ds.OverrideList.EventType');
goog.require('spo.ds.mail');
goog.require('spo.gametemplate');
goog.require('spo.ui.ButtonRenderer');
goog.require('goog.ui.CustomButton');
goog.require('goog.events.EventType');
goog.require('goog.ui.Component.EventType');
goog.require('goog.dom.dataset');
goog.require('spo.control.Event');
goog.require('spo.control.EventType');
goog.require('pstj.date.utils');

/**
 * Will act as a control as well.
 *
 * @constructor
 * @extends {spo.ui.Widget}
 */
spo.ui.MailList = function() {
  goog.base(this);
  this.localCopy_ = null;
  this.buttonPrev_ = new goog.ui.CustomButton('', spo.ui.ButtonRenderer.getInstance());
  this.buttonNext_ = new goog.ui.CustomButton('', spo.ui.ButtonRenderer.getInstance());
  this.buttonPrev_.setEnabled(false);
  this.buttonNext_.setEnabled(false);
};
goog.inherits(spo.ui.MailList, spo.ui.Widget);

/**
 * @override
 * @return {!spo.ds.MailList}
 */
spo.ui.MailList.prototype.getModel;

/**
 * @type {Array.<*>}
 */
spo.ui.MailList.prototype.localCopy_ = null;

/**
 * @type {pstj.ds.RecordID}
 * @private
 */
spo.ui.MailList.prototype.selectedMailId_;
/**
 * Reference to the content element as it is used very often.
 * @type {!Element}
 * @private
 */
spo.ui.MailList.prototype.contentElement_;

/** @inheritDoc */
spo.ui.MailList.prototype.getTemplate = function() {
  return spo.gametemplate.MailList({});
};

/** @inheritDoc */
spo.ui.MailList.prototype.getContentElement = function() {
  return this.contentElement_;
};

/** @inheritDoc */
spo.ui.MailList.prototype.decorateInternal = function(el) {
  goog.base(this, 'decorateInternal', el);
  this.contentElement_ = /** @type {!Element} */ (goog.dom.getElementByClass(
      goog.getCssName('mail-listing-view'), this.getElement()));
  this.buttonPrev_.decorate(goog.dom.getElementByClass(goog.getCssName('prev'), el));
  this.buttonNext_.decorate(goog.dom.getElementByClass(goog.getCssName('next'), el));
};

/** @inheritDoc */
spo.ui.MailList.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.getHandler().listen(this.buttonNext_, goog.ui.Component.EventType.ACTION, this.onNextPressed);
  this.getHandler().listen(this.buttonPrev_, goog.ui.Component.EventType.ACTION, this.onPrevPressed);
  this.getHandler().listen(this.getContentElement(), goog.events.EventType.CLICK, this.onContentClick);
};

/**
 * Handle the next press. It is guaranteed that it can send action events only when active.
 * @protected
 * @param {goog.events.Event} ev The ACTION event.
 */
spo.ui.MailList.prototype.onNextPressed = function(ev) {
  ev.stopPropagation();
};

/**
 * Handle the previous press. It is guaranteed that it can send action events only when active.
 * @protected
 * @param {goog.events.Event} ev The ACTION event.
 */
spo.ui.MailList.prototype.onPrevPressed = function(ev) {
  ev.stopPropagation();
};
/**
 * Handle clicks in the content zone, make sure the HTML only data records can be clicked.
 * @param {goog.events.Event} ev The CLICK event.
 * @protected
 */
spo.ui.MailList.prototype.onContentClick = function(ev) {
  var target = /** @type {!Element} */ (ev.target);
  if (goog.dom.dataset.has(target, 'recordid')) {
    // safe reference to the mail record that is selected.
    this.selectedMailRecord_ = this.getModel().getList()[+goog.dom.dataset.get(target, 'recordid')];
    // notify for select action.
    this.dispatchEvent(new spo.control.Event(this, spo.control.Action.SELECT));
  }
};


/**
 * Sets the data source provider.
 * @override
 * @param {*} provider The mail list provider.
 */
spo.ui.MailList.prototype.setModel = function(provider) {
  // If there was a model before - un-bind it.
  if (this.getModel() != null) {
    this.getHandler().unlisten(this.getModel(), spo.ds.OverrideList.EventType.UPDATED, this.handleListUpdate);
    this.getModel().setViewState(false);
  }
  this.clean();
  goog.base(this, 'setModel', provider);
  this.getModel().setViewState(true);
  this.getHandler().listen(this.getModel(), spo.ds.OverrideList.EventType.UPDATED, this.handleListUpdate);
  // Request the first page.
  provider.getPage(1);
};

spo.ui.MailList.prototype.clean = function() {
  this.getContentElement().innerHTML = spo.gametemplate.ListLoading({});
  this.localCopy_ = null;
};

spo.ui.MailList.prototype.getSelectedId = function() {
  return this.selectedId_;
};

spo.ui.MailList.prototype.setSelectedId = function(id) {
  this.selectedId_ = id;
};

/**
 * Sets the active child.
 * @param {number} index The index to set as active.
 */
spo.ui.MailList.prototype.setSelectedChild = function(index) {
};

/**
 *
 * Handles the update event on the linked list.
 * @param {goog.events.Event} ev The UPDATE event
 */
spo.ui.MailList.prototype.handleListUpdate = function(ev) {
  // compare all messages to the list we have
  var newList = this.getModel().getList();
  if (this.localCopy_ != null && spo.ds.mail.subsetMatch(newList, this.localCopy_)) {
    return;
  }

  var selectedId = this.getSelectedId();
  // Render using the new list
  var html = '';

  for (var i = 0; i < newList.length; i++) {
    html = html + spo.gametemplate.MailRecord({
      recordid: i,
      sender: newList[i]['from']['alias'],
      subject: newList[i]['subject'],
      date: pstj.date.utils.renderTime(newList[i]['date'], 'Mon dd hh:xx'),
      isread: (newList[i]['is_read'] == 1) ? true : false
    });
  }
  if (newList.length == 0) {
    html = 'No messages in this box';
  }
  this.getContentElement().innerHTML = html;
  // if the ID of the message still exists - select it.
  if (selectedId != 'undefined') {
    for (var i = 0; i < newList.length; i++) {
      if (newList[i]['id'] == selectedId) {
        this.setSelectedChild(i);
      }
    }
  }
  this.localCopy_ = newList;
  this.buttonPrev_.setEnabled(this.getModel().hasPreviousPage());
  this.buttonNext_.setEnabled(this.getModel().hasNextPage());
};
