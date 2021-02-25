import React, { useEffect, useState } from 'react';
import { IdentityIcon } from '@patract/ui-components';
import { Flex, Tooltip, Text } from '@chakra-ui/react';
import { useAccount, useApi } from '@patract/react-hooks';
import { truncated } from '@patract/utils';

type AddressProps = {
  value: string;
  type?: 'address' | 'contract';
  hideText?: boolean;
};

export const Address: React.FC<AddressProps> = ({ hideText = false, value, type, ...rest }) => {
  const { api } = useApi();
  const { accountList } = useAccount();
  const [identityDisplay, setIdentityDisplay] = useState<string>();

  useEffect(() => {
    if (value) {
      api.query.identity.identityOf(value).then((data) => {
        if (!data.isEmpty) {
          try {
            const name = (data.unwrap().info.display.toHuman() as any).Raw;
            setIdentityDisplay(name);
          } catch {
            setIdentityDisplay('');
          }
        } else {
          setIdentityDisplay('');
        }
      });
    } else {
      setIdentityDisplay('');
    }
  }, [value]);

  if (!value) return null;

  const account = accountList?.filter((account) => account.address === value)[0];
  const name = identityDisplay ? identityDisplay : account ? account.meta.name : `${truncated(value)}`;

  return (
    <Tooltip label={value} aria-label='account address' placement='top' hasArrow {...rest}>
      <Flex display='inline-flex' alignItems='center' textTransform='uppercase'>
        <IdentityIcon value={value} theme={type === 'contract' ? 'polkadot' : 'robohash'} />
        {!hideText ? <Text mx={2}>{name as string}</Text> : <Text mx={2}>{(name as string).slice(0, 5) + '...'}</Text>}
      </Flex>
    </Tooltip>
  );
};
