/**
 * 用于转换 FormData 对象
 * */
import React from 'react';
import moment from 'moment';

function dataType(obj) {
  if (obj === null) return 'Null';
  if (obj === undefined) return 'Undefined';
  return Object.prototype.toString.call(obj).slice(8, -1);
}

function dealObjectValue(obj) {
  const param = {};
  if (obj === null || obj === undefined || obj === '' || obj == 'undefined')
    return param;
  for (let key in obj) {
    if (dataType(obj[key]) === 'Object') {
      param[key] = dealObjectValue(obj[key]);
    } else if (
      obj[key] !== null &&
      obj[key] !== undefined &&
      obj[key] !== '' &&
      obj[key] !== 'undefined'
    ) {
      param[key] = obj[key];
    }
  }
  return param;
}

export function parseFormData(obj) {
  const filterObj = dealObjectValue(obj);
  const formData = new FormData();
  for (let key in filterObj) {
    if (filterObj.hasOwnProperty(key) === true)
      formData.append(key, filterObj[key]);
  }
  return formData;
}

/**
 * 转换成URL参数
 * */
export function parseUrlData(obj) {
  if (obj == null) return '';
  let prefix = '?';
  let _result = [];
  for (let key in obj) {
    let value = obj[key];
    // 去掉为空的参数
    if (['', undefined, null].includes(value)) {
      continue;
    }
    _result.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
  }
  return _result.length ? prefix + _result.join('&') : '';
}

const DEFAULT_HINT = '--';

export function formatValue(value) {
  return value != null || value != undefined ? value : DEFAULT_HINT;
}

//遍历字典,找出对应的键
export function findAttributeValue(
  selectedKey,
  array,
  options = { key: 'key', value: 'value' },
) {
  const find = array.find(item => item[options.key] == selectedKey);
  return find ? find[options.value] : DEFAULT_HINT;
}

export function findRightOrWrong(value, right = '是', wrong = '否') {
  if (value == null || value == undefined) return DEFAULT_HINT;
  return value ? right : wrong;
}

export function parseMoment(value, format = 'YYYY-MM-DD HH:mm:ss') {
  const isSafari =
    /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent); //判断是否是safari
  if (isSafari && value) {
    //safari兼容   YYYY/MM/DD HH:mm:ss
    value = value.replace(/\-/g, '/');
  }

  return (value && moment(new Date(value), format)) || moment();
}

export function getMomentValue(momentObj, format = 'YYYY-MM-DD HH:mm:ss') {
  if (momentObj) return momentObj.format(format);
  return moment().format(format);
}

// 获取两日期之间的所有日期
export function enumerateDaysBetweenDates(
  startDate,
  endDate,
  type = 'DD',
  compareType = 'days',
) {
  let dates = [];
  let currDate = parseMoment(startDate);
  let lastDate = parseMoment(endDate);

  while (currDate.diff(lastDate, compareType) <= 0) {
    dates.push(getMomentValue(currDate, type));
    currDate.add(1, compareType);
  }

  return dates;
}

/**
 * 获取视频或者音频时长
 * @param file
 * @param callback
 */
export function getVideoDuration(source, callback) {
  let fileUrl;
  if (typeof source === 'string') {
    fileUrl = source;
  } else {
    fileUrl = URL.createObjectURL(source);
  }
  const audioElement = new Audio(fileUrl);
  audioElement.addEventListener('loadedmetadata', () =>
    callback(Math.round(audioElement.duration)),
  );
}

export function dataURLtoFile(dataUrl, filename = 'image.jpg') {
  let arr = dataUrl.split(',')[1] || dataUrl.split(',')[0],
    mime = 'data:image/jpeg;base64,'.match(/:(.*?);/)[1],
    bstr = atob(arr),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: 'dase64' });
}

/**
 * 用于解析ANT upload上传文件
 * @param files
 * @param mode={0=字符串(复数逗号分隔), 1=字符串数组, 2=对象数组({name, url}), 3=源数据Files}
 * @returns string|Array ,如果数组长度为一择返回具体对象
 */
export function transformUploadFileValue(files, mode = 0) {
  if (files == null) return null;

  let uploadImages = [];
  for (let file of files) {
    if (file.status === 'done' || file.status === 'loaded') {
      //  上传成功
      let url;
      if (file.response && file.response.file) {
        //  上传结果
        url = file.response.file[0];
      } else if (file.response && file.response.vodId) {
        url = file.response.vodId;
      } else if (file.url) {
        url = file.url;
      }
      if (mode === 2) {
        uploadImages.push({
          url,
          name: file.name,
        });
      } else {
        uploadImages.push(url);
      }
    }
  }

  switch (mode) {
    case 0:
      return uploadImages.join(',');
    case 1:
    case 2:
      return uploadImages;
    case 3:
      return files;
  }
}

