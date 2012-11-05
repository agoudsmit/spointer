goog.provide('spo.ui.TeamList');

goog.require('goog.ui.Component');
goog.require('goog.dom');
goog.require('spo.template');

spo.ui.TeamList = function(odh) {
  goog.base(this, odh);
};
goog.inherits(spo.ui.TeamList, goog.ui.Component);

goog.scope(function() {
  var proto = spo.ui.TeamList.prototype;

  proto.createDom = function() {
    this.decorateInternal(
      /** @type {Element} */goog.dom.htmlToDocumentFragment(
        spo.template.TeamList({})));
  };
});
