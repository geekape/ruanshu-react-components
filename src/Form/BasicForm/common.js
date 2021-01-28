import React from 'react';
import { Button } from 'antd';

export const fields = [
  {
    key: 'old',
    content: '用户名',
    componentName: 'Input',
    componentOptions: {
      type: 'text',
      placeholder: '请输入用户名',
    },
    required: true,
  },
  {
    key: 'new',
    content: '密码',
    componentName: 'Input',
    componentOptions: {
      type: 'password',
      placeholder: '请输入新密码',
    },
    required: true,
  },
];

export function useFormBlockButton(buttonText = '显示表单') {
  const [show, setShow] = React.useState(false);

  function renderFormButton() {
    return (
      <Button type="primary" onClick={() => setShow(true)}>
        {buttonText}
      </Button>
    );
  }

  const formProps = {
    visible: show,
    onCancel: () => setShow(false),
  };

  return {
    show,
    setShow,
    renderFormButton,
    formProps,
  };
}
