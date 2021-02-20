import { useContractQuery } from '@patract/react-hooks';
import { Flex, PageHeader, PageLayout, PageMain } from '@patract/ui-components';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { useMakerContract } from '../../hooks/use-maker-contract';
import CDPList from './cdp-list';
import { SystemParams, SystemParamsArea } from './system-params';
import { TotalSupply, TotalSupplyProps } from './total-supply';


const Maker: FC = (): ReactElement => {
  const { contract } = useMakerContract();
  const { read: readSystemParams } = useContractQuery({ contract, method: 'systemParams' });
  const { read: readTotalSupply } = useContractQuery({ contract, method: 'totalSupply' });
  const [ totalSupply, setTotalSupply ] = useState<TotalSupplyProps[]>([]);
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
    readTotalSupply().then(data => {
      const [totalIssuers, totalCollateral, totalIssuance] = (data as number[]) || [0, 0, 0, 0];

      setTotalSupply([
        { title: 'Total Issuers', val: totalIssuers },
        { title: 'Total Collateral', val: totalCollateral, unit: 'DOT' },
        { title: 'Total Issuance', val: totalIssuance, unit: 'DAI' },
        { title: 'Average Collateral Ratio', val: '125%' },
      ]);
    }).catch(() => {});
  }, [readTotalSupply]);

  return (
    <>
      <Flex justifyContent='space-between' sx={{ marginBottom: '1rem' }}>
        { totalSupply.map(item => <TotalSupply key={ item.title } title={ item.title } val={ item.val } unit={ item.unit } />) }
      </Flex>
      <SystemParamsArea mcr={systemParams.mcr} mlr={ systemParams.mlr } lrr={ systemParams.lrr } currentPrice={ systemParams.currentPrice } />
      <CDPList systemParams={systemParams} owner={true} />
      <CDPList systemParams={systemParams} owner={false} />
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
