function Event(type, target) {
  this.type = type || null;
  this.target = target || null;
}

Event.prototype = {
  constructor: Event,
  getType: function() {
    return this.type;
  },
  setType: function(type) {
    this.type = type;
  },
  get _count() {
    return this._count;
  },
  set _count(v) {
    this._count += 1;
  }
};

module.exports = Event;
