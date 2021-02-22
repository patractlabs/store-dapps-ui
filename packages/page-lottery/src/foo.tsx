import React from 'react';
import { Box, Flex, Spacer } from '@patract/ui-components';

import { Pop } from './component';
import { TicketBoard } from './ticket';
import { FooCardProps } from './types';
import { useProvider } from './provider';
import { useApi } from '@patract/react-hooks';

/* The header table */
export const Foo: React.FC<{}> = () => {
  const context = useProvider();
  const api = useApi();

  return (
    <Flex height={317} px='4' py='4' rounded='lg' shadow='sm' bg='white' flexDirection='row'>
      <Box width='100%' mr='16'>
        <Box bg='#ffe6d6ff' p='2' rounded='md' fontWeight='bold'>
          Epoch ID: {context.epochId}
        </Box>
        <Flex width='100%' mt='6' color='white'>
          <FooCard
            titleColor='rgba(202, 94, 0, 0.2)'
            title='Reward Pool'
            contentColor='#FF7600'
            content={
              <Flex>
                <Box>{context.rewardPool / Math.pow(10, api.api.registry.chainDecimals)}</Box>
                <Flex fontSize='1rem' pl='0.5rem' alignItems='flex-end' lineHeight='3rem'>
                  DOT
                </Flex>
              </Flex>
            }
          />
          <Spacer />
          <FooCard
            titleColor='rgba(0, 133, 146, 0.2)'
            title='Open In'
            contentColor='#00BACB'
            content={
              <Box>
                {Math.floor(context.openIn / 60)} : {context.openIn % 60}s
              </Box>
            }
          />
        </Flex>
        <Pop />
      </Box>
      <Spacer />
      <TicketBoard />
    </Flex>
  );
};

export const FooCard: React.FC<FooCardProps> = ({ title, titleColor, contentColor, content }) => {
  return (
    <Box width='16rem' bg={contentColor} p='0' height='11rem' rounded='md' shadow='md'>
      <Box bg={titleColor} height='3rem' roundedTop='md' lineHeight='3rem' fontSize='1.2rem' pl='1.5rem'>
        {title}
      </Box>
      <Box p='1.5rem' alignItems='center' justifyContent='center' fontSize='2.5rem'>
        {content}
      </Box>
    </Box>
  );
};
