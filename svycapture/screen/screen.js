angular.module('svycaptureScreen', ['servoy']).factory("svycaptureScreen", function($services, $window) {
		var scope = $services.getServiceScope('svycaptureScreen');
		return {
			capture: function(classname, callback) {
				if (!classname) {
					classname = '.svy-body'
				} else {
					classname = '.' + classname;
				}
				html2canvas(document.querySelector('.svy-body'), { foreignObjectRendering: false, useCORS: true }).then(function(canvas) {
					var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
					$window.executeInlineScript(callback.formname, callback.script, [image]);

				});
			},
			captureViaDisplayMedia: function(callback) {
				var v = document.getElementById("videoCaptureCanvas");
				if (!v) {
					var elv = document.createElement("video")
					elv.id = "videoCaptureCanvas"
					elv.style.width = $(window).width
					elv.style.height = $(window).height
					elv.autoplay = true;
					elv.muted = true;
					elv.style.visibility = 'hidden'
					document.body.appendChild(elv);
					v = document.getElementById("videoCaptureCanvas");
				}
				function run() {
					var scale = 1;
					const canvas = document.createElement("canvas");
					canvas.width = v.clientWidth * scale;
					canvas.height = v.clientHeight * scale;
					canvas.getContext('2d').drawImage(v, 0, 0,
						canvas.width, canvas.height);
					var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

					// stop video
					var tracks = v.srcObject.getTracks();
					tracks.forEach(function(track) {
						track.stop();
					});
					v.srcObject = null;

					// you can send image back to server
					$window.executeInlineScript(callback.formname, callback.script, [image]);
				}

				navigator.mediaDevices.getDisplayMedia({
					video: { width: $(window).width, height: $(window).height },
					audio: false
				}).then(function(r) {
						v.srcObject = r;
						setTimeout(run, 500);
					}, function(err) {
						console.log(err);
					});
			}
		}
	}).run(function($rootScope, $services) { })