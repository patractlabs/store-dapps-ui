import React from 'react';
import { Box, Flex, InfoIcon } from '@patract/ui-components';

export const Tip: React.FC<{}> = () => {
  return (
    <Flex flexDirection='row' p='1rem' mb='1rem' bg='#FFE6D6' color='rgba(250, 100, 0, 1)' justifyContent='flex-start'>
      <InfoIcon mr='0.5rem' />
      <Box>
        {' '}
        This is just a demo for fun. In Substrate repo, they declared that the epoch BABE random number MUST NOT be used
        for gambling, as it can be influenced by a malicious validator in the short term.Please wait for more secure
        random number algorithm.{' '}
      </Box>
    </Flex>
  );
};
