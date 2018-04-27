class NativeEngine {
    // Native HTML5 audio playback engine
    constructor(audioElement) {
        this._audioEl = audioElement;
    }

    get currentTime() {
        return this._audioEl.currentTime;
    }

    set currentTime(time) {
        this._audioEl.currentTime = time;
    }

    get duration() {
        return this._audioEl.duration;
    }

    get source() {
        return this._audioEl.src;
    }

    set source(source) {
        this._audioEl.src = source[0];
    }

    get playbackRate() {
        return this._audioEl.playbackRate;
    }

    set playbackRate(rate) {
        this._audioEl.playbackRate = rate;
    }

    get muted() {
        return this._audio.muted;
    }

    set muted(isMuted) {
        this._audioEl.muted = isMuted;
    }

    initPlayback() {
        this.play();
    }

    play() {
        if (this._audioEl.paused) {
            this._audioEl.play();
        }
    }

    pause() {
        this._audioEl.pause();
    }
}

export default NativeEngine;
