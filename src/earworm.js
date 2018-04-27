import AudioAnalyser from './audio-analyser';
import MediaSourceEngine from './engines/mediasource';
import NativeEngine from './engines/native';

class Earworm {
    constructor(audioElement, files) {

        this._audioEl = audioElement;
        this._files = files;

        if (this._files.length > 1) {
            this.engine = new MediaSourceEngine(this._audioEl);
        }

        if (this._files.length === 1) {
            this.engine = new NativeEngine(this._audioEl);
        }

        else {
            throw new Error('No file');
        }
        // Setup Audio Engine

        this.engine.source = this._files;

        // Setup Analyser
        const options = {
            smoothingTimeConstant: 0.0,
            fftSize: 512
        };

        this.analyser = new AudioAnalyser(this._audioEl, options);
    }

    /**
     * Initiates playback and segment addition
     */
    initPlayback() {
        this.engine.initPlayback();
    }

    get playbackRate() {
        return this.engine.playbackRate;
    }

    set playbackRate(rate) {
        this.engine.playbackRate = rate;
    }

    get muted() {
        return this.engine.muted;
    }

    set muted(isMuted) {
        this.engine.muted = isMuted;
    }
}


export default Earworm;
