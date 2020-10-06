{
	"name": "svycapture-audio",
	"displayName": "audio",
	"version": 1,
 	"definition": "svycapture/audio/audio.js",
	"libraries": [],
	"model": { 
		"mediaRecorder": {"type":"object"}
	},
 	"api":{
 		"capture": {"parameters": [{ "name": "onSuccess","type": "function" },{ "name": "onError","type": "function" }]},
 		"stop": {"parameters": [{ "name": "onSuccess","type": "function" },{ "name": "onError","type": "function" }]}
 	}
}