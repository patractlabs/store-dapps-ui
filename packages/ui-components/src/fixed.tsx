import { Box } from '@chakra-ui/react';
import { toFixed, FixedNumber } from '@patract/utils';
import React, { useMemo } from 'react';

type FixedProps = {
  value: string | number | undefined | FixedNumber;
  decimals?: number;
  round?: number;
  postfix?: string;
  withDecimals?: boolean;
} & Omit<React.ComponentType<typeof Box>, 'value'>;

export const Fixed: React.FC<FixedProps> = ({ value, withDecimals = false, decimals = 0, round = 3, postfix, ...rest }) => {
  if (value === undefined || value === null) return null;

  const fixed = useMemo(() => {
    try {
      if(withDecimals) {
        return toFixed(value, decimals, withDecimals).round(round).toString();
      } else {
        return toFixed(value, decimals, withDecimals).round(round).toString();
      }
    } catch {
      return 'Invalid Number'
    }
  }, [value, round, decimals, withDecimals]);

  return (
    <Box display='inline-flex' alignItems='center' textTransform='uppercase' {...rest}>
      {fixed} {postfix}
    </Box>
  );
};
