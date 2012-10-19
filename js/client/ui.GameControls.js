/**
 * TODO: Add dispose method as this component is often disposed
 */

goog.provide('spo.ui.GameControls');

goog.require('goog.ui.Component');
goog.require('goog.structs.Map');
goog.require('spo.template');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.dataset');


/**
 * @constructor
 * @extends {goog.ui.Component}
 * @param {goog.dom.DomHelper=} odh Optional dom helper.
 */
spo.ui.GameControls = function(odh) {
  goog.base(this, odh);
  this.actionToButtonMap_ = new goog.structs.Map();
};
goog.inherits(spo.ui.GameControls, goog.ui.Component);


goog.scope(function() {
  var proto = spo.ui.GameControls.prototype;
  /**
   * @inheritDoc
   */
  proto.createDom = function() {
    this.decorateInternal(goog.dom.htmlToDocumentFragment(
      spo.template.gameControls()));
  };

  proto.createControls_ = function(els) {
    goog.array.forEach(els, this.createControl_, this);
  };

  proto.createControl_ = function(el) {
    var button = new goog.ui.CustomButton('',
      spo.ui.ButtonRenderer.getInstance());

    this.addChild(button);
    button.decorate(el);
    var action = goog.dom.dataset.get(el, 'action');
    if (action != null) {
      this.actionToButtonMap_.set(button, action);
    }

  };

  proto.getActionByButton = function(button) {
    return this.actionToButtonMap_.get(button);
  };

  /**
   * @inheritDoc
   */
  proto.decorateInternal = function(element) {
    goog.base(this, 'decorateInternal', element);
    var controls = goog.dom.getElementsByClass(goog.getCssName(
      'game-control-item'), element);
    this.createControls_(controls);
  };

});
