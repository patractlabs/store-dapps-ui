import { useContractQuery, useModal } from '@patract/react-hooks';
import { Box, Button, Flex, PageHeader, PageLayout, PageMain } from '@patract/ui-components';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { useMakerContract } from '../../hooks/use-maker-contract';
import IssueDAI from './issue-dai';
import CDPList from './cdp-list';
interface TotalSupplyProps{
  title: string;
  val: number | string;
  unit?: string;
}

interface SystemParamsProps {
  mcr: number;
  mlr: number;
  lrr: number;
  currentPrice: number;
}

const TotalSupply: FC<TotalSupplyProps> = ({ title, val, unit }): ReactElement => {
  return <Box sx={{
    borderRadius: '8px',
    height: '135px',
    width: '262px',
    border: '1px solid #00ACC3',
    background: '#04BACB',
    boxShadow: '0px 8px 15px 0px rgba(0, 186, 203, 0.4)'
  }}>
    <Box sx={{
      width: '262px',
      height: '45px',
      background: '#00ACC3',
      boxShadow: '0px 12px 22px 0px rgba(0, 186, 203, 0.4)',
      borderRadius: '8px 8px 4px 4px',
      border: '1px solid #00ACC3',
      fontSize: '18px',
      fontFamily: 'PingFangSC-Medium, PingFang SC',
      fontWeight: '500',
      color: '#FFFFFF',
      lineHeight: '45px',
      textAlign: 'center'
    }}>
      { title }
    </Box>
    <Box sx={{
      height: '90px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '36px',
      fontFamily: 'PingFangSC-Medium, PingFang SC',
      fontWeight: '500',
      color: '#FFFFFF',
    }}>
      { val } {unit}
    </Box>
  </Box>;
};

const SystemParams: FC<SystemParamsProps> = ({
  mcr,
  mlr,
  lrr,
  currentPrice,
}): ReactElement => {
  const { isOpen: isIssueDAIOpen, onOpen: onIssueDAIOpen, onClose: onIssueDAIClose } = useModal();

  return <Flex sx={{
    height: '183px',
    background: '#FFFFFF',
    boxShadow: '0px 0px 10px 0px rgba(171, 180, 208, 0.5)',
    borderRadius: '8px',
    padding: '1rem',
  }} justifyContent='space-between'>
    <Box>
      <Flex justifyContent='space-between' style={{ height: '40px' }}>
        <Box style={{
          width: '170px',
          fontSize: '14px',
          fontFamily: 'PingFangSC-Regular, PingFang SC',
          fontWeight: 400,
          color: '#000000',
          lineHeight: '24px',
        }}>Min Collateral Ratio</Box>
        <Box style={{
          width: '170px',
          fontSize: '14px',
          fontFamily: 'PingFangSC-Regular, PingFang SC',
          fontWeight: 400,
          color: '#000000',
          lineHeight: '24px',
        }}>Min Liquidation Ratio</Box>
        <Box style={{
          width: '170px',
          fontSize: '14px',
          fontFamily: 'PingFangSC-Regular, PingFang SC',
          fontWeight: 400,
          color: '#000000',
          lineHeight: '24px',
        }}>Liquidater Reward Ratio</Box>
        <Box style={{
          width: '170px',
          fontSize: '14px',
          fontFamily: 'PingFangSC-Regular, PingFang SC',
          fontWeight: 400,
          color: '#000000',
          lineHeight: '24px',
        }}>Current DOT Price</Box>
      </Flex>
      <Flex height={ 100 }>
        <Box style={{ width: '170px', textAlign: 'center' }}>
          <p style={{ 
            fontSize: '25px',
            fontFamily: 'PingFangSC-Semibold, PingFang SC',
            fontWeight: 600,
            color: '#000000',
            lineHeight: '36px',
           }}>{ mcr }%</p>
          <p>(MCR)</p>
        </Box>
        <Box style={{ width: '170px', textAlign: 'center' }}>
          <p style={{ 
            fontSize: '25px',
            fontFamily: 'PingFangSC-Semibold, PingFang SC',
            fontWeight: 600,
            color: '#000000',
            lineHeight: '36px',
           }}>{ mlr }%</p>
          <p>(MLR)</p>
        </Box>
        <Box style={{ width: '170px', textAlign: 'center' }}>
          <p style={{ 
            fontSize: '25px',
            fontFamily: 'PingFangSC-Semibold, PingFang SC',
            fontWeight: 600,
            color: '#000000',
            lineHeight: '36px',
           }}>{ lrr }%</p>
          <p>(LRR)</p>
        </Box>
        <Box style={{ width: '170px', textAlign: 'center' }}>
          <p style={{
            fontSize: '25px',
            fontFamily: 'PingFangSC-Semibold, PingFang SC',
            fontWeight: 600,
            color: '#000000',
            lineHeight: '36px',
           }}>${ currentPrice }</p>
        </Box>
      </Flex>
    </Box>
    <Box sx={{
      textAlign: 'center',
      width: '400px',
    }}>
      <h3 style={{
        fontSize: '15px',
        fontFamily: 'PingFangSC-Medium, PingFang SC',
        fontWeight: 500,
        color: '#000000',
        lineHeight: '17px',
      }}>At current price and ratios, 100 DOT can issue 1000 DAI at max.</h3>
      <p style={{
        fontSize: '12px',
        fontFamily: 'PingFangSC-Regular, PingFang SC',
        fontWeight: 400,
        color: '#666666',
        lineHeight: '15px',
      }}>You can under take up to 27% price drop. Otherwise, you need to increase collateral, or you can be liquidated by anyone and lose 5%.</p>
      <Button
        colorScheme={ 'green' }
        sx={{
          width: '193px',
          height: '40px',
          background: '#25A17C',
          boxShadow: '0px 0px 4px 0px #ABB4D0',
          borderRadius: '4px',
        }}
        onClick={onIssueDAIOpen}>
          Issue DAI
      </Button>
    </Box>
    <IssueDAI currentPrice={ 15 } isOpen={isIssueDAIOpen} onClose={onIssueDAIClose} onSubmit={ () => {} } balance={ 100.1 } />
  </Flex>
};

const Maker: FC = (): ReactElement => {
  const { contract } = useMakerContract();
  const { read: readSystemParams } = useContractQuery({ contract, method: 'systemParams' });
  const { read: readTotalSupply } = useContractQuery({ contract, method: 'totalSupply' });
  const [ totalSupply, setTotalSupply ] = useState<TotalSupplyProps[]>([]);
  const [ systemParams, setSystemParams ] = useState<SystemParamsProps>({
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
      <SystemParams mcr={systemParams.mcr} mlr={ systemParams.mlr } lrr={ systemParams.lrr } currentPrice={ systemParams.currentPrice } />
      <CDPList price={systemParams.currentPrice}/>
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
