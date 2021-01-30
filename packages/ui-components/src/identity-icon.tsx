import { Box } from '@chakra-ui/react';
import { useToast } from '@patract/react-hooks';
import BaseIdentityIcon from '@polkadot/react-identicon';
import React, { useCallback } from 'react';

type IdentityIconProps = {
  size?: number;
  value?: string | Uint8Array | null;
};

export const IdentityIcon: React.FC<IdentityIconProps> = ({ value, size = 24 }) => {
  const toast = useToast();

  const onCopy = useCallback(
    (value) => {
      toast({
        title: 'Copied',
        description: value,
        status: 'success'
      });
    },
    [toast]
  );

  return (
    <Box
      sx={{
        display: 'inline-block',
        w: `${size + 2}px`,
        h: `${size + 2}px`,
        border: '1px solid',
        borderColor: 'gray.300',
        borderRadius: '50%',
        overflow: 'hidden'
      }}
    >
      <BaseIdentityIcon onCopy={onCopy} value={value} size={size} theme='substrate' />
    </Box>
  );
};
