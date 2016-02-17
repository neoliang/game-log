top_event_view = {
};

var top_headTemplate = function  () {
  return '<div> \
    <h1 id="error_type_num"> 错误类型统计 </h1> \
    <table width="100%" class="table2"> \
      <tr > \
        <td width="8px"/> \
        <td width="70px" align="center"> 数量 </td> \
        <td align="center"> 标题 </td> \
      </tr> \
    </table> \
    </div>';
};

var top_getContent = function  (content,display,hashData) {
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
var top_getTitleTemplate = function  () {
  return '<table width="100%" class="table1"> \
      <tr class="parent" id="row_01"> \
        <td bgcolor="{{color}}"> \
          <table width="100%" class="table2"> \
            <tr > \
              <td width="8px"/> \
              <td width="70px" align="left">{{num}} </td> \
              <td width="400px" align="left"> {{title}} </td> \
            </tr> \
          </table> \
        </td> \
      </tr>';
};



var top_getTitle = function  (idx,num,title) {
  var even = idx % 2 == 0;
  var color = "#E0F0F0";
  if (even) {
    color = "#F0E0E0";
  }
  var t = top_getTitleTemplate();
  return formateTemplate(t,{
    color: color,
    num: num,
    title: title 
  });
};

var countBy = function (_datas,countType) {
  var countDatas = {}
  for (var i = 0; i < _datas.length; i++) {
    if (_datas[i].content.type == 'crash') {
      continue;
    }
    var toCount = countDatas[_datas[i].content[countType]];
    if (!toCount) {
      toCount = {
        count:0,
      };
      countDatas[_datas[i].content[countType]] = toCount;
    }
    toCount.count += 1;
    toCount.data = _datas[i];
  }
  return countDatas;
};

top_event_view.reloadView =  function  (_datas,_display,_hashData) {
  var log_contents = $('#footer');
  var htmlContent = top_headTemplate();

  var countDatas = countBy(_datas,'title');
  var sortedCountDatas = [];
  Object.keys(countDatas).forEach(function  (key) {
    var item = countDatas[key];
    sortedCountDatas.push(item);
  });
  sortedCountDatas.sort(function(b,a){
    return a.count - b.count;
  });
  for (var i = 0; i < sortedCountDatas.length; i++) {
    var item = sortedCountDatas[i];
    console.log(item);
    htmlContent += top_getTitle(i,item.count,_hashData[item.data.content.title]);
    htmlContent += top_getContent(item.data.content,_display,_hashData);
  }
  log_contents.html(htmlContent);
  var error_type_num = $('#error_type_num');
  error_type_num.empty();
  error_type_num.append('错误类型统计(' + sortedCountDatas.length + '种)');
  $('.parent').bind('click',function(){   // 获取所谓的父行
    $(this)
    .toggleClass("selected")   // 添加/删除高亮
    .siblings('.child_'+this.id).toggle(100);  // 隐藏/显示所谓的子行
  });
};