// FORKED FROM https://github.com/muaz-khan/WebRTC-Experiment/tree/master/Chrome-Extensions/desktopCapture

document.cookie = "rocketchatscreenshare=chrome";


// this port connects with background script
var port = chrome.runtime.connect();


// get message from background script and forward to the webpage
port.onMessage.addListener(function (message) {
	window.postMessage(message, '*');
});


window.addEventListener('message', function (event) {
	// if invalid source or invalid message
	if (event.source !== window || event.data !== 'get-sourceId')
		return;

	// forward message to background script
	port.postMessage(event.data);
});
