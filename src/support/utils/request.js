import { notification } from 'antd';
import {
  checkLoginPermissions,
  defaultRequestHeaders,
  handleResponse,
  handleResponseFailure,
} from '../config';
import { history } from 'umi';
import { parseFormData, parseUrlData } from './transform';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext,
  });

  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  return Promise.reject(error);
};

/**
 * 请求
 * @param params
 * @returns {Promise<Promise<any> | never | Promise<never>>}
 */
export function request(params) {
  let {
    url,
    method = 'POST',
    body,
    bodyType = 'JSON',
    checkLogin = true,
    showMessage,
    msg,
    headers,
    initDefaultHeader = true,
  } = params;
  const temp = { method: method.toUpperCase() };
  if (initDefaultHeader) {
    temp.headers = { ...defaultRequestHeaders(), ...headers };
  } else {
    temp.headers = { ...headers };
  }
  if (checkLogin && !checkLoginPermissions()) {
    history.replace('/user/login');
  }
  if (['POST', 'PUT', 'DELETE'].find(item => temp.method === item) && body) {
    if (bodyType === 'FORM_DATA') {
      temp.body = parseFormData(body);
    } else if (bodyType === 'JSON') {
      //temp.credentials = 'include';
      temp.headers['Content-Type'] = 'application/json; charset=utf-8';
      temp.body = JSON.stringify(body);
    } else if (bodyType === 'GET') {
      url += parseUrlData(body);
    }
  } else if (temp.method === 'GET') {
    // temp.credentials = 'include';
    temp.headers['Content-Type'] = 'application/json; charset=utf-8';
    url += parseUrlData(body);
  }
  return fetch(url, temp)
    .then(checkStatus)
    .then(response => response.json())
    .then(res => handleResponse(res, showMessage, msg))
    .catch(e => {
      if (msg) e.message = msg;
      handleResponseFailure(e, url);
      return Promise.reject(e);
    });
}

/**
 * 下载文件
 */
export function downloadFile(fileUrl) {
  fetch(fileUrl).then(res =>
    res.blob().then(blob => {
      const filename = res.headers.get('Content-Disposition');
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
      } else {
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(blob); // 获取 blob 本地文件连接 (blob 为纯二进制对象，不能够直接保存到磁盘上)
        a.href = url;
        a.download = getFileName(fileUrl);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    }),
  );
}

function getFileName(url) {
  let num = url.lastIndexOf('/') + 1;
  let fileName = url.substring(num);
  //把参数和文件名分割开
  fileName = decodeURI(fileName.split('?')[0]);
  return fileName;
}
