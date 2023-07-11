{
	"name": "svycapture-audio",
	"displayName": "audio",
	"version": 1,
 	"definition": "svycapture/audio/audio.js",
 	"ng2Config": {
       "packageName": "@servoy/svycapture",
       "serviceName": "SvyCaptureAudio",
       "entryPoint": "dist/servoy/svycapture"
    },
	"libraries": [],
	"model": { 
		"mediaRecorder": {"type":"object"}
	},
 	"api":{
 		"capture": {"parameters": [{ "name": "onSuccess","type": "function" },{ "name": "onError","type": "function" }]},
 		"stop": {"parameters": [{ "name": "onSuccess","type": "function" },{ "name": "onError","type": "function" }]}
 	}
}