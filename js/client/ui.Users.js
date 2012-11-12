/**
 * @fileoverview  Provides the list structure for user lists.
 */

goog.provide('spo.ui.Users');

goog.require('goog.dom');
goog.require('goog.ui.Component');
goog.require('spo.ds.Team');
goog.require('spo.template');

/**
 * Provides the widget for User lists for non-control users. It is a thin
 * wrapping DOM structure only.
 *
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
  /** @type {Element} */ goog.dom.htmlToDocumentFragment(
      spo.template.Users({
        teamname: this.getModel().getProp(spo.ds.Team.Property.NAME)
      })));
};
