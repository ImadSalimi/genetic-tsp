
function deepEqual(one, another) {
	if (one === another) return true;

	if (typeof one == "object" && typeof another == "object") {
		for (key in one) {
			if (!(key in another)) return false;
			if (!deepEqual(one[key], another[key])) return false;
		}

		for (key in another) {
			if (!(key in one)) return false;
		}

		return true;
	}

	return false;
}

// Export for node and the browser
if (typeof module != 'undefined') {
	module.exports = deepEqual;
}
if (typeof window != 'undefined') {
	window.deepequal = deepEqual;
}
