import React from 'react'

import { BigText, SmallerText } from 'component-library';


export default function Test() {
  return (
      <div>
        <BigText as="p">Hello</BigText>
        <BigText as="p" subdued>Hello</BigText>
        <BigText as="p" subdued bold>Hello</BigText>
        <BigText as="p" subdued light>Hello</BigText>
        <BigText as="p" semi>Hello</BigText>
        <BigText as="p" sx={{ color: 'red' }}>Hello</BigText>
        <BigText as="h3" bold>Hello</BigText>
        <SmallerText as="p">Hello</SmallerText>
        </div>
  );
}


