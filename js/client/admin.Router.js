goog.provide('spo.admin.Router');

goog.require('pstj.mvc.SimpleRouter');

spo.admin.Router = function() {
  goog.base(this);
};
goog.inherits(spo.admin.Router, pstj.mvc.SimpleRouter);

goog.addSingletonGetter(spo.admin.Router);
