/**
 * @fileoverview Provides the list view for the team names.
 */

goog.provide('spo.ui.TeamList');

goog.require('goog.dom');
goog.require('goog.ui.Component');
goog.require('spo.template');

/**
 * @constructor
 * @extends {goog.ui.Component}
 * @param {goog.dom.DomHelper=} odh Optional dom helper.
 */
spo.ui.TeamList = function(odh) {
  goog.base(this, odh);
};
goog.inherits(spo.ui.TeamList, goog.ui.Component);

/**
 * @inheritDoc
 */
spo.ui.TeamList.prototype.createDom = function() {
  this.decorateInternal(
  /** @type {Element} */ (goog.dom.htmlToDocumentFragment(
    spo.template.TeamList({}))));
};

