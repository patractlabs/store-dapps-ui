import { useApi, useModal } from '@patract/react-hooks';
import { Button, PageHeader, PageLayout, PageMain } from '@patract/ui-components';
import React from 'react';
import { CreateAssetModal } from './create-asset-modal';
import { Api } from '@patract/react-components';
import { ApiContext } from '@patract/react-components/api/api-context';
import Queue from '@patract/react-components/status/queue';

export const App = () => {
  const { isOpen, onOpen, onClose } = useModal();
  console.log(ApiContext)
  const { isApiReady, api } = useApi();

  // console.log(isApiReady, api);

  return (
    <Queue>
      <Api url='ws://192.168.50.10:9944'>
        <PageLayout>
          <PageHeader title='Patra Asset' />
          <PageMain>
            <Button onClick={onOpen}>Create Asset</Button>
            <CreateAssetModal isOpen={isOpen} onClose={onClose} />
          </PageMain>
        </PageLayout>
      </Api>
    </Queue>
  );
};

export default App;
