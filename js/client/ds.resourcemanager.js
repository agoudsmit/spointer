goog.provide('spo.ds.Resource');

goog.require('goog.json.NativeJsonProcessor');
goog.require('goog.net.XhrIo');
goog.require('goog.Uri.QueryData');

spo.ds.Resource = function() {

};

goog.scope(function() {

  var proto = spo.ds.Resource.prototype;

  spo.ds.Resource.MAIN_URL_ = '/dispatcher'
  spo.ds.Resource.JSON_PROCESSOR_ = new goog.json.NativeJsonProcessor();
  proto.get = function(data, cb) {
    // Set the timestamp as it is needed on the server but not used anymore
    data['time_stamp'] = 0;

    var query = new goog.Uri.QueryData();
    query.add('queries', spo.ds.Resource.JSON_PROCESSOR_.stringify([data]));
    this.sendRequest_(query, cb);
  };

  proto.sendRequest_ = function(query, cb) {
    console.log(query.toString());
    // TODO: remove this after we know how to query svilen
    return;
    goog.net.XhrIo.send(spo.ds.Resource.MAIN_URL_,
      goog.bind(this.handleResponse_, this, cb), 'POST', query.toString());
  };

  proto.handleResponse_ = function(cb, e) {
    // e.type will be goog.net.EventType.COMPLETE
    var xhr = /** @type {goog.net.XhrIo} */ (e.target);
    var responseText = xhr.getResponseText();
    var response = spo.ds.Resource.JSON_PROCESSOR_.parse(
      xhr.getResponseText());
    var responseObject = response['response'][0];
    if (responseObject['status'] != 'ok') {
      console.log(responseObject);
      throw Error('Something wrong with response?')
    }
    cb(responseObject['content']);
  };

});
goog.addSingletonGetter(spo.ds.Resource);
