// audioXP

import { genericVariables } from "./variables/generic";

export class audioXP {
    audio = new Audio(genericVariables.audioSrc);
    audioContext = new AudioContext();
    canvas = document.createElement("canvas");
    canvasCtx = this.canvas.getContext("2d");
    audioSource;
    analyser;
    bufferLength;
    dataArray;
    barWidth;
    xPosition;

    constructor() {
        this.setupAudio();
        this.setupCanvas();
        this.setupGraph();
    }

    // setup canvas variables
    setupCanvas() {
        this.canvas.classList.add("audio-visualizer");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        document.body.appendChild(this.canvas);

        window.addEventListener("resize", this.handleResize.bind(this));
        window.addEventListener("click", this.handleCanvasClick.bind(this));
    }

    // setup audio variables
    setupAudio() {
        this.audioSource = this.audioContext.createMediaElementSource(this.audio);
        this.analyser = this.audioContext.createAnalyser();

        this.audioSource.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        this.analyser.fftSize = genericVariables.fftSize;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
    }

    // setup graph variables
    setupGraph() {
        this.barWidth = this.canvas.width / this.bufferLength;
        this.handleAnimation();
    }

    // hadles window resize
    handleResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.barWidth = this.canvas.width / this.bufferLength;
    }

    // handles canvas click
    handleCanvasClick() {
        this.audio.play();
        this.handleAnimation();
    }

    handleAnimation() {
        let barHeight;
        this.xPosition = 0;
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.analyser.getByteFrequencyData(this.dataArray);
        for( let i = 0; i < this.bufferLength; i++) {
            barHeight = this.dataArray[i];
            this.canvasCtx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
            this.canvasCtx.fillRect(this.xPosition, this.canvas.height - barHeight, this.barWidth, barHeight);
            this.xPosition+= this.barWidth;
        }
        requestAnimationFrame(this.handleAnimation.bind(this));
    }
}