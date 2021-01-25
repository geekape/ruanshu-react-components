import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Form, Icon, Select, Row, Col, Button } from 'antd';
import './index.less';

let id = 0;

const formItemLayout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

export interface IProps {
  /**
   * 动态选择器的值，是个二维数组
   */
  value?: Array<Object>;
  /**
   * 动态选择器的每一项数据
   */
  selects: Array<SelectItem>;
  /**
   * 动态选择器变动的回调
   */
  onChange: (value: Array<Array<Object>>) => void;
  form: any;
}

export interface SelectItem {
  /**
   * 动态选择器单项的key，唯一值
   */
  key: any;
  list: Array<SelectListItem>;
  placeholder: String;
}

export interface SelectListItem {
  key: String | Number;
  value: String | Number;
}

function DynamicSelect(props: IProps) {
  const [value, setValue] = useState<any>([]);

  useEffect(() => {
    setTimeout(() => {
      const val = props.value;
      if (Array.isArray(val)) {
        setValue(val);
        id = 0;
        val.forEach(item => {
          add();
        });
      } else {
        id = 0;
        add();
      }
    }, 500);
  }, []);

  const remove = (k: number) => {
    const { form } = props;
    const keys = form.getFieldValue('keys');
    if (keys.length === 1) {
      return;
    }

    form.setFieldsValue({
      keys: keys.filter((key: number) => key !== k),
    });
  };

  const add = () => {
    const { form } = props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  const getValues = useCallback(() => props.form.getFieldValue('names'), []);

  const handleChange = (val: string, key: number, index: number) => {
    const newValue = getValues().reduce((t: any, v: any) => [...t, v], []);
    newValue[index][key] = val;
    props.onChange(newValue);
  };

  const handleSubmit = () => {};

  const { getFieldDecorator, getFieldValue } = props.form;
  const { selects = [] } = props;

  getFieldDecorator('keys', { initialValue: [] });
  const keys = getFieldValue('keys');

  const formItems = keys.map((k: number, index: number) => (
    <Form.Item {...formItemLayout} label="" required={false} key={k}>
      <Row>
        <Col span={22}>
          <Row>
            {selects.map(item => (
              <Col span={24 / selects.length} key={item.key}>
                {getFieldDecorator(`names[${k}][${item.key}]`, {
                  initialValue: value[k] && value[k][item.key],
                })(
                  <Select
                    placeholder={item.placeholder}
                    key={`${item.key}-${k}`}
                    onChange={(val: any) => {
                      handleChange(val, item.key, index);
                    }}
                  >
                    {item.list.map(ite => (
                      <Select.Option key={`${ite.key}`}>
                        {ite.value}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Col>
            ))}
          </Row>
        </Col>
        <Col span={2}>
          {keys.length > 1 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              onClick={() => remove(k)}
            />
          ) : null}
        </Col>
      </Row>
    </Form.Item>
  ));

  return (
    <Form onSubmit={handleSubmit}>
      {formItems}
      <Form.Item>
        <Button type="dashed" onClick={add} style={{ width: '60%' }}>
          + 再加一个
          {/* <Icon type="plus" /> 再加一个 */}
        </Button>
      </Form.Item>
    </Form>
  );
}

export default Form.create<IProps>()(DynamicSelect);
