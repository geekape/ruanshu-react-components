---
title: BasicForm 基础表单
---

# BasicForm 基础表单

## 什么时候用？

## 代码演示

```jsx
/**
 * title: 基础表单
 * description: 这个表单666
 */
import React from 'react';
import { fields } from './common';
import BasicForm from './index';

export default () => {
  return <BasicForm dataSource={fields} config={{ mode: 4 }} />;
};
```

```jsx
/**
 * title: modal嵌套的表单
 */
import React from 'react';
import { fields, useFormBlockButton } from './common';
import BasicForm from './index';

export default () => {
  const { formProps, renderFormButton } = useFormBlockButton();
  return [
    <BasicForm {...formProps} dataSource={fields} config={{ mode: 1 }} />,
    <div>{renderFormButton()}</div>,
  ];
};
```

```jsx
/**
 * title: drawer嵌套的表单
 */
import React from 'react';
import BasicForm from './index';
import { fields, useFormBlockButton } from './common';

export default () => {
  const { formProps, renderFormButton } = useFormBlockButton();
  return [
    <BasicForm
      {...formProps}
      dataSource={fields}
      config={{ mode: 2, width: '500px' }}
    />,
    <div>{renderFormButton()}</div>,
  ];
};
```

<API />
