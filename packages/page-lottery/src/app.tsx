import { Box, Flex, PageHeader, PageLayout, PageMain, Spacer } from '@patract/ui-components';
import React from 'react';
import { T } from './table';
import { Foo } from './foo';
import { useMy, useBig, useHis } from './hooks';

export const App = () => {
  const [my, big, his] = [useMy(), useBig(), useHis()];

  return (
    <PageLayout>
      <PageHeader title='Patra Lottery' />
      <PageMain my='30'>
        <Box>
          <Foo />
          <Flex>
            <T title='My Lotteries' head={my.head} body={my.body} width='570px' />
            <Spacer />
            <T title='Biggest Winners' head={big.head} body={big.body} width='570px' />
          </Flex>
          <T height='1104px' title='Epoch Histories' head={his.head} body={his.body} />
        </Box>
      </PageMain>
    </PageLayout>
  );
};

export default App;
