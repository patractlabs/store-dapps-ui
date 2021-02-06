import React from 'react';
import { Box, Flex } from '@patract/ui-components';

export const Foo: React.FC<{}> = () => {
  return (
    <Flex height={317} px='4' py='4' rounded='lg' shadow='sm' bg='white' flexDirection='row'>
      <Box width='100%' mr='16'>
        <Box bg='#ffe6d6ff' p='2' rounded='md' fontWeight='bold'>
          Epoch ID: 918
        </Box>
        <Flex width='100%' mt='6'>
          <Box width='100%' bg='#FF7600FF' p='3' height='11rem' rounded='md' mr={3}>
            Left card
          </Box>
          <Box width='100%' bg='#00BACBFF' p='3' height='11rem' rounded='md' ml={3}>
            Right card
          </Box>
        </Flex>
        <Box mt='5'>(?) Rules</Box>
      </Box>
      <Box width='100%'>
        <Box height='100%' bg='#F9F9FBFF' p='5' rounded='md' border='1px solid rgba(171, 180, 208, 0.35)'>
          Epoch ID: 918
        </Box>
      </Box>
    </Flex>
  );
};
