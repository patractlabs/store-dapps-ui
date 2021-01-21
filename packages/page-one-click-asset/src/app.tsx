import { Button } from '@chakra-ui/react';
import { Api } from '@patract/react-components';
import { useModal } from '@patract/react-hooks';
import { ThemeProvider } from '@patract/ui-components';
import React from 'react';
import { CreateAssetModal } from './create-asset-modal';

export const App = () => {
  const { isOpen, onOpen, onClose } = useModal();

  return (
    <ThemeProvider>
      <Api url='ws://192.168.50.10:9944'>
        <Button onClick={onOpen}>add asset</Button>
        <CreateAssetModal isOpen={isOpen} onClose={onClose} />
      </Api>
    </ThemeProvider>
  );
};

export default App;
