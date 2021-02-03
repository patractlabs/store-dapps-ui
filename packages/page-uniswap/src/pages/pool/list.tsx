import { AddIcon } from '@chakra-ui/icons';
import { useModal } from '@patract/react-hooks';
import {
  Address,
  Fixed,
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
import React, { useReducer } from 'react';
import { useLPtokenBalance } from '../../hooks/useLPtokenBalance';
import { usePairList } from '../../hooks/usePairList';
import Add from './add';
import CreatePair from './create-pair';
import Withdraw from './withdraw';

const AddLiquidity: React.FC<any> = ({ item, onSubmit, lpBalance }) => {
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useModal();

  return (
    <Box>
      <Button size='sm' mr='4' onClick={onAddOpen}>
        Add
      </Button>
      <Add lpBalance={lpBalance} onSubmit={onSubmit} item={item} isOpen={isAddOpen} onClose={onAddClose} />
    </Box>
  );
};

const WithdrawLiquidity: React.FC<any> = ({ item, onSubmit, lpBalance }) => {
  const { isOpen: isWithdrawOpen, onOpen: onWithdrawOpen, onClose: onWithdrawClose } = useModal();

  return (
    <Box>
      <Button size='sm' mr='4' onClick={onWithdrawOpen}>
        Withdraw
      </Button>
      <Withdraw lpBalance={lpBalance} onSubmit={onSubmit} item={item} isOpen={isWithdrawOpen} onClose={onWithdrawClose} />
    </Box>
  );
};

export const PoolList = () => {
  const [signal, forceUpdate] = useReducer((x) => x + 1, 0);

  const { isOpen: isCreatePairOpen, onOpen: onCreatePairOpen, onClose: onCreatePairClose } = useModal();
  const { data, loading } = usePairList(signal);
  const lpBalance = useLPtokenBalance(signal);

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
                  <Fixed value={item.from_token_pool} decimals={item.from_decimals} postfix={item.from_name} />
                </Td>
                <Td>
                  <Fixed value={item.to_token_pool} decimals={item.to_decimals} postfix={item.to_name} />
                </Td>
                <Td>
                  <Fixed value={item.lp_token_supply} decimals={18} postfix='LPT' />
                </Td>
                <Td>
                  <Fixed value={lpBalance} decimals={18} postfix='LPT' />
                </Td>
                <Td>
                  <Flex>
                    <AddLiquidity lpBalance={lpBalance} item={item} onSubmit={forceUpdate} />
                    <WithdrawLiquidity lpBalance={lpBalance} item={item} onSubmit={forceUpdate} />
                  </Flex>
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
      <CreatePair onSubmit={forceUpdate} isOpen={isCreatePairOpen} onClose={onCreatePairClose} />
    </Box>
  );
};
