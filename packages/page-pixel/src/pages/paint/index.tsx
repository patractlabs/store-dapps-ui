import { PageHeader, PageLayout, PageMain } from '@patract/ui-components';
import React from 'react';
import { Paint } from './paint';

export const PaintIndex: React.FC = () => {
  return (
    <PageLayout>
      <PageHeader title='PatraPixel' />
      <PageMain>
        <Paint />
      </PageMain>
    </PageLayout>
  );
};
