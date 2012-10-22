/**
 * TODO: Add dispose method as this component is often disposed
 */

goog.provide('spo.ui.GameControls');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.dataset');
goog.require('goog.events.EventType');
goog.require('goog.ui.Component');
goog.require('spo.control.EventType');
goog.require('spo.template');

/**
 * @constructor
 * @extends {goog.ui.Component}
 * @param {goog.dom.DomHelper=} odh Optional dom helper.
 */
spo.ui.GameControls = function(odh) {
  goog.base(this, odh);
};
goog.inherits(spo.ui.GameControls, goog.ui.Component);


goog.scope(function() {
  var proto = spo.ui.GameControls.prototype;
  /**
   * @inheritDoc
   */
  proto.createDom = function() {

    this.decorateInternal(
      /** @type {Element} */ (goog.dom.htmlToDocumentFragment(
      spo.template.gameControls({}))));
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

  /**
   * Create coustom controls from the class-ed elements.
   * @param {goog.array.ArrayLike} els The elements to work with.
   * @private
   */
  proto.createControls_ = function(els) {
    goog.array.forEach(els, this.createControl_, this);
  };

  /**
   * Creates a custom button control from an element. The action of the button
   * should be contained in its data set.
   * @param  {Element} el The Element to make a child control of.
   * @private
   */
  proto.createControl_ = function(el) {
    var button = new goog.ui.CustomButton('',
      spo.ui.ButtonRenderer.getInstance());

    this.addChild(button);
    button.decorate(el);
  };

  /**
   * Handler function for the ACTION event of the custom buttons. The handler
   * will receive the action event from the buttons but is bound to the parent.
   * @param  {goog.events.Event} e The goog.ui.Component.EventType.ACTION event
   * coming from the buttons that are children of this control.
   * @private
   */
  proto.handleControlAction_ = function(e) {
    var target = e.target.getElement();
    if (goog.dom.dataset.has(target, 'action')) {
      this.handleNamedAction_(goog.dom.dataset.get(target, 'action'));
    }
  };

  /**
   * Handles a named action coming from the control buttons.
   * @param  {?string} action The name of the action as recived by the html data
   * set.
   * @private
   */
  proto.handleNamedAction_ = function(action) {
    if (goog.isString(action) && !goog.string.isEmpty(action)) {
      switch (action) {
        case 'uploadscenario':
          this.dispatchEvent(new spo.control.Event(this,
            spo.control.Action.UPLOAD_SCENARIO));
          break;
        case 'uploaduser':
          this.dispatchEvent(new spo.control.Event(this,
            spo.control.Action.UPLOAD_TEAMLIST));
          break;
        case 'managecontrols':
          this.dispatchEvent(new spo.control.Event(this,
            spo.control.Action.MANAGE_CONTROLS));
          break;
      }
    }
  };

  /**
   * @inheritDoc
   */
  proto.enterDocument = function() {
    this.getHandler().listen(this,
      goog.ui.Component.EventType.ACTION, this.handleControlAction_);
  };

});
