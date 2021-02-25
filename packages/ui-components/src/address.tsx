import React, { useEffect, useState } from 'react';
import { IdentityIcon, Box, Tag } from '@patract/ui-components';
import { Flex, Tooltip, Text } from '@chakra-ui/react';
import { useAccount, useApi, useAccountInfo } from '@patract/react-hooks';
import { truncated } from '@patract/utils';
import Badge from './badge';

type AddressProps = {
  value: string;
  type?: 'address' | 'contract';
  hideText?: boolean;
};

export const Address: React.FC<AddressProps> = ({ hideText = false, value, type, ...rest }) => {
  const { api } = useApi();
  const { accountList } = useAccount();
  const accountInfo = useAccountInfo(value || null);

  if (!value) return null;

  const account = accountList?.filter((account) => account.address === value)[0];
  const name = accountInfo.name ? accountInfo.name : `${truncated(value)}`;
  console.log(accountInfo.name, accountInfo.identity?.display);
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
