/* eslint-disable */

var files = ['dancing_queen_4seconds.wav'];

var audioElement = document.querySelector('#track');

var earworm = new Earworm(audioElement, files);
var avgVolume = 0;

// ANIMATION
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function convertRgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

var canvas = document.getElementById('visualizer');
var ctx = canvas.getContext("2d");
ctx.fillStyle = convertRgbToHex(252, 170, 0);
ctx.fillRect(0, 0, canvas.width, canvas.height);

var capturer = new CCapture( {
    framerate: 60,
    verbose: true,
    format: 'webm'
} );

var iter = 0;
var recordData = [];

function render(){

    requestAnimationFrame(render);
    if (recordData.length === 0 || recordData.length < iter) {
        return;
    }
    iter++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // rendering stuff ...
    ctx.fillStyle = convertRgbToHex(252, 170, recordData[iter].volumeStats.avgVolume);
    console.log(recordData[iter]);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    capturer.capture( canvas );

}


function generateRecordData() {
    var fps = 60;
    var recordRate = 4;

    var refreshInterval = 1000 / (fps * recordRate);
    console.log(refreshInterval);

    earworm.muted = true;
    earworm.playbackRate = recordRate;




    var recordAutomator = null;

    audioElement.addEventListener('play', function() {
        var iter = 0;
        recordData = [];
        recordAutomator = setInterval(function() {
            recordData[iter] = earworm.analyser.audioBaseData;
            iter++;
        }, refreshInterval);
    });

    audioElement.addEventListener('ended', function() {
        clearInterval(recordAutomator);
        recordAutomator = null;
        console.log(recordData);
    });

    // render();

}

var recordButton = document.querySelector('#record');
generateRecordData();



setTimeout(function() {
    capturer.stop();

// default save, will download automatically a file called {name}.extension (webm/gif/tar)
    capturer.save();
}, 5000);
