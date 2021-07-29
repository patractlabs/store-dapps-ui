import { useContractQuery } from '@patract/react-hooks';
import { Box, PageHeader, PageLayout, PageMain } from '@patract/ui-components';
import { trait } from '@patract/utils';
import React, { FC, ReactElement, useEffect, useReducer, useState } from 'react';
import { useDaiContract } from '../../hooks/use-dai-contract';
import { useMakerContract } from '../../hooks/use-maker-contract';
import CDPList from './cdp-list';
import { SystemParams, SystemParamsArea } from './system-params';
import { TotalSupply } from './total-supply';

const Maker: FC = (): ReactElement => {
  const { contract } = useMakerContract();
  const { read: readSystemParams } = useContractQuery({ contract, method: 'systemParams' });
  const { contract: daiContract } = useDaiContract();
  const { read: readDecimals } = useContractQuery({ contract: daiContract, method: `${trait}tokenDecimals` });
  const [signal, forceUpdate] = useReducer((x) => x + 1, 0);
  const [decimals, setDecimals] = useState<number>(18);
  const [systemParams, setSystemParams] = useState<SystemParams>({
    mcr: 0,
    mlr: 0,
    lrr: 0,
    currentPrice: 0
  });
  useEffect(() => {
    readSystemParams()
      .then((data) => {
        const [mcr, mlr, lrr, currentPrice] = (data as number[]) || [0, 0, 0, 0];
        setSystemParams({
          mcr,
          mlr,
          lrr,
          currentPrice: currentPrice / 100
        });
      })
      .catch(() => {});
  }, [readSystemParams, signal]);

  useEffect(() => {
    readDecimals()
      .then((data) => setDecimals(data as number))
      .catch(() => {});
  }, [setDecimals, readDecimals]);

  return (
    <Box>
      <TotalSupply price={systemParams.currentPrice} signal={signal} daiDecimals={decimals} />
      <SystemParamsArea systemParams={systemParams} onIssueDaiSubmit={forceUpdate} signal={signal} />
      <Box sx={{ height: '34px' }}></Box>
      <CDPList systemParams={systemParams} owner={true} daiDecimals={decimals} onSubmit={forceUpdate} signal={signal} />
      <CDPList
        systemParams={systemParams}
        owner={false}
        daiDecimals={decimals}
        onSubmit={forceUpdate}
        signal={signal}
      />
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
