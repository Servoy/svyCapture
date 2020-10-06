/**
 * Perform the element onclick action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"0B3459B4-9813-4AEE-BCF1-399CF0F83EF4"}
 */
function onAction(event) {
	plugins.svycaptureScreen.capture(null, getImage);
}

/**
 * @param img
 *
 * @properties={typeid:24,uuid:"3DD6DF26-47BE-409A-AEB5-818F7579A68B"}
 */
function getImage(img) {
	forms.imagePreview.open(img);
}

/**
 * Perform the element onclick action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"9A5BFF1C-AE94-48CB-87C4-18A78A5705E4"}
 */
function onActionv2(event) {
	plugins.svycaptureScreen.captureViaDisplayMedia(getImage);
}

/**
 * Perform the element onclick action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"4C69B2C1-F21E-41D6-BA87-E1ACF8BD9555"}
 */
function onAction$captureAudio(event) {
	plugins.svycaptureAudio.capture(audioCB, audioCBError);
}

/**
 * @properties={typeid:24,uuid:"DF563E32-B435-437C-9E32-FB5D1EEC171E"}
 */
function audioCB(data) {
	application.output(data);
}
/**
 * @properties={typeid:24,uuid:"B137A4C4-2CA9-4D3C-A6A1-199AE8CF92FF"}
 */
function audioCBError() { 
	application.output('error with audio capture');
}

/**
 * @properties={typeid:24,uuid:"EACFB1C4-BE40-4678-A8F4-DEA0C630A442"}
 */
function audioStopCB() {
	application.output('stop audio capture');
}

/**
 * Perform the element onclick action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"85F45C01-47F4-4192-BEDA-AA703D841EBF"}
 */
function onAction$StopAudio(event) {
	plugins.svycaptureAudio.stop(audioStopCB, audioCBError);
}
