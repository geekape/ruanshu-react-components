---
title: DynamicSelect 动态选择器
---

# DynamicSelect 动态选择器

用于需要使用动态添加的选择器

## 代码演示

```jsx
/**
 * title: 单个默认值
 */
import React from 'react';
import DynamicSelect from './index';
import { useDynamicSelect } from './common';

export default () => {
  const { dynamicSelectProps } = useDynamicSelect();

  return <DynamicSelect {...dynamicSelectProps} />;
};
```

```jsx
/**
 * title: 多个默认值
 */
import React from 'react';
import DynamicSelect from './index';
import { useDynamicSelect, selectKeys } from './common';

export default () => {
  const { dynamicSelectProps } = useDynamicSelect(
    Array(10).fill({
      [selectKeys[0]]: 0,
      [selectKeys[1]]: 1,
    }),
  );

  return <DynamicSelect {...dynamicSelectProps} />;
};
```

<API></API>
