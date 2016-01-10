
log_table_view_controller = {
};

var getContent = function  (content,display) {
		var body =  '<tr class="child_row_01"><td><table width="100%" class="table3">';
		Object.keys(display).forEach(function  (key) {
			var v = display[key];
			var name = v;
			if (typeof(v) === 'object') {
				name = v.name;
			};
			if (content[key]) {
				body += '<tr ><td>' + name +  '</td><td>' + content[key] +  '</td></tr>';
			};
		});
		body += '</table></td></tr></table>';
		return body;
};
	
var getTitle = function  (idx,date,title) {
	var timeReg = new RegExp("[0-9][0-9]:[0-9][0-9]:[0-9][0-9]");
	date = timeReg.exec(date)[0];
	var even = idx % 2 == 0;
	if (even) {
		return '<table width="100%" class="table1" id="log_contents"><tr class="parent" id="row_01"><td bgcolor="#E0F0F0"> <table width="100%" class="table2"><tr ><td width="20px"/><td >' + date + ' -- ' + title + '</td></tr></table></td></tr>'
	} else{
		return '<table width="100%" class="table1" id="log_contents"><tr class="parent" id="row_01"><td bgcolor="#F0E0E0"> <table width="100%" class="table2"><tr><td width="20px"/><td >' + date + ' -- ' + title + '</td></tr></table></td></tr>'
	}
};

log_table_view_controller.reloadView =	function  (datas,display) {
	var log_contents = $('#log_contents');
	$('#error_num').empty();
	$('#error_num').html("错误数: " + datas.length.toString());
	var htmlContent = "";
	for (var i = 0; i < datas.length; i++) {
		htmlContent += getTitle(i,datas[i].date,datas[i].content.title);
		htmlContent += getContent(datas[i].content,display);
	};
	log_contents.html(htmlContent);
	$('.parent').bind('click',function(){   // 获取所谓的父行
		$(this)
		.toggleClass("selected")   // 添加/删除高亮
		.siblings('.child_'+this.id).toggle(100);  // 隐藏/显示所谓的子行
	});
};