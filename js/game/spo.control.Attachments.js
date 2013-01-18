goog.provide('spo.control.Attachments');
goog.provide('spo.control.AttachmentElement');

goog.require('pstj.ui.Templated');
goog.require('goog.array');
goog.require('spo.gametemplate');
goog.require('goog.events.EventType');
goog.require('spo.control.EventType');
goog.require('spo.control.Event');

/**
 * @constructor
 * @extends {pstj.ui.Templated}
 * @param {!string} path The string that is the file name.
 * @param {!number} index The index of the item.
 */
spo.control.AttachmentElement = function(path, index) {
	goog.base(this);
	this.title = path;
	this.index = index;
};
goog.inherits(spo.control.AttachmentElement, pstj.ui.Templated);

goog.scope(function() {
	var proto = spo.control.AttachmentElement.prototype;

	/**
	 * @type {!string}
	 */
	proto.title;

	/**
	 * @type {!number}
	 */
	proto.index;

	/** @inheritDoc */
	proto.getTemplate = function() {
		return spo.gametemplate.AttachmentElement({
			title: this.title
		});
	};
	/** @inheritDoc */
	proto.enterDocument = function() {
		goog.base(this, 'enterDocument');
		this.getHandler().listen(this.getElement(), goog.events.EventType.CLICK, this.handleClick_);
	};

	/**
	 * Handles the click of the user. Filters out clicks on elements that do not
	 * have the click-able class name.
	 *
	 * @param {goog.events.Event} ev The CLICK event from the DOM.
	 *
	 * @private
	 */
	proto.handleClick_ = function(ev) {
		ev.preventDefault();
		ev.stopPropagation();
		if (goog.dom.classes.has(ev.target, goog.getCssName('actionable'))) {
			this.dispatchEvent(spo.control.EventType.CONTROL_ACTION);
		}
	};
});

/**
 * @constructor
 * @extends {pstj.ui.Templated}
 */
spo.control.Attachments = function() {
	goog.base(this);
};
goog.inherits(spo.control.Attachments, pstj.ui.Templated);

goog.scope(function() {
	var proto = spo.control.Attachments.prototype;

	/** @inheritDoc */
	proto.setModel = function(attachments_list)  {
		goog.base(this, 'setModel', attachments_list);
		this.updateUI();
	};

	/**
	 * Pointer to the element to show the title of the attachment div.
	 *
	 * @type {Element}
	 *
	 * @private
	 */
	proto.nadpis_;
	/**
	 * Pointer to the content element.
	 *
	 * @type {Element}
	 *
	 * @private
	 */
	proto.contentElement_;

	/** @inheritDoc */
	proto.getContentElement = function() {
		return this.contentElement_;
	};

	/**
	 * Called when we want to clear everything and draw the objects anew.
	 *
	 * @protected
	 */
	proto.updateUI = function() {
		this.removeChildren(true);
		this.nadpis_.innerHTML = '';
		if (goog.isArray(this.getModel()) && !goog.array.isEmpty(/** @type {Array} */(this.getModel()))) {
			goog.array.forEach(this.getModel(), this.addRemovableItem, this);
			this.nadpis_.innerHTML = 'Attachments';
		}
	};

	/** @inheritDoc */
	proto.getTemplate = function() {
		return spo.gametemplate.Attachments({});
	};

	/**
	 * Add a new child widget that is able to trigger control actions.
	 *
	 * @param {!string} path The button description.
	 * @param {!number} index The index of the item.
	 *
	 * @protected
	 */
	proto.addRemovableItem = function(path, index) {
		var title = path.replace(/\\/g,'/').replace( /.*\//, '' );
		this.addChild(new spo.control.AttachmentElement(title, index), true);
	};

	/** @inheritDoc */
	proto.decorateInternal = function(el) {
		goog.base(this, 'decorateInternal', el);
		this.nadpis_ = this.getEls(goog.getCssName('a-title'));
		this.contentElement_ = this.getEls(goog.getCssName('content-element'));
	};

	/** @inheritDoc */
	proto.enterDocument = function() {
		goog.base(this, 'enterDocument');
		this.getHandler().listen(this, spo.control.EventType.CONTROL_ACTION, this.deleteAttachment);
	};

	/**
	 * Handles the delete request from a child. It will remove the entry from
	 * the list of attachments using the index.
	 *
	 * @param {goog.events.Event} ev The action event. We will use simple event
	 * because we do not need data.
	 */
	proto.deleteAttachment = function(ev) {
		console.log('Handle update level attachment')
		goog.array.removeAt(this.getModel(), ev.target.index);
		this.updateUI();
	};
});
