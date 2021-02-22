import { Pagination } from '@material-ui/lab';
import { useAccount, useModal } from '@patract/react-hooks';
import { Address, Center, CircularProgress, Flex, Table, Tbody, Td, Th, Thead, Tr, Text, Fixed, Box } from '@patract/ui-components';
import React, { FC, ReactElement, useCallback, useMemo, useReducer, useState } from 'react';
import { SystemParams } from './system-params';
import { useCdpList } from '../../hooks/use-cdp-list';
import Increase from './increase';
import Liquidate from './liquidate';
import Reduce from './reduce';
import { CDP } from './types';
import Withdraw from './with-draw';
import styled from 'styled-components';

const getRatioColor = (ratio: number): string => {
  if (ratio >= 150) {
    return '#25A17C';
  }
  if (ratio >= 110) {
    return '#F7B500';
  }
  return '#FA1C00';
}

const getDays = (createTime: string): string => {
  const _createTime = parseFloat(createTime);
  if (`${_createTime}` === 'NaN') {
    return '';
  }
  const days = (Date.now() - parseFloat(createTime)) / 86400000;
  if (days < 1) {
    return 'Today';
  }
  if (days < 2) {
    return `${Math.floor(days)} day ago`;
  }
  return `${Math.floor(days)} days ago`;
};

const LabelButton = styled.label<{ isDisabled?: boolean }>`
  cursor: pointer;
  color: ${props => props.isDisabled ? '#ABB4D0' : '#0058FA'};
  text-decoration: underline;
`;

const CDPList: FC<{
  systemParams: SystemParams;
  owner: boolean;
  decimals: number;
}> = ({ systemParams, owner, decimals }): ReactElement => {
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
  }, [data, currentAccount, owner]);

  const renderOperations = useCallback(
    (item: CDP) => {
      return owner ?
        <Flex justifyContent='space-between'>
          <LabelButton
            isDisabled={ item.collateral_dot === 0 }
            onClick={ () => {
              if (item.collateral_dot === 0) {
                return;
              }
              setChoosedCdp(item);
              onIncreaseOpen();
            } }>
              Increase
            </LabelButton>
          <LabelButton
            isDisabled={ item.collateral_ratio < 150 || item.collateral_dot === 0 }
            onClick={ () => {
              if (item.collateral_ratio < 150 || item.collateral_dot === 0) {
                return;
              }
              setChoosedCdp(item);
              onReduceOpen();
            } }>
              Reduce
            </LabelButton>
          <LabelButton
            isDisabled={ item.collateral_ratio < 120 || item.collateral_dot === 0 }
            onClick={ () => {
              if (item.collateral_ratio < 120 || item.collateral_dot === 0) {
                return;
              }
              setChoosedCdp(item);
              onWithdrawOpen();
            } }>
              Withdraw
            </LabelButton>
        </Flex>
        :
        <LabelButton
          isDisabled={ item.collateral_ratio > 110 || item.collateral_dot === 0 }
          onClick={ () => {
            if (item.collateral_ratio > 110 || item.collateral_dot === 0) {
              return;
            }
            setChoosedCdp(item);
            onLiquidateOpen();
          } }>Liquidate</LabelButton>
    },
    [onIncreaseOpen, onReduceOpen, onWithdrawOpen, onLiquidateOpen, owner],
  );

  const renderCdpRow = useCallback(
    (item: CDP) => {
      return (
        <Tr key={item.id}>
          <Td sx={{ px: '3', textAlign: 'left' }}>
            <Address value={item.issuer} />
          </Td>
          <Td>
            { getDays(item.create_date) }
          </Td>
          <Td>
            <Fixed value={item.collateral_dot} decimals={decimals} />
          </Td>
          <Td>
            <Fixed value={item.issue_dai} decimals={decimals} />
          </Td>
          <Td>
            <label style={{
              color: getRatioColor(item.collateral_ratio),
            }}>
              { item.collateral_ratio }%
            </label>
          </Td>
          <Td sx={{ paddingLeft: '0px' }}>{renderOperations(item)}</Td>
        </Tr>
      );
    },
    [renderOperations, decimals]
  );

  const pageSize = 10;
  const count = useMemo(() => {
    return list ? Math.ceil(list.length / pageSize) : 0;
  }, [list]);
  const [page, setPage] = useState(1);

  return (
    <Box sx={{
      background: '#FFFFFF',
      borderRadius: '8px',
      padding: '1rem',
    }}>
      <Text sx={{ paddingBottom: '1em' }}>{ owner ? 'My' : 'Others' } Collaterals</Text>
      <Table variant='maker'>
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
          {list.slice(pageSize * (page - 1), pageSize * page).map(item => renderCdpRow(item))}
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
      <Increase cdp={choosedCdp} isOpen={isIncreaseOpen && !!choosedCdp} onClose={onIncreaseClose} onSubmit={forceUpdate} price={systemParams.currentPrice} />
      <Reduce cdp={choosedCdp} isOpen={isReduceOpen && !!choosedCdp} onClose={onReduceClose} onSubmit={forceUpdate} price={systemParams.currentPrice} />
      <Withdraw cdp={choosedCdp} isOpen={isWithdrawOpen && !!choosedCdp} onClose={onWithdrawClose} onSubmit={forceUpdate} price={systemParams.currentPrice} />
      <Liquidate cdp={choosedCdp} isOpen={isLiquidateOpen && !!choosedCdp} onClose={onLiquidateClose} onSubmit={forceUpdate} systemParams={systemParams} />
    </Box>
  );
};

export default CDPList;