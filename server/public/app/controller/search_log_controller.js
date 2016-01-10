
search_log_controller = {
};

var isMatch =	function  (key,value,c) {
	return (c[key].search(value) !== -1);
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