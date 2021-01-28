import React, { PureComponent } from 'react';
import { Button, Form, Icon } from 'antd';
import { transformData } from '../../utils/formUtil';
import { checkAuthority, SEARCH_TRIGGER_MODE } from '../../config';
import { debounce } from 'lodash';

const FormItem = Form.Item;
// 自动刷新组件
const autoRefreshComponents = ['Select', 'InputSearch'];

@Form.create({
  name: 'global_search',
  onValuesChange: debounce(
    (
      {
        dataSource,
        onSubmit,
        transformValues,
        searchTriggerMode = SEARCH_TRIGGER_MODE,
      },
      changedFields,
      allFields,
    ) => {
      if (searchTriggerMode === 1) {
        if (onSubmit) {
          const key = Object.keys(changedFields)[0];
          const find = dataSource.find(item => item.key === key);
          const contain = autoRefreshComponents.find(
            item => item === find.componentName,
          );
          if (find && find.componentName)
            onSubmit(transformValues ? transformValues(allFields) : allFields);
        } else {
          console.error('please implement SearchForm onSubmit method.');
        }
      }
    },
    500,
  ),
})
export default class SearchForm extends PureComponent {
  state = {
    expand: false,
    hasExpand: false,
    dataSource: [],
  };

  handleSearch = e => {
    e.preventDefault();
    const { form, onSubmit, transformValues } = this.props;
    form.validateFields((err, values) => {
      if (!err && onSubmit)
        onSubmit(transformValues ? transformValues(values) : values);
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
    this.props.onSubmit();
    if (this.props.onSearchReset) this.props.onSearchReset();
  };

  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  };

  renderButton() {
    const { hasExpand } = this.state;
    return (
      <>
        <Button type="primary" htmlType="submit">
          查询
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
          清空
        </Button>
        {hasExpand && (
          <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
            {this.state.expand ? '收起' : '展开'}{' '}
            <Icon type={this.state.expand ? 'up' : 'down'} />
          </a>
        )}
      </>
    );
  }

  initFormParams() {
    return {
      hideRequiredMark: true,
      onSubmit: this.handleSearch.bind(this),
      layout: 'inline',
      style: { marginBottom: 8 },
    };
  }

  componentDidMount() {
    const { dataSource = [] } = this.props;
    let hasExpand = false;
    const filter = dataSource.filter(item => {
      if (item.hasOwnProperty('expand') && !hasExpand) hasExpand = true;
      return checkAuthority(item.authority);
    });
    this.setState({ dataSource: filter, hasExpand });
  }

  render() {
    const {
      form,
      searchTriggerMode = SEARCH_TRIGGER_MODE,
      extra = '',
    } = this.props;
    const { getFieldDecorator } = form;
    const { dataSource = [] } = this.state;

    return (
      <Form {...this.initFormParams()} className={'search-form'}>
        {dataSource.map(item => {
          const defaultStyle = { width: 200 };
          if (!item.componentOptions) {
            item.componentOptions = { style: defaultStyle };
          } else if (!item.componentOptions.style) {
            item.componentOptions.style = defaultStyle;
          }
          const {
            key,
            formItemOptions,
            fieldDecoratorOptions,
            render,
            extraRender,
          } = transformData(item);
          if (key) {
            if (
              !item.hasOwnProperty('expand') ||
              (item.expand && this.state.expand)
            ) {
              return (
                <FormItem
                  {...formItemOptions}
                  key={key}
                  labelCol={null}
                  wrapperCol={null}
                >
                  {render &&
                    getFieldDecorator(key, fieldDecoratorOptions)(render)}
                  {extraRender}
                </FormItem>
              );
            }
          }
        })}
        {searchTriggerMode === 0 && dataSource.length > 0 && (
          <FormItem>
            {this.renderButton()}
            {extra}
          </FormItem>
        )}
      </Form>
    );
  }
}
