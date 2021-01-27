import React from 'react';
import { Box } from '@chakra-ui/react';
import BaseIdentityIcon from '@polkadot/react-identicon';

type IdentityIconProps = {
  size?: number;
  value?: string | Uint8Array | null;
};

export const IdentityIcon: React.FC<IdentityIconProps> = ({ value, size = 24 }) => {
  return (
    <Box sx={{ display: 'inline-block', w: `${size + 2}px`, h: `${size + 2}px`, border: '1px solid', borderColor: 'gray.300', borderRadius: '50%', overflow: 'hidden' }}>
      <BaseIdentityIcon value={value} size={size} theme='substrate' />
    </Box>
  );
};
