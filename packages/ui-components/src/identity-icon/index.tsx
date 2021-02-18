import { Box } from '@chakra-ui/react';
import { useToast } from '@patract/react-hooks';
import BaseIdentityIcon from '@polkadot/react-identicon';
import React, { useCallback } from 'react';
import RoboHash from './RoboHash';

type IdentityIconProps = {
  size?: number;
  theme?: string;
  value?: string | Uint8Array | null;
};

export const IdentityIcon: React.FC<IdentityIconProps> = ({ theme = 'polkadot', value, size = 24 }) => {
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

  const Custom = theme === 'robohash'
    ? RoboHash
    : undefined;

  return (
    <Box
      marginTop='2px'
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
      <BaseIdentityIcon Custom={Custom} onCopy={onCopy} value={value} size={size} theme={theme} />
    </Box>
  );
};
