angular.module('svycaptureAudio', ['servoy']).factory("svycaptureAudio", function($services, $window) {
		var scope = $services.getServiceScope('svycaptureAudio');
		return {
			capture: function(cb, cberr) {

				if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

					var cc = document.getElementById("audioCanvasContainer");
					if (!cc) {
						cc = document.createElement("div");
						cc.id = "audioCanvasContainer";
						cc.style.position = 'fixed';
						cc.style.visibility = 'hidden'
						cc.style.top = 'calc(50% - 60px)';
						cc.style.left = 'calc(50% - 100px)';
						cc.style.width = '200px';
						cc.style.height = '150px';
						cc.style.border = '4px solid black';
						cc.style.borderRadius = '10px';
						cc.style.boxShadow = '1px 1px 10px black';
						cc.style.background = 'black';
						cc.style.padding = '1px';

						var sp = document.createElement("span");
						cc.appendChild(sp);
						sp.textContent = 'RECORDING AUDIO'
						sp.style.color = 'white';

						var ac = document.createElement("canvas");
						cc.appendChild(ac);
						ac.id = "audiocanvas";
						ac.style.background = 'black';
						ac.style.width = '100%';
						ac.style.height = 'calc(100% - 25px)';
						ac.style.borderRadius = '10px';
						document.body.appendChild(cc);
					}

					//setup visualiser
					var ac = document.getElementById("audiocanvas");

					audioCtx = null;
					canvasCtx = ac.getContext("2d");

					var constraints = { audio: true };
					var chunks = [];

					function onSuccess(stream) {
						scope.model.mediaRecorder = new MediaRecorder(stream);

						visualize(stream);

						scope.model.mediaRecorder.start();
						cc.style.visibility = 'visible';

						scope.model.mediaRecorder.onstop = function(e) {
							const blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
							chunks = [];

							var reader = new FileReader();
							reader.readAsDataURL(blob);
							reader.onloadend = function() {
								var base64data = reader.result;
								$window.executeInlineScript(cb.formname, cb.script, [base64data]);
							}

						}

						scope.model.mediaRecorder.ondataavailable = function(e) {
							chunks.push(e.data);
						}
					}

					function onError(err) {
						$window.executeInlineScript(cberr.formname, cberr.script, [err]);
					}

					navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

					// navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

					// $window.executeInlineScript(cb.formname, cb.script, []);
					// $window.executeInlineScript(cberr.formname, cberr.script, [err]);
					// $window.executeInlineScript(cberr.formname, cberr.script, ['getUserMedia not supported on your browser!']);

				} else {
					console.log('getUserMedia not supported on your browser!');
				}

				function visualize(stream) {
					if (!audioCtx) {
						audioCtx = new AudioContext();
					}

					const source = audioCtx.createMediaStreamSource(stream);

					const analyser = audioCtx.createAnalyser();
					analyser.fftSize = 2048;
					const bufferLength = analyser.frequencyBinCount;
					const dataArray = new Uint8Array(bufferLength);

					source.connect(analyser);

					draw();

					function draw() {
						const WIDTH = ac.width
						const HEIGHT = ac.height;

						requestAnimationFrame(draw);

						analyser.getByteTimeDomainData(dataArray);

						canvasCtx.fillStyle = 'gray';
						canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

						canvasCtx.lineWidth = 3;
						canvasCtx.strokeStyle = 'white';

						canvasCtx.beginPath();

						var sliceWidth = WIDTH * 1.0 / bufferLength;
						var x = 0;

						for (var i = 0; i < bufferLength; i++) {

							var v = dataArray[i] / 128.0;
							var y = v * HEIGHT / 2;

							if (i === 0) {
								canvasCtx.moveTo(x, y);
							} else {
								canvasCtx.lineTo(x, y);
							}

							x += sliceWidth;
						}

						canvasCtx.lineTo(ac.width, ac.height / 2);
						canvasCtx.stroke();

					}
				}
			},
			stop: function(cb) {
				var cc = document.getElementById("audioCanvasContainer");
				if (cc) cc.style.visibility = 'hidden';
				scope.model.mediaRecorder.stop();
				if (cb) $window.executeInlineScript(cb.formname, cb.script, []);
			}
		}
	}).run(function($rootScope, $services) { })