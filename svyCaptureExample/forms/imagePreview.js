/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"6AE2A612-688C-4161-8F28-13AC60169758"}
 */
var img_data = '';

/**
 * @properties={typeid:24,uuid:"E65384C9-8430-4F3B-84F7-F6489B92DAA5"}
 */
function open(img) {
	img_data = '<img src="'+img+'"/>'	
	var w = application.createWindow(controller.getName(), JSWindow.MODAL_DIALOG);
	w.title = 'Screenshot Preview'
	w.setSize(500,500)
	w.show(controller.getName())
}
