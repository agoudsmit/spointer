/**
 * @fileoverview List abstraction that has static method 'get' that returns
 * deferred object. The controllers that want to use the list should use
 * addCallback to the returned object to allow them to be sure that the data
 * is actually available for when it is needed.
 * Deferred are chosen also because some controllers might need access to more
 * than one list structure and it is easier to combine those.
 */
goog.provide('spo.ds.GameList');

goog.require('goog.async.Deferred');
goog.require('pstj.ds.List');
goog.require('spo.ds.Game');
goog.require('spo.ds.Resource');

/**
 * Provides the game list infrastructure.
 *
 * @constructor
 * @extends {pstj.ds.List}
 */
spo.ds.GameList = function() {
  goog.base(this);
  this.query_ = {
    'url': '/games'
  };
};
goog.inherits(spo.ds.GameList, pstj.ds.List);

/**
 * Load the data from server. The methods expects the content part of
 * the reply.
 *
 * @param  {Array} content The content list.
 */
spo.ds.GameList.prototype.loadData = function(content) {
  var games = content['games'];

  for (var i = 0, len = games.length; i < len; i++) {
    this.addFromRawData_(games[i]);
  }

  // Register for new games.
  spo.ds.Resource.getInstance().registerResourceHandler('/game/create',
    goog.bind(function(response) {
      console.log('Adds new game in the beginning', response);
      this.addFromRawData_(response['content'], true);
    }, this));

  // Register for updated games
  spo.ds.Resource.getInstance().registerResourceHandler('/game/update/:id',
    goog.bind(function(response) {
      console.log('update game in place.', response);
      this.update(new spo.ds.Game(response['content']));
    }, this));

  // Register for game removes.
  spo.ds.Resource.getInstance().registerResourceHandler('/game/remove/:id',
    goog.bind(function(resp) {
      console.log('Removing game in place.', resp);
      this.deleteNode(resp['content']['id']);
    }, this));

  // Resolve the deferred now that we have the data.
  spo.ds.GameList.deferred_.callback(this);

};

/**
 * Helper function that adds a new record item from data chunk/raw data.
 *
 * @param {*} chunk The raw data chunk.
 * @param {boolean=} reverse If the addition should happen in the beginning of
 *                           the list.
 * @private
 */
spo.ds.GameList.prototype.addFromRawData_ = function(chunk, reverse) {
  this.add(new spo.ds.Game(chunk), (reverse == true));
};

/**
 * Getter for the query params.
 *
 * @return {*} The query object to use to load the list.
 */
spo.ds.GameList.prototype.getQuery = function() {
  return this.query_;
};

/**
 * The deferred object that the static method will always return.
 *
 * @type {goog.async.Deferred}
 * @private
 */
spo.ds.GameList.deferred_ = new goog.async.Deferred();

/**
 * The list instance, that will be returned on the deferened addCallback fn.
 *
 * @type {spo.ds.GameList}
 * @private
 */
spo.ds.GameList.instance_ = null;

/**
 * Initialize the data store by populating it.
 *
 * @private
 */
spo.ds.GameList.init_ = function() {
  if (!spo.ds.GameList.instance_) {
    spo.ds.GameList.instance_ = new spo.ds.GameList();
    spo.ds.Resource.getInstance().get(spo.ds.GameList.instance_.getQuery(),
      function(response) {
        if (response['status'] != 'ok') {
          spo.ds.GameList.deferred_.errback();
        } else {
          spo.ds.GameList.instance_.loadData(response['content']);
        }
      });
  }
};

/**
 * The static method to obtain the list.
 * It returns a deferred object and the consumers should add listeners to it.
 * For more information see goog.async.Deferred.
 *
 * @return {goog.async.Deferred} The deferred object to add listeners to.
 */
spo.ds.GameList.getList = function() {
  if (!spo.ds.GameList.instance_) {
    spo.ds.GameList.init_();
  }
  return spo.ds.GameList.deferred_;
};
