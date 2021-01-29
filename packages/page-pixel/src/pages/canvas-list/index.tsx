import { PageHeader, PageLayout, PageMain } from '@patract/ui-components';
import React from 'react';
import { CanvasList } from './list';

const CanvasIndex: React.FC = () => {
  return (
    <PageLayout>
      <PageHeader title='Patra Pixel' />
      <PageMain>
        <CanvasList />
      </PageMain>
    </PageLayout>
  );
};

export default CanvasIndex;
