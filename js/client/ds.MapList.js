goog.provide('spo.ds.MapList');

goog.require('goog.async.Deferred');
goog.require('spo.ds.Resource');

/**
 * Unified Map List.
 *
 * @constructor
 * @param {function(new:pstj.ds.List): undefined} listConstructor Constructor
 *                                                that returns
 *                                                instance of list.
 * @param {function(new:pstj.ds.ListItem): undefined} listItemConstructor The
 *                                                    constructor for the list
 *                                                    item.
 * @param {string} contetx_prefix The prefixed namespace to look for the data
 *                                when processing a reply.
 */
spo.ds.MapList = function(listConstructor, listItemConstructor, content_prefix) {
  this.lconstructor_ = listConstructor;
  this.listItemConstructor_ = listItemConstructor;
  this.contentLoadPrefix_ = content_prefix;
  this.dmap_ = {};
  this.lmap_ = {};
  this.setupPrefixes();
};

/**
 * Subscribe for the updates on this list.
 *
 * @protected
 */
spo.ds.MapList.prototype.setupPrefixes = function() {
  var prefix = this.lconstructor_.path;

  // Auto subscribe for updates from server.
  if (goog.isString(prefix)) {
    spo.ds.Resource.getInstance().registerResourceHandler(prefix + '/create',
      function(response) {
        var content = response['content'];
        // Obtain reference to the ID of the holding list (i,e when it is
        // a team list the game_id path will be used to retrieve which list
        // to update with a new item)
        var uid = content[this.contentLoadPrefix_];
        if (this.hasList(uid)) {
          this.lmap_[uid].add(this.listItemConstructor_(content),
            true);
        }
      });

    spo.ds.Resource.getInstance().registerResourceHandler(prefix +
      '/update/:id', function(response, fragment, uid) {
        uid = +uid;
        for (var list in this.lmap_) {
          if (list.getById(uid) != null) {
            list.update(new this.listItemConstructor_(response['content']));
            return;
          }
        }
      });

    spo.ds.Resource.getInstance().registerResourceHandler(prefix +
      '/remove/:id', function(response, fragment, uid) {
        uid = +uid;
        for (var list in this.lmap_) {
          if (list.getById(uid) != null) {
            list.deleteNode(uid);
            return;
          }
        }
      });
  }
};

/**
 * Handles the responses to the get instructions.
 *
 * @private
 * @param  {pstj.ds.RecordID} uid The ID of the record that was requested.
 * @param  {*} response The response from the server.
 */
spo.ds.MapList.prototype.handleListResponse_ = function(uid, response) {
  if (response['status'] != 'ok') {
    this.dmap_[uid].errback(/** error? */);
  } else {
    this.lmap_[uid].loadData(response['content']);
    this.dmap_[uid].callback(this.lmap_[uid]);
  }
};

/**
 * Gets the list corresponding to a RecordID.
 *
 * @param  {pstj.ds.RecordID} uid The record ID to match a list against.
 * @return {!goog.async.Deferred} The deferred that will eventually provide the
 *                                    list.
 */
spo.ds.MapList.prototype.getList = function(uid) {
  if (!this.dmap_[uid]) {
    this.dmap_[uid] = new goog.async.Deferred();
    this.lmap_[uid] = new this.lconstructor_(uid);
    spo.ds.Resource.getInstance().get(this.lmap_[uid].getQuery(),
      goog.bind(this.handleListResponse_, this, uid));
  }
  return this.dmap_[uid];
};

/**
 * Checks if a record with this id was previourly requested.
 *
 * @param  {pstj.dsRecordID}  uid The record ID to check against.
 * @return {boolean} True if the mem cache knowns about the ID.
 */
spo.ds.MapList.prototype.hasList = function(uid) {
  return !!this.dmap_[uid];
};

/**
 * Remove references to a list matching the provided id.
 *
 * @param  {pstj.ds.RecordID} uid The ID to look for.
 */
spo.ds.MapList.prototype.teadDown = function(uid) {
  if (this.dmap_[uid]) {
    this.dmap_[uid].cancel();
    delete this.dmap_[uid];
    goog.dispose(this.lmap_[uid]);
    delete this.lmap_[uid];
  }
};

/**
 * Helper function for deep cleaning...
 * Do not use for user code.
 *
 * @param  {pstj.ds.RecordID} uid The ID of the the List to get.
 * @return {pstj.ds.List} The list. Note that it might be empty!
 */
spo.ds.MapList.prototype.getDirect = function(uid) {
  if (this.hasList(uid)) return this.lmap_[uid];
  return null;
};

/**
 * Cancel a deferred if it exists.
 *
 * @param  {pstj.ds.RecordID} uid The ID to match the deferred to.
 */
spo.ds.MapList.prototype.cancel = function(uid) {
  if (this.dmap_[uid]) this.dmap_[uid].cancel();
};
