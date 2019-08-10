//筛选表格的数据的公共方法
export function filterData(searchInput, dataSource) {
  const searchCondition = searchInput.toLowerCase();
  if (searchCondition) {
    // filter() 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。
    return dataSource.filter(data => {
      // some() 方法用于检测数组中的元素是否满足指定条件;
      // some() 方法会依次执行数组的每个元素：
      // 如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测;
      // 如果没有满足条件的元素，则返回false。
      return Object.keys(data).some(key => {
        // indexOf() 返回某个指定的字符在某个字符串中首次出现的位置，如果没有找到就返回-1；
        // 该方法对大小写敏感！所以之前需要toLowerCase()方法将所有查询到内容变为小写。
        return (
          String(data[key]).toLowerCase().indexOf(searchCondition) > -1
        );
      });
    });
  }
  return dataSource;
}

/*获得普通column对象*/
export function getColumn(title, key, sorter) {
  return {
    title: title,
    dataIndex: key,
    key: key,
    align:'center',
    //slots: {title: "customTitle"},
    scopedSlots: {customRender: key},
    sorter: sorter
  }
}

/*获得有宽度的column对象*/
export function getWidthColumn(title, key, width,sorter) {
  return {
    title: title,
    dataIndex: key,
    key: key,
    align:'center',
    width:width,
    //slots: {title: "customTitle"},
    scopedSlots: {customRender: key},
    sorter: sorter
  }
}

/*获得 fixed column对象*/
export function getFixedColumn(title, key,fixed, sorter) {
  return {
    title: title,
    dataIndex: key,
    key: key,
    fixed: fixed,
    align:'center',
    //slots: {title: title},
    scopedSlots: {customRender: key},
    sorter: sorter
  }
}

/*获得 fixed column对象*/
export function getCellColumn(title, key,customCell,color, sorter) {
  return {
    title: title,
    dataIndex: key,
    key: key,
    scopedSlots: {customRender: key},
    align:'center',
    customCell:customCell,
    sorter: sorter
  }
}

//转换为TreeData
export function transData(list, idStr, pIdStr) {
  let result = [], temp = {};
  for (let i = 0; i < list.length; i++) {
    delete list[i].children;
    temp[list[i][idStr]] = list[i];//将数组转成对象类型
  }
  for (let j = 0; j < list.length; j++) {
    let tempVp = temp[list[j][pIdStr]]; //获取每一个子对象的父对象
    if (tempVp) { //判断父对象是否存在，如果不存在直接将对象放到第一层
      if (!tempVp["children"]) tempVp["children"] = []; //如果父元素的children对象不存在，则创建数组
      tempVp["children"].push(list[j]); //将本对象压入父对象的children数组

    } else {
      result.push(list[j]);//将不存在父对象的对象直接放入一级目录
    }
  }
  return result;
}


/*递归函数 角色菜单树*/
export function recursion(list) {
  let treeData = [];
  list.forEach(item => {
    let data = {
      title: item.title,
      key: item.id,
      children: []
    };
    if (item.children) data.children = recursion(item.children);
    treeData.push(data);
  });
  return treeData
}


/*递归函数 菜单树*/
export function recursionMenu(list) {
  let treeData = [];
  list.forEach(item => {
    let data = {
      title: item.title,
      value: item.id.toString(),
      key: item.id,
      children: []
    };
    if (item.children) data.children = recursionMenu(item.children);
    treeData.push(data);
  });
  return treeData
}

/*时间格式的转换*/
export const longValueToDateString = (longTime) => {

  let date = new Date(longTime);
  let year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate()-1, hour = date.getUTCHours() , minute = date.getMinutes(),
    second = date.getSeconds();
  if (month <= 9) month = '0' + month;
  if (day <= 9) day = '0' + day;
  if (hour <= 9) hour = '0' + hour;
  if (minute <= 9) minute = '0' + minute;
  if (second <= 9) second = '0' + second;
  //let timeString = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
};

export const timeToDateString = (longTime) => {

  let date = new Date(longTime);
  let year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate(), hour = date.getHours(), minute = date.getMinutes(),
    second = date.getSeconds();
  if (month <= 9) month = '0' + month;
  if (day <= 9) day = '0' + day;
  if (hour <= 9) hour = '0' + hour;
  if (minute <= 9) minute = '0' + minute;
  if (second <= 9) second = '0' + second;
  //let timeString = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
};




