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
  var blockLayer = goog.dom.createDom('div', {
    style: 'position: absolute; z-index:9999; top:0; left:0; width: 100%; height:100%; display:table; background-color: rgba(0,0,0,0.7);'
  });
  blockLayer.innerHTML = '<div style="display: table-cell; vertical-align: middle; margin: auto; color: red; font-size: 40px; text-align: center; width: 100%;">This game is currently disabled</div>';
  blockLayer.style.display =  'none';
  function handleGameDetails(result) {
    console.log(result);
    if (result['status'] == 'ok') {
      var game = result['content'];
      if (gameRecord == null) {
        gameRecord = new spo.ds.Game(game);
        window['GAME'] = gameRecord;
        var clock = new spo.ui.HeaderGameTime();
        clock.setModel(gameRecord);
        header.setClockInstance(clock);
        header.setGameName(gameRecord.getProp(spo.ds.Game.Property.NAME)
          .toString());

        spo.ds.Resource.getInstance().registerResourceHandler('/game/update/' + game['id'],
          function(response) {
            handleGameDetails(response);
          });

        gameArena.setGame(gameRecord);
      } else {
        gameRecord.update(new spo.ds.Game(game));
      }
      if (gameRecord.getProp(spo.ds.Game.Property.STATUS) != 1) {
        blockLayer.style.display = 'table';
      }
    }
  }

  spo.ds.Resource.getInstance().get({
    'url': '/game/details'
  }, handleGameDetails);



  var gameArena = new spo.control.GameArena(
      /** @type {!Element} */ (goog.dom.getElementByClass(
      goog.getCssName('content'), screen)));



  document.body.appendChild(blockLayer);
//  var scrollarea = new pstj.ui.CustomScrollArea();
//  scrollarea.setScrollInsideTheWidget(false);
//  scrollarea.render(goog.dom.getElementByClass(goog.getCssName('content'),
//  screen));

};

game();
