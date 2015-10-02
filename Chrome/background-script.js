// FORKED FROM https://github.com/muaz-khan/WebRTC-Experiment/tree/master/Chrome-Extensions/desktopCapture

// this background script is used to invoke desktopCapture API to capture screen-MediaStream.

var session = ['screen', 'window', 'tab'];

chrome.runtime.onConnect.addListener(function (port) {
	// this one is called for each message from "content-script.js"
	port.onMessage.addListener(function (message) {
		if(message === 'get-sourceId') {
			chrome.desktopCapture.chooseDesktopMedia(session, port.sender.tab, onAccessApproved);
		}
	});


	// "sourceId" will be empty if permission is denied.
	function onAccessApproved(sourceId) {
		// if "cancel" button is clicked
		if(!sourceId || !sourceId.length) {
			return port.postMessage('PermissionDeniedError');
		}

		port.postMessage({
			sourceId: sourceId
		});
	}
});
