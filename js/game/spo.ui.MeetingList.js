goog.provide('spo.ui.MeetingList');

goog.require('pstj.ui.Templated');
goog.require('spo.gametemplate')


/**
 * @constructor
 * @extends {pstj.ui.Templated}
 *
 */
spo.ui.MeetingList = function() {
  goog.base(this);
  this.tabs_ = new goog.ui.TabBar();
};
goog.inherits(spo.ui.MeetingList, pstj.ui.Templated);

goog.scope(function() {
  var p = spo.ui.MeetingList.prototype;
  /** @inheritDoc */
  p.getTemplate = function() {
    return spo.gametemplate.MeetingList({});
  };

  /** @inheritDoc */
  p.decorateInternal = function(el) {
    goog.base(this, 'decorateInternal', el);
    this.tabs_.decorate(this.getEls(goog.getCssName('goog-tab-bar')));
  };

});

