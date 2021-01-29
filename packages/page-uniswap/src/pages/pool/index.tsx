import { PageLayout, PageMain } from '@patract/ui-components';
import React from 'react';
import Header from '../../components/header';
import { PoolList } from './list';

const Pool = () => {
  return (
    <PageLayout>
      <Header />
      <PageMain>
        <PoolList />
      </PageMain>
    </PageLayout>
  );
};

export default Pool;
