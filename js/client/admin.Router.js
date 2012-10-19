goog.provide('spo.admin.Router');

goog.require('pstj.mvc.SimpleRouter');

/**
 * Provides the default admin router
 * @constructor
 * @extends {pstj.mvc.SimpleRouter}
 */
spo.admin.Router = function() {
  goog.base(this);
};
goog.inherits(spo.admin.Router, pstj.mvc.SimpleRouter);

goog.addSingletonGetter(spo.admin.Router);
