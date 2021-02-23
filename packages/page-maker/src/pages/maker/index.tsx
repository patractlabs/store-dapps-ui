import { useContractQuery } from '@patract/react-hooks';
import { Flex, PageHeader, PageLayout, PageMain } from '@patract/ui-components';
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
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

  const [ decimals, setDecimals ] = useState<number>(18);
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
  }, [readSystemParams]);

  useEffect(() => {
    readDecimals().then((data) => {
      console.log('fuck decimals', data);
      setDecimals(10);
    }).catch(() => {});
  }, [setDecimals, readDecimals]);

  useCallback(() => {}, []);

  return (
    <>
      <Flex justifyContent='space-between' sx={{ marginBottom: '1rem' }}>
        <TotalSupply price={systemParams.currentPrice} />
      </Flex>
      <SystemParamsArea systemParams={systemParams} onIssueDaiSubmit={() => {}} />
      <CDPList systemParams={systemParams} owner={true} decimals={decimals} />
      <CDPList systemParams={systemParams} owner={false} decimals={decimals} />
    </>
  );
};

export default () => (
  <PageLayout>
    <PageHeader title='Patra Maker' />
    <PageMain>
      <Maker />
    </PageMain>
  </PageLayout>
);