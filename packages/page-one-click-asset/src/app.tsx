import { useModal } from '@patract/react-hooks';
import { Button, PageHeader, PageLayout, PageMain } from '@patract/ui-components';
import React from 'react';
import { CreateAssetModal } from './create-asset-modal';

export const App = () => {
  const { isOpen, onOpen, onClose } = useModal();

  // console.log(isApiReady, api);

  return (
    <PageLayout>
      <PageHeader title='Patra Asset' />
      <PageMain>
        <Button onClick={onOpen}>Create Asset</Button>
        <CreateAssetModal isOpen={isOpen} onClose={onClose} />
      </PageMain>
    </PageLayout>
  );
};

export default App;
