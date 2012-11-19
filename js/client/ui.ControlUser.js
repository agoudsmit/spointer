goog.provide('spo.ui.ControlUser');

goog.require('goog.dom');
goog.require('goog.ui.LabelInput');
goog.require('spo.ds.ControlUser');
goog.require('spo.ui.User');
/**
 * @constructor
 * @extends {spo.ui.User}
 */
spo.ui.ControlUser = function() {
  goog.base(this);
};
goog.inherits(spo.ui.ControlUser, spo.ui.User);

goog.scope(function() {
  var proto = spo.ui.ControlUser.prototype;
  var dom = goog.dom;

  /** @inheritDoc */
  proto.createDom = function() {
    this.decorateInternal(
      /** @type {Element} */ (dom.htmlToDocumentFragment(
        spo.template.ControlUser({
          name: this.getModel().getProp(spo.ds.ControlUser.Property.NAME),
          mail: this.getModel().getProp(spo.ds.ControlUser.Property.EMAIL)
        })))
      );
  };
  /** @inheritDoc */
  proto.createValueHolders = function() {
    this.name_ = new goog.ui.LabelInput();
    this.mail_ = new goog.ui.LabelInput();
    this.addChild(this.name_);
    this.addChild(this.mail_);
  };
  /** @inheritDoc */
  proto.decorateValueHolders = function() {
        // Populate values as labeled inputs.
    var values = goog.dom.getElementsByClass(goog.getCssName('form-values'),
      this.getElement());
    this.name_.decorate(values[0]);
    this.mail_.decorate(values[1]);
  };
  /** @inheritDoc */
  proto.setValuesOnValueHolders = function() {
    this.name_.setValue(this.getModel().getProp(
      spo.ds.ControlUser.Property.NAME));
    this.mail_.setValue(this.getModel().getProp(
      spo.ds.ControlUser.Property.EMAIL));
  };
});
