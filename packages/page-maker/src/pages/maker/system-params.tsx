import { useModal } from '@patract/react-hooks';
import { Image, Box, Button, Grid, GridItem } from '@patract/ui-components';
import React, { FC, ReactElement, useMemo } from 'react';
import IssueDAI from './issue-dai';
import Add from '../../images/svgs/add.svg';

const AddIcon: FC = (): ReactElement => {
  return <Image size='xs' src={Add} />
};

export interface SystemParams {
  mcr: number;
  mlr: number;
  lrr: number;
  currentPrice: number;
}

const Card: FC<{
  val: string;
  title: string;
  unit: string;
  orange?: boolean;
}> = ({ title, val, unit, orange = false }): ReactElement => {
  return (
    <Box sx={{ textAlign: 'center', paddingTop: '24px' }}>
      <Box sx={{
          fontSize: '14px',
          color: orange ? '#0058FA' : '#000000',
          lineHeight: '24px',
          marginBottom: '17px',
        }}>
          { title }
      </Box>
      <Box sx={{ borderRight: !orange ? '1px solid #E1E9FF' : '' }}>
        <p style={{ 
          fontSize: '25px',
          fontWeight: 600,
          color: orange ? '#0058FA' : '#000000',
          lineHeight: orange ? '60px' : '36px',
          }}>{ val }</p>
        <p>{ unit }</p>
      </Box>
    </Box>
  );
}

export const SystemParamsArea: FC<{
  systemParams: SystemParams;
  onIssueDaiSubmit(): void;
  decimals: number;
}> = ({
  systemParams,
  onIssueDaiSubmit,
  decimals,
}): ReactElement => {
  const { isOpen: isIssueDAIOpen, onOpen: onIssueDAIOpen, onClose: onIssueDAIClose } = useModal();
  const list: {
    title: string;
    val: string;
    unit: string;
  }[] = useMemo(() => {
    if (!systemParams) {
      return [
        { title: 'Min Collateral Ratio', val: '?', unit: '(MCR)' },
        { title: 'Min Liquidate Ratio', val: '?', unit: '(MLR)' },
        { title: 'Liquidater Reward Ratio', val: '?', unit: '(LRR)' },
        { title: 'Current DOT Price', val: '?', unit: ''},
      ];
    }
    return [
      { title: 'Min Collateral Ratio', val: `${systemParams.mcr}%`, unit: '(MCR)' },
      { title: 'Min Liquidate Ratio', val: `${systemParams.mlr}%`, unit: '(MLR)' },
      { title: 'Liquidater Reward Ratio', val: `${systemParams.lrr}%`, unit: '(LRR)' },
      { title: 'Current DOT Price', val: `$${systemParams.currentPrice}`, unit: ''},
    ];
  }, [systemParams]);

  const dotYouMayHave = 100;
  const estimatedDai = useMemo(() => {
    if (!systemParams.mcr) {
      return '?';
    }
    const dai = dotYouMayHave * systemParams.currentPrice / systemParams.mcr * 100;
    return dai.toFixed(0);
  }, [systemParams]);

  const losePercent = useMemo(() => {
    if (!systemParams.mcr) {
      return '?';
    }
    // `100` here is not ${dotYouMayHave}
    const _losePercent = (100 - 100 / systemParams.mcr * systemParams.mlr);
    return _losePercent.toFixed(0);
  }, [systemParams]);

  return (
    <Grid
      h="183px"
      bg="#FFFFFF"
      templateColumns="repeat(12, 1fr)"
      gap={4}
      sx={{ 
        boxShadow: '0px 0px 10px 0px rgba(171, 180, 208, 0.5)',
        borderRadius: '8px',
        padding: '1rem'
      }}
    >
      {
        list.map((item, index) => 
          <GridItem colSpan={2} key={index}>
            <Card title={item.title} val={item.val} unit={item.unit} orange={ index === 3 } />
          </GridItem>
        ) 
      }
      <GridItem colSpan={4} sx={{
          textAlign: 'center',
        }}>
          <Box sx={{ padding: '0px 26px' }}>
            <h3 style={{
              fontSize: '15px',
              fontWeight: 500,
              color: '#000000',
              lineHeight: '17px',
              height: '34px',
              marginTop: '7px',
              marginBottom: '13px',
            }}>At current price and ratios, { dotYouMayHave } DOT can issue { estimatedDai } DAI at max.</h3>
            <p style={{
              fontSize: '12px',
              color: 'brand.grey',
              lineHeight: '15px',
              marginBottom: '12px',
              height: '45px',
            }}>You can under take up to { losePercent }% price drop. Otherwise, you need to increase collateral, or you can be liquidated by anyone and lose { systemParams.lrr }%.</p>
            <Button
              colorScheme={ 'green' }
              sx={{
                width: '193px',
                height: '40px',
                background: '#25A17C',
                boxShadow: '0px 0px 4px 0px #ABB4D0',
                borderRadius: '4px',
              }}
              leftIcon={ <AddIcon/> }
              onClick={onIssueDAIOpen}>
                Issue DAI
            </Button>
          </Box>
        <IssueDAI systemParams={ systemParams } isOpen={isIssueDAIOpen} onClose={onIssueDAIClose} onSubmit={onIssueDaiSubmit} decimals={decimals} />
      </GridItem>
    </Grid>
  )
};