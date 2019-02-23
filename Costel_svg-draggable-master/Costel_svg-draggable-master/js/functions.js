var MB_TEXT  	= 0;
var MB_SUCCESS  = 1;
var MB_ERROR	= 2;

function _ID(id) {
	return document.getElementById(id);
}

function _msg(szMessage, nMessageType) {
	var wrapper = _ID('statusWrapper');

	if( ! wrapper) return;

	switch(nMessageType) {
		case MB_SUCCESS:
			wrapper.style.color = "green";
			break;

		case MB_ERROR:
			wrapper.style.color = "red";
			break;

		default:
			wrapper.style.color = "black";
	}

	wrapper.innerHTML = szMessage;
}