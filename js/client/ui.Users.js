goog.provide('spo.ui.Users');

goog.require('goog.dom');
goog.require('goog.ui.Component');
goog.require('spo.ds.Team');
goog.require('spo.template');

/**
 * @constructor
 * @extends {goog.ui.Component}
 */
spo.ui.Users = function() {
  goog.base(this);
};
goog.inherits(spo.ui.Users, goog.ui.Component);

/**
 * @inheritDoc
 */
spo.ui.Users.prototype.createDom = function() {
  this.decorateInternal(
    goog.dom.htmlToDocumentFragment(
      spo.template.Users({
        teamname: this.getModel().getProp(spo.ds.Team.Property.NAME)
      })));
};
