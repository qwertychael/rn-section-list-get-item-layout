# React Native SectionList getItemLayout

This package provides an extension re-written in js and allows for use with hooks for the function built originally by [Jan Soendermann](https://github.com/jsoendermann/rn-section-list-get-item-layout) which helps you construct the `getItemLayout` function for your `SectionList`s. For an explanation of why this exists, see [this post](https://medium.com/@jsoendermann/sectionlist-and-getitemlayout-2293b0b916fb). It's meant to be used like this:

```javascript
import React from 'react';
import { SectionList } from 'react-native';
import useDynamicListLayout from 'react-native-section-list-get-item-layout-js';

const MyComponent = (props) => {
  const { getItemLayout } = useDynamicListLayout({
    // The height of the row with rowData at the given sectionIndex and rowIndex
    getItemHeight: (rowData, sectionIndex, rowIndex) => (sectionIndex === 0 ? 100 : 50),

    // These four properties are optional
    getSeparatorHeight: () => 1, // The height of your separators
    getSectionHeaderHeight: () => 20, // The height of your section headers
    getSectionFooterHeight: () => 10, // The height of your section footers
    listHeaderHeight: 40, // The height of your list header
  });

  return (
    <SectionList
      {...props}
      getItemLayout={getItemLayout}
      // Other props
    />
  );
};

export default MyComponent;
```
