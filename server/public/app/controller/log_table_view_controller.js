
log_table_view_controller = {
};


var getContent = function  (content,display,hashData) {
		var body =  '<tr class="child_row_01"><td><table width="100%" class="table3">';
		Object.keys(display).forEach(function  (key) {
			var v = display[key];
			var name = v;
			var isHash = false;
			var show = true;
			if (typeof(v) === 'object') {
				name = v.name;
				if (v.type === 'hash')
				{
					isHash = true;
				}
				if (v.display && v.display === 'none') {
					show = false;
				};
			};
			if (content[key] && show) {
				var nv = content[key];
				if (isHash )
				{
					nv = hashData[content[key]];
				}
				if(nv){
					body += '<tr ><td>' + name +  '</td><td>' + nv.toString().replace(/\r?\n/g, '<br />') +  '</td></tr>';
				}
			};
		});
		body += '</table></td></tr></table>';
		return body;
};
var getTitleTemplate = function  () {
	return '<table width="100%" class="table1" id="log_contents"> \
			<tr class="parent" id="row_01"> \
				<td bgcolor="{{color}}"> \
					<table width="100%" class="table2"> \
						<tr > \
							<td width="8px"/> \
							<td width="100px"> {{hashCode}} </td> \
							<td width="70px">{{date}} </td> \
							<td > {{title}} </td> \
						</tr> \
					</table> \
				</td> \
			</tr>';
};



var getTitle = function  (idx,date,title,hashCode) {
	var timeReg = new RegExp("[0-9][0-9]:[0-9][0-9]:[0-9][0-9]");
	date = timeReg.exec(date)[0];
	var even = idx % 2 == 0;
	var color = "#E0F0F0";
	if (even) {
		color = "#F0E0E0";
	}
	var t = getTitleTemplate();
	return formateTemplate(t,{
		color: color,
		date: date,
		hashCode:hashCode,
		title: title 
	});
};
var headTemplate = function  () {
	return '<div> \
		<table width="100%" class="head"> \
			<tr> \
				<td width="80%"><input type="checkbox" checked="checked" id="btn_fold_log">折叠</input></td> \
				<td id="error_num" align="right" width="20%" > 错误数: 0</td> \
			</tr> \
		</table> \
		<table width="100%" class="table2"> \
			<tr > \
				<td width="8px"/> \
				<td width="100px" align="center"> 错误码 </td> \
				<td width="70px" align="center"> 时间 </td> \
				<td align="center"> 标题 </td> \
			</tr> \
		</table> \
		</div>';
};

log_table_view_controller.reloadView =	function  (datas,display,hashData) {
	var log_contents = $('#log_contents');
	var htmlContent = headTemplate();
	var tilteDisplay = display['title'];
	if (typeof(tilteDisplay) === 'object' && tilteDisplay.type === 'hash')
	for (var i = 0; i < datas.length; i++) {
		htmlContent += getTitle(i,datas[i].date,hashData[datas[i].content.title],datas[i].content.title);
		htmlContent += getContent(datas[i].content,display,hashData);
	};
	log_contents.html(htmlContent);

	$('#error_num').empty();
	$('#error_num').append("错误数: " + datas.length.toString());

	$('.parent').bind('click',function(){   // 获取所谓的父行
		$(this)
		.toggleClass("selected")   // 添加/删除高亮
		.siblings('.child_'+this.id).toggle(100);  // 隐藏/显示所谓的子行
	});
	$('#btn_fold_log').bind('click',function () {
		var fold = $(this).is(':checked');
		if (fold) {
			$(".child_row_01").hide(100);
		} else{
			$(".child_row_01").show(100);
		};
	});	
};