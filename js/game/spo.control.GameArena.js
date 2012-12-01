goog.provide('spo.control.GameArena');

goog.require('spo.control.Base');
goog.require('pstj.ui.CustomScrollArea');
goog.require('spo.control.MailBoxList');
goog.require('spo.control.Action');
goog.require('spo.ds.mail');
goog.require('spo.ui.MailList');


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
  // TODO: Load game details => setup header
  
  var top_pane = /** @type {!Element} */ (goog.dom.getElementByClass(goog.getCssName(
  'mail-list-placeholder'), this.view_.getContentElement()));
  
  //Load mailbox list => setup mailbox list
  this.mailbox_ = new spo.control.MailBoxList(top_pane);
  this.mailbox_.setParentControl(this);
  
  // Load mail listing UI.
  this.maillist_ = new spo.ui.MailList();
  console.log(top_pane);
  this.maillist_.render(top_pane);
};

/** @inheritDoc */
spo.control.GameArena.prototype.notify = function(child, action) {
  switch (child) {
    case this.mailbox_:
      if (action == spo.control.Action.SELECT) {
        console.log(' Received new resource', this.mailbox_.getActiveResource());
        var mailbox = spo.ds.mail.getListing(this.mailbox_.getActiveResource());
        console.log(mailbox);
        this.maillist_.setModel(spo.ds.mail.getListing(this.mailbox_.getActiveResource()));
        
      }
      break;
    default: 
       goog.base(this, 'notify', null, action);
       break;
  }
};