// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"vdom/createElement.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default(tagName) {
  var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  return Object.assign(Object.create(null), {
    tagName: tagName,
    props: props,
    children: children
  });
};

exports.default = _default;
},{}],"utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.partial = exports.pipe = void 0;

var _pipe = function _pipe(f, g) {
  return function () {
    return g(f.apply(void 0, arguments));
  };
};

var pipe = function pipe() {
  for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  return fns.reduce(_pipe);
};

exports.pipe = pipe;

var partial = function partial(fn) {
  for (var _len2 = arguments.length, presetArgs = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    presetArgs[_key2 - 1] = arguments[_key2];
  }

  return function () {
    for (var _len3 = arguments.length, laterArgs = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      laterArgs[_key3] = arguments[_key3];
    }

    return fn.apply(void 0, presetArgs.concat(laterArgs));
  };
};

exports.partial = partial;
},{}],"vdom/render.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("../utils");

var createNode = function createNode(tagName) {
  return document.createElement(tagName);
};

var setAttribute = function setAttribute(props, $el, prop) {
  $el.setAttribute(prop, props[prop]);
  return $el;
};

var addPropsToNode = function addPropsToNode(props, $node) {
  return Object.keys(props).reduce((0, _utils.partial)(setAttribute, props), $node);
};

var appendChild = function appendChild($domNode, child) {
  $domNode.appendChild(render(child));
  return $domNode;
};

var appendChildrenToNode = function appendChildrenToNode(children, $node) {
  return children.reduce(appendChild, $node);
};

var renderElement = function renderElement(_ref) {
  var tagName = _ref.tagName,
      props = _ref.props,
      children = _ref.children;
  return (0, _utils.pipe)(createNode, (0, _utils.partial)(addPropsToNode, props), (0, _utils.partial)(appendChildrenToNode, children))(tagName);
};

var render = function render(vNode) {
  return typeof vNode === 'string' ? document.createTextNode(vNode) : renderElement(vNode);
};

var _default = render;
exports.default = _default;
},{"../utils":"utils.js"}],"vdom/mount.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default($node, $target) {
  $target.replaceWith($node);
  return $node;
};

exports.default = _default;
},{}],"vdom/diff.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("../utils");

var _render = _interopRequireDefault(require("./render"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var setAttribute = function setAttribute(prop, propValue, $node) {
  $node.setAttribute(prop, propValue);
  return $node;
};

var getSetters = function getSetters(nextProps, setters, prop) {
  setters.push((0, _utils.partial)(setAttribute, prop, nextProps[prop]));
  return setters;
};

var getPropSetters = function getPropSetters(nextProps) {
  return Object.keys(nextProps).reduce((0, _utils.partial)(getSetters, nextProps), []);
};

var unsetAttribute = function unsetAttribute(prop, $node) {
  $node.removeAttribute(prop);
  return $node;
};

var getUnsetters = function getUnsetters(nextProps, patches, prop) {
  if (!prop in nextProps) {
    patches.push((0, _utils.partial)(unsetAttribute, prop));
  }

  return patches;
};

var getPropUnsetters = function getPropUnsetters(nextProps, prevProps) {
  return Object.keys(prevProps).reduce((0, _utils.partial)(getUnsetters, nextProps), []);
};

var patchProps = function patchProps(patches, $node) {
  return patches.reduce(function ($node, patch) {
    var $patched = patch($node);
    return $patched;
  }, $node);
};

var diffProps = function diffProps(prevProps, nextProps) {
  var patches = [].concat(_toConsumableArray(getPropSetters(nextProps)), _toConsumableArray(getPropUnsetters(nextProps, prevProps)));
  return (0, _utils.partial)(patchProps, patches);
};

var getPatches = function getPatches(newChildren, patches, oldChild, i) {
  patches.push(diff(oldChild, newChildren[i]));
  return patches;
};

var getChildPatches = function getChildPatches(oldChildren, newChildren) {
  return oldChildren.reduce((0, _utils.partial)(getPatches, newChildren), []);
};

var zip = function zip(childPatches, childNodes) {
  return childPatches.reduce(function (zipped, patch, index) {
    zipped.push([patch, childNodes[index]]);
    return zipped;
  }, []);
};

var updateDom = function updateDom(childPatches, additionalPatches, $parent) {
  var patches = zip(childPatches, $parent.childNodes);
  patches.map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        patch = _ref2[0],
        $child = _ref2[1];

    return patch($child);
  });
  additionalPatches.map(function (patch) {
    return patch($parent);
  });
  return $parent;
};

