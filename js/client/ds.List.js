goog.provide('spo.ds.List');

goog.require('pstj.ds.List');

/**
 * List that is linked by its ID.
 *
 * @constructor
 * @extends {pstj.ds.List}
 * @param {pstj.ds.RecordID} id The ID to link to.
 */
spo.ds.List = function(id) {
  goog.base(this);
  this.id_ = id;
};

/**
 * The ID of the list.
 *
 * @type {pstj.ds.RecordID}
 * @private
 */
spo.ds.List.prototype.id_;

/**
 * @inheritDoc
 */
spo.ds.List.prototype.disposeInternal = function() {
  delete this.id_;
  goog.base(this, 'disposeInternal');
};

/**
 * Provides data loading into the list.
 *
 * @param {*} content The response content data from the server.
 */
spo.ds.List.prototype.loadData = goog.abstractMethod;

/**
 * The query that the server will understand to return content data.
 *
 * @return {*} Object with an URL and data if needed.
 */
spo.ds.List.prototype.getQuery = goog.abstractMethod;
