import React from 'react';
import TableComponent from './TableComponent';
import { transformViews } from '../../support/utils/formUtil';
import { Button, Card } from 'antd';
import FloatLayout from '../../support/widget/FloatLayout';
import { request } from '../../support/utils/request';
import SearchForm from '../../support/widget/SearchForm';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

export default class BasicTableLayout extends TableComponent {
  state = {
    actionKey: null,
  };

  initPageHeaderParams() {
    return {
      action: <div>{transformViews(this.stepToolbarActionFields())}</div>,
    };
  }

  stepToolbarActionFields() {
    return null;
  }

  initCardParams() {}

  renderToolbar() {
    const toolbarStyle = { display: 'flex', padding: 0, marginBottom: 16 };
    const fields = this.stepToolbarFields() || [];
    return (
      fields.length > 0 && (
        <div style={toolbarStyle}>
          {transformViews(fields)}
          {/*<InputSearch disabled={loading} style={{marginLeft: 16, width: 200}}/>*/}
        </div>
      )
    );
  }

  stepToolbarFields() {
    const { loading } = this.props;
    return [
      {
        key: 'add',
        content: '添加',
        componentName: 'Button',
        componentOptions: {
          disabled: loading,
          type: 'primary',
          icon: 'plus',
          onClick: () => this.onClickAction('add'),
        },
      },
    ];
  }

  /**
   *  接收对象格式
   *  component: 组件
   *  options: 弹出层参数(可选)[复数]
   * */
  stepFloatFields() {
    return [];
  }

  onCancel() {
    setTimeout(() => this.setState({ actionKey: null }), 100);
  }

  async onHandle(params) {
    try {
      params.showMessage = true;
      const result = await request(params);
      await this.onHandleSuccessCallback(result);
      return result;
    } catch (error) {}
  }

  onHandleSuccessCallback(data) {
    this.onCancel();
    const { actionKey, selectedRowKeys } = this.state;
    const { resetPage, list, page } = this.props;
    if (actionKey && actionKey == 'del' && list.length == 1) {
      resetPage(page - 1, true);
    } else if (actionKey && actionKey == 'delete') {
      if (list && list.length == selectedRowKeys.length)
        resetPage(page - 1, true);
      this.setState({ selectedRowKeys: [], selectedRows: [] });
    } else {
      this.props.onRefresh();
    }
  }

  getFloatParams() {
    const { actionKey, selectedData } = this.state;
    return {
      selectedData,
      selectedKey: actionKey,
      onCancel: this.onCancel.bind(this),
      onSuccessCallback: this.onHandleSuccessCallback.bind(this),
    };
  }

  stepSearchFields() {
    return { dataSource: [], expand: false };
  }

  render() {
    return (
      <PageHeaderWrapper
        {...this.initPageHeaderParams()}
        extra={this.renderToolbar()}
      >
        <Card bordered={false} {...this.initCardParams()}>
          {this.stepSearchFields() && (
            <SearchForm
              {...this.stepSearchFields()}
              onSubmit={values => this.props.onSearch(values)}
            />
          )}
          {this.initTableView()}
        </Card>
        <FloatLayout
          {...this.getFloatParams()}
          fields={this.stepFloatFields()}
        />
      </PageHeaderWrapper>
    );
  }
}
