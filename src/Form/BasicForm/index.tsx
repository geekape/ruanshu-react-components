// @ts-nocheck
import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
  memo,
} from 'react';
import { Form, Row, Button, Col, Card, Modal, Drawer } from 'antd';
import { throttle } from 'lodash';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { transformData, setFormLayout } from '../../support/utils/formUtil';
import useHandle from '../../support/hooks/useHandle';

import styles from './index.less';

export interface IProps {
  dataSource: DataSourceItem[];
  form?: any;
  config?: Object;
  formLayout?: Object;
  onSuccessCallback?: () => void;
  onCancel?: () => void;
  submitParams?: () => void;
  onSubmit: any;
  visible?: Boolean;
  cardParams?: Object;
  buttonParams?: Object;
  formStyle?: Object;
  children?: Node;
  footer?: any;
}

export interface DataSourceItem {
  key: String;
}

interface FormConfig {
  mode: 1 | 2 | 3 | 4 | 5;
  bodyFlexDirection: String;
}

const FormItem = Form.Item;

const tailFormItemLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 6, offset: 4 },
  },
};

const BasicForm = (props: IProps, ref) => {
  const {
    dataSource = [],
    form,
    config = {},
    onSuccessCallback,
    onCancel,
    submitParams,
    visible = false,
    children,
    cardParams,
    footer,
    formLayout = { labelCol: 4, wrapperCol: 20 },
    buttonParams = {
      text: '提交',
      offset: 0,
      span: 24,
      style: { width: '100%' },
    },
    formStyle,
  } = props;

  useImperativeHandle(ref, () => ({
    props,
  }));

  const { isLoading, isError, onHandle } = useHandle();

  function handleSubmit() {}

  const { getFieldDecorator, getFieldValue } = props.form;
  // function renderFormItems() {
  //   return (
  //     <div>
  //       {dataSource.map(item => {
  //         const {
  //           key,
  //           formItemOptions,
  //           fieldDecoratorOptions,
  //           render,
  //           extraRender,
  //           visibility,
  //         } = transformData(item);
  //         return (
  //           <Form.Item
  //             {...setFormLayout(formLayout)}
  //             {...formItemOptions}
  //             key={key}
  //           >
  //             {getFieldDecorator(key, fieldDecoratorOptions)(render)}
  //             {extraRender}
  //           </Form.Item>
  //         );
  //       })}
  //     </div>
  //   );
  // }

  const renderFormItem = item => {
    const {
      key,
      formItemOptions,
      fieldDecoratorOptions,
      render,
      extraRender,
      visibility,
    } = transformData(item);
    if (!visibility) return;

    const getFormItem = () => (
      <FormItem {...setFormLayout(formLayout)} {...formItemOptions} key={key}>
        {getFieldDecorator(key, fieldDecoratorOptions)(render)}
        {extraRender}
      </FormItem>
    );
    return key && render ? (
      item.span && typeof item.span === 'number' ? (
        <Col span={item.span}>{getFormItem()}</Col>
      ) : (
        getFormItem()
      )
    ) : (
      item
    );
  };

  const transformItem = (item, index = 0) => {
    if (item.componentName === 'Div' && item.children) {
      return (
        <div key={item.key || index} {...item.componentOptions}>
          {item.children.map(renderFormItem)}
        </div>
      );
    } else {
      return renderFormItem(item, index);
    }
  };

  function transFormChildren(children) {
    return children.map((item, index) => {
      if (Array.isArray(item)) {
        return transFormChildren(item);
      } else if (
        (item && item.hasOwnProperty('componentName')) ||
        item.hasOwnProperty('component')
      ) {
        return transformItem(item);
      } else {
        return item;
      }
    });
  }

  const onSubmit = event => {
    form.validateFields((err, values) => {
      throttle(async () => {
        if (!err && props.onSubmit) {
          props.onSubmit(values, onHandle);
        } else if (!err && submitParams) {
          onHandle(submitParams(values), result => {
            if (onSuccessCallback) {
              onSuccessCallback(result);
            } else {
              onCancel();
            }
          });
        }
      }, 1000)();
    });
  };

  function initFormView() {
    return (
      <Form style={{ flexGrow: 1, ...formStyle }}>
        <Row>
          {children && Array.isArray(children)
            ? transFormChildren(children)
            : Array.isArray(dataSource) && dataSource.map(transformItem)}
        </Row>
        {config && (config.mode === 3 || config.mode === 4) && (
          <FormItem {...tailFormItemLayout}>
            {footer != null ? (
              footer({ isLoading, onSubmit, onCancel })
            ) : (
              <Button
                style={buttonParams.style}
                loading={isLoading}
                onClick={onSubmit}
                type="primary"
                htmlType="submit"
              >
                {buttonParams.text}
              </Button>
            )}
          </FormItem>
        )}
      </Form>
    );
  }

  const mode = (config && config.mode) || 1;

  const container = (
    <div
      className={styles.float_body}
      style={{
        flexDirection: (config && config.bodyFlexDirection) || 'column',
      }}
    >
      {initFormView()}
    </div>
  );

  switch (mode) {
    case 1:
      return (
        <Modal
          {...config}
          onCancel={onCancel}
          visible={visible}
          loading={isLoading}
          onOk={onSubmit}
        >
          {container}
        </Modal>
      );
    case 2:
      const bodyStyle = {
        paddingBottom: '50px',
        height: '100vh',
        overflow: 'auto',
      };
      return (
        <Drawer
          {...config}
          maskClosable={true}
          onCancel={onCancel}
          visible={visible}
          bodyStyle={bodyStyle}
        >
          {initFormView()}
          {footer != null ? (
            footer({ isLoading, onSubmit, onCancel })
          ) : (
            <div className={styles.container}>
              <Button style={{ marginRight: 8 }} onClick={onCancel}>
                取消
              </Button>
              <Button loading={isLoading} onClick={onSubmit} type="primary">
                提交
              </Button>
            </div>
          )}
        </Drawer>
      );
    case 3: {
      return (
        <PageHeaderWrapper>
          <Card bordered={false} {...cardParams}>
            {container}
          </Card>
        </PageHeaderWrapper>
      );
    }
    case 4:
      return initFormView();
    default:
      return null;
  }
};

export default Form.create<IProps>()(memo(forwardRef(BasicForm)));
