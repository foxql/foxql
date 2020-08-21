/**
 * The MIT License
 * Copyright (c) 2009 Olle Törnström studiomediatech.com
 * https://github.com/olle/lz77-kit/blob/master/src/main/js/lz77.js
 */
module.exports =  function (settings) {

	settings = settings || {};	
	
	// PRIVATE
	
	var referencePrefix = "`";
	var referenceIntBase = settings.referenceIntBase || 96;
	var referenceIntFloorCode = " ".charCodeAt(0);
	var referenceIntCeilCode = referenceIntFloorCode + referenceIntBase - 1;
	var maxStringDistance = Math.pow(referenceIntBase, 2) - 1;
	var minStringLength = settings.minStringLength || 5;
	var maxStringLength = Math.pow(referenceIntBase, 1) - 1 + minStringLength;
	var defaultWindowLength = settings.defaultWindowLength || 144;
	var maxWindowLength = maxStringDistance + minStringLength;
	
	var encodeReferenceInt = function (value, width) {
		if ((value >= 0) && (value < (Math.pow(referenceIntBase, width) - 1))) {
			var encoded = "";
			while (value > 0) {
				encoded = (String.fromCharCode((value % referenceIntBase) + referenceIntFloorCode)) + encoded;
				value = Math.floor(value / referenceIntBase);
			}
			var missingLength = width - encoded.length;
			for (var i = 0; i < missingLength; i++) {
				encoded = String.fromCharCode(referenceIntFloorCode) + encoded;
			}
			return encoded;
		} else {
			throw "Reference int out of range: " + value + " (width = " + width + ")";
		}
	};
	
	var encodeReferenceLength = function (length) {
		return encodeReferenceInt(length - minStringLength, 1);
	};
	
	var decodeReferenceInt = function (data, width) {
		var value = 0;
		for (var i = 0; i < width; i++) {
			value *= referenceIntBase;
			var charCode = data.charCodeAt(i);
			if ((charCode >= referenceIntFloorCode) && (charCode <= referenceIntCeilCode)) {
				value += charCode - referenceIntFloorCode;
			} else {
				throw "Invalid char code in reference int: " + charCode;
			}
		}
		return value;
	};
	
	var decodeReferenceLength = function (data) {
		return decodeReferenceInt(data, 1) + minStringLength;
	};
		
	// PUBLIC
	
	/**
	 * Compress data using the LZ77 algorithm.
	 *
	 * @param data
	 * @param windowLength
	 */
	this.compress = function (data, windowLength) {
		windowLength = windowLength || defaultWindowLength;
		if (windowLength > maxWindowLength) {
			throw "Window length too large";
		}
		var compressed = "";
		var pos = 0;
		var lastPos = data.length - minStringLength;
		while (pos < lastPos) {
			var searchStart = Math.max(pos - windowLength, 0);
			var matchLength = minStringLength;
			var foundMatch = false;
			var bestMatch = {distance:maxStringDistance, length:0};
			var newCompressed = null;
			while ((searchStart + matchLength) < pos) {
				var isValidMatch = ((data.substr(searchStart, matchLength) == data.substr(pos, matchLength)) && (matchLength < maxStringLength));
				if (isValidMatch) {
					matchLength++;
					foundMatch = true;
				} else {
					var realMatchLength = matchLength - 1;
					if (foundMatch && (realMatchLength > bestMatch.length)) {
						bestMatch.distance = pos - searchStart - realMatchLength;
						bestMatch.length = realMatchLength;
					}
					matchLength = minStringLength;
					searchStart++;
					foundMatch = false;
				}
			}
			if (bestMatch.length) {
				newCompressed = referencePrefix + encodeReferenceInt(bestMatch.distance, 2) + encodeReferenceLength(bestMatch.length);
				pos += bestMatch.length;
			} else {
				if (data.charAt(pos) != referencePrefix) {
					newCompressed = data.charAt(pos);
				} else {
					newCompressed = referencePrefix + referencePrefix;
				}
				pos++;
			}
			compressed += newCompressed;
		}
		return compressed + data.slice(pos).replace(/`/g, "``");
	};
	
	/**
	 * Decompresses LZ77 compressed data.
	 *
	 * @param data
	 */
	this.decompress = function (data) {
		var decompressed = "";
		var pos = 0;
		while (pos < data.length) {
			var currentChar = data.charAt(pos);
			if (currentChar != referencePrefix) {
				decompressed += currentChar;
				pos++;
			} else {
				var nextChar = data.charAt(pos + 1);
				if (nextChar != referencePrefix) {
					var distance = decodeReferenceInt(data.substr(pos + 1, 2), 2);
					var length = decodeReferenceLength(data.charAt(pos + 3));
					decompressed += decompressed.substr(decompressed.length - distance - length, length);
					pos += minStringLength - 1;
				} else {
					decompressed += referencePrefix;
					pos += 2;
				}
			}
		}
		return decompressed;
	};
};