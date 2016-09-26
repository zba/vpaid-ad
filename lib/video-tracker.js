'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var vpaidLifeCycle = require('./vpaid-life-cycle');
var quartiles = [{
  value: 0,
  name: vpaidLifeCycle[0]
}, {
  value: 0.25,
  name: vpaidLifeCycle[1]
}, {
  value: 0.50,
  name: vpaidLifeCycle[2]
}, {
  value: 0.75,
  name: vpaidLifeCycle[3]
}];
function handleTimeupdate() {
  var upcomingQuartileIndex = this.quartileIndexEmitted + 1;
  var upcomingQuartile = quartiles[upcomingQuartileIndex];
  if (upcomingQuartile && this.el.currentTime / this.el.duration > upcomingQuartile.value) {
    this.emit(upcomingQuartile.name);
    this.quartileIndexEmitted = upcomingQuartileIndex;
  }
}

function handleEnded() {
  this.emit(vpaidLifeCycle[4]);
  // Garbage collect event listeners
  this.removeEventListeners();
}

var VideoTracker = function () {
  /**
   * [constructor description]
   * @param  {[type]} el      [description]
   * @param  {TinyEmitter} emitter [description]
   * @return {[type]}         [description]
   */
  function VideoTracker(el, emitter) {
    var prefix = arguments.length <= 2 || arguments[2] === undefined ? 'AdVideo' : arguments[2];

    _classCallCheck(this, VideoTracker);

    this.el = el;
    this.emitter = emitter;
    this.prefix = prefix;
    this.quartileIndexEmitted = -1;
    this.addEventListeners();
  }

  _createClass(VideoTracker, [{
    key: 'emit',
    value: function emit() {
      for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
        rest[_key] = arguments[_key];
      }

      var eventName = this.prefix + rest[0];
      return this.emitter.emit.apply(this.emitter, [eventName].concat(rest.splice(1)));
    }
  }, {
    key: 'addEventListeners',
    value: function addEventListeners() {
      this.el.addEventListener('timeupdate', handleTimeupdate.bind(this));
      this.el.addEventListener('ended', handleEnded.bind(this));
    }
  }, {
    key: 'removeEventListeners',
    value: function removeEventListeners() {
      this.el.removeEventListener('timeupdate', handleTimeupdate);
      this.el.removeEventListener('ended', handleEnded);
    }
  }]);

  return VideoTracker;
}();

module.exports = VideoTracker;