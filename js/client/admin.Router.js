/**
 * @fileoverview Provides the global access to the admin panel router.
 * This file only provides globally accessible router, i.e. the router
 * is transformed into a singleton.
 */
goog.provide('spo.admin.Router');

goog.require('pstj.mvc.SimpleRouter');

/**
 * Provides the default admin router.
 *
 * @constructor
 * @extends {pstj.mvc.SimpleRouter}
 */
spo.admin.Router = function() {
  goog.base(this);
};
goog.inherits(spo.admin.Router, pstj.mvc.SimpleRouter);
goog.addSingletonGetter(spo.admin.Router);
