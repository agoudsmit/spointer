/**
 * @fileoverview Provides the list view for the team names (both players and
 * controls).
 */

goog.provide('spo.ui.TeamList');

goog.require('goog.dom');
goog.require('goog.ui.Component');
goog.require('spo.template');

/**
 * @constructor
 * @extends {goog.ui.Component}
 * @param {!string} header The header title to use.
 * @param {goog.dom.DomHelper=} odh Optional dom helper.
 */
spo.ui.TeamList = function(header, odh) {
  goog.base(this, odh);
  this.header_ = header;
};
goog.inherits(spo.ui.TeamList, goog.ui.Component);

/**
 * @type {!string}
 * @private
 */
spo.ui.TeamList.prototype.header_;

/**
 * @inheritDoc
 */
spo.ui.TeamList.prototype.createDom = function() {
  this.decorateInternal(
  /** @type {Element} */ (goog.dom.htmlToDocumentFragment(
    spo.template.TeamList({
      header: this.header_
    }))));
};

/** @inheritDoc */
spo.ui.TeamList.prototype.disposeInternal = function() {
  delete this.header_;
  goog.base(this, 'disposeInternal');
};
