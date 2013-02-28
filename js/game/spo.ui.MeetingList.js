goog.provide('spo.ui.MeetingList');

goog.require('pstj.ui.Templated');
goog.require('spo.gametemplate');


/**
 * @constructor
 * @extends {pstj.ui.Templated}
 *
 */
spo.ui.MeetingList = function() {
  goog.base(this);
  this.tabs_ = new goog.ui.TabBar();
  this.scrollarea_ = new pstj.ui.CustomScrollArea();
  this.scrollarea_.setScrollInsideTheWidget(true);
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
    this.addChild(this.tabs_);
    this.tabs_.decorate(this.getEls(goog.getCssName('goog-tab-bar')));
    var contentEl = this.getEls(goog.getCssName('goog-tab-content'));
    this.scrollarea_.render(contentEl);
    //this.contentElement = this.getEls(goog.getCssName('goog-tab-content'))
  };

  /** @inheritDoc */
  p.getContentElement = function() {
    return this.scrollarea_.getContentElement();
  };
});

