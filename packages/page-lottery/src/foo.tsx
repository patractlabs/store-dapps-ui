import React from 'react';
import { Box, Flex } from '@patract/ui-components';

import { FooCardProps } from './types';

/* The header table */
export const Foo: React.FC<{}> = () => {
  return (
    <Flex height={317} px='4' py='4' rounded='lg' shadow='sm' bg='white' flexDirection='row'>
      <Box width='100%' mr='16'>
        <Box bg='#ffe6d6ff' p='2' rounded='md' fontWeight='bold'>
          Epoch ID: 918
        </Box>
        <Flex width='100%' mt='6' color='white'>
          <FooCard
            titleColor='rgba(202, 94, 0, 0.2)'
            title='Reward Pool'
            contentColor='#FF7600'
            content={
              <Flex>
                <Box>6980.10</Box>
                <Flex fontSize='1rem' pl='0.5rem' alignItems='flex-end' lineHeight='3rem'>
                  DOT
                </Flex>
              </Flex>
            }
          />
          <FooCard
            titleColor='rgba(0, 133, 146, 0.2)'
            title='Open In'
            contentColor='#00BACB'
            content={<Box>01 : 10s</Box>}
          />
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

export const FooCard: React.FC<FooCardProps> = ({ title, titleColor, contentColor, content }) => {
  return (
    <Box width='100%' bg={contentColor} p='0' height='11rem' rounded='md' mr={3} shadow='md'>
      <Box bg={titleColor} height='3rem' roundedTop='md' lineHeight='3rem' fontSize='1.2rem' pl='1.5rem'>
        {title}
      </Box>
      <Box p='1.5rem' alignItems='center' justifyContent='center' fontSize='2.5rem'>
        {content}
      </Box>
    </Box>
  );
};
