/**
 * @fileoverview Provides the game controls (in game view details).
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
 * Provides the control elements for a game. Those are the buttons that
 * are on top of the game widget.
 *
 * @constructor
 * @extends {goog.ui.Component}
 * @param {goog.dom.DomHelper=} odh Optional dom helper.
 */
spo.ui.GameControls = function(odh) {
  goog.base(this, odh);
};
goog.inherits(spo.ui.GameControls, goog.ui.Component);

/**
 * @inheritDoc
 */
spo.ui.GameControls.prototype.createDom = function() {

  this.decorateInternal(
    /** @type {Element} */ (goog.dom.htmlToDocumentFragment(
    spo.template.gameControls({}))));
};

/**
 * @inheritDoc
 */
spo.ui.GameControls.prototype.decorateInternal = function(element) {
  goog.base(this, 'decorateInternal', element);
  var controls = goog.dom.getElementsByClass(goog.getCssName(
    'game-control-item'), element);
  this.createControls_(controls);
};

/**
 * @inheritDoc
 */
spo.ui.GameControls.prototype.enterDocument = function() {
  this.getHandler().listen(this,
    goog.ui.Component.EventType.ACTION, this.handleControlAction_);
};


/**
 * Sets the play state of the control. This is if the game is in play
 * state the pause buttton should be active, in pause state the play
 * button should be active.
 *
 * @param {boolean} play True if the game is in play state.
 */
spo.ui.GameControls.prototype.setPlayState = function(play) {
  if (play) {
    this.getChildAt(0).getElement().style.display = 'block';
    this.getChildAt(1).getElement().style.display = 'none';

  } else {
    this.getChildAt(0).getElement().style.display = 'none';
    this.getChildAt(1).getElement().style.display = 'block';
  }
};

/**
 * Sets the edit state of the control. This is if the game is being edited
 * the edit button should disapear.
 *
 * @param {boolean} edit true if the game is in edit mode.
 */
spo.ui.GameControls.prototype.setEditState = function(edit) {
  if (edit) {
    this.getChildAt(4).getElement().style.display = 'none';
  } else {
    this.getChildAt(4).getElement().style.display = 'block';
  }
};

/**
 * Create coustom controls from the class-ed elements. It expects all elements
 * that need decoration. The elements should have the data-action attribute.
 *
 * @param {goog.array.ArrayLike} els The elements to work with.
 * @private
 */
spo.ui.GameControls.prototype.createControls_ = function(els) {
  goog.array.forEach(els, this.createControl_, this);
};

/**
 * Creates a custom button control from an element. The action of the button
 * should be contained in its data set (data-action).
 *
 * @param  {Element} el The Element to make a child control of.
 * @private
 */
spo.ui.GameControls.prototype.createControl_ = function(el) {
  var button = new goog.ui.CustomButton('',
    spo.ui.ButtonRenderer.getInstance());

  this.addChild(button);
  button.decorate(el);
};

/**
 * Handler function for the ACTION event of the custom buttons. The handler
 * will receive the action event from the buttons but is bound to the parent.
 *
 * @private
 * @param  {goog.events.Event} e The goog.ui.Component.EventType.ACTION event
 *                               coming from the buttons that are children of
 *                               this control.
 */
spo.ui.GameControls.prototype.handleControlAction_ = function(e) {
  var target = e.target.getElement();
  if (goog.dom.dataset.has(target, 'action')) {
    this.handleNamedAction_(goog.dom.dataset.get(target, 'action'));
  }
};


/**
 * Handles a named action coming from the control buttons.
 *
 * @private
 * @param  {?string} action The name of the action as recived by the html data
 *                          set.
 */
spo.ui.GameControls.prototype.handleNamedAction_ = function(action) {
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
      case 'edit':
        this.dispatchEvent(new spo.control.Event(this,
          spo.control.Action.EDIT));
        break;
      case 'delete':
        this.dispatchEvent(new spo.control.Event(this,
          spo.control.Action.DELETE));
        break;
      case 'pause':
        this.dispatchEvent(new spo.control.Event(this,
          spo.control.Action.PAUSE));
        break;
      case 'play':
        this.dispatchEvent(new spo.control.Event(this,
          spo.control.Action.PLAY));
        break;
      case 'stop':
        this.dispatchEvent(new spo.control.Event(this,
          spo.control.Action.STOP));
        break;
    }
  }
};
