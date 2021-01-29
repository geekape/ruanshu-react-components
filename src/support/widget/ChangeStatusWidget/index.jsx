/**
 * 表格数据状态显示控件
 */

import React from 'react';
import { Menu, Dropdown, Modal } from 'antd';
import styles from './index.less';

export default class ChangeStatusWidget extends React.Component {
  constructor(props) {
    super(props);
    this.refStatusWidget = React.createRef();
  }

  mouseEnter(color) {
    this.refStatusWidget.current.style.background = color;
    this.refStatusWidget.current.style.color = '#fff';
  }

  mouseLeave(color) {
    this.refStatusWidget.current.style.background = 'transparent';
    this.refStatusWidget.current.style.color = color;
  }

  showConfirm(value) {
    const {
      dataSource,
      transformChildren = item => {
        return { key: item.dicCode, value: item.dicValue };
      },
    } = this.props;

    const find = transformChildren(
      dataSource.find(item => {
        let transform = transformChildren(item);
        return transform.key === value.key;
      }),
    );

    const _this = this;

    Modal.confirm({
      title: '确认',
      content: `您确定要${find.value}吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        _this.props.selectedStatus(find.key);
      },
    });
  }

  render() {
    const {
      value,
      color = '#1890ff',
      width = 80,
      dataSource = [],
      colorSource,
      transformChildren = item => {
        return { key: item.dicCode, value: item.dicValue };
      },
    } = this.props;

    const menu = (
      <Menu onClick={value => this.showConfirm(value)}>
        {!dataSource.length && (
          <Menu.Item>
            <span>暂无数据</span>
          </Menu.Item>
        )}
        {dataSource.length &&
          dataSource.map(item => {
            let transformItem = transformChildren(item);
            return (
              <Menu.Item key={transformItem.key}>
                <div
                  className={styles.menuItem}
                  style={{
                    color: '#fff',
                    background: colorSource[transformItem.key],
                  }}
                >
                  {transformItem.value}
                </div>
              </Menu.Item>
            );
          })}
      </Menu>
    );

    return (
      <Dropdown trigger={['click']} overlay={menu} placement="bottomLeft">
        <div
          ref={this.refStatusWidget}
          className={styles.content}
          onMouseEnter={() => this.mouseEnter(color)}
          onMouseLeave={() => this.mouseLeave(color)}
          style={{ width: width, color: color, borderColor: color }}
        >
          {value}
        </div>
      </Dropdown>
    );
  }
}
