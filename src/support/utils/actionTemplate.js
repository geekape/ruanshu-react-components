/**
 * 按钮模板
 * */
import React from 'react';
import { Icon, Modal } from 'antd';
import { exPush } from '../support/utils/router-helper';
import styles from './ActionTemplate.less';
import { COMMON_STATUS, COMMON_STATUS_COLOR } from '@/constants/common';
import { findAttributeValue } from '@/support/utils/transform';
import ChangeStatusWidget from '@/components/ChangeStatusWidget';

const { confirm } = Modal;

let DEFAULT_KEY = 0;

export function createButton(
  that,
  options = {
    key: 'add',
    content: '新建',
    componentOptions: { type: 'primary' },
  },
  onClick,
) {
  return {
    key: options.key,
    content: options.content,
    componentName: 'Button',
    componentOptions: {
      onClick: onClick ? onClick : () => that.onClickAction(options.key),
      ...options.componentOptions,
    },
  };
}

/**
 * 确认弹窗模板
 * */
export function createPopConfirm(
  that,
  params,
  options = {
    key: 'del',
    content: '删除',
    componentOptions: { title: '您确定要删除吗?' },
  },
  onConfirm,
) {
  return {
    key: options.key,
    content: (
      <a className={`${content === '删除' ? styles.delete : styles.link}`}>
        {options.content}
      </a>
    ),
    componentName: 'PopConfirm',
    componentOptions: {
      onConfirm: onConfirm
        ? onConfirm
        : () =>
            that.setState({ actionKey: 'del' }, () => that.onHandle(params)),
      ...options.componentOptions,
    },
  };
}

export function createModalConfirm(
  { title = '删除', content = '您确定要删除吗?', authority, disabled = false },
  onHandle,
) {
  return {
    key: 'confirm' + ++DEFAULT_KEY,
    content: title,
    authority: authority,
    componentName: 'TextLink',
    componentOptions: {
      disabled: disabled,
      className: title === '删除' ? styles.delete : styles.link,
      onClick: () =>
        confirm({
          title,
          cancelText: '取消',
          okText: '确定',
          content,
          style: { top: 360 },
          icon:
            title === '删除' ? (
              <Icon type="exclamation-circle" />
            ) : (
              <Icon type="question-circle" />
            ),
          onOk() {
            onHandle();
          },
        }),
    },
  };
}

/**
 * 文本模板
 * */
export function createTextLink(
  that,
  record,
  options = { key: 'edit', content: '编辑' },
  disabled = false,
) {
  const defaultOption = {
    componentName: 'TextLink',
    componentOptions: {
      onClick: () => that.onClickAction(options.key, record),
      disabled: disabled,
      className: options.content === '删除' ? styles.delete : styles.link,
    },
  };
  return { ...defaultOption, ...options };
}

/**
 * 文本跳转模板
 * */
export function createRouteLink(
  path,
  options = { key: 'link', content: '跳转' },
  extraOptions,
) {
  const defaultOption = {
    componentName: 'TextLink',
    componentOptions: { onClick: () => exPush(path), ...extraOptions },
  };
  return { ...defaultOption, ...options };
}

/**
 * 文本直接操作模板
 * */
export function createOprLink(
  options = { key: 'click', content: '点击', disabled: false },
  onClick = () => {},
) {
  const defaultOption = {
    componentName: 'TextLink',
    componentOptions: {
      onClick: onClick,
      disabled: options.disabled || false,
    },
  };
  return { ...defaultOption, ...options };
}

export function initFloatHandleOptions(name, params) {
  return [
    { key: 'add', title: `添加${name}`, ...params },
    { key: 'edit', title: `修改${name}`, ...params },
  ];
}

export function basicSubmitParams(values, selectedKey, url, id) {
  let method;
  if (selectedKey === 'add') {
    method = 'post';
  } else if (selectedKey === 'edit') {
    method = 'put';
    if (id) values.id = id;
  }
  return { url, method, body: values };
}

export function createStatus(
  status,
  onHandle,
  list = COMMON_STATUS,
  options = { key: 'dicCode', value: 'dicValue' },
) {
  let text = findAttributeValue(String(status), list, options);
  return (
    <ChangeStatusWidget
      color={COMMON_STATUS_COLOR[String(status)]}
      value={text}
      dataSource={list}
      colorSource={COMMON_STATUS_COLOR}
      selectedStatus={onHandle}
    />
  );
}
