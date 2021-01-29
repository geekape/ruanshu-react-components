---
title: BasicTableLayout 基础表格
---

# BasicTableLayout 基础表格

## 代码演示

```jsx
/**
 * title: 基础表格
 * description: 这个表格很强大
 */
import React from 'react';
import BasicTableLayout from './index';
import { fields } from './common';

export default class DemoDefaultTable extends BasicTableLayout {
  stepTableFields() {
    const columns = this.initActionColumns(fields);
    return { columns };
  }
}
```

```jsx
/**
 * title: 添加操作栏
 * description: 适用于表格项需求增删查改
 */
import React from 'react';
import BasicTableLayout from './index';
import { fields } from './common';
import { createTextLink } from '../../support/utils/actionTemplate';
import { withRefresh } from '../../support/hoc/refresh';

//TODO 添加请求数据
class DemoDefaultTable extends BasicTableLayout {
  stepTableFields() {
    const columns = this.initActionColumns(fields);
    return { columns };
  }

  stepTableActionFields(record) {
    return [
      createTextLink(this, record, {
        key: 'details',
        content: '详情' /* authority: 'details' */,
      }),
      createTextLink(this, record, {
        key: 'service',
        content: '我的服务单' /* authority: 'details' */,
      }),
      createTextLink(this, record, { key: 'tag', content: '标签设置' }),
      createTextLink(this, record, { key: 'test', content: '面试/考试' }),
      createTextLink(this, record, { key: 'card', content: '个人名片' }),
    ];
  }
}
```
