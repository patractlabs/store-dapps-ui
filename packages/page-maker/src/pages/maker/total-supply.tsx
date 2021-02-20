import { useContractQuery } from '@patract/react-hooks';
import { Box } from '@patract/ui-components';
import { toFixed } from '@patract/utils';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { useMakerContract } from '../../hooks/use-maker-contract';

export const TotalSupply: FC<{price: number}> = ({ price }): ReactElement => {
  const { contract } = useMakerContract();
  const { read: readTotalSupply } = useContractQuery({ contract, method: 'totalSupply' });
  const [ list, setList ] = useState<{
    title: string;
    val: number | string;
    unit?: string;
  }[]>([]);
  
  useEffect(() => {
    readTotalSupply().then(data => {
      const [totalIssuers, totalCollateral, totalIssuance] = (data as number[]) || [0, 0, 0, 0];
      
      setList([
        { title: 'Total Issuers', val: totalIssuers },
        { title: 'Total Collateral', val: toFixed(totalCollateral, 10).round(3).toString(), unit: 'DOT' },
        { title: 'Total Issuance', val: toFixed(totalIssuance, 10).round(3).toString(), unit: 'DAI' },
        { title: 'Average Collateral Ratio', val: (totalCollateral * price / totalIssuance * 100).toFixed(0), unit: '%' },
      ]);
    }).catch(() => {});
  }, [readTotalSupply, price]);

  return <>
    {
      list.map(item => (<Box key={item.title} sx={{
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
          { item.title }
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
          {item.val} {item.unit}
        </Box>
      </Box>))
    }
  </>
};