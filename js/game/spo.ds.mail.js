/**
 * @fileoverview Provides the Mail abstraction. A mail is a data structure that
 * has sender, receiver, status, subject and body. The structure is provided as
 * a wrapper to facilitate getters/setters only and bears no other logic because
 * of the way the data retrieval will work on the server.
 */

goog.provide('spo.ds.mail');

goog.require('pstj.object');
goog.require('pstj.ds.ListItem');
goog.require('spo.ds.MailList');
goog.require('spo.ds.Resource');

/**
 * Holds reference to all resources matching a mail listing.
 * @type {Object}
 * @private
 */
spo.ds.mail.registry_ = {};

/**
 * Getter for the list of known names on the game.
 * @return {!Array.<string>}
 */
spo.ds.mail.getNames = function() {
  return goog.global['RECIPIENTS'];
};

/**
 * Getter for the ID of the message. It is used to retrieve the id in order to
 * be able to compare the messages after list overlapping.
 *
 * @param {*} mail The mail record (message) to retrieve from.
 * @return {pstj.ds.RecordID} The found message id or null.
 */
spo.ds.mail.getMessageId = function(mail) {
  if (goog.isDefAndNotNull(mail)) {
    var id = mail['id'];
    if (goog.isDef(id)) return id;
  }
  throw Error('No message ID cound be found');
};

/**
 * Provides mechanism to compare two messages. The messages will match
 * if the ID of both is the same and the properties are not changed.
 * TODO: add optimization - remove comparison of properties that are known to
 * not change.
 *
 * @param {*} message Message 1 to compare.
 * @param {*} message_other The other message to use in the comparison.
 * @return {!boolean} True if the messages match. False otherwise.
 */
spo.ds.mail.doMatch = function(message, message_other) {
  if (spo.ds.mail.getMessageId(message) != spo.ds.mail.getMessageId(message_other)) {
    return false;
  }
  // TODO: fix up the compare function!!!
  return pstj.object.deepEquals(message, message_other, function(a, b) {
    if (a['is_read'] != b['is_read']) return false;
    return true ;
  });
};

/**
 * Iterates over each of the list of currently 'used' messages and
 * compares them to the 'whole' list of messages set by the server. The
 * comparison is supported with an offset (i.e. check from message 10 to 20).
 *
 * @param {!Array.<*>} whole_list The server list.
 * @param {!Array.<*>} partial_list The currently used list subset.
 * @return {!boolean} True if the lists match. False otherwise.
 */
spo.ds.mail.subsetMatch = function(whole_list, partial_list) {
  // preliminary checks (i.e. optimizing).
  // if the length of the server list is lower than the index partial's last
  // item then there is no change there will be a match.
  if (whole_list.length != partial_list.length) return false;
  var len = whole_list.length;
  for (var i = 0; i < len; i++) {
    if (!spo.ds.mail.doMatch(whole_list[i], partial_list[i])) {
      return false;
    }
  }
  return true;
};

/**
 * Returns the mail listing data structure matching the resource. If one
 * does not exists it will be created and then returned.
 *
 * @param {!string} resource The mail URL resource to use.
 */
spo.ds.mail.getListing = function(resource) {
  if (!goog.isDef(spo.ds.mail.registry_[resource])) {
    spo.ds.mail.registry_[resource] = new spo.ds.MailList(resource);
    //spo.ds.mail.registry_[resource].update();
  }
  return spo.ds.mail.registry_[resource];
};

/**
 * Checks if a message record is read.
 * @param {*} record The message record.
 * @return {boolean} True if the message is read already.
 */
spo.ds.mail.isRead = function(record) {
  return record['is_read'] == 1;
};

/**
 * Updates the record in place to be marked as read.
 * @param {*} record The message record.
 */
spo.ds.mail.markAsRead = function(record) {
  record['is_read'] = 1;
};

/**
 * Get index of the message if it is contained in this list.
 * @param  {Array.<*>} list The msg list.
 * @param  {*} message message to find.
 * @return {number} The index of the mesasge or -1.
 */
spo.ds.mail.getIndexOfMessage = function(list, message) {
  var id = spo.ds.mail.getMessageId(message);
  for (var i = 0; i < list.length; i++) {
    if (spo.ds.mail.getMessageId(list[i]) == id) return i;
  }
  return -1;
};

/**
 * Retrieves the username by index from the recipient list. If none is found null is returned.
 * @param  {*} record The mail record
 * @param  {number} index  The index to look for.
 * @return {string|null} The username found or null.
 */
spo.ds.mail.getRecipientByIndex = function(record, index) {
  if (goog.isArray(record['to'])) {
    if (index < record['to'].length) {
      var username = record['to'][index];
      if (username != '') return username;
    }
  }
  return null;
};
