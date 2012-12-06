goog.provide('spo.ui.PreviewControl');
goog.require('spo.ui.GameControls');
goog.require('spo.gametemplate');
goog.require('goog.string');
goog.require('goog.dom');
goog.require('spo.control.Event');
goog.require('spo.control.Action');

/**
 * @constructor
 * @extends {spo.ui.GameControls}
 */
spo.ui.PreviewControl = function() {
  goog.base(this);
};
goog.inherits(spo.ui.PreviewControl, spo.ui.GameControls);

goog.scope(function() {
  var p = spo.ui.PreviewControl.prototype;
  /** @inheritDoc */
  p.createDom = function() {
    this.decorateInternal(
      /** @type {!Element} */(goog.dom.htmlToDocumentFragment(spo.gametemplate.PreviewControl({}))));
  };
  /**
   * @inheritDoc
   */
  p.handleNamedAction = function(action) {
    if (goog.isString(action) && !goog.string.isEmpty(action)) {
      switch (action) {
        case 'reply':
          this.dispatchEvent(new spo.control.Event(this,
            spo.control.Action.REPLY));
          break;
        case 'delete':
          this.dispatchEvent(new spo.control.Event(this,
            spo.control.Action.DELETE));
          break;
        case 'forward':
          this.dispatchEvent(new spo.control.Event(this,
            spo.control.Action.FORWARD));
          break;
      }
    }
  };
})
