/**
 *
 * Created by Freddie on 2018/09/04
 * Description: 路由管理类, 封装路由, 利于管理维护
 */

import { history as router } from 'umi';
import { parse } from 'qs';

const getHomePage = () => '/home';

/**
 * 跳转
 * */
export function exPush(path) {
  router.push(path);
}

/**
 * 替换跳转
 * */
export function exReplace(path) {
  router.replace(path);
}

/**
 * 回退
 * */
export function exGoBack() {
  router.goBack();
}

export function redirect() {
  const params = getPageQuery();
  let { redirect } = params;
  if (redirect) {
    window.location.href = redirect;
  } else {
    router.replace(getHomePage());
  }
}

function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}
