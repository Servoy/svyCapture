import { Injectable } from '@angular/core';
import { ServoyPublicService } from '@servoy/public';

type CallableFunction = (...args: unknown[]) => void;

@Injectable()
export class SvyCaptureAudio {
	bufferLength: number;
	dataArray: Uint8Array;
	mediaRecorder: MediaRecorder;
	audioCtx: AudioContext;
	analyser: AnalyserNode;
	canvasCtx: CanvasRenderingContext2D;
	ac: HTMLCanvasElement;
	cc: HTMLDivElement; 
    ccb: CallableFunction;
    ccberr: CallableFunction;
    constraints = { audio: true };
    chunks = [];

    constructor(private servoyService: ServoyPublicService) {}
    
    draw = () => {
        const WIDTH = this.ac.width
        const HEIGHT = this.ac.height;

        requestAnimationFrame(this.draw);

        this.analyser.getByteTimeDomainData(this.dataArray);

        this.canvasCtx.fillStyle = 'gray';
        this.canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        this.canvasCtx.lineWidth = 3;
        this.canvasCtx.strokeStyle = 'white';

        this.canvasCtx.beginPath();

        const sliceWidth = WIDTH * 1.0 / this.bufferLength;
        let x = 0;

        for (let i = 0; i < this.bufferLength; i++) {

            const v = this.dataArray[i] / 128.0;
            const y = v * HEIGHT / 2;

            if (i === 0) {
                this.canvasCtx.moveTo(x, y);
            } else {
                this.canvasCtx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        this.canvasCtx.lineTo(this.ac.width, this.ac.height / 2);
        this.canvasCtx.stroke();
    }
    
    visualize = (stream: MediaStream) => {
        if (!this.audioCtx) {
            this.audioCtx = new AudioContext();
        }

        const source = this.audioCtx.createMediaStreamSource(stream);

        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 2048;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);

        source.connect(this.analyser);

        this.draw();
    }
    
    onError = (err: Error) => {
		this.ccberr(err);
    }
    
    onSuccess = (stream: MediaStream) => {
        this.mediaRecorder = new MediaRecorder(stream);

        this.visualize(stream);

        this.mediaRecorder.start();
        this.cc.style.visibility = 'visible';

        this.mediaRecorder.onstop = () => {
            const blob = new Blob(this.chunks, { 'type': 'audio/ogg; codecs=opus' });
            this.chunks = [];
    
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
            	const base64data = reader.result;
                this.ccb(base64data);
            }
        }
    
        this.mediaRecorder.ondataavailable = (e: BlobEvent) => {
            this.chunks.push(e.data);
        }
    }
    
    public capture(cb: CallableFunction, cberror: CallableFunction) {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            this.cc = document.getElementById("audioCanvasContainer") as HTMLDivElement;
            if (!this.cc) {
                this.cc = document.createElement("div");
                this.cc.id = "audioCanvasContainer";
                this.cc.style.position = 'fixed';
                this.cc.style.visibility = 'hidden'
                this.cc.style.top = 'calc(50% - 60px)';
                this.cc.style.left = 'calc(50% - 100px)';
                this.cc.style.width = '200px';
                this.cc.style.height = '150px';
                this.cc.style.border = '4px solid black';
                this.cc.style.borderRadius = '10px';
                this.cc.style.boxShadow = '1px 1px 10px black';
                this.cc.style.background = 'black';
                this.cc.style.padding = '1px';

                const sp = document.createElement("span");
                this.cc.appendChild(sp);
                sp.textContent = 'RECORDING AUDIO'
                sp.style.color = 'white';

                this.ac = document.createElement("canvas");
                this.cc.appendChild(this.ac);
                this.ac.id = "audiocanvas";
                this.ac.style.background = 'black';
                this.ac.style.width = '100%';
                this.ac.style.height = 'calc(100% - 25px)';
                this.ac.style.borderRadius = '10px';
            } else {
            	this.ac = document.getElementById("audiocanvas") as HTMLCanvasElement;
			}
			
			document.body.appendChild(this.cc);

            this.audioCtx = null;
            this.canvasCtx = this.ac.getContext("2d");

			this.ccb = cb;
			this.ccberr = cberror;
            navigator.mediaDevices.getUserMedia(this.constraints).then(this.onSuccess, this.onError);
        } else {
            console.log('getUserMedia not supported on your browser!');
        }
    }
	
	public stop(cb: CallableFunction) {
		this.mediaRecorder.stop();
		if (cb) cb();
		if (this.cc) this.cc.remove();
	}
}