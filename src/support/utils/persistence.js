/**
 * 持久化帮助类, 封装 Session,local, 用于管理持久化数据
 * */

export const PERSISTENCE_TYPE = 'session';

/**
 * type={session, local}, default: session
 * eg. 数据只要不是字符串类型, 将自动转换成json对象存储
 * */
export function setPersistenceData(key, value, type = PERSISTENCE_TYPE) {
  if (typeof value != 'string') value = JSON.stringify(value);
  if (type === 'session') {
    sessionStorage.setItem(key, value);
  } else if (type === 'local') {
    localStorage.setItem(key, value);
  }
}

/**
 * 获取数据
 * */
export function getPersistenceData(key, type = PERSISTENCE_TYPE) {
  if (type === 'session') {
    return sessionStorage.getItem(key);
  } else if (type === 'local') {
    return localStorage.getItem(key);
  }
}

/**
 * 清空数据
 * @param type
 */
export function clearPersistenceData(type = PERSISTENCE_TYPE) {
  if (type === 'session') {
    return sessionStorage.clear();
  } else if (type === 'local') {
    return localStorage.clear();
  }
}
