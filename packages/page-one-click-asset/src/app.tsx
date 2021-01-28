import { AddIcon } from '@chakra-ui/icons';
import { useModal } from '@patract/react-hooks';
import { Box, Button, Flex, PageHeader, PageLayout, PageMain, Text } from '@patract/ui-components';
import React from 'react';
import { AssetList } from './asset-list';
import { CreateAssetModal } from './create-asset-modal';

export const App = () => {
  const { isOpen, onOpen, onClose } = useModal();

  return (
    <PageLayout>
      <PageHeader title='Patra Asset' />
      <PageMain>
        <Flex justifyContent='flex-end'>
          <Button leftIcon={<AddIcon mb={1} />} onClick={onOpen}>
            Create Asset
          </Button>
        </Flex>
        <Box>
          <Text>Your Assets</Text>
          <AssetList isAll={false} />
          <Text mt="8">All Assets</Text>
          <AssetList isAll={true} />
        </Box>
      </PageMain>
      <CreateAssetModal isOpen={isOpen} onClose={onClose} />
    </PageLayout>
  );
};

export default App;
