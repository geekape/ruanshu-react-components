import { getPersistenceData } from '../utils/persistence';

export const PAGE_SIZE = 10;

export const LOADING_REFRESH_TYPE = 1;
export const DEFAULT_LOADING_HANDLE_TYPE = 4;

export const SEARCH_TRIGGER_MODE = 0;
export const DEFAULT_IMAGE = '/images/img_default.png';

export const PERSISTENCE_TYPE = 'session';

export function checkLoginPermissions() {
  const token = getPersistenceData(SL_TOKEN);
  return token != undefined || token != null;
}

export function defaultRequestHeaders() {
  const headers = {
    Accept: 'application/json, text/plain, */*',
  };

  if (window[USER_PLATFORM]) {
    headers['User-Platform'] = window[USER_PLATFORM];
  }

  const token = getPersistenceData(SL_TOKEN);
  if (token) headers['Authorization'] = token;
  return headers;
}

/**
 * 全局请求回调
 * */
export function handleResponse(res, showMessage, msg) {
  const { data, resultCode } = res;
  let messageValue = msg || res.message;

  if (resultCode === 0 || resultCode === '0' || resultCode === 200) {
    if (showMessage && messageValue) message.success(messageValue);
    return data;
  } else if (res.RequestId && res.UploadAuth && res.UploadAddress) {
    // 阿里云接口数据兼容(单独处理)
    return data;
  } else {
    const find = ERROR_CODES.find(item => item.code === resultCode);
    messageValue = find ? find.value : res.message;
    if (showMessage) message.error(messageValue);
  }

  throw new Error(messageValue);
}

export function handleResponseFailure(e, url) {
  const status = (e && e.name) || 404;
  if (status === 401) {
    window.g_app._store.dispatch({ type: 'login/logout' });
  } else if (status === 403) {
    router.push('/exception-403');
  } else if (status <= 504 && status >= 500) {
    router.push('/exception-500');
  } else if (status >= 404 && status < 422) {
    if (url.indexOf('/users') > -1) {
      router.push('/exception-404');
    }
  }
}

/**
 * 全局权限校验方法, 请根据自身需求重写该方法
 * */
export function checkAuthority(authorities, type) {
  if (authorities == null) return true;

  let find,
    authorizations = window.actionAuthority;

  if (type === 'columns') authorizations = window.cloumsAuthority;

  if (window.actionAuthority) {
    const currentPathName = window.location.pathname;

    if (
      typeof authorities === 'string' &&
      authorizations &&
      authorizations.length > 0
    ) {
      find = authorizations.find(item => {
        let matchingPath =
          currentPathName.indexOf(item.menuUrl) > -1 || item.menuUrl === '/all';

        let matchingCode =
          item.actionCode === authorities || item.cloumsCode === authorities;

        return matchingCode && matchingPath;
      });
    } else if (
      Array.isArray(authorities) &&
      authorizations &&
      authorizations.length > 0
    ) {
      find = authorities.find(item =>
        authorizations.find(authority => {
          let matchingPath =
            currentPathName.indexOf(authority.menuUrl) > -1 ||
            authority.menuUrl === '/all';

          let matchingCode =
            authority.actionCode === item || authority.cloumsCode === item;

          return matchingPath && matchingCode;
        }),
      );
    }

    return !!find;
  }

  return false;
}

/**
 * 全局列表请求请求默认携带参数
 * */
export function defaultListParams(page = 1, pageSize) {
  return { page: page - 1, size: pageSize };
}

/**
 * 解析Response List数据, 返回ListData
 * return {
 *     list: Array,
 *     total : Integer
 * }
 * */
export function parseListData(data) {
  let list = [];
  let total = 0;
  if (data && Array.isArray(data) && data.length > 0) {
    list = data;
    total = data.length;
  } else if (data && data.content && data.content.length > 0) {
    list = data.content;
  } else if (data && data.list && data.list.length > 0) {
    list = data.list;
  }

  if (data && data.totalElements) {
    total = data.totalElements;
  }
  return { list, total };
}
