var AdmZip = require('adm-zip');

// creating archives
var zip = new AdmZip();

zip.addLocalFolder("./META-INF/", "/META-INF/");
zip.addLocalFolder("./dist/servoy/svycapture/", "/dist/servoy/svycapture/");
zip.addLocalFolder("./audio/", "/audio/");
zip.addLocalFolder("./screen/", "/screen/");
zip.writeZip("svycapture.zip");