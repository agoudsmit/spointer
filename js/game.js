goog.provide('game');

//goog.require('spo.control.MailBoxList');
goog.require('goog.dom');
goog.require('spo.gametemplate');
//goog.require('pstj.ui.CustomScrollArea');
goog.require('spo.control.GameArena');
goog.require('spo.ui.GameHeader');
goog.require('spo.ds.Resource');
goog.require('spo.ds.Game');
goog.require('spo.ui.HeaderGameTime');
goog.require('spo.ds.STP');

game = function() {


  spo.ds.STP.getInstance().setServerTime(goog.global['SERVER_TIME'] * 1000);

//  var screen = goog.dom.getElement('screen');
//
//  var edit = new spo.ui.MessageEditor();
//  edit.render(screen);
//  edit.makeEditField();
  var screen = /** @type {!Element} */ (goog.dom.getElement('screen'));
  // Setup the static view
  screen.innerHTML = spo.gametemplate.game({});



  var header = spo.ui.GameHeader.getInstance();
  header.decorate(goog.dom.getElementByClass(goog.getCssName('header'),
    screen));

  var gameRecord = null;
  function handleGameDetails(result) {

    if (result['status'] == 'ok') {
      var game = result['content']['content'];
      if (gameRecord == null) {
        gameRecord = new spo.ds.Game(game);
        var clock = new spo.ui.HeaderGameTime();
        clock.setModel(gameRecord);
        header.setClockInstance(clock);
        header.setGameName(gameRecord.getProp(spo.ds.Game.Property.NAME)
          .toString());
      } else {
        gameRecord.update(new spo.ds.Game(game));
      }
    }
  }

  spo.ds.Resource.getInstance().get({
    'url': '/game/details'
  }, handleGameDetails);

  var gameArena = new spo.control.GameArena(
      /** @type {!Element} */ (goog.dom.getElementByClass(
      goog.getCssName('content'), screen)));

//  var scrollarea = new pstj.ui.CustomScrollArea();
//  scrollarea.setScrollInsideTheWidget(false);
//  scrollarea.render(goog.dom.getElementByClass(goog.getCssName('content'),
//  screen));

};

game();
