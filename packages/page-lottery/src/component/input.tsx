import React from 'react';
import { Box, AddIcon, MinusIcon, Flex, IconButton } from '@patract/ui-components';

export const NumberInput: React.FC<{ disabled?: number; value: number; set: (e: any) => void }> = ({
  disabled = 1,
  value,
  set
}) => {
  return (
    <Flex alignItems='center'>
      <Box width='4rem' borderColor='rgba(0, 88, 250, .8)' borderWidth='2px' rounded='5px' textAlign='center'>
        {value}
      </Box>
      <IconButton
        ml='1rem'
        icon={<AddIcon color='rgba(0, 88, 250, 1)' />}
        bg='#fff'
        aria-label='Add number'
        shadow='0px 1px 5px 0px rgba(171, 180, 208, 0.5)'
        onClick={() => {
          set(value + 1);
        }}
      />
      <IconButton
        ml='1rem'
        icon={<MinusIcon color='rgba(0, 88, 250, 1)' />}
        bg='#fff'
        aria-label='minus number'
        shadow='0px 1px 5px 0px rgba(171, 180, 208, 0.5)'
        disabled={value <= disabled}
        onClick={() => {
          set(value - 1);
        }}
      />
    </Flex>
  );
};
