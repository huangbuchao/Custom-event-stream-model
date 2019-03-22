var EventTarget = require("./event/EventTarget");

function Node() {
  this._bubbleListener = null;
  this._captureListener = null;
}

Node.prototype = {
  constructor: Node,

  dispatch: function() {},

  init: function() {},

  destroy: function() {},

  getCaptureTargets: function() {},

  getBubblingTargets: function() {}
};
