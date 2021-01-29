import React from 'react';
import { IdentityIcon } from '@patract/ui-components';
import { Flex, Tooltip, Text } from '@chakra-ui/react';
import { useAccount } from '@patract/react-hooks';
import { truncated } from '@patract/utils';

type AccountProps = {
  value: string;
  type?: 'address' | 'contract';
};

export const Account: React.FC<AccountProps> = ({ value, type, ...rest }) => {
  const { accountList } = useAccount();
  let account = accountList?.filter((account) => account.address === value)[0];
  const name = account ? account.meta.name : truncated(value);

  return (
    <Tooltip label={value} aria-label='account address' placement='top' hasArrow {...rest}>
      <Flex
        sx={{
          display: 'inline-flex',
          verticalAlign: 'top',
          fontSize: '14px',
          lineHeight: '25px',
        }}
      >
        <IdentityIcon value={value} />
        <Text sx={{ mx: '8px' }}>{name as string}</Text>
      </Flex>
    </Tooltip>
  );
};
