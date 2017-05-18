// FORKED FROM https://github.com/muaz-khan/WebRTC-Experiment/tree/master/Chrome-Extensions/desktopCapture

// this background script is used to invoke desktopCapture API to capture screen-MediaStream.

var session = ['screen', 'window'];

chrome.runtime.onConnect.addListener(function (port) {
	// this one is called for each message from "content-script.js"
	port.onMessage.addListener(function (message) {
		if (message === 'get-RocketChatScreenSharingExtensionVersion') {
			return port.postMessage({ version: chrome.runtime.getManifest().version });
		} else if (message === 'get-sourceId') {
			// Tab for which the stream will be created (passed to
			// chrome.desktopCapture.chooseDesktopMedia).
			var tab = port.sender.tab;

			// If the streamId is requested from frame with different url than
			// its parent according to the documentation (
			// https://developer.chrome.com/extensions/desktopCapture ) -
			// "The stream can only be used by frames in the given tab whose
			// security origin matches tab.url." That's why we need to change
			// the url to the url of the frame (the frame is the sender).
			// Related ticket:
			// https://bugs.chromium.org/p/chromium/issues/detail?id=425344
			tab.url = port.sender.url;

			chrome.desktopCapture.chooseDesktopMedia(session, tab, onAccessApproved);
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
