import React from 'react'

import { LargeText, MediumText } from 'component-library';


export default function Test() {
  return (
      <div>
        <LargeText as="p">Hello</LargeText>
        <LargeText as="p" subdued>Hello</LargeText>
        <LargeText as="p" subdued bold>Hello</LargeText>
        <LargeText as="p" subdued light>Hello</LargeText>
        <LargeText as="p" semi>Hello</LargeText>
        <LargeText as="p" sx={{ color: 'red' }}>Hello</LargeText>
        <LargeText as="h3" bold>Hello</LargeText>
        <MediumText as="p">Hello</MediumText>
        </div>
  );
}
