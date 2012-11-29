goog.provide('spo.ui.MessageEditor');

goog.require('goog.editor.Field');
goog.require('spo.ui.Widget');
goog.require('spo.gametemplate');
goog.require('goog.editor.Command');
goog.require('goog.editor.plugins.BasicTextFormatter');
goog.require('goog.editor.plugins.EnterHandler');
goog.require('goog.editor.plugins.HeaderFormatter');
goog.require('goog.editor.plugins.LinkBubble');
goog.require('goog.editor.plugins.LinkDialogPlugin');
goog.require('goog.editor.plugins.ListTabHandler');
goog.require('goog.editor.plugins.LoremIpsum');
goog.require('goog.editor.plugins.RemoveFormatting');
goog.require('goog.editor.plugins.SpacesTabHandler');
goog.require('goog.editor.plugins.UndoRedo');
goog.require('goog.ui.editor.DefaultToolbar');
goog.require('goog.ui.editor.ToolbarController');

spo.ui.MessageEditor = function() {
  goog.base(this);
};
goog.inherits(spo.ui.MessageEditor, spo.ui.Widget);

goog.scope(function() {
  var dom = goog.dom;
  var proto = spo.ui.MessageEditor.prototype;

  /** @inheritDoc */
  proto.getTemplate = function() {
    return spo.gametemplate.EditorWrapper({id:'msgeditor'});
  };

  proto.hasMadeEditField_ = false;


  proto.makeEditField = function() {
    if (!this.hasMadeEditField_) {
      this.field_ = new goog.editor.Field('newid');
      this.field_.registerPlugin(new goog.editor.plugins.BasicTextFormatter());
      this.field_.registerPlugin(new goog.editor.plugins.RemoveFormatting());
      this.field_.registerPlugin(new goog.editor.plugins.UndoRedo());
      this.buttons_ = [
        goog.editor.Command.BOLD,
        goog.editor.Command.ITALIC,
        goog.editor.Command.UNDERLINE
      ];
      var toolbar = /** @type {!Element} */ (dom.getElementByClass(goog.getCssName(
          'editor-toolbar'), this.getElement()));
      var toolbarControl = goog.ui.editor.DefaultToolbar.makeToolbar(this.buttons_, toolbar);
      var tc = new goog.ui.editor.ToolbarController(this.field_, toolbarControl );
      this.field_.makeEditable();
    }
    this.hasMadeEditField_ = true;
  };
});

goog.addSingletonGetter(spo.ui.MessageEditor);
