import {
  Button,
  Cascader,
  Checkbox,
  DatePicker,
  Input,
  InputNumber,
  Popconfirm,
  Radio,
  Select,
  Switch,
  TimePicker,
  TreeSelect,
} from 'antd';

const { MonthPicker, RangePicker } = DatePicker;

import { checkAuthority } from '../config';

/**
 * 格式化数据, 仅适用解析表单
 * */
export function transformData({
  key,
  value,
  content,
  required = false,
  formItemOptions,
  fieldDecoratorOptions,
  component,
  componentName,
  componentChildren,
  componentOptions,
  transformChildren,
  visibility = true,
  extraRender,
  verify,
}) {
  const { formLayout, ...other } = formItemOptions || {};
  const tempFormItemOptions = {
    label: content,
    ...(formLayout ? setFormLayout(formLayout) : setFormItemOptions(content)),
    ...other,
  };

  /**
   * 简单为空限制, 默认不限制
   * */
  if (
    (verify || required) &&
    fieldDecoratorOptions &&
    fieldDecoratorOptions.rules
  ) {
    if (componentName && componentName === 'Input') {
      fieldDecoratorOptions.rules.push({
        required,
        whitespace: true,
        message: `${tempFormItemOptions.label}不允许为空`,
      });
    }
    // insertVerify(verify, rules, tempFormItemOptions.label);
  } else if (verify || required) {
    if (componentName && componentName === 'Input') {
      fieldDecoratorOptions = {
        rules: [
          {
            required,
            whitespace: true,
            message: `${tempFormItemOptions.label}不允许为空`,
          },
        ],
      };
    } else {
      fieldDecoratorOptions = {
        rules: [
          { required, message: `${tempFormItemOptions.label}不允许为空` },
        ],
      };
    }
    // insertVerify(verify, rules, tempFormItemOptions.label);
  }

  return {
    key,
    formItemOptions: tempFormItemOptions,
    fieldDecoratorOptions: {
      initialValue: value != null ? value : undefined,
      ...fieldDecoratorOptions,
    },
    visibility,
    render:
      component ||
      (componentName &&
        transformComponent({
          content,
          componentName,
          componentChildren,
          componentOptions,
          transformChildren,
        })),
    extraRender,
  };
}

/**
 *  根据数据格式, 转换具体的View
 * */