export function transformDuration(msd) {
  let time = parseFloat(msd) / 1000;
  if (null != time && '' != time) {
    if (time > 60 && time < 60 * 60) {
      let a =
        parseInt(time / 60.0) < 10
          ? '0' + parseInt(time / 60.0)
          : parseInt(time / 60.0);
      let ms = parseInt((parseFloat(time / 60.0) - parseInt(time / 60.0)) * 60);
      let b = ms < 10 ? '0' + ms : ms;
      time = '00:' + a + ':' + b;
    } else if (time >= 60 * 60 && time < 60 * 60 * 24) {
      let H =
        parseInt(time / 3600.0) < 10
          ? '0' + parseInt(time / 3600.0)
          : parseInt(time / 3600.0);
      let ms = parseInt(
        (parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60,
      );
      let M = ms < 10 ? '0' + ms : ms;
      let ss = parseInt(
        (parseFloat(
          (parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60,
        ) -
          parseInt(
            (parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60,
          )) *
          60,
      );
      let S = ss < 10 ? '0' + ss : ss;
      time = H + ':' + M + ':' + S;
    } else {
      let d = parseInt(time) < 10 ? '0' + parseInt(time) : parseInt(time);
      time = '00:00:' + d;
    }
  }
  return time;
}

const default_select_value = ['all', '全部'];

// 过滤参数函数
export const transformValues = values => {
  let obj = {};

  for (let key in values) {
    if (Array.isArray(values[key])) {
      let checkArray = values[key].filter(
        item => !default_select_value.includes(item),
      );
      if (checkArray.length) {
        obj[key] = checkArray;
      }
    } else if (
      typeof values[key] !== 'undefined' &&
      !default_select_value.includes(values[key])
    ) {
      obj[key] = String(values[key]).replace(/(^\s*)|(\s*$)/g, '');
    }
  }

  return obj;
};

// 格式化金额
export const formatMoney = (value = 0) => {
  return value === null ? '0.00' : value.toFixed(2);
};

// 数字转文字
export const convertToChinaNum = num => {
  var arr1 = new Array(
    '零',
    '一',
    '二',
    '三',
    '四',
    '五',
    '六',
    '七',
    '八',
    '九',
  );
  var arr2 = new Array(
    '',
    '十',
    '百',
    '千',
    '万',
    '十',
    '百',
    '千',
    '亿',
    '十',
    '百',
    '千',
    '万',
    '十',
    '百',
    '千',
    '亿',
  ); //可继续追加更高位转换值
  if (!num || isNaN(num)) {
    return '零';
  }
  var english = num.toString().split('');
  var result = '';
  for (var i = 0; i < english.length; i++) {
    var des_i = english.length - 1 - i; //倒序排列设值
    result = arr2[i] + result;
    var arr1_index = english[des_i];
    result = arr1[arr1_index] + result;
  }
  //将【零千、零百】换成【零】 【十零】换成【十】
  result = result.replace(/零(千|百|十)/g, '零').replace(/十零/g, '十');
  //合并中间多个零为一个零
  result = result.replace(/零+/g, '零');
  //将【零亿】换成【亿】【零万】换成【万】
  result = result.replace(/零亿/g, '亿').replace(/零万/g, '万');
  //将【亿万】换成【亿】
  result = result.replace(/亿万/g, '亿');
  //移除末尾的零
  result = result.replace(/零+$/, '');
  //将【零一十】换成【零十】
  //result = result.replace(/零一十/g, '零十');//貌似正规读法是零一十
  //将【一十】换成【十】
  result = result.replace(/^一十/g, '十');
  return result;
};

//遍历字典,找出对应的键
export const traverseValue = (list, value, id, name) => {
  let value2 = '';
  list.map(item => {
    if (item[id] == value) {
      value2 = item[name];
    }
  });
  return value2;
};

//值是数组,遍历字典,找出对应的键
export const traverseArray = (list, arr, id, name) => {
  let arr2 = [];
  arr.map(item => {
    list.map(listItem => {
      if (item == listItem[id]) {
        arr2.push(listItem[name]);
      }
    });
  });
  return arr2;
};

//处理接口返回的 whUserOrderServiceDoc 数据
export const analyseData = data => {
  const formData = {};

  function multipleValue(option) {
    const itemValue = [];
    option.map((items, index) => {
      repetition(items, index);
    });
    function repetition(obj, i) {
      if (obj.whServiceDocOptions) {
        obj.whServiceDocOptions.map(item => {
          repetition(item, i);
        });
      } else {
        if (obj.code) {
          if (itemValue[i]) {
            itemValue[i][obj.title] = obj.code;
          } else {
            itemValue[i] = {};
            itemValue[i][obj.title] = obj.code;
          }
        } else {
          itemValue.push(obj.value);
        }
      }
    }
    return itemValue;
  }

  data.map(item => {
    if (item.whServiceDocOptions) {
      formData[item.title] = multipleValue(item.whServiceDocOptions);
    } else if (item.code) {
      formData[item.title] = item.code;
    } else {
      formData[item.title] = item.value;
    }
  });
  return formData;
};
