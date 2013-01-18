goog.provide('spo.control.Dialog');

goog.require('goog.ui.Dialog');
goog.require('goog.ui.Dialog.ButtonSet');

/**
 * @fileoverview Provides a reusable dialog for confirmation on game deletion. The instance is
 * designed to be shared across the games. Each invocation should provide a callback with
 * the show request. If callback is not provided the affirmative answer to the dialog will be ignored.
 */


/**
 * Custom dialogue for the admin area.
 * @constructor
 * @extends {goog.ui.Dialog}
 */
spo.control.Dialog = function() {
	goog.base(this);
  this.setContent(goog.global['DELETE_CONFIRMATION'] || 'Once the game is deleted it will no longer be available.<br>Are you sure you want to delete the game?');
  this.setTitle(goog.global['DELETE_TITLE'] || 'Confirm deletion');
  this.setButtonSet(goog.ui.Dialog.ButtonSet.createOkCancel());
  this.getHandler().listen(this, goog.ui.Dialog.EventType.SELECT, this.onSelect_);
};
goog.inherits(spo.control.Dialog, goog.ui.Dialog);
goog.addSingletonGetter(spo.control.Dialog);

/**
 * @type {?function(): void}
 * @private
 */
spo.control.Dialog.prototype.okHandler_;

/**
 * Named show method.
 *
 * @param {?function():void} callback The call back to execute when the
 * OK is pressed.
 *
 * @public
 */
spo.control.Dialog.prototype.showDialog = function(callback) {
	this.okHandler_ = callback;
	this.setVisible(true);
};

/**
 * Handles the selection in the dialog.
 *
 * @param {goog.ui.Dialog.Event} ev The select event.
 *
 * @private
 */
spo.control.Dialog.prototype.onSelect_ = function(ev) {
	if (ev.key == 'ok' && goog.isFunction(this.okHandler_)) {
		this.okHandler_();
	}
	this.okHandler_ = null;
};
