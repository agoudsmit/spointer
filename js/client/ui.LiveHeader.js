goog.provide('spo.ui.Header');

goog.require('goog.ui.Component');

spo.ui.Header = function(dh) {
  goog.base(this, dh);
};
goog.inherits(spo.ui.Header, goog.ui.Component);

goog.scope(function() {
  var proto = spo.ui.Header.prototype;

  proto.decorateInternal = function(element) {
    // The element should already be in the page, because we want the header
    // to persists. Just fill it in now with the content.
    goog.base(this, 'decorateInternal', element);
    element.innerHTML = spo.template.headerWithLogin({
      username: goog.global['USER_NAME']
    });
    this.gameNameLabel_ = goog.dom.getElementByClass(goog.getCssName(
      'game-name'), element);
    this.viewName_ = goog.dom.getElementByClass(goog.getCssName('view-name'),
      element);

  };
  proto.setViewName = function(viewname) {
    this.viewName_.innerHTML = viewname;
  }
  proto.setGameName = function(gamename) {
    this.gameNameLabel_.innerHTML = gamename;
  };

});
