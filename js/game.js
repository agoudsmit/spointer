goog.provide('game');

goog.require('spo.ui.MessageEditor');
goog.require('goog.dom');


game = function() {
  var screen = goog.dom.getElement('screen');

  var edit = new spo.ui.MessageEditor();
  edit.render(screen);
  edit.makeEditField();
};

game();
