/**
 * @fileoverview Provides the Mail abstraction. A mail is a data structure that
 * has sender, receiver, status, subject and body. The structure is provided as
 * a wrapper to facilitate getters/setters only and bears no other logic because
 * of the way the data retrieval will work on the server.
 */

goog.provide('spo.ds.mail');

goog.require('pstj.ds.RecordID');
goog.require('pstj.object');


goog.scope(function() {
  var mail = spo.ds.mail;
  var object = pstj.object;
  /**
   * Getter for the ID of the message. It is used to retrieve the id in order to
   * be able to compare the messages after list overlapping.
   *
   * @param {*} mail The mail record (message) to retrieve from.
   * @return {pstj.ds.RecordID} The found message id or null.
   */
  mail.getMessageId = function(mail) {
    if (goog.isDefAndNotNull(mail)) {
      var id = mail['id'];
      if (goog.isDef(id)) return id;
    }
    return null;
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
  mail.doMatch = function(message, message_other) {
    if (mail.getMessageId(message) != mail.getMessageId(message_other)) {
      return false;
    }
    return object.deepEquals(message, message_other);
  };

  /**
   * Iterates over each of the list of currently 'used' messages and
   * compares them to the 'whole' list of messages set by the server. The
   * comparison is supported with an offset (i.e. check from message 10 to 20).
   *
   * @param {!Array.<*>} whole_list The server list.
   * @param {!Array.<*>} partial_list The currently used list subset.
   * @param {number=} offset Optional offset indicating which is the index of
   * the first item in the partial list in the server list.
   * @return {!boolean} True if the lists match. False otherwise.
   */
  mail.subsetMatch = function(whole_list, partial_list, offset) {
    if (!goog.isNumber(offset)) offset = 0;
    var len = partial_list.length;
    var first_index = offset * len;
    // preliminary checks (i.e. optimizing).
    // if the length of the server list is lower than the index partial's last
    // item then there is no change there will be a match.
    if (whole_list.length < first_index + len) return false;
    for (var i = 0; i < len; i++) {
      if (!mail.doMatch(whole_list[offset + i], partial_list[i])) {
        return false;
      }
    }
    return true;
  };
});
