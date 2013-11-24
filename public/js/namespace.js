/*global window: true */
(function (global) {
  "use strict";

  var BIPLANES = typeof global.BIPLANES !== 'undefined'
    ? global.BIPLANES : {};

  BIPLANES.namespace = function (ns_string) {
    var
      parts = ns_string.split('.'),
      parent = BIPLANES,
      i = 0,
      iMax = 0;

    if (parts[0] === 'BIPLANES') {
      parts = parts.slice(1); //remove redundant top level namespace
    }

    for (i = 0, iMax = parts.length; i < iMax; i += 1) {
      if (typeof parent[parts[i]] === 'undefined') {
        //only create new object if part does not yet exist
        parent[parts[i]] = {};
      }
      parent = parent[parts[i]];
    }

    return parent;
  };

  global.BIPLANES = BIPLANES; //make app global

}(window));
