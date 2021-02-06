// import { AddIcon } from '@chakra-ui/icons';
import { Box, Flex, PageHeader, PageLayout, PageMain } from '@patract/ui-components';
import React from 'react';
import { T } from './table';
import { Foo } from './foo';
import { useMy } from './hooks';

export const App = () => {
  const myLotteries = useMy();

  return (
    <PageLayout>
      <PageHeader title='Patra Lottery' />
      <PageMain my='30'>
        <Box>
          <Foo />
          <Flex>
            <T title='My Lotteries' cols={myLotteries} />
            <Box width='30px'></Box>
            <T title='My Lotteries' cols={myLotteries} />
          </Flex>
          <T title='My Lotteries' cols={myLotteries} />
        </Box>
      </PageMain>
    </PageLayout>
  );
};

export default App;
