import { Box } from '@patract/ui-components';
import React, { FC, ReactElement } from 'react';

export interface TotalSupplyProps{
  title: string;
  val: number | string;
  unit?: string;
}

export const TotalSupply: FC<TotalSupplyProps> = ({ title, val, unit }): ReactElement => {
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