var appendChild = function appendChild(newChild, $node) {
  $node.appendChild((0, _render.default)(newChild));
  return $node;
};

var getAddition = function getAddition(patches, newChild) {
  patches.push((0, _utils.partial)(appendChild, newChild));
  return patches;
};

var getAdditionPatches = function getAdditionPatches(oldVChildren, newVChildren) {
  return newVChildren.slice(oldVChildren.length).reduce((0, _utils.partial)(getAddition), []);
};

var diffChildren = function diffChildren(oldVChildren, newVChildren) {
  var childPatches = getChildPatches(oldVChildren, newVChildren);
  var additionPatches = getAdditionPatches(oldVChildren, newVChildren);
  return (0, _utils.partial)(updateDom, childPatches, additionPatches);
};

var removeNode = function removeNode($node) {
  $node.remove();
  return undefined;
};

var replaceNode = function replaceNode(newVTree, $node) {
  var $newNode = (0, _render.default)(newVTree);
  $node.replaceWith($newNode);
  return $newNode;
};

var passThrough = function passThrough($node) {
  return $node;
};

var patchNode = function patchNode(oldVTree, newVTree, $node) {
  var patchProps = diffProps(oldVTree.props, newVTree.props);
  var patchChildren = diffChildren(oldVTree.children, newVTree.children);
  return (0, _utils.pipe)(patchProps, patchChildren)($node);
};

var diff = function diff(oldVTree, newVTree) {
  var patch;

  if (!patch && typeof newVTree === 'undefined') {
    patch = removeNode;
  }

  if (!patch && (typeof oldVTree === 'string' || typeof newVTree === 'string')) {
    if (oldVTree !== newVTree) {
      patch = (0, _utils.partial)(replaceNode, newVTree);
    } else {
      patch = passThrough;
    }
  }

  if (!patch && oldVTree.tagName !== newVTree.tagName) {
    patch = (0, _utils.partial)(replaceNode, newVTree);
  }

  if (!patch) {
    patch = (0, _utils.partial)(patchNode, oldVTree, newVTree);
  }

  return patch;
};

var _default = diff;
exports.default = _default;
},{"../utils":"utils.js","./render":"vdom/render.js"}],"main.js":[function(require,module,exports) {
"use strict";

var _createElement = _interopRequireDefault(require("./vdom/createElement"));

var _render = _interopRequireDefault(require("./vdom/render"));

var _mount = _interopRequireDefault(require("./vdom/mount"));

var _diff = _interopRequireDefault(require("./vdom/diff"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var createVApp = function createVApp(count) {
  return _createElement.default.apply(void 0, ['div', {
    id: 'app',
    dataCount: count
  }, 'The current count is: ', String(count)].concat(_toConsumableArray(Array.from({
    length: count
  }, function () {
    return (0, _createElement.default)('img', {
      src: 'https://media.giphy.com/media/cuPm4p4pClZVC/giphy.gif'
    });
  }))));
};

var vApp = createVApp(0);
var $app = (0, _render.default)(vApp);
var $rootEl = (0, _mount.default)($app, document.getElementById('app'));
setInterval(function () {
  var n = Math.floor(Math.random() * 10);
  var vNewApp = createVApp(n);
  var patch = (0, _diff.default)(vApp, vNewApp); // we might replace the whole $rootEl,
  // so we want the patch will return the new $rootEl

  $rootEl = patch($rootEl);
  vApp = vNewApp;
}, 1000);
},{"./vdom/createElement":"vdom/createElement.js","./vdom/render":"vdom/render.js","./vdom/mount":"vdom/mount.js","./vdom/diff":"vdom/diff.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "36831" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.js"], null)
//# sourceMappingURL=/main.1f19ae8e.js.map