import { useModal } from '@patract/react-hooks';
import { Box, Button, Flex } from '@patract/ui-components';
import React, { FC, ReactElement } from 'react';
import IssueDAI from './issue-dai';

export interface SystemParams {
  mcr: number;
  mlr: number;
  lrr: number;
  currentPrice: number;
}

interface SystemParamsProps {
  systemParams: SystemParams;
  onIssueDaiSubmit(): void;
}

export const SystemParamsArea: FC<SystemParamsProps> = ({
  systemParams,
  onIssueDaiSubmit,
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
           }}>{ systemParams.mcr }%</p>
          <p>(MCR)</p>
        </Box>
        <Box style={{ width: '170px', textAlign: 'center' }}>
          <p style={{ 
            fontSize: '25px',
            fontFamily: 'PingFangSC-Semibold, PingFang SC',
            fontWeight: 600,
            color: '#000000',
            lineHeight: '36px',
           }}>{ systemParams.mlr }%</p>
          <p>(MLR)</p>
        </Box>
        <Box style={{ width: '170px', textAlign: 'center' }}>
          <p style={{ 
            fontSize: '25px',
            fontFamily: 'PingFangSC-Semibold, PingFang SC',
            fontWeight: 600,
            color: '#000000',
            lineHeight: '36px',
           }}>{ systemParams.lrr }%</p>
          <p>(LRR)</p>
        </Box>
        <Box style={{ width: '170px', textAlign: 'center' }}>
          <p style={{
            fontSize: '25px',
            fontFamily: 'PingFangSC-Semibold, PingFang SC',
            fontWeight: 600,
            color: '#000000',
            lineHeight: '36px',
           }}>${ systemParams.currentPrice }</p>
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
    <IssueDAI currentPrice={ systemParams.currentPrice } isOpen={isIssueDAIOpen} onClose={onIssueDAIClose} onSubmit={onIssueDaiSubmit} />
  </Flex>
};