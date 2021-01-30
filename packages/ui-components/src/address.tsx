import React from 'react';
import { IdentityIcon } from '@patract/ui-components';
import { Flex, Tooltip, Text } from '@chakra-ui/react';
import { useAccount } from '@patract/react-hooks';
import { truncated } from '@patract/utils';

type AddressProps = {
  value: string;
  type?: 'address' | 'contract';
};

export const Address: React.FC<AddressProps> = ({ value, type, ...rest }) => {
  const { accountList } = useAccount();

  let account = accountList?.filter((account) => account.address === value)[0];
  const name = account ? account.meta.name : truncated(value);

  return (
    <Tooltip label={value} aria-label='account address' placement='top' hasArrow {...rest}>
      <Flex display='inline-flex' alignItems='center' textTransform='uppercase'>
        <IdentityIcon value={value} />
        <Text mx={2}>{name as string}</Text>
      </Flex>
    </Tooltip>
  );
};
