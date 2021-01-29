/**
 *
 * Created by Freddie on 2018/09/04
 * Description: 常用工具类
 */

/**
 * 获取一个随机数
 * **/
export function getRandomNumber(digit = 5) {
  let value = '1';
  for (let i = 0; i < digit; i++) value += '0';
  return Math.floor(Math.random() * parseInt(value));
}

/**
 * 创建名称
 * @param prefix 前缀
 * @param separator 分隔符
 * @returns {string} 名称
 */
export function createName({ fileName = '', prefix = '', separator = '-' }) {
  const index = fileName.lastIndexOf('.');
  const fileExtension = fileName.substring(index);
  return prefix + separator + new Date().valueOf() + fileExtension;
}

/**
 * 判断是否有包含
 * */
export function contains(values, value) {
  if (values instanceof Array) {
    for (let i = 0; i < values.length; i++) {
      if (values[i] === value) return true;
    }
    return false;
  } else {
    return values === value;
  }
}

/**
 * 判断此对象是否是Object类型
 * @param {Object} obj
 */
function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

export function isJSON(str) {
  if (typeof str == 'string') {
    try {
      const obj = JSON.parse(str);
      if (typeof obj == 'object' && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
}

/**
 * 判断此类型是否是Array类型
 * @param {Array} arr
 */
function isArray(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]';
}

/**
 *  深度比较两个对象是否相同
 * @param {Object} oldData
 * @param {Object} newData
 */
export function equalsObj(oldData, newData) {
  //       类型为基本类型时,如果相同,则返回true
  if (oldData === newData) return true;
  if (
    isObject(oldData) &&
    isObject(newData) &&
    Object.keys(oldData).length === Object.keys(newData).length
  ) {
    //      类型为对象并且元素个数相同

    //      遍历所有对象中所有属性,判断元素是否相同
    for (const key in oldData) {
      if (oldData.hasOwnProperty(key)) {
        if (!equalsObj(oldData[key], newData[key]))
          //      对象中具有不相同属性 返回false
          return false;
      }
    }
  } else if (
    isArray(oldData) &&
    isArray(oldData) &&
    oldData.length === newData.length
  ) {
    //      类型为数组并且数组长度相同

    for (let i = 0, length = oldData.length; i < length; i++) {
      if (!equalsObj(oldData[i], newData[i]))
        //      如果数组元素中具有不相同元素,返回false
        return false;
    }
  } else {
    //      其它类型,均返回false
    return false;
  }

  //      走到这里,说明数组或者对象中所有元素都相同,返回true
  return true;
}

/**
 * 获取文件类型
 * @param name
 * @param type = {0: 图片, 1:视频}
 * @returns {*}
 */
export function checkFileType(name, type = 0) {
  let types;
  switch (type) {
    case 1:
      types = [
        'avi',
        'wmv',
        'mkv',
        'mp4',
        'mov',
        'rm',
        '3gp',
        'flv',
        'mpg',
        'rmvb',
      ];
      return RegExp('.(' + types.join('|') + ')$', 'i').test(
        name.toLowerCase(),
      );
    case 0:
      types = ['gif', 'jpeg', 'jpg', 'bmp', 'png'];
      return RegExp('.(' + types.join('|') + ')$', 'i').test(
        name.toLowerCase(),
      );
  }
  return false;
}
