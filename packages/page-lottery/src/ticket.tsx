import React from 'react';
import { Box, Button, CloseIcon, Flex, Spacer } from '@patract/ui-components';

import { Circle, NumberInput } from './component';

export const TicketBoard: React.FC<{}> = () => {
  return (
    <Flex
      width='100%'
      flexDirection='column'
      bg='#F9F9FBFF'
      p='5'
      rounded='md'
      border='1px solid rgba(171, 180, 208, 0.35)'
    >
      <Flex flexDir='row' justifyContent='space-around'>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n, i) =>
          Circle({ v: n, style: 0, r: '42px', fontSize: '1.1rem', lineHeight: '2.4rem', key: String(i) })
        )}
      </Flex>
      <Spacer />
      <Flex alignItems='center'>
        <Box mr='1rem'>Epoch ID: </Box>
        <NumberInput />
      </Flex>
      <Spacer />
      <TicketInput />
      <Spacer />
      <Flex alignItems='flex-end'>
        <Button bg='rgba(0, 88, 250, 1)' color='#fff' width='5rem'>
          Buy
        </Button>
        <Box ml='1rem' color='rgba(37, 161, 124, 1)' fontSize='12px'>
          Total: 1 DOT
        </Box>
      </Flex>
    </Flex>
  );
};

const TicketInput: React.FC<{}> = () => {
  return (
    <Flex
      bg='#fff'
      rounded='4px'
      shadow='0px 0px 6px 0px rgba(171, 180, 208, 0.31)'
      height='90px'
      justifyContent='center'
      alignItems='center'
      p='1rem'
    >
      <Flex flexDir='row' justifyContent='space-around'>
        {[1, 2, 3].map((n, i) =>
          Circle({
            v: n,
            style: 0,
            r: '52px',
            fontSize: '1.5rem',
            lineHeight: '3rem',
            key: String(i),
            mr: i === 2 ? '0px' : '20px'
          })
        )}
      </Flex>
      <Spacer />
      <CloseIcon />
      <Spacer />
      <NumberInput />
    </Flex>
  );
};
