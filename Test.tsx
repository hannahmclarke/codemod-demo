import React from 'react'

import { BigText, SmallerText } from 'component-library';


export default function Test() {
  return (
    <div>
        <BigText as="p">Hello</BigText>
        <BigText as="p" subdued underlined>Hello</BigText>
        <BigText as="p" subdued bold>Hello</BigText>
        <BigText as="p" subdued light>Hello</BigText>
        <BigText as="p" semi underlined>Hello</BigText>
        <BigText sx={{ color: 'red' }} as="p">Hello</BigText>
        <BigText as="h3" bold>Hello</BigText>
        <SmallerText as="p">Hello</SmallerText>
    </div>
  );
}


/**
 * Expected output based on current transform.js configuration:
 * 
    import React from 'react'
    import { BigText, SmallerText, Text } from 'component-library';

    export default function Test() {
        return (
            (<div>
                <Text as="p" variant="text.large.regular">Hello</Text>
                <Text as="p" color="secondary" variant="text.large.regular">Hello</Text>
                <Text as="p" color="secondary" variant="text.large.bold">Hello</Text>
                <Text as="p" color="secondary" variant="text.large.regular">Hello</Text>
                <Text as="p" variant="text.large.medium">Hello</Text>
                <Text sx={{ color: 'red' }} as="p" variant="text.large.regular">Hello</Text>
                <BigText as="h3" bold>Hello</BigText>
                <SmallerText as="p">Hello</SmallerText>
            </div>)
        );
    }
 * 
 */