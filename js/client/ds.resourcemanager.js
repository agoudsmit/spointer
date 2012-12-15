/**
 * @fileoverview provides the data getting abstraction to encode the data
 * in the way that jquery does it and PHP expects it.
 */

goog.provide('spo.ds.Resource');

goog.require('goog.array');
goog.require('goog.json.NativeJsonProcessor');
goog.require('goog.net.XhrIo');

/**
 * This class should only be accessed as instance (getInstance()).
 *
 * @constructor
 */
spo.ds.Resource = function() {};

/**
 * The main url where to send the post requests to.
 *
 * @type {string}
 * @private
 */
spo.ds.Resource.MAIN_URL_ = '/InterACT/dispatcher';

/**
 * The JSON processor to use. Here we use the native one and expect the
 * host to have it. Not tested on IE8.
 *
 * @type {goog.json.Processor}
 * @private
 */
spo.ds.Resource.JSON_PROCESSOR_ = new goog.json.NativeJsonProcessor();

/**
 * A default callback to use when no callback is provided by the user.
 * This is same as if the packet has come from the websocket (preliminary work).
 *
 * @param  {*} response The response from the server. We need a bit of
 *                      processing anyway, because of the possibility of an
 *                      error as we are the sender.
 * @private
 */
spo.ds.Resource.defaultCallback_ = function(response) {
  if (response['status'] == 'ok') {
    var fragment = response['resource'];
    goog.array.forEach(spo.ds.Resource.urlhandlers_, function(url, i) {
      var args = url.exec(fragment);
      if (!args) return;
      goog.array.insertAt(args, response);
      spo.ds.Resource.handlers_[i].apply(null, args);
    });
  }
};

/**
 * List of URLs (fragments of url as in packet) that are known to be listened
 * for by a data structure.
 *
 * @type {Array.<RegExp>}
 * @private
 */
spo.ds.Resource.urlhandlers_ = [];

/**
 * List of handlers/function that are known to match (by index) the listened url
 * from the list of urls.
 *
 * @type {Array.<Function>}
 * @private
 */
spo.ds.Resource.handlers_ = [];

/**
 * If web socket should be used.
 * @type {boolean}
 * @private
 */
spo.ds.Resource.prototype.useWebSocket_ = goog.global['USE_WEB_SOCKS'];
/**
 * Sets the forced used of web socket.
 * @param  {boolean} enable True if it should be enabled.
 */
spo.ds.Resource.prototype.useWebSocket = function(enable) {
  this.useWebSocket_ = enable;
};

/**
 * Register a new websocket resource/route/url with a handler that is interested
 *  in it.
 *
 * @param {!string} url The url / resource to listen for.
 * @param {!function(*): void} handler The hadler of the resource.
 */
spo.ds.Resource.prototype.registerResourceHandler = function(url, handler) {
  var route = new RegExp('^' + goog.string.regExpEscape(url)
    .replace(/\\:\w+/g, '(\\w+)')
    .replace(/\\\*/g, '(.*)')
    .replace(/\\\[/g, '(')
    .replace(/\\\]/g, ')?')
    .replace(/\\\{/g, '(?:')
    .replace(/\\\}/g, ')?') + '$');
  spo.ds.Resource.urlhandlers_.push(route);
  spo.ds.Resource.handlers_.push(handler);
};

/**
 * Gets data from the server. The method is designed to work with single
 * requests only, however the server can handle multiple requests and this
 * implementation is embeding the requests in a query array for this.
 *
 * @param  {*}   data The data structure that the server can proocess.
 * @param  {function(*): void=} cb   The function that will handle the data
 *                             that is returned by the server. Currently the
 *                             server returns an array of responses, we only
 *                             utilize the first one.
 */
spo.ds.Resource.prototype.get = function(data, cb) {
  // Set the time stamp as it is needed on the server but not used anymore
  // data['time_stamp'] = 0;
  var query = {
    'queries': [data]
  };
  this.sendRequest_(query, cb);
};

