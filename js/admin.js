goog.provide('admin');

goog.require('spo.template');
goog.require('spo.ui.Header');
goog.require('goog.dom');
goog.require('spo.ds.Resource');
goog.require('pstj.ui.ScrollList');


admin = function() {
  var screen = goog.dom.getElement('screen');
  screen.innerHTML = spo.template.admin();

  var header = new spo.ui.Header();
  var header_element = goog.dom.getElementByClass(goog.getCssName('header'),
    screen);
  header.decorate(header_element);
  header.setGameName('Laiden');
  header.setViewName('dashboard');


  var RM = spo.ds.Resource.getInstance();
  RM.get({'url':'/games'}, function(result) {
    console.log(result);
  });

  var scrollList = new pstj.ui.ScrollList(125);
  var content = goog.dom.getElementByClass(goog.getCssName('content'), screen);
  scrollList.render(content);
};

//window.onload =
admin();
