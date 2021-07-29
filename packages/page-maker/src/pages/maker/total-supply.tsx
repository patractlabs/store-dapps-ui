import ApiContext from '@patract/react-components/api/api-context';
import { useAccount, useContractQuery } from '@patract/react-hooks';
import { Box, SimpleGrid } from '@patract/ui-components';
import { toFixed, trait } from '@patract/utils';
import React, { FC, ReactElement, useContext, useEffect, useState } from 'react';
import { useDaiContract } from '../../hooks/use-dai-contract';
import { useMakerContract } from '../../hooks/use-maker-contract';

const Card: FC<{
  title: string;
  val: ReactElement;
  green?: boolean;
  orange?: boolean;
}> = ({ title, val, orange = false, green = false }): ReactElement => {
  let containerStyle;
  let titleStyle;

  if (orange) {
    titleStyle = {
      background: '#FF8F00'
    };
    containerStyle = {
      background: '#FFA400',
      boxShadow: '0px 8px 15px 0px rgba(247, 181, 0, 0.5)',
      border: '1px solid #F7B500'
    };
  } else if (green) {
    titleStyle = {
      background: '#2F855A'
    };
    containerStyle = {
      background: '#25A17C'
      // border: '1px solid #F7B500',
    };
  } else {
    titleStyle = {
      background: '#00ACC3'
    };
    containerStyle = {
      background: '#04BACB',
      boxShadow: '0px 8px 15px 0px rgba(0, 186, 203, 0.4)',
      border: '1px solid #00ACC3'
    };
  }

  return (
    <Box
      sx={{
        height: '135px',
        borderRadius: '8px',
        color: '#FFFFFF',
        ...containerStyle
      }}
    >
      <Box
        sx={{
          height: '45px',
          borderRadius: '8px 8px 4px 4px',
          fontSize: '18px',
          lineHeight: '45px',
          textAlign: 'center',
          ...titleStyle
        }}
      >
        {title}
      </Box>
      <Box
        sx={{
          height: '90px',
          fontSize: '36px',
          textAlign: 'center',
          lineHeight: '90px'
        }}
      >
        {val}
        {/* <label>{item.val}</label>
      <label>{item.unit}</label> */}
      </Box>
    </Box>
  );
};
const initialTotal = [
  { title: 'Total Issuers', val: '0' },
  { title: 'Total Collateral', val: '0' },
  { title: 'Total Issuance', val: '0' },
  { title: 'Average Collateral Ratio', val: '0' },
  { title: 'My Balance', val: 0 }
];
export const TotalSupply: FC<{
  price: number;
  signal: number;
  daiDecimals: number;
}> = ({ price, signal, daiDecimals }): ReactElement => {
  const { contract } = useMakerContract();
  const { read: readTotalSupply } = useContractQuery({ contract, method: 'totalSupply' });
  const { contract: daiContract } = useDaiContract();
  const { read: readBalance } = useContractQuery({ contract: daiContract, method: `${trait}balanceOf` });
  const { currentAccount } = useAccount();
  const { tokenDecimals: dotDecimals } = useContext(ApiContext);
  const [list, setList] = useState<
    {
      title: string;
      val: number | string;
    }[]
  >(initialTotal);

  useEffect(() => {
    Promise.all([readTotalSupply(), readBalance(currentAccount)])
      .then(([total, balance]) => {
        const [totalIssuers, totalCollateral, totalIssuance] = (total as number[]) || [0, 0, 0, 0];
        const newList = [...initialTotal];
        newList[0].val = totalIssuers;
        newList[1].val = toFixed(totalCollateral, dotDecimals).round(1).toString();
        newList[2].val = toFixed(totalIssuance, daiDecimals).round(1).toString();
        newList[3].val = totalIssuance
          ? (((totalCollateral * price * Math.pow(10, daiDecimals - dotDecimals)) / totalIssuance) * 100).toFixed(0)
          : '0';
        newList[4].val = toFixed((balance as number) || 0, daiDecimals)
          .round(3)
          .toString();
        setList(newList);
      })
      .catch((e) => {
        console.log('err', e);
      });
  }, [readTotalSupply, price, signal, readBalance, currentAccount, daiDecimals, dotDecimals]);

  return (
    <SimpleGrid columns={5} spacing={4} sx={{ marginBottom: '1rem' }}>
      <Card title={list[0].title} val={<label>{list[0].val}</label>} />
      <Card
        title={list[1].title}
        val={
          <label>
            <label>{list[1].val} </label>
            <label style={{ fontSize: '18px' }}>DOT</label>
          </label>
        }
      />
      <Card
        title={list[2].title}
        val={
          <label>
            <label>{list[2].val} </label>
            <label style={{ fontSize: '18px' }}>DAI</label>
          </label>
        }
      />
      <Card title={list[3].title} val={<label>{list[3].val}%</label>} orange={true} />
      <Card
        green={true}
        title={list[4].title}
        val={
          <label>
            <label>{list[4].val} </label>
            <label style={{ fontSize: '18px' }}>DAI</label>
          </label>
        }
      />
    </SimpleGrid>
  );
};
