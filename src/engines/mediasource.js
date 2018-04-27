import MediaSorcerer from 'media-sorcerer';

class MediaSourceEngine {
    constructor(audioElement) {
        this._audioEl = audioElement;
        this._files = null;

        // Setup Sorcerer
        this._sorcerer = new MediaSorcerer(this._audioEl);
    }

    set source(source) {
        this._files = source;
        this._audioStream = this._sorcerer.addStream('audio/mpeg', `../chunk2/${this._files[0]}`);
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

    play() {
        if (this._audioEl.paused) {
            this._audioEl.play();
        }
    }

    /**
     * Initiates playback and segment addition
     */
    initPlayback() {
        this.play();
        this._appendSegments();
    }


    _appendSegments() {
        // For subsequent segments after init
        this._files.slice(1).forEach((file) => {
            const segment = `../chunk2/${file}`;
            this._audioStream.addSegment(segment);
            console.log(this._sorcerer._buffersForCodec.audio);
        });

        console.log('Done appending');

        this._sorcerer._fireStreamHasEnded();
    }
}

export default MediaSourceEngine;
