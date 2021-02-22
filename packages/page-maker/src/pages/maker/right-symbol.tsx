import { InputRightElement, Text } from '@patract/ui-components';
import React, { FC, ReactElement } from 'react';

export const RightSymbol: FC<{ symbol: string }> = ({ symbol }): ReactElement => {
  return <InputRightElement
    minWidth='74px'
    marginRight='1rem'
    children={
      <Text
        sx={{
          fontSize: '1em',
          background: '#E1E9FF',
          borderRadius: '4px',
          minWidth: '74px',
          textAlign: 'center',
        }}
      >
        { symbol }
      </Text>
    }
  />
};