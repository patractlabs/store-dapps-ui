import { Flex, PageHeader, PageLayout, PageMain, Spacer } from '@patract/ui-components';
import React from 'react';

import { Tip } from './component';
import { T } from './table';
import { Foo } from './foo';
import { useMy, useBig, useHis } from './hooks';

export const App = () => {
  const [my, big, his] = [useMy(), useBig(), useHis()];

  return (
    <PageLayout>
      <PageHeader title='Patra Lottery' />
      <PageMain my='30' minWidth='1360px' width='1360px'>
        <Tip />
        <Foo />
        <Flex>
          <T title='My Lotteries' head={my.head} body={my.body} width='570px' />
          <Spacer />
          <T title='Biggest Winners' head={big.head} body={big.body} width='570px' />
        </Flex>
        <T height='1104px' title='Epoch Histories' head={his.head} body={his.body} />
      </PageMain>
    </PageLayout>
  );
};

export default App;
