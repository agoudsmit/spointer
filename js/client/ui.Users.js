/**
 * @fileoverview  Provides the list structure for user lists.
 */

goog.provide('spo.ui.Users');

goog.require('goog.dom');
goog.require('goog.ui.Component');
goog.require('goog.ui.CustomButton');
goog.require('pstj.ds.ListItem.EventType');
goog.require('spo.ds.Team');
goog.require('spo.template');
goog.require('spo.ui.ButtonRenderer');

/**
 * Provides the widget for User lists for non-control users. It is a thin
 * wrapping DOM structure only.
 *
 * @constructor
 * @extends {goog.ui.Component}
 */
spo.ui.Users = function() {
  goog.base(this);
  this.newBtn_ = new goog.ui.CustomButton('',
    spo.ui.ButtonRenderer.getInstance());
};
goog.inherits(spo.ui.Users, goog.ui.Component);

/**
 * @protected
 * @return {string} The team name.
 */
spo.ui.Users.prototype.getTeamName = function() {
  return this.getModel().getProp(spo.ds.Team.Property.NAME);
};

/**
 * @inheritDoc
 */
spo.ui.Users.prototype.createDom = function() {
  this.decorateInternal(
  /** @type {Element} */ (goog.dom.htmlToDocumentFragment(
        spo.template.Users({
          teamname: this.getTeamName()
        }))));
};

goog.scope(function() {
  var proto = spo.ui.Users.prototype;
  /** @inheritDoc */
  proto.decorateInternal = function(el) {
    goog.base(this, 'decorateInternal', el);
    this.addChild(this.newBtn_);
    this.newBtn_.decorate(goog.dom.getElementByClass(goog.getCssName(
      'add-user-button'), this.getElement()));
  };
  /** @inheritDoc */
  proto.enterDocument = function() {
    goog.base(this, 'enterDocument');
    this.getHandler().listen(/** @type {!pstj.ds.ListItem} */ (this.getModel()),
      pstj.ds.ListItem.EventType.UPDATE, this.updateHeading_);
  };
  /** @private */
  proto.updateHeading_ = function() {
    goog.dom.getElementByClass(goog.getCssName('detail-heading'),
      this.getElement()).innerHTML = this.getTeamName();
  };
  /**
   * Getter for the action button related to the view.
   *
   * @return {!goog.ui.CustomButton} The custom button defined.
   */
  proto.getActionButton = function() {
    return this.newBtn_;
  };
});
