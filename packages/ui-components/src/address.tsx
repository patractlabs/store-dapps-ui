import { Flex, Text, Tooltip } from '@chakra-ui/react';
import { useAccount, useAccountInfo, useApi } from '@patract/react-hooks';
import { Box, IdentityIcon } from '@patract/ui-components';
import { truncated } from '@patract/utils';
import React from 'react';
import Badge from './badge';

type AddressProps = {
  value: string;
  type?: 'address' | 'contract';
  hideText?: boolean;
};

export const Address: React.FC<AddressProps> = ({ hideText = false, value, type, ...rest }) => {
  const accountInfo = useAccountInfo(value || null);

  if (!value) return null;

  const name = accountInfo.identity?.display
    ? accountInfo.identity.display
    : accountInfo.name
    ? accountInfo.name
    : `${truncated(value)}`;

  return (
    <Tooltip label={value} aria-label='account address' placement='top' hasArrow {...rest}>
      <Flex display='inline-flex' alignItems='center' textTransform='uppercase'>
        <IdentityIcon value={value} theme={type === 'contract' ? 'polkadot' : 'robohash'} />
        <Flex alignItems='center' mx={2}>
          {accountInfo.identity?.display ? (
            <Badge
              color={accountInfo.identity.isGood ? 'green' : 'gray'}
              icon={accountInfo.identity.isGood && !accountInfo.identity.isBad ? 'check' : 'minus'}
              isSmall
            />
          ) : null}
          <Box>{!hideText ? <Text>{name as string}</Text> : <Text>{(name as string).slice(0, 5) + '...'}</Text>}</Box>
        </Flex>
      </Flex>
    </Tooltip>
  );
};
