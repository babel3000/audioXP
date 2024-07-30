// audioXP
/*
    TODO: 
    - ADD OPTIONS ON LIB INITIALIZATION:
        - Color Factors for RGB
        - Type of color: RGB or HUE
        - Height Factor for Bar Graphs
        - Top Border of Bar Graphs:
            - Color
            - Position
            - Height
        - Type of Graph
        - Number of bars on Bar Graph
*/

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
    barHeight;
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
    setupAudio(fftSize = genericVariables.fftSize) {
        this.audioSource = this.audioContext.createMediaElementSource(this.audio);
        this.analyser = this.audioContext.createAnalyser();

        this.audioSource.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        this.analyser.fftSize = fftSize;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
    }

    // setup graph variables
    setupGraph() {
        this.handleAnimation();
    }

    // hadles window resize
    handleResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    // handles canvas click
    handleCanvasClick() {
        this.audio.play();
        this.handleAnimation();
    }

    // handles bar animation
    handleAnimation() {
        this.xPosition = 0;
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.analyser.getByteFrequencyData(this.dataArray);
        this.buildCircleBarGraph(1, 5, 5, 1.5);
        requestAnimationFrame(this.handleAnimation.bind(this));
    }

    buildBarGraph(redFactor = 10, greenFactor = 2, blueFactor = 5, heightFactor = 1) {
        this.barWidth = this.canvas.width / this.bufferLength;
        for( let i = 0; i < this.bufferLength; i++) {
            this.drawBars(false, {red: redFactor, green: greenFactor, blue: blueFactor, height: heightFactor}, i);
        }
    }

    buildMirrorBarGraph(redFactor = 10, greenFactor = 2, blueFactor = 5, heightFactor = 1) {
        this.barWidth = (this.canvas.width / 2) / this.bufferLength;
        for( let i = 0; i < this.bufferLength; i++) {
            this.drawBars(true, {red: redFactor, green: greenFactor, blue: blueFactor, height: heightFactor}, i, true);
        }
        for( let i = 0; i < this.bufferLength; i++) {
            this.drawBars(false, {red: redFactor, green: greenFactor, blue: blueFactor, height: heightFactor}, i, true);
        }
    }

    buildCircleBarGraph(redFactor = 10, greenFactor = 2, blueFactor = 5, heightFactor = 1) {
        this.barWidth = this.canvas.width / this.bufferLength;
        for( let i = 0; i < this.bufferLength; i++) {
            this.drawBars(false, {red: redFactor, green: greenFactor, blue: blueFactor, height: heightFactor}, i, false, true, 'hue');
        }
    }

    drawBars(inverted = false, factors, index, border, circle = false, colorScheme = 'rgb') {
        this.barHeight = this.dataArray[index] * factors.height;
        if(circle) {
            this.canvasCtx.save();
            this.canvasCtx.translate(this.canvas.width/2, this.canvas.height/2)
            this.canvasCtx.rotate(index * Math.PI * 8 / this.bufferLength);
        }
        const x = circle ? 0 : inverted ? this.canvas.width / 2 - this.xPosition : this.xPosition
        const y = circle ? 0 : this.canvas.height - this.barHeight;

        if(border) {
            this.canvasCtx.fillStyle = `black`;
            this.canvasCtx.fillRect(x, y, this.barWidth, 10);
        }

        if(colorScheme === 'rgb') {
            const red = this.barHeight / factors.red;
            const green = this.barHeight / factors.green;
            const blue = this.barHeight / factors.blue;

            this.canvasCtx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
        } else if (colorScheme === 'hue') {
            const hue = index * 15;
            this.canvasCtx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        }

        
        this.canvasCtx.fillRect(x, y, this.barWidth, this.barHeight);
        this.xPosition+= this.barWidth;

        if(circle){
            this.canvasCtx.restore();
        }
    }
}