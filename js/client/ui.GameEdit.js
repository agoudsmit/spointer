// TODO: Fix mem leaks/dispose
goog.provide('spo.ui.GameEdit');

goog.require('goog.dom');
goog.require('goog.ui.CustomButton');
goog.require('goog.ui.InputDatePicker');
goog.require('goog.ui.LabelInput');
goog.require('goog.ui.Slider');
goog.require('goog.ui.SliderBase.Orientation');
goog.require('goog.ui.Textarea');
goog.require('pstj.date.utils');
goog.require('spo.ds.Game');
goog.require('spo.template');
goog.require('spo.ui.ButtonRenderer');
goog.require('spo.ui.GameDetails');

/**
 * Provides the Edit widget for a game record.
 *
 * @constructor
 * @extends {spo.ui.GameDetails}
 * @param {goog.dom.DomHelper=} odh Optional dom helper.
 */
spo.ui.GameEdit = function(odh) {
  goog.base(this, odh);

  this.speedSlider_ = new goog.ui.Slider();
  this.speedSlider_.setOrientation(goog.ui.Slider.Orientation.HORIZONTAL);
  this.speedSlider_.setMinimum(0);
  this.speedSlider_.setMaximum(12);

  this.gameTimeInput_ = new goog.ui.LabelInput();

  this.datePicker_ = new goog.ui.InputDatePicker(spo.ds.Game.DateFormatter,
    spo.ds.Game.DateParser);
  this.datePicker_.getDatePicker().setShowToday(false);
  this.datePicker_.getDatePicker().setShowWeekNum(false);
  this.datePicker_.getDatePicker().setAllowNone(false);
  this.datePicker_.getDatePicker().setShowOtherMonths(false);

  this.saveBtn_ = new goog.ui.CustomButton('',
    spo.ui.ButtonRenderer.getInstance());
};
goog.inherits(spo.ui.GameEdit, spo.ui.GameDetails);


/**
 * Indicates if the form has been used already and it is safe to close/dispose
 * it.
 *
 * @type {boolean}
 * @private
 */
spo.ui.GameEdit.prototype.used_ = false;

/**
 * Pointer to text area - used to resize the area accroding to text size
 * FIXME: this seem to not be working at all...
 *
 * @type {goog.ui.Textarea}
 * @private
 */
spo.ui.GameEdit.prototype.ta_;

/**
 * Pointer to the 'save' button.
 *
 * @type {goog.ui.CustomButton}
 * @private
 */
spo.ui.GameEdit.prototype.saveBtn_;


/**
 * The slider to configure the speed of the game.
 *
 * @private
 * @type {goog.ui.Slider}
 */
spo.ui.GameEdit.prototype.speedSlider_;

/**
 * The time input for the game start time.
 *
 * @type {goog.ui.LabelInput}
 * @private
 */
spo.ui.GameEdit.prototype.gameTimeInput_;


/**
 * The date picker for the game start time.
 *
 * @type {goog.ui.InputDatePicker}
 * @private
 */
spo.ui.GameEdit.prototype.datePicker_;

/**
 * The DOM element in which to display the minutes it takes for one day to pass.
 *
 * @type {Element}
 * @private
 */
spo.ui.GameEdit.prototype.minutesElement_;

/**
 * @inheritDoc
 */
spo.ui.GameEdit.prototype.createDom = function() {
  this.decorateInternal(
    /** @type {Element} */ (goog.dom.htmlToDocumentFragment(
    spo.template.gameEdit({
      description: this.getModel().getProp(spo.ds.Game.Property.DESCRIPTION),
      gamestartdate: this.getModel().getFormatedStartDate(),
      date_format: spo.ds.Game.Formatting.DATE_ONLY,
      time_format: 'hh:mm',
      gamestarttime: pstj.date.utils.renderTime(this.getModel().getProp(
        spo.ds.Game.Property.START_TIME), 'hh:xx'),
      minutes: this.speedToDays_(this.getModel().getProp(
        spo.ds.Game.Property.SPEED))
    }))));
};


/**
 * Check if the form has been utilized to save data already.
 * @return {boolean} True is the save button has been used.
 */
spo.ui.GameEdit.prototype.isSafeToClose = function() {
  return this.used_;
};

/**
 * @inheritDoc
 */
