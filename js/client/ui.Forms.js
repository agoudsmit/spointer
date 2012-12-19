/**
 * @fileoverview Provides the FORMS for the game details screen. Those are used
 * to upload files to the server without submitting the page.
 */

goog.provide('spo.ui.Forms');
goog.provide('spo.ui.Forms.FormEvent');

goog.require('goog.async.Delay');
goog.require('goog.dom');
goog.require('goog.events.Event');
goog.require('goog.net.EventType');
goog.require('goog.net.IframeIo');
goog.require('goog.ui.Component');
goog.require('spo.template');

/**
 * Hidden forms needed for file uploads.
 *
 * @constructor
 * @extends {goog.ui.Component}
 * @param {goog.dom.DomHelper=} odh Optional dom helper.
 */
spo.ui.Forms = function(odh) {
  goog.base(this, odh);
  this.io_ = new goog.net.IframeIo();
  this.getHandler().listen(this.io_, goog.net.EventType.COMPLETE,
    this.notify_);
};
goog.inherits(spo.ui.Forms, goog.ui.Component);

/**
 * The IO uploader.
 * @type {goog.net.IframeIo}
 * @private
 */
spo.ui.Forms.prototype.io_;

/**
 * @inheritDoc
 */
spo.ui.Forms.prototype.disposeInternal = function() {
  goog.dispose(this.io_);
  delete this.io_;
  goog.base(this, 'disposeInternal');
};

/**
 * @inheritDoc
 */
spo.ui.Forms.prototype.createDom = function() {
  var html = spo.template.uploadForms({
    gameid: this.getModel().getId(),
    action_upload_scenario: goog.global['UPLOAD_SCENARIO'],
    action_upload_teams: goog.global['UPLOAD_TEAMS']
  });
  this.decorateInternal(
    /** @type {!Element} */ (goog.dom.htmlToDocumentFragment(html)));
};

/**
 * @inheritDoc
 */
spo.ui.Forms.prototype.enterDocument = function() {
  var els = goog.dom.getElementsByClass(goog.getCssName('monitor'),
    this.getElement());
  goog.array.forEach(els, function(el) {
    this.getHandler().listen(el, goog.events.EventType.CHANGE,
      this.handleFileChange_);
  }, this);
};

/**
 * Enables the upload scenario file selector.
 */
spo.ui.Forms.prototype.enableScneario = function() {
  goog.dom.getElement('scenario').click();
};

/**
 * Enables the upload team list file selector.
 */
spo.ui.Forms.prototype.enableTeam = function() {
  goog.dom.getElement('teamlist').click();
};

/**
 * Dispatch a control notification event.
 *
 * @param  {goog.net.EventType} e The network event.
 * @private
 */
spo.ui.Forms.prototype.notify_ = function(e) {
  var target = /** @type {!goog.net.IframeIo} */ (e.target);
  //console.log('Response from server is', target.getResponseHtml());
  this.dispatchEvent(new spo.ui.Forms.FormEvent(
    (target.isSuccess() ? spo.control.EventType.SUCCESS :
      spo.control.EventType.FAILURE), this, target.getResponseText()));
};

/**
 * Handles the changes in the inputs of the different upload forms.
 *
 * @param  {goog.events.Event} e The change event.
 * @private
 */
spo.ui.Forms.prototype.handleFileChange_ = function(e) {
  this.io_.sendFromForm(e.target.parentNode);
};

/**
 * Form event to dispatch, that will contain the server response
 * on the form submition.
 *
 * @constructor
 * @extends {goog.events.Event}
 * @param {spo.control.EventType} type The type of the event to fire.
 * @param {spo.ui.Forms} target The firing form.
 * @param {?string} response The response from the server.
 */
spo.ui.Forms.FormEvent = function(type, target, response) {
  goog.base(this, type, target);
  this.formResponse = response;
};
goog.inherits(spo.ui.Forms.FormEvent, goog.events.Event);

/**
 * @type {?string}
 */
spo.ui.Forms.FormEvent.prototype.formResponse;
