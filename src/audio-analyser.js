class AudioAnalyser {
    constructor(element, options) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this._audioContext = new AudioContext();
        this._analyser = this._audioContext.createAnalyser();

        // Stick the analyser between audio source and destination
        this.audioElement = element;
        this._source = this._audioContext.createMediaElementSource(this.audioElement);
        this._source.connect(this._analyser);
        this._analyser.connect(this._audioContext.destination);


        this._analyser.smoothingTimeConstant = options.smoothingTimeConstant;
        this._analyser.fftSize = options.fftSize;
    }

    get audioBaseData() {
        return {
            currentTime: this.currentTime,
            timeDomain: this.timeDomainByteData,
            allFrequencies: this.freqByteData,
            threeBand: this.threeBandLevels,
            volumeStats: this.volumeStats
        };
    }

    get currentTime() {
        return this.audioElement.currentTime;
    }

    get timeDomainByteData() {
        const timeDomainByteData = new Uint8Array(this._analyser.fftSize);
        this._analyser.getByteTimeDomainData(timeDomainByteData);
        return timeDomainByteData;
    }

    get freqByteData() {
        const freqByteData = new Uint8Array(this._analyser.frequencyBinCount);
        this._analyser.getByteFrequencyData(freqByteData);
        return freqByteData;
    }

    get threeBandLevels() {
        return this._computeThreeBandFrequency(this.freqByteData);
    }

    get volumeStats() {
        return {
            avgVolume: this._getAverageVolume(this.freqByteData),
            minVolume: this._analyser.minDecibels,
            maxVolume: this._analyser.maxDecibels
        };
    }

    _computeThreeBandFrequency(freqByteData) {
        const lowBin = [0, 11];
        const midBin = [11, 22];
        const highBin = [22, 32];

        const threeBand = {
            low: 0,
            mid: 0,
            high: 0
        };

        // Get avg low band level
        for (let i = lowBin[0]; i < lowBin[1]; i++) {
            threeBand.low += freqByteData[i];
        }
        threeBand.low /= (lowBin[1] - lowBin[0]);

        // Get avg mid band level
        for (let i = midBin[0]; i < midBin[1]; i++) {
            threeBand.mid += freqByteData[i];
        }
        threeBand.mid /= (midBin[1] - midBin[0]);

        // Get avg high band level
        for (let i = highBin[0]; i < highBin[1]; i++) {
            threeBand.high += freqByteData[i];
        }
        threeBand.high /= (highBin[1] - highBin[0]);

        return threeBand;
    }

    _getAverageVolume(freqByteData) {
        let average = 0;

        // get all the frequency amplitudes
        for (let i = 0; i < freqByteData.length; i++) {
            average += freqByteData[i];
        }

        average /= freqByteData.length;
        return average;
    }
}

export default AudioAnalyser;
