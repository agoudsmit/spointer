goog.provide('spo.ui.GameHeader');
goog.require('spo.ui.Header');

/**
 * @constructor
 * @extends {spo.ui.Header}
 */
spo.ui.GameHeader = function() {
  goog.base(this);
};
goog.inherits(spo.ui.GameHeader, spo.ui.Header);

goog.addSingletonGetter(spo.ui.GameHeader);
