import React from 'react';

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

export const selectKeys = ['childName', 'childGender'];

export function useDynamicSelect(
  defaultValue = [{ childName: '0', childGender: '0' }],
) {
  const [value, setValue] = React.useState(defaultValue);

  const dynamicSelectProps = {
    value,
    selects: [
      { key: selectKeys[0], list: sexTypes, placeholder: '性别' },
      { key: selectKeys[1], list: childAgeTypes, placeholder: '多大' },
    ],
    onChange: ev => {
      console.log('DynamicSelect值为', ev);
      setValue(ev);
    },
  };
  return {
    value,
    dynamicSelectProps,
  };
}
