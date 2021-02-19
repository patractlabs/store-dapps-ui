import React from 'react';
import { Box, Flex, Spacer } from '@patract/ui-components';
import { useLottery } from './hooks';

import { useContractQuery } from '@patract/react-hooks';

import { Pop } from './component';
import { TicketBoard } from './ticket';
import { FooCardProps } from './types';

/* The header table */
export const Foo: React.FC<{}> = () => {
  const contract = useLottery();
  const res = useContractQuery({ contract: contract.contract, method: 'latestEpoch' });

  React.useEffect(() => {
    res.read().then((r) => {
      console.log(r);
    });
  }, []);

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
          <Spacer />
          <FooCard
            titleColor='rgba(0, 133, 146, 0.2)'
            title='Open In'
            contentColor='#00BACB'
            content={<Box>01 : 10s</Box>}
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
