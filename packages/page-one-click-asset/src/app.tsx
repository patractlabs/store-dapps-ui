import { useModal } from '@patract/react-hooks';
import { AddIcon } from '@chakra-ui/icons';
import {
  Button,
  PageHeader,
  Flex,
  PageLayout,
  PageMain,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Box,
  Center,
  CircularProgress,
  Text
} from '@patract/ui-components';
import React, { useMemo } from 'react';
import Erc20fixed from './contracts/erc20fixed.json';
import Erc20mintable from './contracts/erc20mintable.json';
import { CreateAssetModal } from './create-asset-modal';
import { useAssetList, useQueryContracts } from './hooks';
import { truncated } from '@patract/utils';
export const App = () => {
  const { isOpen, onOpen, onClose } = useModal();

  const { data } = useQueryContracts(
    '3gGPnhZnwLXxX9nZfLY2moFdjLvBMVDVMbqRMTKZPbkXQuNA',
    Erc20fixed.source.hash,
    Erc20mintable.source.hash
  );

  const contractList = useMemo(() => {
    if (!data) return;
    return data.Events.map((event: any) => {
      return {
        id: event.id,
        signer: event.args[0],
        address: event.args[1],
        codeHash: event.extrinsic.args.code_hash
      };
    });
  }, [data]);

  const { data: list, loading } = useAssetList(contractList);

  return (
    <PageLayout>
      <PageHeader title='Patra Asset' />
      <PageMain>
        <Flex justifyContent='flex-end'>
          <Button leftIcon={<AddIcon mb={1} />} onClick={onOpen}>
            Create Asset
          </Button>
        </Flex>
        <Box mt={4} padding={3} background='white' borderRadius='12px' border='1px solid' borderColor='gray.100'>
          <Table variant='simple' size='md'>
            <Thead>
              <Tr>
                <Th>Contract Address</Th>
                <Th>Owner Address</Th>
                <Th>Name</Th>
                <Th>Symbol</Th>
                <Th>Decimals</Th>
                <Th>Max Supply</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {list?.map((item) => (
                <Tr key={item.id}>
                  <Td>{truncated(item.address)}</Td>
                  <Td>{truncated(item.signer)}</Td>
                  <Td>{item.tokenName}</Td>
                  <Td>{item.tokenSymbol}</Td>
                  <Td>{item.tokenDecimals}</Td>
                  <Td>{item.totalSupply}</Td>
                  <Td>
                    <Button size='sm'>issue</Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {(!list || list.length === 0) && (
            <Center p={16}>
              {loading ? <CircularProgress isIndeterminate color='blue.300' /> : <Text>No Data</Text>}
            </Center>
          )}
        </Box>
      </PageMain>
      <CreateAssetModal isOpen={isOpen} onClose={onClose} />
    </PageLayout>
  );
};

export default App;
