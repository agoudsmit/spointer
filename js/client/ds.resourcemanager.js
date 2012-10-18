/**
 * @fileOverview provides the data getting abstraction to encode the data
 * in the way that jquery does it and PHP expects it.
 */

goog.provide('spo.ds.Resource');

goog.require('goog.json.NativeJsonProcessor');
goog.require('goog.net.XhrIo');
goog.require('goog.array');

/**
 * This class should only be accessed as instance (getInstance())
 * @constructor
 */
spo.ds.Resource = function() {};

/**
 * The main url where to send the post requests to.
 * @type {string}
 * @private
 */
spo.ds.Resource.MAIN_URL_ = '/InterACT/dispatcher'

/**
 * The JSON processor to use. Here we use the native one and expect the
 * host to have it. Not etsted on IE8.
 * @type {goog.json.Processor}
 * @private
 */
spo.ds.Resource.JSON_PROCESSOR_ = new goog.json.NativeJsonProcessor();

/**
 * Gets data from the server. The method is designed to work with single
 * requests only, however the server can handle multiple requests and this
 * implementation is embeding the requests in a query array for this.
 * @param  {*}   data The data structure that the server can proocess.
 * @param  {function(*): void} cb   The function that will handle the data
 * that is returned by the server. Currently the server returns an array
 * of responses, we only utilize the first one.
 */
spo.ds.Resource.prototype.get = function(data, cb) {
  // Set the timestamp as it is needed on the server but not used anymore
  data['time_stamp'] = 0;
  var query = {
    'queries': [data]
  };
  this.sendRequest_(query, cb);
};

/**
 * Port from jquery.
 * @param {!Array.<string>} arr
 * @param {!string} key
 * @param {*} value [description]
 * @private
 */
spo.ds.Resource.prototype.add_ = function(arr, key, value) {
  value = goog.isFunction(value) ? value() : (
    goog.isNull(value) ? '' : value);
  arr.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
};

/**
 * Port from jquery.
 * @private
 * @param  {!Array.<strnig>} arr
 * @param  {string} prefix
 * @param  {*} data
 */
spo.ds.Resource.prototype.buildParams_ = function(arr, prefix, data) {
  var name;
  if (goog.isArray(data)) {
    goog.array.forEach(data, function(el, index) {
      if (/\[\]$/.test(prefix)) {
        this.add_(arr, prefix, el);
      } else {
        this.buildParams_(arr, prefix + '[' +
          (typeof el == 'object' ? index : '') + ']', el);
      }
    }, this);
  } else if (goog.isObject(data)) {
    for (name in data) {
      this.buildParams_(arr, prefix + '[' + name + ']', data[name]);
    }
  } else {
    this.add_(arr, prefix, data);
  }
};

/**
 * Encodes Literal object data to PHP understandable multitude of post params
 * as url encoded string.
 * @private
 * @param  {*} data Any literal object data.
 * @return {string} The encoded string.
 */
spo.ds.Resource.prototype.encode_ = function(data) {
  var s = [];
  var prefix;
  if (goog.isArray(data)) {
    throw Error('Not implemented');
  }
  for (prefix in data) {
    this.buildParams_(s, prefix, data[prefix]);
  }
  return s.join('&').replace(/%20/g, '+');
};

/**
 * Sends the request using the XHR transport.
 * @param  {*}   query The query data.
 * @param  {function(*): void} cb    The function to call wth the result.
 * @private
 */
spo.ds.Resource.prototype.sendRequest_ = function(query, cb) {
  // TODO: remove this after we know how to query svilen
  goog.net.XhrIo.send(spo.ds.Resource.MAIN_URL_,
    goog.bind(this.handleResponse_, this, cb), 'POST', this.encode_(query));
};

/**
 * Function that handles the response internally because of the wrapping made
 * on the server side to support multiple queries. The response is unwrapped
 * and passed to the original callback.
 * @param  {function(*): void} cb The original hadnler for the data.
 * @param  {goog.events.Event}   e  The goog.net.EventType.COMPLETE event.
 * @private
 */
spo.ds.Resource.prototype.handleResponse_ = function(cb, e) {
  // e.type will be goog.net.EventType.COMPLETE
  var xhr = /** @type {goog.net.XhrIo} */ (e.target);
  var responseText = xhr.getResponseText();
  var response = spo.ds.Resource.JSON_PROCESSOR_.parse(
    xhr.getResponseText());

  var responseObject = response['response'][0];

  if (responseObject['status'] != 'ok') {
    console.log('Something wrong with response', responseObject);
  }
  /** { content: .., status: "OK"|"FAIL"} */
  cb(responseObject);
};

/**
 * Makes the Resource object globally available.
 */
goog.addSingletonGetter(spo.ds.Resource);