spo.ui.GameEdit.prototype.decorateInternal = function(el) {
  goog.base(this, 'decorateInternal', el);

  // Setup text area
  this.ta_ = new goog.ui.Textarea('');
  this.ta_.setMinHeight(50);
  this.addChild(this.ta_);
  this.ta_.decorate(goog.dom.getElementByClass(goog.getCssName(
    'game-description-edit'), this.getElement()));

  // Setup date picker.
  var date_el = goog.dom.getElementByClass(goog.getCssName('game-date-picker'),
      this.getElement());
  this.addChild(this.datePicker_);
  this.datePicker_.setPopupParentElement(date_el.parentElement);
  this.datePicker_.decorate(date_el);

  // Setup time input label
  this.addChild(this.gameTimeInput_);
  this.gameTimeInput_.decorate(goog.dom.getElementByClass(goog.getCssName(
    'game-time'), this.getElement()));

  // Setup save button
  this.addChild(this.saveBtn_);
  this.saveBtn_.decorate(goog.dom.getElementByClass(goog.getCssName(
    'text-button'), el));
  this.getHandler().listenOnce(this.saveBtn_,
    goog.ui.Component.EventType.ACTION, this.saveGame_);

  // Setup slider
  this.addChild(this.speedSlider_);
  this.speedSlider_.decorate(goog.dom.getElementByClass(goog.getCssName(
    'goog-slider'), this.getElement()));
  // Work around the inability of the slider to detect the update before it is
  // entered document.
  setTimeout(goog.bind(function() {
    this.speedSlider_.setValue(goog.array.indexOf(
      spo.ui.GameDetails.Speeds, this.getModel().getProp(
      spo.ds.Game.Property.SPEED)));
  }, this), 100);
  this.getHandler().listen(this.speedSlider_,
    goog.ui.Component.EventType.CHANGE, function() {
      this.minutesElement_.innerHTML = this.speedToDays_(
        spo.ui.GameDetails.Speeds[this.speedSlider_.getValue()]);
    });

  this.minutesElement_ = goog.dom.getElementByClass(goog.getCssName(
    'in-minutes'), this.getElement());
};

/**
 * Private method to call on save button activation. It disables the components
 * and sends request to the server. The response is checked for errors only, if
 * the request succeeds an update should be received via websocket and the
 * control should catch the update event and close this edit view.
 * FIXME: if the save is successfull, but nothing changed the UPDATE event will
 * not fire in the DS, thus this view will not close. Add cancel button.
 *
 * @private
 */
spo.ui.GameEdit.prototype.saveGame_ = function() {
  var time = this.gameTimeInput_.getValue();
  var date = this.datePicker_.getInputValue();
  var start_date = new Date(date + ' ' + time);
  if (start_date.toString() == 'Invalid Date') {
    this.setNotification('The date/time of the game start is invalid.');
    return;
  }
  this.used_ = true;
  this.saveBtn_.setEnabled(false);
  this.saveBtn_.setValue('Saving');
  this.ta_.setEnabled(false);
  this.speedSlider_.setEnabled(false);
  this.gameTimeInput_.setEnabled(false);
  this.datePicker_.getElement().disabled = true;
  var desc = this.ta_.getValue();
  //var data = this.getModel().getRawData();
  //data[spo.ds.Game.Property.DESCRIPTION] = desc;
  spo.ds.Resource.getInstance().get({
    'url': '/game/update/' + this.getModel().getId(),
    'data': {
      'speed': spo.ui.GameDetails.Speeds[this.speedSlider_.getValue()],
      'game_started_date': +(start_date),
      'description': desc
    }
  }, goog.bind(this.onServerResponse_, this));
};

/**
 * Handle the server response for update.
 * @param  {*} resp The server response object.
 * @private
 */
spo.ui.GameEdit.prototype.onServerResponse_ = function(resp) {
  if (resp['status'] != 'ok') {
    this.setNotification('Server error: ' + resp['error']);
  }
};


/**
 * @inheritDoc
 */
spo.ui.GameEdit.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  delete this.notificationArea_;
  delete this.used_;
  delete this.ta_;
  delete this.saveBtn_;
  delete this.speedSlider_;
  delete this.gameTimeInput_;
  delete this.datePicker_;
};

/**
 * Helper function, just focus the text area for now.
 */
spo.ui.GameEdit.prototype.focusFirstElement = function() {
  this.ta_.getElement().focus();
};
