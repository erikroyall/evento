// Evento - v1.0.0
// by Erik Royall <erikroyalL@hotmail.com> (http://erikroyall.github.io)
// Public Domain (Unlicense)
 
// Array.prototype.indexOf shim
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
 
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
    'use strict';
    if (this == null) {
      throw new TypeError();
    }
    
    var n, k, t = Object(this)
      , len = t.length >>> 0;
 
    if (len === 0) {
      return -1;
    }
    
    n = 0;
    if (arguments.length > 1) {
      n = Number(arguments[1]);
      if (n != n) { // shortcut for verifying if it's NaN
        n = 0;
      } else if (n != 0 && n != Infinity && n != -Infinity) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }
    if (n >= len) {
      return -1;
    }
    for (k = n >= 0 ? n : Math.max(len - Math.abs(n), 0); k < len; k++) {
      if (k in t && t[k] === searchElement) {
        return k;
      }
    }
    return -1;
  };
}
 
var evento = (function (window) {
  var win = window
    , doc = win.document
    , _handlers = {}
    , addEvent
    , removeEvent
    , triggerEvent;
  
  addEvent = (function () {
    if (typeof doc.addEventListener === "function") {
      return function (el, evt, fn) {
        el.addEventListener(evt, fn, false);
        _handlers[el] = _handlers[el] || {};
        _handlers[el][evt] = _handlers[el][evt] || [];
        _handlers[el][evt].push(fn);

      };
    } else if (typeof doc.attachEvent === "function") {
      return function (el, evt, fn) {
        el.attachEvent(evt, fn);
        _handlers[el] = _handlers[el] || {};
        _handlers[el][evt] = _handlers[el][evt] || [];
        _handlers[el][evt].push(fn);
      };
    } else {
      return function (el, evt, fn) {
        el["on" + evt] = fn;
        _handlers[el] = _handlers[el] || {};
        _handlers[el][evt] = _handlers[el][evt] || [];
        _handlers[el][evt].push(fn);
      };
    }
  }());

  // removeEvent
  removeEvent = (function () {
    if (typeof doc.removeEventListener === "function") {
      return function (el, evt, fn) {
        el.removeEventListener(evt, fn, false);
        Helio.each(_handlers[el][evt], function (fun) {
          if (fun === fn) {
            _handlers[el] = _handlers[el] || {};
            _handlers[el][evt] = _handlers[el][evt] || [];
            _handlers[el][evt][_handlers[el][evt].indexOf(fun)] = undefined;
          }
        });

      };
    } else if (typeof doc.detachEvent === "function") {
      return function (el, evt, fn) {
        el.detachEvent(evt, fn);
        Helio.each(_handlers[el][evt], function (fun) {
          if (fun === fn) {
            _handlers[el] = _handlers[el] || {};
            _handlers[el][evt] = _handlers[el][evt] || [];
            _handlers[el][evt][_handlers[el][evt].indexOf(fun)] = undefined;
          }
        });
      };
    } else {
      return function (el, evt, fn) {
        el["on" + evt] = undefined;
        Helio.each(_handlers[el][evt], function (fun) {
          if (fun === fn) {
            _handlers[el] = _handlers[el] || {};
            _handlers[el][evt] = _handlers[el][evt] || [];
            _handlers[el][evt][_handlers[el][evt].indexOf(fun)] = undefined;
          }
        });
      };
    }
  }());

  // triggerEvent
  triggerEvent = function (el, evt) {
    _handlers[el] = _handlers[el] || {};
    _handlers[el][evt] = _handlers[el][evt] || [];

    for (var _i = 0, _l = _handlers[el][evt].length; _i < _l; _i += 1) {
      _handlers[el][evt][_i]();
    }
  };
  
  return {
    add: addEvent,
    remove: removeEvent,
    trigger: triggerEvent,
    _handlers: _handlers
  };
}(this));
