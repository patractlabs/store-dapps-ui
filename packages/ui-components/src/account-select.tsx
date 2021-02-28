import React, { useEffect } from 'react';
import { TriangleDownIcon } from '@chakra-ui/icons';
import { Box, Flex, Popover, PopoverContent, PopoverTrigger, Text, Spinner, useDisclosure } from '@chakra-ui/react';
import { useAccount, useApi } from '@patract/react-hooks';
import { truncated } from '@patract/utils';
import type { KeyringPair } from '@polkadot/keyring/types';
import { IdentityIcon } from '@patract/ui-components';
import { Balance } from './balance';

export const AccountSelect: React.FC = () => {
  const { isApiReady } = useApi();
  const { accountList, currentAccount, setCurrentAccount } = useAccount();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const current = accountList?.filter((account) => account.address === currentAccount)[0];

  const onSelect = (account: KeyringPair) => {
    onClose();
    setCurrentAccount(account.address);
    localStorage.setItem('current-account', account.address);
  };

  useEffect(() => {
    const storedAccount = localStorage.getItem('current-account');
    if (storedAccount && accountList?.some((account) => account.address === storedAccount)) {
      setCurrentAccount(storedAccount);
    } else if (accountList && accountList.length > 0) {
      setCurrentAccount(accountList[0].address);
    }
  }, [accountList]);

  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} variant='responsive'>
      <PopoverTrigger>
        <Flex
          sx={{
            textTransform: 'uppercase',
            justifyContent: 'space-between',
            alignItems: 'center',
            minW: 'sm',
            h: '40px',
            border: '1px solid',
            borderRadius: '4px',
            borderColor: 'gray.300',
            cursor: 'pointer',
            bgColor: '#FFFFFF',
            px: '8px',
            _hover: {
              borderColor: 'gray.400'
            },
            _focus: {
              borderColor: 'gray.400'
            }
          }}
        >
          {!isApiReady ? (
            <Flex sx={{ flex: '1', flexDirection: 'row-reverse' }}>
              <Spinner size='sm' color='blue.500' />
            </Flex>
          ) : !currentAccount ? (
            <Flex sx={{ flex: '1' }}>No Account</Flex>
          ) : (
            <>
              <Flex
                alignItems='center'
                sx={{
                  flexGrow: '1',
                  fontSize: 'sm',
                  padding: '5px 0',
                  left: '42px'
                }}
              >
                <IdentityIcon value={currentAccount} theme='robohash' />
                <Text sx={{ flexGrow: '1', mx: '8px' }}>{current?.meta.name as string}</Text>
                <Box sx={{ color: 'gray.400' }}>
                  <Balance address={currentAccount} />
                </Box>
              </Flex>
              <TriangleDownIcon sx={{ w: '10px', h: '10px', color: '#0058FA', ml: '8px' }} />
            </>
          )}
        </Flex>
      </PopoverTrigger>
      {isApiReady && currentAccount && (
        <PopoverContent
          maxW='sm'
          sx={{ textTransform: 'uppercase', minW: 'sm', left: '0', top: '-6px', zIndex: 'dropdown' }}
        >
          <ul>
            {accountList?.map((account) => (
              <Box
                as='li'
                key={account.address}
                sx={{ listStyle: 'none', p: '5px 10px', cursor: 'pointer', _hover: { bgColor: 'gray.100' } }}
                onClick={onSelect.bind(null, account)}
              >
                <Flex sx={{ fontSize: 'sm' }} alignItems='center'>
                  <IdentityIcon value={account.address} theme='robohash' />
                  <Text sx={{ flexGrow: '1', ml: '8px' }}>{account.meta.name as string}</Text>
                  <Box sx={{ color: 'gray.400' }}>
                    <Balance address={account.address} />
                  </Box>
                </Flex>
              </Box>
            ))}
          </ul>
        </PopoverContent>
      )}
    </Popover>
  );
};
