import { Box, Image } from '@chakra-ui/react';
import { useToast } from '@patract/react-hooks';
import BaseIdentityIcon from '@polkadot/react-identicon';
import React, { useCallback } from 'react';
import RoboHash from './RoboHash';
import UsdtWebp from './images/usdt.webp';
import EthWebp from './images/eth.webp';
import Dai from './images/dai.png';
import BTC from './images/btc.png';

type IdentityIconProps = {
  size?: number;
  theme?: string;
  value?: string | Uint8Array | null;
};

const addressMap: any = {
  '5DLB2GYTjdQHJigkDx1SWGC4a12VwGAWtuJrnh82Y1BdrKBr': EthWebp,
  '5GnhhemyFoDQjo53rFZbm6D48rv4EdfjBS3fqGCpQvYWD3jP': Dai,
  '5EDmv8KGnHP3zy5Cfp64BDg9HvjMCET4TnUbnTyPEmvGp9AN': BTC,
  '5H3enav9XbGoai3eMCtQeSRSnPmz28mJCwTyTc7YgcanKhKE': UsdtWebp
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

  const Custom = theme === 'robohash' ? RoboHash : undefined;

  return (
    <Box
      marginTop='2px'
      sx={{
        display: 'inline-block',
        w: `${size + 2}px`,
        h: `${size + 2}px`,
        // border: '1px solid',
        // borderColor: 'gray.300',
        borderRadius: '50%',
        overflow: 'hidden'
      }}
    >
      {addressMap[value as any] ? (
        <Image sx={{ width: '100%', height: '100%' }} size='xs' src={addressMap[value as any]} />
      ) : (
        <BaseIdentityIcon Custom={Custom} onCopy={onCopy} value={value} size={size} theme={theme} />
      )}
    </Box>
  );
};
