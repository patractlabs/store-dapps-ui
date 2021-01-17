import { Button } from '@chakra-ui/react';
import { ThemeProvider } from '@patract/ui-components';
import React from 'react';
import { CreateAssetModal } from './create-asset-modal';
import { useModal } from '@patract/react-hooks';

export const App = () => {
  const { isOpen, onOpen, onClose } = useModal();

  return (
    <ThemeProvider>
      <Button onClick={onOpen}>add asset</Button>
      <CreateAssetModal isOpen={isOpen} onClose={onClose} />
    </ThemeProvider>
  );
};

export default App;
