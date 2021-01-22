import { useApi, useModal } from '@patract/react-hooks';
import React from 'react';
import { CreateAssetModal } from './create-asset-modal';
import { Header, Box, Button, Container } from '@patract/ui-components';

export const App = () => {
  const { isOpen, onOpen, onClose } = useModal();

  const { isApiReady } = useApi();

  console.log(isApiReady);

  return (
    <Box>
      <Header title='Patra Asset' />
      <Container maxW='75rem'>
        <Button onClick={onOpen}>add asset</Button>
        <CreateAssetModal isOpen={isOpen} onClose={onClose} />
      </Container>
    </Box>
  );
};

export default App;
