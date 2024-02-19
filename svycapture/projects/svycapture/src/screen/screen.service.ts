import { Injectable } from '@angular/core';
import { ServoyPublicService } from '@servoy/public';
import html2canvas from 'html2canvas';

@Injectable()
export class SvyCaptureScreen {
	v: HTMLVideoElement ;
	ccb: (...args: unknown[]) => void;
	
    constructor(private servoyService: ServoyPublicService) {}

    public capture(classname: string, callback: (...args: unknown[]) => void) {
		if (!classname) {
			classname = '.svy-body'
		} else {
			classname = '.' + classname;
		}
		html2canvas(document.querySelector(classname), { foreignObjectRendering: false, useCORS: true }).then((canvas) => {
			const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
			callback(image);
		});
	}
	
	run = () => {
		const scale = 1;
		const canvas = document.createElement("canvas");
		canvas.width = this.v.clientWidth * scale;
		canvas.height = this.v.clientHeight * scale;
		canvas.getContext('2d').drawImage(this.v, 0, 0, canvas.width, canvas.height);
		const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

		// stop video
		const srcObject = this.v.srcObject as MediaStream;
		const tracks = srcObject.getTracks();
		tracks.forEach((track) => {
			track.stop();
		});
		this.v.srcObject = null;

		// you can send image back to server
		this.ccb(image);
	}
	
	public captureViaDisplayMedia(callback: (...args: unknown[]) => void) {
		this.v = document.getElementById("videoCaptureCanvas") as HTMLVideoElement ;
		if (!this.v) {
			const elv = document.createElement("video")
			elv.id = "videoCaptureCanvas"
			elv.style.width = `${window.innerWidth}`;
			elv.style.height = `${window.innerHeight}`;
			elv.autoplay = true;
			elv.muted = true;
			elv.style.visibility = 'hidden'
			document.body.appendChild(elv);
			this.v = document.getElementById("videoCaptureCanvas") as HTMLVideoElement;
		}

		this.ccb = callback;
		navigator.mediaDevices.getDisplayMedia({
			video: { width: window.innerWidth, height: window.innerHeight },
			audio: false
		}).then((r) => {
			this.v.srcObject = r;
			setTimeout(this.run, 500);
		}, (err) => {
			console.log(err);
		});
	}
}
