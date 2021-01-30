import { Box } from '@chakra-ui/react';
import { formatAmount } from '@patract/utils';
import React from 'react';

type AmountProps = {
  value: string | number | undefined;
  decimals?: number;
  postfix?: string;
} & Omit<React.ComponentType<typeof Box>, 'value'>;

export const Amount: React.FC<AmountProps> = ({ value, decimals, postfix, ...rest }) => {
  if (value === undefined || value === null) return null;

  return (
    <Box display='inline-flex' alignItems='center' textTransform='uppercase' {...rest}>
      {formatAmount(value, decimals)} {postfix}
    </Box>
  );
};
