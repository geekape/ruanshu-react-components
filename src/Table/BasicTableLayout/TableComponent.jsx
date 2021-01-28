/**
 *
 * Created by Freddie on 2018/09/04
 * Description: WEB端通用表格操作继承类
 */

import React from 'react';
import { Button, Divider, Dropdown, Icon, Menu, Popconfirm, Table } from 'antd';
import { checkAuthority } from '../../support/config';

import { transformComponent } from '../../support/utils/formUtil';
import { formatValue } from '../../support/utils/transform';

export default class TableComponent extends React.PureComponent {
  state = {
    rowKeyName: 'id',
  };

  defaultRowSelection() {
    const {
      selectedRowKeys = [],
      selectedRows = [],
      rowKeyName = 'id',
    } = this.state;
    return {
      selectedRowKeys,
      onChange: (keys, rows) => {
        if (keys.length === rows.length) {
          this.setState({ selectedRowKeys: keys, selectedRows: rows });
        } else {
          let list = [...rows, ...selectedRows];
          let temp = [];
          for (let key of keys) {
            const find = list.find(item => item[rowKeyName] === key);
            if (find != null) temp.push(find);
          }
          this.setState({ selectedRowKeys: keys, selectedRows: temp });
        }
      },
    };
  }

  /**
   * 多选参数配置
   * */
  rowSelection() {
    // 建议重写该方法, 用于判断是否为可选项
    // getCheckboxProps: record => ({
    //   disabled: record.name === 'Disabled User', // Column configuration not to be checked
    //   name: record.name,
    // })
    return {};
  }

  /**
   * 多选触发按钮, 可以根据具体喜好进行调整或者重写
   * */
  renderRowSelectionButton(
    onHandle,
    keyword = '删除',
    hasConfirm = true,
    restProps,
  ) {
    const { selectedRowKeys = [] } = this.state;
    const buttonProps = { type: 'primary', ...restProps };
    return (
      selectedRowKeys.length > 0 &&
      (hasConfirm ? (
        <Popconfirm
          key={'plural'}
          onConfirm={onHandle}
          title={`您确定要${keyword}${selectedRowKeys.length}数据吗?`}
        >
          <Button style={{ marginRight: 8 }} {...buttonProps}>
            批量{keyword}
            {selectedRowKeys.length}条数据
          </Button>
        </Popconfirm>
      ) : (
        <Button
          style={{ marginRight: 8 }}
          {...buttonProps}
          onClick={onHandle}
          key={'plural'}
        >
          批量{keyword}
          {selectedRowKeys.length}条数据
        </Button>
      ))
    );
  }

  /**
   * 设置表格唯一标识
   * */
  rowKey(record, position) {
    return record[this.state.rowKeyName] || record.id || position + '';
  }

  onShowSizeChange(current, pageSize) {
    this.props.resetPage({ current, pageSize }, true);
  }

  /**
   * 初始化分页参数
   */
  initPagination() {
    const { total = 0, page = 1, pageSize } = this.props;
    return {
      onShowSizeChange: this.onShowSizeChange.bind(this),
      total: total,
      current: page,
      pageSize: pageSize,
      showSizeChanger: true,
      showTotal: (total, range) => `总共: ${total} 条数据`,
    };
  }

  /**
   * 初始化Table组件
   * */
  initTableView(params) {
    const { showPagination = true, showRowSelection = false } = this.state;
    const { list = [], loading = false } = this.props;
    const tableParams = {
      loading,
      dataSource: list,
      rowKey: this.rowKey.bind(this),
      onChange: this.onTableChange.bind(this),
      pagination: showPagination && this.initPagination(),
    };
    if (showRowSelection) {
      tableParams.rowSelection = {
        ...this.defaultRowSelection(),
        ...this.rowSelection(),
      };
    }

    const { columns, ...other } = this.stepTableFields();
    let formatColumns = [];
    columns.forEach(item => {
      if (!item.hasOwnProperty('render'))
        item.render = record => formatValue(record);
      if (!item.authority || checkAuthority(item.authority /* , 'columns' */))
        formatColumns.push(item);
    });

    return (
      <Table {...tableParams} columns={formatColumns} {...other} {...params} />
    );
  }

  /**
   * 设置Table属性, 详情查看ANTD-table: https://ANTD-design.gitee.io/components/table-cn/
   * tips: 请务必重写该方法,否则影响表格使用
   * */
  stepTableFields() {
    return { columns: [] };
  }

  /**
   * 分页、排序、筛选变化时触发, 详情查看ANTD-table: https://ANTD-design.gitee.io/components/table-cn/
   * */
  onTableChange({ pageSize, current }) {
    const { total, list, resetPage } = this.props;
    if (list.length == total) {
      resetPage({ current, pageSize });
    } else {
      resetPage({ current, pageSize }, true);
    }
  }

  /**
   * 加载表格
   * */
  render() {
    return this.initTableView();
  }

  /**
   * Action相关组件点击时触发
   * */
  onClickAction(actionKey, selectedData) {
    this.setState({ actionKey, selectedData });
  }

  /**
   * 初始化操作栏
   * */
  initActionColumns(columns, authorities, params = {}) {
    if (checkAuthority(authorities)) {
      columns.push({
        title: '操作',
        key: 'action',
        ...params,
        render: (text, record, index) =>
          this.formatActionView(this.stepTableActionFields(record, index)),
      });
    }
    return columns;
  }

  /**
   * 格式化操作栏(增加分割线, 权限判断, 更多数量隐藏)
   * */
  formatActionView(actions) {
    let formatActions = actions.filter(item => checkAuthority(item.authority));
    if (actions && Array.isArray(actions)) {
      let temp = [];
      let menus = [];
      // const maxActionNumber = 3;
      const maxActionNumber = 5;

      for (let i = 0; i < formatActions.length; i++) {
        if (
          !formatActions[i].hasOwnProperty('visibility') ||
          formatActions[i].visibility
        ) {
          if (
            i < maxActionNumber ||
            formatActions.length - maxActionNumber <= 1
          ) {
            temp.push(transformComponent(formatActions[i]));
            if (i < formatActions.length - 1)
              temp.push(<Divider key={'d_' + i} type="vertical" />);
          } else {
            menus.push(formatActions[i]);
          }
        }
      }

      if (menus.length > 1) {
        temp.push(
          <Dropdown
            overlay={
              <Menu>
                {menus.map((item, position) => (
                  <Menu.Item key={`more-${position}`}>
                    {transformComponent(item)}
                  </Menu.Item>
                ))}
              </Menu>
            }
            key={'more'}
          >
            <a className="ant-dropdown-link">
              更多操作 <Icon type="down" />
            </a>
          </Dropdown>,
        );
      }

      return temp;
    } else if (actions) {
      return checkAuthority(actions.authority) && transformComponent(actions);
    }
    return null;
  }

  /**
   * 设置操作栏功能(增删改查)
   * */
  stepTableActionFields(record, index) {
    const actions = [];
    /**
     * eg.
     *    actions.push(this.createTextView(record));
     * */
    return actions;
  }
}