/**
 * Port from jQuery.
 *
 * @param {!Array.<string>} arr
 * @param {!string} key
 * @param {*} value .
 * @private
 */
spo.ds.Resource.prototype.add_ = function(arr, key, value) {
  value = goog.isFunction(value) ? value() : (
    goog.isNull(value) ? '' : value);
  arr.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
};

/**
 * Port from jquery.
 *
 * @private
 * @param  {!Array.<string>} arr
 * @param  {string} prefix
 * @param  {*} data
 */
spo.ds.Resource.prototype.buildParams_ = function(arr, prefix, data) {
  var name = null;
  if (goog.isArray(data)) {
    goog.array.forEach(/** @type {!Array} */(data), function(el, index) {
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
 * as URL encoded string.
 *
 * @private
 * @param  {*} data Any literal object data.
 * @return {string} The encoded string.
 */
spo.ds.Resource.prototype.encode_ = function(data) {
  var s = [];
  if (goog.isArray(data)) {
    throw Error('Not implemented');
  }
  for (var prefix in data) {
    this.buildParams_(s, prefix, data[prefix]);
  }
  return s.join('&').replace(/%20/g, '+');
};

/**
 * Sends the request using the XHR transport.
 *
 * @param  {*}   query The query data.
 * @param  {function(*): void=} callback The function to call wth the result.
 * @private
 */
spo.ds.Resource.prototype.sendRequest_ = function(query, callback) {
  // TODO: remove this after we know how to query Svilen
  goog.net.XhrIo.send(spo.ds.Resource.MAIN_URL_,
    goog.bind(this.handleResponse_, this, callback), 'POST',
      this.encode_(query));
};

/**
 * Function that handles the response internally because of the wrapping made
 * on the server side to support multiple queries. The response is unwrapped
 * and passed to the original callback.
 *
 * @param {Function} cb The original handler for the data.
 * @param {goog.events.Event} e The goog.net.EventType.COMPLETE event.
 * @private
 */
spo.ds.Resource.prototype.handleResponse_ = function(cb, e) {
  // e.type will be goog.net.EventType.COMPLETE
  var xhr = /** @type {goog.net.XhrIo} */ (e.target);
  var response = spo.ds.Resource.JSON_PROCESSOR_.parse(
    xhr.getResponseText());
  var responseObject = response['response'][0];

  if (responseObject['status'] != 'ok') {
    console.log('Something wrong with response', responseObject);
  }
  // Handle the response if a callback function was provided.
  if (goog.isFunction(cb)) cb(responseObject);
  // If there is a resource - hand over the object to the web socket
  // shim we have here.
  // Remove this once we have a working web socket on the server.
  if (goog.isDefAndNotNull(responseObject['resource'])) {
    if (this.useWebSocket_)
      goog.net.XhrIo.send('/socket', undefined, 'POST', this.encode_({
        'data' : spo.ds.Resource.JSON_PROCESSOR_.stringify(responseObject)
      }));
    else {
      spo.ds.Resource.defaultCallback_(responseObject);
    }
  }
};

/**
 * Shim to work around the lack of ws implementation on the server side
 * as of now, so we instead will pass the packets here.
 *
 * @param {*} packet The server response, should be a string or a literal
 *                   object.
 */
spo.ds.Resource.prototype.wsShim = function(packet) {
  if (goog.isString(packet)) {
    try {
      packet = spo.ds.Resource.JSON_PROCESSOR_.parse(packet);
    } catch (e) {
      console.log('Error in package: ', packet, ' ,done.');
    }
  }
  spo.ds.Resource.defaultCallback_(packet);
};

/**
 * Makes the Resource object globally available.
 */
goog.addSingletonGetter(spo.ds.Resource);

goog.exportSymbol('SocketBridge.process', function(data) {
  spo.ds.Resource.getInstance().wsShim(data);
});;
