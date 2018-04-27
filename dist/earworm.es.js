import MediaSorcerer from 'media-sorcerer';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var AudioAnalyser =
/*#__PURE__*/
function () {
  function AudioAnalyser(element, options) {
    _classCallCheck(this, AudioAnalyser);

    var AudioContext = window.AudioContext || window.webkitAudioContext;
    this._audioContext = new AudioContext();
    this._analyser = this._audioContext.createAnalyser(); // Stick the analyser between audio source and destination

    this.audioElement = element;
    this._source = this._audioContext.createMediaElementSource(this.audioElement);

    this._source.connect(this._analyser);

    this._analyser.connect(this._audioContext.destination);

    this._analyser.smoothingTimeConstant = options.smoothingTimeConstant;
    this._analyser.fftSize = options.fftSize;
  }

  _createClass(AudioAnalyser, [{
    key: "_computeThreeBandFrequency",
    value: function _computeThreeBandFrequency(freqByteData) {
      var lowBin = [0, 11];
      var midBin = [11, 22];
      var highBin = [22, 32];
      var threeBand = {
        low: 0,
        mid: 0,
        high: 0
      }; // Get avg low band level

      for (var i = lowBin[0]; i < lowBin[1]; i++) {
        threeBand.low += freqByteData[i];
      }

      threeBand.low /= lowBin[1] - lowBin[0]; // Get avg mid band level

      for (var _i = midBin[0]; _i < midBin[1]; _i++) {
        threeBand.mid += freqByteData[_i];
      }

      threeBand.mid /= midBin[1] - midBin[0]; // Get avg high band level

      for (var _i2 = highBin[0]; _i2 < highBin[1]; _i2++) {
        threeBand.high += freqByteData[_i2];
      }

      threeBand.high /= highBin[1] - highBin[0];
      return threeBand;
    }
  }, {
    key: "_getAverageVolume",
    value: function _getAverageVolume(freqByteData) {
      var average = 0; // get all the frequency amplitudes

      for (var i = 0; i < freqByteData.length; i++) {
        average += freqByteData[i];
      }

      average /= freqByteData.length;
      return average;
    }
  }, {
    key: "audioBaseData",
    get: function get() {
      return {
        currentTime: this.currentTime,
        timeDomain: this.timeDomainByteData,
        allFrequencies: this.freqByteData,
        threeBand: this.threeBandLevels,
        volumeStats: this.volumeStats
      };
    }
  }, {
    key: "currentTime",
    get: function get() {
      return this.audioElement.currentTime;
    }
  }, {
    key: "timeDomainByteData",
    get: function get() {
      var timeDomainByteData = new Uint8Array(this._analyser.fftSize);

      this._analyser.getByteTimeDomainData(timeDomainByteData);

      return timeDomainByteData;
    }
  }, {
    key: "freqByteData",
    get: function get() {
      var freqByteData = new Uint8Array(this._analyser.frequencyBinCount);

      this._analyser.getByteFrequencyData(freqByteData);

      return freqByteData;
    }
  }, {
    key: "threeBandLevels",
    get: function get() {
      return this._computeThreeBandFrequency(this.freqByteData);
    }
  }, {
    key: "volumeStats",
    get: function get() {
      return {
        avgVolume: this._getAverageVolume(this.freqByteData),
        minVolume: this._analyser.minDecibels,
        maxVolume: this._analyser.maxDecibels
      };
    }
  }]);

  return AudioAnalyser;
}();

var MediaSourceEngine =
/*#__PURE__*/
function () {
  function MediaSourceEngine(audioElement) {
    _classCallCheck(this, MediaSourceEngine);

    this._audioEl = audioElement;
    this._files = null; // Setup Sorcerer

    this._sorcerer = new MediaSorcerer(this._audioEl);
  }

  _createClass(MediaSourceEngine, [{
    key: "play",
    value: function play() {
      if (this._audioEl.paused) {
        this._audioEl.play();
      }
    }
    /**
     * Initiates playback and segment addition
     */

  }, {
    key: "initPlayback",
    value: function initPlayback() {
      this.play();

      this._appendSegments();
    }
  }, {
    key: "_appendSegments",
    value: function _appendSegments() {
      var _this = this;

      // For subsequent segments after init
      this._files.slice(1).forEach(function (file) {
        var segment = "../chunk2/".concat(file);

        _this._audioStream.addSegment(segment);

        console.log(_this._sorcerer._buffersForCodec.audio);
      });

      console.log('Done appending');

      this._sorcerer._fireStreamHasEnded();
    }
  }, {
    key: "source",
    set: function set(source) {
      this._files = source;
      this._audioStream = this._sorcerer.addStream('audio/mpeg', "../chunk2/".concat(this._files[0]));
    }
  }, {
    key: "playbackRate",
    get: function get() {
      return this._audioEl.playbackRate;
    },
    set: function set(rate) {
      this._audioEl.playbackRate = rate;
    }
  }, {
    key: "muted",
    get: function get() {
      return this._audio.muted;
    },
    set: function set(isMuted) {
      this._audioEl.muted = isMuted;
    }
  }]);

  return MediaSourceEngine;
}();

var NativeEngine =
/*#__PURE__*/
function () {
  // Native HTML5 audio playback engine
  function NativeEngine(audioElement) {
    _classCallCheck(this, NativeEngine);

    this._audioEl = audioElement;
  }

  _createClass(NativeEngine, [{
    key: "initPlayback",
    value: function initPlayback() {
      this.play();
    }
  }, {
    key: "play",
    value: function play() {
      if (this._audioEl.paused) {
        this._audioEl.play();
      }
    }
  }, {
    key: "pause",
    value: function pause() {
      this._audioEl.pause();
    }
  }, {
    key: "currentTime",
    get: function get() {
      return this._audioEl.currentTime;
    },
    set: function set(time) {
      this._audioEl.currentTime = time;
    }
  }, {
    key: "duration",
    get: function get() {
      return this._audioEl.duration;
    }
  }, {
    key: "source",
    get: function get() {
      return this._audioEl.src;
    },
    set: function set(source) {
      this._audioEl.src = source[0];
    }
  }, {
    key: "playbackRate",
    get: function get() {
      return this._audioEl.playbackRate;
    },
    set: function set(rate) {
      this._audioEl.playbackRate = rate;
    }
  }]);

  return NativeEngine;
}();

var Earworm =
/*#__PURE__*/
function () {
  function Earworm(audioElement, files) {
    _classCallCheck(this, Earworm);

    this._audioEl = audioElement;
    this._files = files;

    if (this._files.length > 1) {
      this.engine = new MediaSourceEngine(this._audioEl);
    }

    if (this._files.length === 1) {
      this.engine = new NativeEngine(this._audioEl);
    } else {
      throw new Error('No file');
    } // Setup Audio Engine


    this.engine.source = this._files; // Setup Analyser

    var options = {
      smoothingTimeConstant: 0.0,
      fftSize: 512
    };
    this.analyser = new AudioAnalyser(this._audioEl, options);
  }
  /**
   * Initiates playback and segment addition
   */


  _createClass(Earworm, [{
    key: "initPlayback",
    value: function initPlayback() {
      this.engine.initPlayback();
    }
  }, {
    key: "playbackRate",
    get: function get() {
      return this.engine.playbackRate;
    },
    set: function set(rate) {
      this.engine.playbackRate = rate;
    }
  }, {
    key: "muted",
    get: function get() {
      return this.engine.muted;
    },
    set: function set(isMuted) {
      this.engine.muted = isMuted;
    }
  }]);

  return Earworm;
}();

export default Earworm;
