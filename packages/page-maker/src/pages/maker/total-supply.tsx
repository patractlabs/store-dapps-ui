import { useAccount, useContractQuery } from '@patract/react-hooks';
import { Box, SimpleGrid } from '@patract/ui-components';
import { toFixed } from '@patract/utils';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { useDaiContract } from '../../hooks/use-dai-contract';
import { useMakerContract } from '../../hooks/use-maker-contract';

const Card: FC<{
  title: string;
  val: ReactElement;
  green?: boolean
  orange?: boolean;
}> = ({ title, val, orange = false, green = false }): ReactElement => {
  let containerStyle;
  let titleStyle;
  
  if (orange) {
    titleStyle = {
      background: '#FF8F00',
    };
    containerStyle = {
      background: '#FFA400',
      boxShadow: '0px 8px 15px 0px rgba(247, 181, 0, 0.5)',
      border: '1px solid #F7B500',
    }
  } else if (green) {
    titleStyle = {
      background: '#2F855A',
    };
    containerStyle = {
      background: '#25A17C',
      // border: '1px solid #F7B500',
    }
  } else {
    titleStyle = {
      background: '#00ACC3',
    };
    containerStyle = {
      background: '#04BACB',
      boxShadow: '0px 8px 15px 0px rgba(0, 186, 203, 0.4)',
      border: '1px solid #00ACC3',
    }
  }

  return (<Box sx={{
    height: '135px',
    borderRadius: '8px',
    color: '#FFFFFF',
    ...containerStyle,
  }}>
    <Box sx={{
      height: '45px',
      borderRadius: '8px 8px 4px 4px',
      fontSize: '18px',
      lineHeight: '45px',
      textAlign: 'center',
      ...titleStyle,
    }}>
      { title }
    </Box>
    <Box sx={{
      height: '90px',
      fontSize: '36px',
      textAlign: 'center',
      lineHeight: '90px',
    }}>
      { val }
      {/* <label>{item.val}</label>
      <label>{item.unit}</label> */}
    </Box>
  </Box>);
}

export const TotalSupply: FC<{
  price: number;
  signal: number;
  decimals: number;
}> = ({ price, signal, decimals }): ReactElement => {
  const { contract } = useMakerContract();
  const { read: readTotalSupply } = useContractQuery({ contract, method: 'totalSupply' });
  const { contract: daiContract } = useDaiContract();
  const { read: readBalance } = useContractQuery({ contract: daiContract, method: 'iErc20,balanceOf' });
  const { currentAccount } = useAccount();
  const [ list, setList ] = useState<{
    title: string;
    val: number | string;
  }[]>([
    { title: 'Total Issuers', val: '' },
    { title: 'Total Collateral', val: '' },
    { title: 'Total Issuance', val: '' },
    { title: 'Average Collateral Ratio', val: '' },
    { title: 'Your Balance', val: 0 },
  ]);

  useEffect(() => {
    Promise.all([readTotalSupply(), readBalance(currentAccount)]).then(([total, balance]) => {
      const [totalIssuers, totalCollateral, totalIssuance] = (total as number[]) || [0, 0, 0, 0];

      setList([
        { title: 'Total Issuers', val: totalIssuers },
        { title: 'Total Collateral', val: toFixed(totalCollateral, decimals).round(1).toString() },
        { title: 'Total Issuance', val: toFixed(totalIssuance, decimals).round(1).toString() },
        { title: 'Average Collateral Ratio', val: totalIssuance ? (totalCollateral * price / totalIssuance * 100).toFixed(0) : '0' },
        { title: 'Your Balance', val: toFixed(balance as number, decimals, false).round(3).toString() },
      ]);
    }).catch((e) => {console.log('err', e)});
  }, [readTotalSupply, price, signal, readBalance, currentAccount, decimals]);

  return (
    <SimpleGrid columns={5} spacing={4} sx={{ marginBottom: '1rem' }}>
      <Card title={list[0].title} val={<label>{list[0].val}</label>}/>
      <Card
        title={list[1].title}
        val={
          <label>
            <label>{ list[1].val }{' '}</label>
            <label style={{ fontSize: '18px' }}>DOT</label>
          </label>
        } />
      <Card
        title={list[2].title}
        val={
        <label>
          <label>{ list[2].val }{' '}</label>
          <label style={{ fontSize: '18px' }}>DAI</label>
          </label>
        } />
      <Card title={list[3].title} val={<label>{list[3].val}%</label>} orange={true}/>
      <Card
        green={true}
        title={list[4].title}
        val={
          <label>
            <label>{ list[4].val }{' '}</label>
            <label style={{ fontSize: '18px' }}>DAI</label>
          </label>
        } />
    </SimpleGrid>

  );
};
