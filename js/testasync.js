goog.provide('deftest')
goog.require('goog.async.Deferred');

function Obj () {
  this.data = null;
  this.loaded = false;
};

var Test = {
  instance: null,
  get_: function(query, cb) {
    setTimeout(function() {
      cb({'test': 1});
    }, 1000);
  },
  deferred: new goog.async.Deferred(),
  init: function() {
    if (this.instance == null) {
      this.instance = new Obj();
      this.get_('a', goog.bind(function(data) {
        this.instance.data = data;
        this.instance.loaded = true;
        this.deferred.callback(this.instance);
      }, this));
    }
  },
  get(fn) {
    this.deferred.addCallback(fn)
  }
};
