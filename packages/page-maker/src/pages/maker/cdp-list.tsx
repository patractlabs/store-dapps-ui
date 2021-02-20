import { Pagination } from '@material-ui/lab';
import { useAccount, useModal } from '@patract/react-hooks';
import { Address, Button, Center, CircularProgress, Flex, Table, Tbody, Td, Th, Thead, Tr, Text } from '@patract/ui-components';
import React, { FC, ReactElement, useCallback, useMemo, useReducer, useState } from 'react';
import { useCdpList } from '../../hooks/use-cdp-list';
import Increase from './increase';
import Liquidate from './liquidate';
import Reduce from './reduce';
import { CDP } from './types';
import Withdraw from './with-draw';

const CDPList: FC<{
  price: number;
  owner: boolean;
}> = ({ price, owner }): ReactElement => {
  const { isOpen: isIncreaseOpen, onOpen: onIncreaseOpen, onClose: onIncreaseClose } = useModal();
  const { isOpen: isReduceOpen, onOpen: onReduceOpen, onClose: onReduceClose } = useModal();
  const { isOpen: isWithdrawOpen, onOpen: onWithdrawOpen, onClose: onWithdrawClose } = useModal();
  const { isOpen: isLiquidateOpen, onOpen: onLiquidateOpen, onClose: onLiquidateClose } = useModal();
  const [signal, forceUpdate] = useReducer((x) => x + 1, 0);
  const { data, isLoading } = useCdpList(signal);
  const [ choosedCdp, setChoosedCdp ] = useState<CDP>();
  const [ list, setList ] = useState<CDP[]>([]);
  const { currentAccount } = useAccount();

  useMemo(() => {
    if (!data) {
      return;
    }
    const _list = data.filter(item => (owner && item.issuer === currentAccount) || (!owner && item.issuer !== currentAccount));
    setList(_list);
  }, [data]);

  const renderOperations = useCallback(
    (item: CDP) => {
      
      return owner ?
        <Flex>
          <Button onClick={ () => {
            setChoosedCdp(item);
            onIncreaseOpen();
          } }>Increase</Button>
          <Button onClick={ () => {
            setChoosedCdp(item);
            onReduceOpen();
          } }>Reduce</Button>
          <Button onClick={ () => {
            setChoosedCdp(item);
            onWithdrawOpen();
          } }>Withdraw</Button>
        </Flex>
        :
        <Button onClick={ () => {
          setChoosedCdp(item);
          onLiquidateOpen();
        } }>Liquidate</Button>
    },
    [onIncreaseOpen, onReduceOpen, onWithdrawOpen, onLiquidateOpen],
  );

  const renderGameRow = useCallback(
    (item: CDP) => {
      return (
        <Tr key={item.id}>
          <Td sx={{ px: '3', textAlign: 'left' }}>
            <Address value={item.issuer} />
          </Td>
          <Td>
            { item.create_date }
          </Td>
          <Td>
            { item.collateral_dot }
          </Td>
          <Td>
            { item.issue_dai }
          </Td>
          <Td>
            { item.collateral_ratio }
          </Td>
          <Td>{renderOperations(item)}</Td>
        </Tr>
      );
    },
    [renderOperations]
  );

  const pageSize = 10;

  const count = useMemo(() => {
    return list ? Math.ceil(list.length / pageSize) : 0;
  }, [list]);

  const [page, setPage] = useState(1);

  return (
    <>
      <Text>{ owner ? 'My' : 'Others' } Collaterals</Text>
      <Table>
        <Thead>
          <Tr>
            <Th px='16px'>Account</Th>
            <Th>Creation Date</Th>
            <Th>DOT Collateral</Th>
            <Th>DAI Issuance</Th>
            <Th>Current Collateral Ratio</Th>
            <Th px='0'>Operation</Th>
          </Tr>
        </Thead>
        <Tbody>
          {list.slice(pageSize * (page - 1), pageSize * page).map(item => renderGameRow(item))}
        </Tbody>
      </Table>
      {((list && list.length !== 0) || page !== 1) && (
        <Flex mt='4' justifyContent='flex-end'>
          <Pagination count={count} page={page} onChange={(_, page) => setPage(page)} shape='rounded' />
        </Flex>
      )}
      {!list.length && isLoading && (
        <Center p={16}>
          <CircularProgress isIndeterminate color='blue.300' />
        </Center>
      )}
      <Increase cdp={choosedCdp} isOpen={isIncreaseOpen && !!choosedCdp} onClose={onIncreaseClose} onSubmit={forceUpdate} price={price} />
      <Reduce cdp={choosedCdp} isOpen={isReduceOpen && !!choosedCdp} onClose={onReduceClose} onSubmit={forceUpdate} price={price} />
      <Withdraw cdp={choosedCdp} isOpen={isWithdrawOpen && !!choosedCdp} onClose={onWithdrawClose} onSubmit={forceUpdate} price={price} />
      <Liquidate cdp={choosedCdp} isOpen={isLiquidateOpen && !!choosedCdp} onClose={onLiquidateClose} onSubmit={forceUpdate} price={price} />
    </>
  );
};

export default CDPList;