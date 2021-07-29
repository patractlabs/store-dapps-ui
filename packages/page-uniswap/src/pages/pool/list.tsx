import { AddIcon } from '@chakra-ui/icons';
import { Image, PopoverTrigger } from '@chakra-ui/react';
import { useModal } from '@patract/react-hooks';
import {
  Box,
  Button,
  Center,
  CircularProgress,
  Fixed,
  Flex,
  IdentityIcon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from '@patract/ui-components';
import { EMPTY } from '@patract/utils';
import React, { useReducer } from 'react';
import { usePairList } from '../../hooks/usePairList';
import ArrowWebp from '../../images/arrow.svg';
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
      <Withdraw onSubmit={onSubmit} item={item} isOpen={isWithdrawOpen} onClose={onWithdrawClose} />
    </Box>
  );
};

export const PoolList = React.memo(() => {
  const [signal, forceUpdate] = useReducer((x) => x + 1, 0);

  const { isOpen: isCreatePairOpen, onOpen: onCreatePairOpen, onClose: onCreatePairClose } = useModal();
  const { data, loading } = usePairList(signal);

  return (
    <Box>
      <Flex flexDirection='row-reverse' mb={4}>
        <Button leftIcon={<AddIcon mb={1} />} onClick={onCreatePairOpen}>
          Create Pair
        </Button>
      </Flex>
      <Box mt={4} padding={3} background='white' borderRadius='12px' border='1px solid' borderColor='gray.100'>
        <Table variant='simple' size='small'>
          <Thead>
            <Tr>
              <Th>Pair</Th>
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
                  <Popover trigger='hover' arrowSize={15} placement='bottom-start'>
                    <PopoverTrigger>
                      <Box
                        display='flex'
                        alignItems='center'
                        textTransform='uppercase'
                        justifyContent='space-between'
                        paddingRight='35px'
                      >
                        <Flex alignItems='center'>
                          <label style={{ marginRight: '16px' }}>{item.from_symbol}</label>
                          <IdentityIcon value={item.from} theme='polkadot' />
                        </Flex>

                        {/* <Image sx={{ width: '20px', height: '20px' }} src={UsdtWebp} /> */}
                        <Image size='xs' src={ArrowWebp} />
                        <Flex alignItems='center'>
                          <label style={{ marginRight: '16px' }}>{item.to_symbol}</label>
                          {/* <Image sx={{ width: '20px', height: '20px' }} size='xs' src={EthWebp} /> */}
                          <IdentityIcon value={item.to} theme='polkadot' />
                        </Flex>
                      </Box>
                    </PopoverTrigger>
                    <PopoverContent sx={{ width: '480px', padding: '16px 12px' }}>
                      <PopoverArrow></PopoverArrow>
                      <PopoverBody sx={{ padding: '0px' }}>
                        <Box
                          sx={{
                            display: 'flex',
                            height: '24px',
                            marginBottom: '11px',
                            padding: '0px',
                            justifyContent: 'flex-start'
                          }}
                          alignItems='center'
                        >
                          <label style={{ fontWeight: 300, color: '#666', display: 'inline-block', width: '40px' }}>
                            From:{' '}
                          </label>
                          <Box mr={2}>
                            <IdentityIcon value={item.from} theme='polkadot' />
                          </Box>
                          <label>{item.from}</label>
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            height: '24px',
                            lineHeight: '17px',
                            padding: '0px',
                            justifyContent: 'flex-start'
                          }}
                          alignItems='center'
                        >
                          <label style={{ fontWeight: 300, color: '#666', display: 'inline-block', width: '40px' }}>
                            To:{' '}
                          </label>
                          <Box mr={2}>
                            <IdentityIcon value={item.to} theme='polkadot' />
                          </Box>
                          <label>{item.to === EMPTY ? 'DOT' : item.to}</label>
                        </Box>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </Td>
                <Td>
                  <Fixed value={item.from_token_pool} decimals={item.from_decimals} postfix={item.from_symbol} />
                </Td>
                <Td>
                  <Fixed value={item.to_token_pool} decimals={item.to_decimals} postfix={item.to_symbol} />
                </Td>
                <Td>
                  <Fixed value={item.lp_token_supply} decimals={item.from_decimals} postfix='LPT' />
                </Td>
                <Td>
                  <Fixed value={item.own_lp_token} decimals={item.from_decimals} postfix='LPT' />
                </Td>
                <Td>
                  <Flex>
                    <AddLiquidity lpBalance={item.own_lp_token} item={item} onSubmit={forceUpdate} />
                    <WithdrawLiquidity lpBalance={item.own_lp_token} item={item} onSubmit={forceUpdate} />
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
});
