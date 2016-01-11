
search_log_controller = {
};

String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
var isMatch =	function  (key,value,c) {
	return (c[key].indexOf(value) !== -1);
};

search_log_controller.search = function (logContents,searchItems) {
	var matches = [];
	for (var j = 0; j < logContents.length; j++) {
		var find = true;
		for (var i = 0; i < searchItems.length; i++) {
			if (searchItems[i].text === '') {
				continue;
			};
			if (!isMatch(searchItems[i].key, searchItems[i].text,logContents[j].content)) {
				find = false;
				break;
			};
		};
		if (find) {
			matches.push(logContents[j]);
		};
	};
	return matches;
};