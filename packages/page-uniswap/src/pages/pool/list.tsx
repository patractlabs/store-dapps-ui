import { AddIcon } from '@chakra-ui/icons';
import { useModal } from '@patract/react-hooks';
import {
  Address,
  Amount,
  Box,
  Button,
  Center,
  CircularProgress,
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from '@patract/ui-components';
import React from 'react';
import { useLPtokenBalance } from '../../hooks/useLPtokenBalance';
import { usePairList } from '../../hooks/usePairList';
import Add from './add';
import CreatePair from './create-pair';
import Withdraw from './withdraw';

export const PoolList = () => {
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useModal();
  const { isOpen: isWithdrawOpen, onOpen: onWithdrawOpen, onClose: onWithdrawClose } = useModal();
  const { isOpen: isCreatePairOpen, onOpen: onCreatePairOpen, onClose: onCreatePairClose } = useModal();
  const { data, loading } = usePairList();
  const lpBalance = useLPtokenBalance();

  return (
    <Box>
      <Flex flexDirection='row-reverse' mb={4}>
        <Button leftIcon={<AddIcon mb={1} />} onClick={onCreatePairOpen}>
          Create Asset
        </Button>
      </Flex>
      <Box mt={4} padding={3} background='white' borderRadius='12px' border='1px solid' borderColor='gray.100'>
        <Table variant='simple' size='small'>
          <Thead>
            <Tr>
              <Th>Pair</Th>
              <Th>From Token Address</Th>
              <Th>To Token Address</Th>
              <Th>From Token Pool</Th>
              <Th>To Token Pool</Th>
              <Th>LP Token Supply</Th>
              <Th>Your LP Tokens</Th>
              <Th>Operation</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((item, index) => (
              <Tr key={index}>
                <Td>
                  {item.from_name}/{item.to_name}
                </Td>
                <Td>
                  <Address value={item.from} />
                </Td>
                <Td>
                  <Address value={item.to} />
                </Td>
                <Td>
                  <Amount value={item.from_token_pool} decimals={item.from_decimals} postfix={item.from_name} />
                </Td>
                <Td>
                  <Amount value={item.to_token_pool} decimals={item.to_decimals} postfix={item.to_name} />
                </Td>
                <Td>
                  <Amount value={item.lp_token_supply} decimals={18} postfix='LPT' />
                </Td>
                <Td>
                  <Amount value={lpBalance} decimals={18} postfix='LPT' />
                </Td>
                <Td>
                  <Button size='sm' mr='4' onClick={onAddOpen}>
                    Add
                  </Button>
                  <Button size='sm' mr='4' onClick={onWithdrawOpen}>
                    Withdraw
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        {!data.length && loading && (
          <Center p={16}>
            <CircularProgress isIndeterminate color='blue.300' />
          </Center>
        )}
      </Box>
      <Add isOpen={isAddOpen} onClose={onAddClose} />
      <Withdraw isOpen={isWithdrawOpen} onClose={onWithdrawClose} />
      <CreatePair isOpen={isCreatePairOpen} onClose={onCreatePairClose} />
    </Box>
  );
};
