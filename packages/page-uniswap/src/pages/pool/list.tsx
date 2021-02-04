import { AddIcon } from '@chakra-ui/icons';
import { List, ListItem, PopoverTrigger, Image } from "@chakra-ui/react"
import { useModal } from '@patract/react-hooks';
import {
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
  Tr,
  Avatar,
  Popover,
  PopoverContent,
  PopoverArrow,
  PopoverBody
} from '@patract/ui-components';
import React, { useReducer } from 'react';
import { useLPtokenBalance } from '../../hooks/useLPtokenBalance';
import { usePairList } from '../../hooks/usePairList';
import Add from './add';
import CreatePair from './create-pair';
import Withdraw from './withdraw';
import UsdtWebp from '../../images/usdt.webp';
import EthWebp from '../../images/eth.webp';
import ArrowWebp from '../../images/arrow.svg';
import TokenFromWebp from '../../images/token-from.webp';
import TokenToWebp from '../../images/token-to.webp';

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

  console.log(data)
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
                    <Box display='flex' alignItems='center' textTransform='uppercase' justifyContent='space-between' paddingRight='35px'>
                      <label>{item.from_symbol}</label>
                      <Image sx={{ width: '20px', height: '20px' }} src={UsdtWebp}/>
                      <Image size='xs' src={ArrowWebp}/>
                      <label>{item.to_symbol}</label>
                      <Image sx={{ width: '20px', height: '20px' }} size='xs' src={EthWebp}/>
                    </Box> 
                  </PopoverTrigger>
                  <PopoverContent sx={{ width: '452px', padding: '16px 12px' }}>
                    <PopoverArrow></PopoverArrow>
                    <PopoverBody sx={{ padding: '0px' }}>
                        <Box sx={{ display: 'flex', height: '17px', lineHeight: '17px', marginBottom: '11px', padding: '0px', justifyContent: 'flex-start' }} >
                          <label style={{ fontWeight: 300, color: '#666', display: 'inline-block', width: '35px' }}>From: </label>
                          <Image sx={{ height: '20px', width: '20px', marginRight: '10px' }} src={TokenFromWebp}/>
                          <label>{ item.from }</label>
                        </Box>
                        <Box sx={{ display: 'flex', height: '17px', lineHeight: '17px', padding: '0px', justifyContent: 'flex-start' }}>
                          <label style={{ fontWeight: 300, color: '#666', display: 'inline-block', width: '35px' }}>To: </label>
                          <Image sx={{ height: '20px', width: '20px', marginRight: '10px' }} src={TokenToWebp}/>
                          <label>{ item.to }</label>
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
