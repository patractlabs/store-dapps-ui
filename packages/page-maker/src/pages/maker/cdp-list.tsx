import { Pagination } from '@material-ui/lab';
import { useAccount, useModal } from '@patract/react-hooks';
import { Address, Flex, Table, Tbody, Td, Th, Thead, Tr, Text, Box } from '@patract/ui-components';
import React, { FC, ReactElement, useCallback, useContext, useMemo, useState } from 'react';
import { SystemParams } from './system-params';
import { useCdpList } from '../../hooks/use-cdp-list';
import Increase from './increase';
import Liquidate from './liquidate';
import Reduce from './reduce';
import { CDP } from './types';
import Withdraw from './with-draw';
import styled from 'styled-components';
import ApiContext from '@patract/react-components/api/api-context';

const getDays = (createTime: string): string => {
  const _createTime = parseFloat(createTime);
  if (`${_createTime}` === 'NaN') {
    return '';
  }
  const now = Date.now();
  // 有可能出现负数的情况
  const time = (now - _createTime) < 0 ? (_createTime - now) : (now - _createTime);
  const days = time / 86400000;
  if (days < 1) {
    const hours = Math.floor(time / 3600000);
    return hours === 0 ? 'Within 1 hour' : `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }
  if (days < 2) {
    return `1 day ago`;
  }
  return `${Math.floor(days)} days ago`;
};

const LabelButton = styled.label<{ isDisabled?: boolean }>`
  cursor: pointer;
  color: ${props => props.isDisabled ? '#ABB4D0' : '#0058FA'};
  text-decoration: underline;
`;

const getFixed = (num: number, decimals = 3) => {
  return parseFloat(num.toFixed(decimals));
}

const CDPList: FC<{
  systemParams: SystemParams;
  owner: boolean;
  daiDecimals: number;
  onSubmit?(): void;
  signal: number;
}> = ({ systemParams, owner, daiDecimals, onSubmit, signal }): ReactElement => {
  const { isOpen: isIncreaseOpen, onOpen: onIncreaseOpen, onClose: onIncreaseClose } = useModal();
  const { isOpen: isReduceOpen, onOpen: onReduceOpen, onClose: onReduceClose } = useModal();
  const { isOpen: isWithdrawOpen, onOpen: onWithdrawOpen, onClose: onWithdrawClose } = useModal();
  const { isOpen: isLiquidateOpen, onOpen: onLiquidateOpen, onClose: onLiquidateClose } = useModal();
  const { data } = useCdpList(signal);
  const [ choosedCdp, setChoosedCdp ] = useState<CDP>();
  const [ list, setList ] = useState<CDP[]>([]);
  const { currentAccount } = useAccount();
  const { tokenDecimals: dotDecimals } = useContext(ApiContext);
  const limit = 0.1;

  useMemo(() => {
    if (!data) {
      return;
    }
    const _list: CDP[] = data.filter(
      item => !!item.collateral_dot && (item.collateral_dot / Math.pow(10, dotDecimals)) >= limit &&  (item.issue_dai / Math.pow(10, daiDecimals)) >= limit
    ).filter(
      item => (owner && item.issuer === currentAccount) || (!owner && item.issuer !== currentAccount)
    ).map(
      item => ({
        ...item,
        collateral_ratio: item.collateral_dot * systemParams.currentPrice / item.issue_dai * 100 * (Math.pow(10, daiDecimals - dotDecimals)),
      })
    );
    // console.log(_list, 'list');
    
    setList(_list);
  }, [data, currentAccount, owner, systemParams.currentPrice, daiDecimals, dotDecimals]);

  const getRatioColor = useCallback((ratio: number, withdrawed = false): string => {
    if (withdrawed) {
      return '#ABB4D0';
    }
    if (getFixed(ratio) >= getFixed(systemParams.mcr)) {
      return '#25A17C';
    }
    if (getFixed(ratio) > getFixed(systemParams.mlr)) {
      return '#F7B500';
    }
    return '#FA1C00';
  }, [systemParams]);
  
  const renderOperations = useCallback(
    (item: CDP) => {
      const canIncrease = item.collateral_dot > 0;
      const canReduce = item.collateral_dot > 0 && item.collateral_ratio > systemParams.mcr;
      const canWithdraw = item.collateral_dot > 0 && item.collateral_ratio > 120;
      const canLiquidate = item.collateral_dot > 0 && item.collateral_ratio <= systemParams.mlr;

      return owner ?
        <Flex justifyContent='space-between'>
          <LabelButton
            isDisabled={!canIncrease}
            onClick={ () => {
              if (!canIncrease) {
                return;
              }
              setChoosedCdp(item);
              onIncreaseOpen();
            } }>
              Increase
            </LabelButton>
          <LabelButton
            isDisabled={!canReduce}
            onClick={ () => {
              if (!canReduce) {
                return;
              }
              setChoosedCdp(item);
              onReduceOpen();
            } }>
              Reduce
            </LabelButton>
          <LabelButton
            isDisabled={!canWithdraw}
            onClick={ () => {
              if (!canWithdraw) {
                return;
              }
              setChoosedCdp(item);
              onWithdrawOpen();
            } }>
              Redeem
            </LabelButton>
        </Flex>
        :
        <LabelButton
          isDisabled={!canLiquidate}
          onClick={ () => {
            if (!canLiquidate) {
              return;
            }
            setChoosedCdp(item);
            onLiquidateOpen();
          } }>Liquidate</LabelButton>
    },
    [onIncreaseOpen, onReduceOpen, onWithdrawOpen, onLiquidateOpen, owner, systemParams],
  );

  const renderCdpRow = useCallback(
    (item: CDP) => {
      return (
        <Tr key={item.id} textAlign="right">
          <Td textAlign="left" px="4">
            <Address value={item.issuer} />
          </Td>
          <Td textAlign="right">
            { getDays(item.create_date) }
          </Td>
          <Td textAlign="right">
            { (item.collateral_dot / Math.pow(10, dotDecimals)).toFixed(3) } DOT
          </Td>
          <Td textAlign="right">
            { (item.issue_dai / Math.pow(10, daiDecimals)).toFixed(3) } DAI
          </Td>
          <Td textAlign="right">
            <label style={{
              color: getRatioColor(item.collateral_ratio, item.collateral_dot === 0),
            }}>
              { !item.collateral_dot ? '-' : `${item.collateral_ratio.toFixed(1)}%` }
            </label>
          </Td>
          <Td textAlign="right" px="6" w={owner ? '295px' : '150px'}>{renderOperations(item)}</Td>
        </Tr>
      );
    },
    [renderOperations, daiDecimals, getRatioColor, owner, dotDecimals]
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
      padding: list.length ? '1rem' : '0px',
      marginBottom: list.length && owner ? '24px' : '0px'
    }}>
      { !!list.length && <Text sx={{ paddingBottom: '1em' }}>{ owner ? 'My' : 'Others' } Collaterals</Text> }
      { !!list.length && <Table variant='maker'>
        <Thead>
          <Tr>
            <Th textAlign="left" px='4'>Account</Th>
            <Th textAlign="right">Creation Time</Th>
            <Th textAlign="right">Collateral</Th>
            <Th textAlign="right">Issuance</Th>
            <Th textAlign="right">Collateral Ratio</Th>
            <Th textAlign="right" px='6' w={owner ? '295px' : '150px'}>Operation</Th>
          </Tr>
        </Thead>
        <Tbody>
          { list.slice(pageSize * (page - 1), pageSize * page).map(item => renderCdpRow(item)) }
        </Tbody>
      </Table> }
      {((list && list.length !== 0) || page !== 1) && (
        <Flex mt='4' justifyContent='flex-end'>
          <Pagination count={count} page={page} onChange={(_, page) => setPage(page)} shape='rounded' />
        </Flex>
      )}
      {/* {(!list.length) && (
        <Center p={16}>
          {isLoading ? <CircularProgress isIndeterminate color='blue.300' /> : <Text>No Data</Text>}
        </Center>
      )} */}
      <Increase cdp={choosedCdp} isOpen={isIncreaseOpen && !!choosedCdp} onClose={onIncreaseClose} onSubmit={onSubmit} price={systemParams.currentPrice} daiDecimals={daiDecimals} />
      <Reduce cdp={choosedCdp} isOpen={isReduceOpen && !!choosedCdp} onClose={onReduceClose} onSubmit={onSubmit} systemParams={systemParams} daiDecimals={daiDecimals} />
      <Withdraw cdp={choosedCdp} isOpen={isWithdrawOpen && !!choosedCdp} onClose={onWithdrawClose} onSubmit={onSubmit} price={systemParams.currentPrice} daiDecimals={daiDecimals} />
      <Liquidate cdp={choosedCdp} isOpen={isLiquidateOpen && !!choosedCdp} onClose={onLiquidateClose} onSubmit={onSubmit} systemParams={systemParams} daiDecimals={daiDecimals} />
    </Box>
  );
};

export default CDPList;