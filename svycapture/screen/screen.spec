{
	"name": "svycapture-screen",
	"displayName": "screen",
	"version": 1,
 	"definition": "svycapture/screen/screen.js",
 	"ng2Config": {
       "packageName": "@servoy/svycapture",
       "serviceName": "SvyCaptureScreen",
       "entryPoint": "dist/servoy/svycapture"
    },
	"libraries": [{
        "name": "HTML2Canvas.js",
        "version": "1.0.0",
        "url": "svycapture/screen/html2canvas.min.js",
        "mimetype": "text/javascript"
    }],
	"model": {},
 	"api": { 
	 	"capture": {"parameters": [{ "name": "className","type": "string" },{ "name": "callback","type": "function" }]},    	
	    "captureViaDisplayMedia": {"parameters": [{"name": "callback","type": "function"}]}
    }
}