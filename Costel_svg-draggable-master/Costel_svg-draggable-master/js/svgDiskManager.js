// source: https://www.html5rocks.com/en/tutorials/file/dndfiles/
var _svgDiskManager = {
	_internal: {
		isAPISupported: false,
		nIndex: 0
	},

	classes: {
		sliderCX: "sliderCX",
		sliderCY: "sliderCY",
		sliderR:  "sliderR",

		SVGContainer: "SVGContainer",

		target: "target",
		
		btnReadSVGFromDisk: "btnReadSVGFromDisk"
	},

	get: {
		SVGContainer: function() { return _ID(_svgDiskManager.classes.SVGContainer); },

		sliderCX: function() { return _ID(_svgDiskManager.classes.sliderCX); },
		sliderCY: function() { return _ID(_svgDiskManager.classes.sliderCY); },
		sliderR: function() { return _ID(_svgDiskManager.classes.sliderR); },

		target: function(nNumber) { return _ID(_svgDiskManager.classes.target + nNumber); },
		
		btnReadSVGFromDisk: function() { return _ID(_svgDiskManager.classes.btnReadSVGFromDisk); }
	},

	ops: {
		addSVGCallback: function(file) {
			return function(event) {
				// escape(file.name);

				_msg("Parsing svg file...");

				// continutul fisierului
				var szRaw = event.target.result;

				// gaseste "<path ... />"
				var szSVGStart = "<path";
				var nStartPos = szRaw.indexOf(szSVGStart);
				if(nStartPos == -1) {
					_msg("Could not find svg path start", MB_ERROR);

					return;
				}

				var szSVGEnd = "/>";
				var nEndPos = szRaw.indexOf(szSVGEnd);
				if(nStartPos == -1) {
					_msg("Could not find svg path end", MB_ERROR);

					return;
				}

				// incrementeaza numarul de elemente "<path>" inserate
				_svgDiskManager._internal.nIndex++;

				// creaza un nou ID		
				var nNewSVGID = _svgDiskManager.classes.target + _svgDiskManager._internal.nIndex;

				// creaza un nou element "<path>"
				var szSVGHtml = ' ' +
					szSVGStart +
						' id="' + nNewSVGID + '"' + 
						' onclick="setSVGTarget(' + "'" + nNewSVGID + "')" + '"' +
						szRaw.substring(nStartPos + szSVGStart.length, nEndPos) +
					szSVGEnd
				;

				_svgDiskManager.get.SVGContainer().innerHTML += szSVGHtml;


				// set current element
				SVG_TARGET_ELEMENT = nNewSVGID;
				_svgDiskManager.ops.setSVGTarget(nNewSVGID);

				_svgDiskManager.ops.moveSVGTarget(_svgDiskManager.get.sliderCX().value, "cx");
				_svgDiskManager.ops.moveSVGTarget(_svgDiskManager.get.sliderCY().value, "cy");
				_svgDiskManager.ops.moveSVGTarget(_svgDiskManager.get.sliderR().value, "r");

				_msg("Added svg...");
			};
		},

		addSVG: function(event) {
			// file list object
			var file = event.target.files[0];

			var fileReader = new FileReader();
			// Closure to capture the file information.
			fileReader.onload = (_svgDiskManager.ops.addSVGCallback)(file);
			// Read in the image file as a data URL.
			fileReader.readAsText(file);
		},

		setSVGTarget: function(targetID) {
			var sliderCX = _svgDiskManager.get.sliderCX();
			var sliderCY = _svgDiskManager.get.sliderCY();
			var sliderR  = _svgDiskManager.get.sliderR();

			// creaza o intrare noua daca nu exista pentru elementul curent
			if( ! SVGS_COORDINATES[ SVG_TARGET_ELEMENT ]) {
				SVGS_COORDINATES[ SVG_TARGET_ELEMENT ] = {
					cx: 0,
					cy: 0,
					r:  sliderR.max / 2
				}
			}

			// seteaza slider-ele cum erau cand ai deselectat elementul
			sliderCX.value = SVGS_COORDINATES[ SVG_TARGET_ELEMENT ].cx;
			sliderCY.value = SVGS_COORDINATES[ SVG_TARGET_ELEMENT ].cy;
			sliderR.value = SVGS_COORDINATES[ SVG_TARGET_ELEMENT ].r;
		},

		moveSVGTarget: function(nValue, direction) {
			var svg = _ID(SVG_TARGET_ELEMENT);

			// works only for "<path>" elements
			var nOldCX = SVGS_COORDINATES[ SVG_TARGET_ELEMENT ].cx;
			var nOldCY = SVGS_COORDINATES[ SVG_TARGET_ELEMENT ].cy;

			if(direction == "cx") {
				SVGS_COORDINATES[ SVG_TARGET_ELEMENT ].cx = nValue;
			} else if(direction == "cy") {
				SVGS_COORDINATES[ SVG_TARGET_ELEMENT ].cy = nValue;
			} else if(direction == "r") {
				SVGS_COORDINATES[ SVG_TARGET_ELEMENT ].r = nValue;
			}

			var szTransformation = "translate(" +
				SVGS_COORDINATES[ SVG_TARGET_ELEMENT ].cx + "," +
				SVGS_COORDINATES[ SVG_TARGET_ELEMENT ].cy + ") " +
				"scale(" + 0.01 * (SVGS_COORDINATES[ SVG_TARGET_ELEMENT ].r ? SVGS_COORDINATES[ SVG_TARGET_ELEMENT ].r: 1) + ")";

			svg.setAttributeNS(null, 'transform', szTransformation);

			return;
		}
	},

	init: {
		all: function() {
			_svgDiskManager._internal.isAPISupported = (
				window.File && 
				window.FileReader && 
				window.FileList && 
				window.Blob
			);

			_svgDiskManager.init.ui();
			_svgDiskManager.init.eventHandlers();
		},

		ui: function() {
			if( ! _svgDiskManager._internal.isAPISupported) {
			  	_svgDiskManager.get.btnReadSVGFromDisk().style.display = "none";

			  	_msg('The File APIs are not fully supported in this browser.', MB_ERROR);

			  	return;
			}

		  	// Great success! All the File APIs are supported.

			// set file attribute mask
		  	_svgDiskManager.get.btnReadSVGFromDisk().setAttribute("accept", 'accept=".svg"');
		},

		eventHandlers: function() {
			if( ! _svgDiskManager._internal.isAPISupported) return;

			_svgDiskManager.get.btnReadSVGFromDisk().onchange = _svgDiskManager.ops.addSVG;
		}
	}
}

// MAIN
// asa se instanteaza obiectul
_svgDiskManager.init.all();