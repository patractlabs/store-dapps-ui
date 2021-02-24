import { useContractQuery } from '@patract/react-hooks';
import { Box, PageHeader, PageLayout, PageMain } from '@patract/ui-components';
import React, { FC, ReactElement, useCallback, useEffect, useReducer, useState } from 'react';
import { useDaiContract } from '../../hooks/use-dai-contract';
import { useMakerContract } from '../../hooks/use-maker-contract';
import CDPList from './cdp-list';
import { SystemParams, SystemParamsArea } from './system-params';
import { TotalSupply } from './total-supply';

const Maker: FC = (): ReactElement => {
  const { contract } = useMakerContract();
  const { contract: daiContract } = useDaiContract();
  const { read: readSystemParams } = useContractQuery({ contract, method: 'systemParams' });
  const { read: readDecimals } = useContractQuery({ contract: daiContract, method: 'iErc20,tokenDecimals' });
  const [ signal, forceUpdate ] = useReducer((x) => x + 1, 0);
  const [ decimals, setDecimals ] = useState<number>(10);
  const [ systemParams, setSystemParams ] = useState<SystemParams>({
    mcr: 0,
    mlr: 0,
    lrr: 0,
    currentPrice: 0,
  });
  useEffect(() => {
    readSystemParams().then((data) => {
      const [ mcr, mlr, lrr, currentPrice ] = (data as number[]) || [0, 0, 0, 0];

      setSystemParams({
        mcr,
        mlr,
        lrr,
        currentPrice,
      });
    }).catch(() => {});
  }, [readSystemParams, signal]);

  useEffect(() => {
    readDecimals().then((data) => setDecimals(10)).catch(() => {});
  }, [setDecimals, readDecimals]);

  useCallback(() => {}, []);

  return (
    <Box>
      <TotalSupply price={systemParams.currentPrice} signal={signal} />
      <SystemParamsArea systemParams={systemParams} onIssueDaiSubmit={forceUpdate} decimals={decimals} />
      <Box sx={{ height: '34px' }}></Box>
      <CDPList systemParams={systemParams} owner={true} decimals={decimals} onSubmit={forceUpdate} signal={signal} />
      <Box sx={{ height: '24px' }}></Box>
      <CDPList systemParams={systemParams} owner={false} decimals={decimals} onSubmit={forceUpdate} signal={signal} />
    </Box>
  );
};

export default () => (
  <PageLayout>
    <PageHeader title='PatraMaker' />
    <PageMain>
      <Maker />
    </PageMain>
  </PageLayout>
);
