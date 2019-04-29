var EventTarget = require("./event/EventTarget");
var inherit = require("./utils");
var _cachedArray = new Array(16);

function Node() {
  this.parent = null;
  this.children = null;
  this._cacheNodes = null;

  this.init();
}

inherit(Node, EventTarget, {
  on(...arg) {
    this._bubblingListeners && this._bubblingListeners.on(...arg);
  },

  off(...arg) {
    this._bubblingListeners && this._bubblingListeners.off(...arg);
  },

  emit(...arg) {
      this._bubblingListeners && this._bubblingListeners.emit(...arg);
  },

  dispatch(e) {
    this._doDispatchEvent(this, e);
    _cachedArray.length = 0;
  },

  init() {
    this._bubblingListeners = new EventTarget();
    this._capturingListeners = new EventTarget();
    this.children = [];
    this._cacheNodes = [];
  },

  destroy() {
    this._bubblingListeners = null;
    this._capturingListeners = null;
    this.parent = null;
    this.children = null;
    this._cacheNodes = null;
  },

  setParent(node) {
    this.parent = node;
  },

  getParent() {
    return this.parent;
  },

  _getCaptureTargets() {
    var parent = this.parent;
    while (parent) {
      if (
        parent._capturingListeners &&
        parent._capturingListeners.hasEventListener(type)
      ) {
        array.push(parent);
      }
      parent = parent.parent;
    }
  },

  _getBubblingTargets() {
    var parent = this.parent;
    while (parent) {
      if (
        parent._bubblingListeners &&
        parent._bubblingListeners.hasEventListener(type)
      ) {
        array.push(parent);
      }
      parent = parent.parent;
    }
  },

  getParents(node) {
    let a = [];
  },

  hasCaptureListener() {
    return this._capturingListeners.length >= 1;
  },

  hasBubbleListener() {
    return this._bubblingListeners.length >= 1;
  },

  _doDispatchEvent(owner, event) {
    var target, i;
    event.target = owner;

    _cachedArray.length = 0;
    owner._getCapturingTargets(event.type, _cachedArray);
    event.eventPhase = 1;
    for (i = _cachedArray.length - 1; i >= 0; --i) {
      target = _cachedArray[i];
      if (target._capturingListeners) {
        event.currentTarget = target;
        target._capturingListeners.emit(event.type, event, _cachedArray);
        if (event._propagationStopped) {
          _cachedArray.length = 0;
          return;
        }
      }
    }
    _cachedArray.length = 0;

    event.eventPhase = 2;
    event.currentTarget = owner;
    if (owner._capturingListeners) {
      owner._capturingListeners.emit(event.type, event);
    }
    if (!event._propagationImmediateStopped && owner._bubblingListeners) {
      owner._bubblingListeners.emit(event.type, event);
    }

    if (!event._propagationStopped && event.bubbles) {
      owner._getBubblingTargets(event.type, _cachedArray);
      event.eventPhase = 3;
      for (i = 0; i < _cachedArray.length; ++i) {
        target = _cachedArray[i];
        if (target._bubblingListeners) {
          event.currentTarget = target;
          target._bubblingListeners.emit(event.type, event);
          if (event._propagationStopped) {
            _cachedArray.length = 0;
            return;
          }
        }
      }
    }
    _cachedArray.length = 0;
  }
});
