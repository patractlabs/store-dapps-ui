import { PageLayout, PageMain } from '@patract/ui-components';
import React from 'react';
import Header from '../../components/header';
import { Swap } from './swap';

const SwapIndex = () => {
  return (
    <PageLayout>
      <Header />
      <PageMain>
        <Swap />
      </PageMain>
    </PageLayout>
  );
};

export default SwapIndex;
