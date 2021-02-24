import { useBalance } from '@patract/react-hooks';
import { Fixed } from '@patract/ui-components';
import React from 'react';

type BalanceProps = {
  address: string;
};

export const Balance: React.FC<BalanceProps> = ({ address }) => {
  const balance = useBalance(address);
  return balance ? <Fixed value={balance} decimals={10} postfix='DOT' /> : <div>-</div>;
};
