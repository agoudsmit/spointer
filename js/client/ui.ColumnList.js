goog.provide('spo.ui.ColumnList');

goog.require('goog.ui.Component');
goog.require('spo.template');

/**
 * Contains simple logic to display the teams/players/control list etc lists.
 * @constructor
 * @extends {goog.ui.Component}
 * @param {goog.dom.DomHelper=} odh Optional dom helper.
 * @param {string=} title The title to se to list.
 */
spo.ui.ColumnList = function(odh, title) {
  goog.base(this, odh);
  this.title_ = title;
};
goog.inherits(spo.ui.ColumnList, goog.ui.Component);


/**
 * @inheritDoc
 */
spo.ui.ColumnList.prototype.createDom = function() {
  this.decorateInternal(goog.dom.htmlToDocumentFragment(
    spo.template.simplelist({
      title: this.title_ || '',
      teams: this.getModel()
    })));
};

/**
 * @inheritDoc
 */
spo.ui.ColumnList.prototype.disposeInternal = function() {
  delete this.title_;
  goog.base(this, 'disposeInternal');
};
