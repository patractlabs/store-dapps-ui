import React from 'react';
import { AddIcon, MinusIcon, Flex, Input, IconButton } from '@patract/ui-components';

export const NumberInput: React.FC<{}> = () => {
  return (
    <Flex alignItems='center'>
      <Input width='4rem' borderColor='rgba(0, 88, 250, 1)' borderWidth='2px' />
      <IconButton
        ml='1rem'
        icon={<AddIcon color='rgba(0, 88, 250, 1)' />}
        bg='#fff'
        aria-label='Add number'
        shadow='0px 1px 5px 0px rgba(171, 180, 208, 0.5)'
      />
      <IconButton
        ml='1rem'
        icon={<MinusIcon color='rgba(0, 88, 250, 1)' />}
        bg='#fff'
        aria-label='minus number'
        shadow='0px 1px 5px 0px rgba(171, 180, 208, 0.5)'
      />
    </Flex>
  );
};
