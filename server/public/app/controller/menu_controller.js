menu_controller = {
	
};

var getSearchItemMenu =	function (key,v) {
	var name = v;
	if (typeof(v) === 'object') {
		name = v.name;
	};
	var check = '<tr ><td align="right"><input type="checkbox" checked="checked" class="display_check" id="' + key + '" > </input></td><td align="left">' + name + '</td><td>';
	var input = '<input type="text"size="18"/ id="_input_search_' + key + '"></td> </tr>';
	if(typeof(v) === 'object') {
		if (v['type'] === 'option' && v['values']) {
			input = '<select class="option_select" id="_input_search_' + key + '">';
			for (var i = 0; i < v['values'].length; i++) {
				var ov = v['values'][i];
				input += '<option value ="' + ov + '">' + ov + '</option>';
			}
			input += "</select></td> </tr>";
		};
	};
	return check + input;
};

menu_controller.reloadMenu = function (display,onSearch,onFilter) {
	var head = '<table class="table_search"><tr><td>显示</td><td>类型</td><td>搜索</td></tr>';
	Object.keys(display).forEach(function  (key) {
		head += getSearchItemMenu(key,display[key]);
	});
	head += "</table>";
	head += '<p/><button type="button" class="btn_search">搜索</button>';
	var menu = $('#menu');
	menu.empty();
	menu.html(head);

	function onSearchPressed () {
		var searchItems = [];
		$('[id^="_input_search_"]').each(function  () {
			var item = {text: $(this).val()};
			item.key = $(this).attr('id').replace("_input_search_","");
			searchItems.push(item);
		});
		onSearch(searchItems);
	};

	//search 
	$('.btn_search').bind('click',onSearchPressed);
	$('.option_select').bind('change',onSearchPressed);
	onSearchPressed();

	// filter display
	function  onFilterDisplay() {
		var checkedIds = [];
		$('.display_check').each(function  () {
			var checked = $(this).is(':checked');
			var id = $(this).attr('id');
			if (checked) {
				checkedIds.push(id);
			}
		});
		onFilter(checkedIds);
	};
	//check display
	$('.display_check').bind('click',onFilterDisplay);
};

