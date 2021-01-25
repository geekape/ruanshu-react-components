---
title: DynamicSelect 动态选择器
---

# DynamicSelect 动态选择器

用于需要使用动态添加的选择器

## 代码演示

```jsx
/**
 * title: 基础使用
 * desc: '666'
 */
import React from 'react';
import DynamicSelect from './index';

const sexTypes = [
  { key: '0', value: '男' },
  { key: '1', value: '女' },
];
const childAgeTypes = [
  { key: '0', value: '1-3个月' },
  { key: '1', value: '3-6个月' },
  { key: '2', value: '6-9个月' },
  { key: '3', value: '9-12个月' },
];

export default () => {
  const [value, setValue] = React.useState([]);

  return [
    <DynamicSelect
      selects={[
        { key: 'childName', list: sexTypes, placeholder: '性别' },
        { key: 'childGender', list: childAgeTypes, placeholder: '多大' },
      ]}
      value={[[{ childName: '0', childGender: '0' }]]}
      onChange={ev => {
        setValue(ev);
      }}
    />,
  ];
};
```

<API></API>

---