export function transformComponent(component) {
  const {
    key,
    content,
    componentName,
    componentChildren = [],
    componentOptions,
    transformChildren = item => ({
      key: item.key,
      value: item.key,
      text: item.value,
      disabled: item.disabled || false,
    }),
  } = component;

  if (component.componentName) {
    switch (componentName) {
      case 'Input':
        return (
          <Input
            key={key}
            placeholder="请输入"
            maxLength={50}
            {...componentOptions}
          />
        );

      case 'InputSearch':
        return (
          <Input.Search key={key} placeholder="请输入" {...componentOptions} />
        );

      case 'InputNumber':
        return (
          <InputNumber
            style={{ width: '100%' }}
            key={key}
            placeholder="请输入"
            min={0}
            {...componentOptions}
          />
        );

      // case 'Upload':
      //   return <UploadView key={key} {...componentOptions} />;

      case 'Select':
        return (
          <Select key={key} placeholder={'请选择'} {...componentOptions}>
            {componentChildren.map((item, index) => {
              const transformedValue = transformChildren(item, index);
              return (
                <Select.Option {...transformedValue}>
                  {transformedValue.text}
                </Select.Option>
              );
            })}
          </Select>
        );

      // case 'SearchSelect':
      //   return (
      //     <SearchSelect
      //       transformChildren={transformChildren}
      //       key={key}
      //       {...componentOptions}
      //     />
      //   );

      case 'TreeSelect':
        return (
          <TreeSelect key={key} placeholder={'请选择'} {...componentOptions}>
            {componentChildren.map(item =>
              traverseView(TreeSelect.TreeNode, item),
            )}
          </TreeSelect>
        );

      case 'DatePicker':
        return (
          <DatePicker
            key={key}
            style={{ width: '100%' }}
            {...componentOptions}
          />
        );

      case 'TimePicker':
        return (
          <TimePicker
            key={key}
            style={{ width: '100%' }}
            {...componentOptions}
          />
        );

      case 'RangePicker':
        return (
          <RangePicker
            key={key}
            style={{ width: '100%' }}
            {...componentOptions}
          />
        );
      case 'MonthPicker':
        return (
          <MonthPicker
            key={key}
            style={{ width: '100%' }}
            {...componentOptions}
          />
        );
      case 'Radio':
        return (
          <Radio.Group key={key} placeholder={'请选择'} {...componentOptions}>
            {componentChildren.map((item, index) => {
              const transformedValue = transformChildren(item, index);
              return (
                <Radio
                  key={transformedValue.key}
                  disabled={transformedValue.disabled}
                  value={transformedValue.value || transformedValue.key}
                >
                  {transformedValue.text}
                </Radio>
              );
            })}
          </Radio.Group>
        );

      case 'TextArea':
        return (
          <Input.TextArea
            key={key}
            placeholder=""
            autoSize={{ minRows: 2, maxRows: 6 }}
            maxLength={100}
            {...componentOptions}
          />
        );

      case 'Button':
        return (
          <Button key={key} {...componentOptions}>
            {content}
          </Button>
        );

      case 'TextLink':
        return (
          <a key={key} {...componentOptions}>
            {content}
          </a>
        );

      case 'PopConfirm':
        return (
          <Popconfirm key={key} {...componentOptions}>
            {content}
          </Popconfirm>
        );

      case 'Cascader':
        return (
          <Cascader key={key} placeholder={'请选择'} {...componentOptions} />
        );

      case 'Checkbox':
        return (
          <Checkbox.Group
            key={key}
            placeholder={'请选择'}
            {...componentOptions}
          >
            {componentChildren.map((item, index) => {
              const transformedValue = transformChildren(item, index);
              return (
                <Checkbox
                  key={transformedValue.key}
                  value={transformedValue.value || transformedValue.key}
                >
                  {transformedValue.text}
                </Checkbox>
              );
            })}
          </Checkbox.Group>
        );

      case 'Switch':
        return <Switch {...componentOptions} />;

      case 'Div':
        return <div {...componentOptions}>{componentChildren}</div>;
      default:
        return null;
    }
  }
  return component;
}

export function setFormLayout({ labelCol = 4, wrapperCol = 20, offset = 0 }) {
  return {
    labelCol: {
      xs: { span: 24 },
      sm: { span: labelCol, offset },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: wrapperCol, offset },
    },
  };
}

function traverseView(ViewNode, item) {
  if (item.treeNode && item.treeNode.length > 0) {
    return (
      <ViewNode title={item.name} key={item.id} value={item.id} entity={item}>
        {item.treeNode.map(childItem => traverseView(ViewNode, childItem))}
      </ViewNode>
    );
  }
  return (
    <ViewNode title={item.name} key={item.id} value={item.id} entity={item} />
  );
}

export function setFormItemOptions(label, labelCol, wrapperCol) {
  return {
    label,
    ...(labelCol
      ? {
          labelCol: {
            xs: { span: 24 },
            sm: { span: labelCol },
          },
        }
      : {}),
    ...(wrapperCol
      ? {
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: wrapperCol },
          },
        }
      : {}),
  };
}

/**
 *  转换复数View
 * */
export function transformViews(fields) {
  if (!fields) return;
  if (Array.isArray(fields)) {
    return fields
      .filter(item => !item.authority || checkAuthority(item.authority))
      .map(item => transformComponent(item));
  } else {
    if (!fields.authority || checkAuthority(fields.authority)) {
      return transformComponent(fields);
    }
  }
}
